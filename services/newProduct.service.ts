import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, getDoc, query, where, orderBy, limit, doc, Timestamp, updateDoc, deleteDoc } from "firebase/firestore";

export interface ProductData {
  title: string;
  mrp: number;
  discount: number; // Percentage
  sellingPrice: number;
  categoryId: string;
  categoryTitle: string; // Added to help generate ID
  gender: string; // 'Male', 'Female', 'Unisex'
  hide: boolean;
  images: string[]; // Array of Base64 strings (up to 3)
  productId?: string; // Auto-generated
  totalQuantity: number; // Inventory
}

export const NewProductService = {
  /**
   * Generates a unique product ID based on category.
   * Format: XXX-NEW-12345
   */
  async generateProductId(categoryTitle: string) {
    const prefix = categoryTitle.slice(0, 3).toUpperCase();
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    return `${prefix}-NEW-${randomNum}`;
  },

  /**
   * Adds a new product to Firestore.
   */
  async createProduct(data: ProductData) {
    try {
      const productId = await this.generateProductId(data.categoryTitle);
      const productRef = collection(db, "newProducts");
      const docRef = await addDoc(productRef, {
        ...data,
        productId,
        createdAt: Timestamp.now(),
      });
      return { success: true, id: docRef.id, productId };
    } catch (error: any) {
      console.error("Error creating new arrival product:", error);
      return { success: false, message: error.message || "Failed to create product" };
    }
  },

  /**
   * Fetches all products.
   */
  async getProducts() {
    try {
      const productRef = collection(db, "newProducts");
      const q = query(productRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("Error fetching new arrival products:", error);
      return [];
    }
  },

  /**
   * Fetches products by category ID.
   */
  async getProductsByCategory(categoryId: string, limitCount: number = 20) {
    try {
      const productRef = collection(db, "newProducts");
      const q = query(
        productRef, 
        where("categoryId", "==", categoryId),
        where("hide", "==", false),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("Error fetching new arrival products by category:", error);
      return [];
    }
  },

  /**
   * Fetches a single product by ID.
   */
  async getProductById(productId: string) {
    try {
      const docRef = doc(db, "newProducts", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error: any) {
      console.error("Error fetching new arrival product by ID:", error);
      return null;
    }
  },

  /**
   * Updates an existing new arrival.
   */
  async updateProduct(productId: string, data: Partial<ProductData>) {
    try {
      const productRef = doc(db, "newProducts", productId);
      await updateDoc(productRef, data);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating new arrival product:", error);
      return { success: false, message: error.message || "Failed to update product" };
    }
  },

  /**
   * Deletes a new arrival product.
   */
  async deleteProduct(productId: string) {
    try {
      const productRef = doc(db, "newProducts", productId);
      await deleteDoc(productRef);
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting new arrival product:", error);
      return { success: false, message: error.message || "Failed to delete product" };
    }
  },

  /**
   * Deducts quantity.
   */
  async reduceQuantity(productId: string, amount: number) {
    try {
      const productRef = doc(db, "newProducts", productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const currentQty = productSnap.data().totalQuantity || 0;
        const newQty = Math.max(0, currentQty - amount);
        await updateDoc(productRef, { totalQuantity: newQty });
        return { success: true };
      }
      return { success: false, message: "Product not found" };
    } catch (error: any) {
      console.error("Error reducing new product quantity:", error);
      return { success: false, message: error.message };
    }
  }
};
