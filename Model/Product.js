import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, where, query, getDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from "../config/FirebaseConfig";
import { Alert } from 'react-native';

const productCollection = collection(db, 'Products');

export const getProductInfo = async() => {
    const snapshot = await getDocs(productCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
