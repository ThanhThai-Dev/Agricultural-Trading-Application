import { doc, getDocs } from "firebase/firestore";

const invoiceCollection = collection(db, 'Invoice');
export const getInvoiceById = async() => {
    const invoiceSnapShot = await getDocs(invoiceCollection);
    const invoiceData = [];

    invoiceSnapShot.forEach((doc) => {
        invoiceData.push({
            id: doc.id,
            ...doc.data(),
        })
    });

    return invoiceData;
}