import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, deleteDoc, doc as firestoreDoc } from "firebase/firestore";

export interface CategoryData {
  title: string;
  image: string; // Base64 encoded string
  discount?: number; // Optional, default 0
  hide?: boolean; // Optional, default false
  trending?: boolean; // NEW: Toggle between normal and trending
}

export const CategoryService = {
  /**
   * Adds a new category to Firestore.
   */
  async createCategory(data: CategoryData) {
    try {
      const categoryRef = collection(db, "categories");
      const docRef = await addDoc(categoryRef, {
        title: data.title,
        image: data.image,
        discount: data.discount ?? 0,
        hide: data.hide ?? false,
        trending: data.trending ?? false,
        createdAt: Timestamp.now(),
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error("Error creating category:", error);
      return { success: false, message: error.message || "Failed to create category" };
    }
  },

  /**
   * Fetches all categories.
   */
  async getCategories() {
    try {
      const categoryRef = collection(db, "categories");
      const snapshot = await getDocs(categoryRef);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  /**
   * Updates an existing category.
   */
  async updateCategory(categoryId: string, data: Partial<CategoryData>) {
    try {
      const categoryRef = firestoreDoc(db, "categories", categoryId);
      await updateDoc(categoryRef, data);
      return { success: true };
    } catch (error: any) {
      console.error("Error updating category:", error);
      return { success: false, message: error.message || "Failed to update category" };
    }
  }
};
