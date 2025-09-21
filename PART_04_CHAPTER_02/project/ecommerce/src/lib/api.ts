const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // 인증 관련
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async register(email: string, password: string, name: string, phone: string, address: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, phone, address }),
    });
    return response.json();
  },

  // 상품 관련
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    return response.json();
  },

  async getProduct(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    return response.json();
  },

  // 장바구니 관련
  async addToCart(userId: number, productId: number, quantity: number = 1) {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    return response.json();
  },

  async getCart(userId: number) {
    const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`);
    return response.json();
  },

  async removeFromCart(userId: number, productId: number) {
    const response = await fetch(`${API_BASE_URL}/api/cart/${userId}/${productId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // 주문 관련
  async createOrder(orderData: any) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  async updateOrderStatus(orderId: string, status: string, paymentKey?: string) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, paymentKey }),
    });
    return response.json();
  },

  async getUserOrders(userId: number) {
    const response = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
    return response.json();
  },

  // 어드민용
  async getAllOrders() {
    const response = await fetch(`${API_BASE_URL}/api/orders`);
    return response.json();
  },
};