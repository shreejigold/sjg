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
}

export const ProductService = {
  /**
   * Generates a unique product ID based on category.
   * Format: XXX-12345
   */
  async generateProductId(categoryTitle: string) {
    const prefix = categoryTitle.slice(0, 3).toUpperCase();
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    return `${prefix}-${randomNum}`;
  },

  /**
   * Adds a new product to Firestore.
   */
  async createProduct(data: ProductData) {
    try {
      const productId = await this.generateProductId(data.categoryTitle);
      const productRef = collection(db, "products");
      const docRef = await addDoc(productRef, {
        ...data,
        productId,
        createdAt: Timestamp.now(),
      });
      return { success: true, id: docRef.id, productId };
    } catch (error: any) {
      console.error("Error creating product:", error);
      return { success: false, message: error.message || "Failed to create product" };
    }
  },

  /**
   * Fetches all products.
   */
  async getProducts() {
    try {
      const productRef = collection(db, "products");
      const q = query(productRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  /**
   * Fetches products by category ID.
   */
  async getProductsByCategory(categoryId: string, limitCount: number = 20) {
    try {
      const productRef = collection(db, "products");
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
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  /**
   * Fetches a single product by ID.
   */
  async getProductById(productId: string) {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error: any) {
      console.error("Error fetching product by ID:", error);
      return null;
    }
  },

  /**
   * Updates an existing product.
   */
  async updateProduct(productId: string, data: Partial<ProductData>) {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, data);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating product:", error);
      return { success: false, message: error.message || "Failed to update product" };
    }
  },

  /**
   * Deletes a product carefully.
   */
  async deleteProduct(productId: string) {
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting product:", error);
      return { success: false, message: error.message || "Failed to delete product" };
    }
  }
};
