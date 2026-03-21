import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const AdminService = {
  async login(usernameInput: string, passwordInput: string) {
    try {
      // Document is in collection 'adminCred' with ID 'adminpass'
      const docRef = doc(db, "adminCred", "adminpass");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.username === usernameInput && data.password === passwordInput) {
          return { success: true };
        } else {
          return { success: false, message: "Invalid credentials" };
        }
      } else {
        return { success: false, message: "Admin account not found" };
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      return { success: false, message: error.message || "Something went wrong" };
    }
  },
};
