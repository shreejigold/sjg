import { db } from "@/lib/firebase";
import { 
  collection, addDoc, getDocs, query, where, 
  orderBy, Timestamp, doc as firestoreDoc, setDoc, limit 
} from "firebase/firestore";
import { CartService, CartItem } from "./cart.service";
import { ProductService } from "./product.service";
import { NewProductService } from "./newProduct.service";

export interface OrderData {
  firstName: string;
  lastName: string;
  address: string;
  pinCode: string;
  state: string;
  primaryMobile: string;
  secondaryMobile?: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge?: number;
  total?: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export const OrderService = {
  /**
   * Places a new order, saves to Firestore, and reduces inventory.
   */
  async placeOrder(data: OrderData) {
    try {
      // 1. Save order to Firestore
      const orderRef = collection(db, "orders");
      const docRef = await addDoc(orderRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        pinCode: data.pinCode,
        state: data.state,
        primaryMobile: data.primaryMobile,
        secondaryMobile: data.secondaryMobile || "",
        paymentMethod: data.paymentMethod,
        items: data.items,
        subtotal: data.subtotal,
        deliveryCharge: data.deliveryCharge || 0,
        total: data.total || data.subtotal,
        status: 'Pending',
        createdAt: Timestamp.now(),
      });

      // 2b. Save or Update Customer details (keyed by primary mobile)
      const customerRef = firestoreDoc(db, "customers", data.primaryMobile);
      await setDoc(customerRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        primaryMobile: data.primaryMobile,
        secondaryMobile: data.secondaryMobile || "",
        lastOrderDate: Timestamp.now(),
        lastAddress: data.address,
        pinCode: data.pinCode,
        state: data.state,
      }, { merge: true });

      // 3. Deduct inventory
      const deductions = data.items.map(item => {
        if (item.collection === 'newProducts') {
          return NewProductService.reduceQuantity(item.id, item.quantity);
        } else {
          return ProductService.reduceQuantity(item.id, item.quantity);
        }
      });

      await Promise.all(deductions);

      // 4. Clear cart since order is placed
      CartService.clearCart();

      return { success: true, orderId: docRef.id };
    } catch (error: any) {
      console.error("Failed to place order:", error);
      return { success: false, message: error.message || "An error occurred while luxury fulfillment was being processed." };
    }
  },

  /**
   * Fetches orders from Firestore.
   * If date is provided, filters orders for that specific date.
   */
  async getOrders(filterDate?: Date) {
    try {
      const orderRef = collection(db, "orders");
      let q;
      
      if (filterDate) {
        // Start and end of the day
        const start = new Date(filterDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filterDate);
        end.setHours(23, 59, 59, 999);
        
        q = query(
          orderRef,
          where("createdAt", ">=", Timestamp.fromDate(start)),
          where("createdAt", "<=", Timestamp.fromDate(end)),
          orderBy("createdAt", "desc")
        );
      } else {
        q = query(orderRef, orderBy("createdAt", "desc"), limit(50));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  /**
   * Fetches all registered customers.
   */
  async getCustomers() {
    try {
      const customerRef = collection(db, "customers");
      const q = query(customerRef, orderBy("lastOrderDate", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  }
};
