import { ProductService } from "./product.service";
import { NewProductService } from "./newProduct.service";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  productId: string;
  stock: number; // NEW: Available inventory
  collection: 'products' | 'newProducts'; // NEW: Which collection it belongs to
}

export const CartService = {
  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('sjg-cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart(item: CartItem) {
    if (typeof window === 'undefined') return;
    const cart = this.getCart();
    const existingItem = cart.find((i) => i.id === item.id);
    
    if (existingItem) {
      if (existingItem.quantity < item.stock) {
        existingItem.quantity += 1;
      } else {
        alert(`Sorry, only ${item.stock} units available in vault.`);
        return;
      }
    } else {
      if (item.stock > 0) {
        cart.push({ ...item, quantity: 1 });
      } else {
        alert("This masterpiece is currently out of stock.");
        return;
      }
    }
    
    localStorage.setItem('sjg-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  },

  removeFromCart(id: string) {
    if (typeof window === 'undefined') return;
    let cart = this.getCart();
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem('sjg-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  },

  updateQuantity(id: string, quantity: number) {
    if (typeof window === 'undefined') return;
    const cart = this.getCart();
    const item = cart.find((i) => i.id === id);
    if (item) {
      if (quantity > item.stock) {
        alert(`Only ${item.stock} units available.`);
        return;
      }
      
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(id);
      } else {
        localStorage.setItem('sjg-cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
      }
    }
  },

  async processCheckout() {
    const cart = this.getCart();
    if (cart.length === 0) return { success: false, message: "Vault is empty" };

    try {
      // Deduct quantity in Firestore for each item
      const deductions = cart.map(item => {
        if (item.collection === 'newProducts') {
          return NewProductService.reduceQuantity(item.id, item.quantity);
        } else {
          return ProductService.reduceQuantity(item.id, item.quantity);
        }
      });

      await Promise.all(deductions);
      this.clearCart();
      return { success: true };
    } catch (error: any) {
      console.error("Checkout deduction failed:", error);
      return { success: false, message: error.message };
    }
  },

  clearCart() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('sjg-cart');
    window.dispatchEvent(new Event('cart-updated'));
  },

  getCartCount(): number {
    return this.getCart().reduce((acc, item) => acc + item.quantity, 0);
  }
};
