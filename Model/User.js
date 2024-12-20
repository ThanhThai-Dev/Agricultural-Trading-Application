import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";

export const updateUser = async(userId, updates) => {
    try {
        const userRef = doc(db, 'Users', userId);
        await updateDoc(userRef, updates);
        console.log("Cap nhat thanh cong");
    } catch (error) {
        console.log(error);
    }
}