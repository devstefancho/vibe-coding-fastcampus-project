const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('store.db');

// 사용자 등록
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, address } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run('INSERT INTO users (email, password, name, phone, address) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone, address], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: '이미 존재하는 이메일입니다.' });
        }
        return res.status(500).json({ error: '회원가입 실패' });
      }
      res.json({ message: '회원가입 성공', userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 사용자 로그인
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: '서버 오류' });
    }

    if (!user) {
      return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    res.json({
      message: '로그인 성공',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address
      }
    });
  });
});

// 상품 목록 조회
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY created_at DESC', (err, products) => {
    if (err) {
      return res.status(500).json({ error: '상품 조회 실패' });
    }
    res.json(products);
  });
});

// 상품 상세 조회
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: '상품 조회 실패' });
    }

    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    res.json(product);
  });
});

// 장바구니에 상품 추가
app.post('/api/cart', (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  db.run('INSERT OR REPLACE INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [userId, productId, quantity], function(err) {
    if (err) {
      return res.status(500).json({ error: '장바구니 추가 실패' });
    }
    res.json({ message: '장바구니에 추가되었습니다.' });
  });
});

// 장바구니 조회
app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT c.*, p.name, p.price, p.image_url
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.all(query, [userId], (err, items) => {
    if (err) {
      return res.status(500).json({ error: '장바구니 조회 실패' });
    }
    res.json(items);
  });
});

// 장바구니 상품 삭제
app.delete('/api/cart/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;

  db.run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
    [userId, productId], function(err) {
    if (err) {
      return res.status(500).json({ error: '장바구니 삭제 실패' });
    }
    res.json({ message: '장바구니에서 삭제되었습니다.' });
  });
});

// 주문 생성
app.post('/api/orders', (req, res) => {
  const { userId, orderId, totalAmount, customerName, customerEmail, customerPhone, shippingAddress, items } = req.body;

  db.run('INSERT INTO orders (user_id, order_id, total_amount, customer_name, customer_email, customer_phone, shipping_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, orderId, totalAmount, customerName, customerEmail, customerPhone, shippingAddress], function(err) {
    if (err) {
      return res.status(500).json({ error: '주문 생성 실패' });
    }

    const orderDbId = this.lastID;

    // 주문 상품 추가
    const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');

    items.forEach(item => {
      stmt.run(orderDbId, item.productId, item.quantity, item.price);
    });

    stmt.finalize();

    // 장바구니 비우기
    db.run('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    res.json({ message: '주문이 생성되었습니다.', orderId: orderDbId });
  });
});

// 주문 상태 업데이트
app.put('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status, paymentKey } = req.body;

  db.run('UPDATE orders SET status = ?, payment_key = ? WHERE order_id = ?',
    [status, paymentKey, orderId], function(err) {
    if (err) {
      return res.status(500).json({ error: '주문 상태 업데이트 실패' });
    }
    res.json({ message: '주문 상태가 업데이트되었습니다.' });
  });
});

// 사용자 주문 내역 조회
app.get('/api/orders/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT o.*,
           GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  db.all(query, [userId], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: '주문 내역 조회 실패' });
    }
    res.json(orders);
  });
});

// 모든 주문 내역 조회 (어드민용)
app.get('/api/orders', (req, res) => {
  const query = `
    SELECT o.*,
           GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  db.all(query, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: '주문 내역 조회 실패' });
    }
    res.json(orders);
  });
});

app.listen(port, () => {
  console.log(`Database server running on http://localhost:${port}`);
});