const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('store.db');

function initializeDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  db.exec(schema, (err) => {
    if (err) {
      console.error('Error creating tables:', err);
    } else {
      console.log('Database tables created successfully');
      insertSampleProducts();
    }
  });
}

function insertSampleProducts() {
  const products = [
    { name: 'Artist Owl', description: '예술가 올빼미 캐릭터', price: 2500, image_url: '/images/artist-owl.svg', hd_image_url: '/images/artist-owl-hd.svg' },
    { name: 'Astronaut Character', description: '우주비행사 캐릭터', price: 3000, image_url: '/images/astronaut-character.svg', hd_image_url: '/images/astronaut-character.svg' },
    { name: 'Athlete Lion', description: '운동선수 사자 캐릭터', price: 3500, image_url: '/images/athlete-lion.svg', hd_image_url: '/images/athlete-lion-hd.svg' },
    { name: 'Cat Character', description: '고양이 캐릭터', price: 2000, image_url: '/images/cat-character.svg', hd_image_url: '/images/cat-character-hd.svg' },
    { name: 'Chef Panda', description: '요리사 판다 캐릭터', price: 4000, image_url: '/images/chef-panda.svg', hd_image_url: '/images/chef-panda-hd.svg' },
    { name: 'Dog Character', description: '강아지 캐릭터', price: 1500, image_url: '/images/dog-character.svg', hd_image_url: '/images/dog-character.svg' },
    { name: 'Dog Friends', description: '강아지 친구들', price: 2800, image_url: '/images/dog-friends.svg', hd_image_url: '/images/dog-friends-hd.svg' },
    { name: 'Explorer Bear', description: '탐험가 곰 캐릭터', price: 4500, image_url: '/images/explorer-bear.svg', hd_image_url: '/images/explorer-bear-hd.svg' },
    { name: 'Gamer Fox', description: '게이머 여우 캐릭터', price: 3200, image_url: '/images/gamer-fox.svg', hd_image_url: '/images/gamer-fox-hd.svg' },
    { name: 'Musician Rabbit', description: '음악가 토끼 캐릭터', price: 2700, image_url: '/images/musician-rabbit.svg', hd_image_url: '/images/musician-rabbit-hd.svg' }
  ];

  const stmt = db.prepare('INSERT INTO products (name, description, price, image_url, hd_image_url) VALUES (?, ?, ?, ?, ?)');

  products.forEach(product => {
    stmt.run(product.name, product.description, product.price, product.image_url, product.hd_image_url);
  });

  stmt.finalize();
  console.log('Sample products inserted successfully');
  db.close();
}

initializeDatabase();