import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../config/FirebaseConfig"

const GetFavList = async (user) => {
    const docSnap = await getDoc(doc(db, 'UserFavProduct', user?.primaryEmailAddress?.emailAddress));

    if (docSnap?.exists()) {
        return docSnap.data();
    } else {
        await setDoc(doc(db, 'UserFavProduct', user?.primaryEmailAddress?.emailAddress), {
            email: user?.primaryEmailAddress?.emailAddress,
            favorite: []
        })
    }
}

const UpdateFav = async(user, favorite) => {
    const docRef = doc(db, 'UserFavProduct', user?.primaryEmailAddress?.emailAddress);
        try {
            await updateDoc(docRef, {
                favorite: favorite
            })
        } catch (error) {
            
        }
}

export default {
    GetFavList,
    UpdateFav,
}