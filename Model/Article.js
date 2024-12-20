import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { db, storage } from "../config/FirebaseConfig";
import { Alert } from "react-native";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import moment from "moment";

const articlesCollection = collection(db, "Post");

export const getArticles = async() => {
    // const articleRef = doc(articlesCollection, userId);
    // const articleDoc = await getDoc(articleRef);
    // const articleQuery = query(articlesCollection, where("postId","==", postId));
    const articleSnapShot = await getDocs(articlesCollection);
    const articleData = [];

    articleSnapShot.forEach((doc) => {
        articleData.push({
            id: doc.id,
            ...doc.data(),
        })
    });

    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return articleData;
};

export const getArticlesByUserId = async(userId) => {
    try {
        const q = query(articlesCollection, where('userId', '==', userId));
        const querySnapShot = await getDocs(q);

        const post = querySnapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return post;
    } catch (error) {
        console.log(error);
    }

}

export const getUserFromArticle = async(userId) => {
    const articleQuery = query(articlesCollection, where("userId", "==", userId));
    const snapshot = await getDocs(articleQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const addLikeToArticle = async(articleId, userId) => {
    const postRef = doc(db, 'Post', articleId);
  const postSnap = await getDoc(postRef);

//   if (!postSnap.exists()) {
//     console.log("Bài viết không tồn tại.");
//     return;
//   }else{
//     console.log("Bai viet ton tai");
//   }

    const postData = postSnap.data();
    
    // Khởi tạo `likeBy` là mảng trống và `likes` là 0 nếu chúng chưa tồn tại
    const likeBy = postData?.likeBy;
    // const likes = postData?.likes; // `?? 0` khởi tạo `likes` với giá trị 0 nếu chưa có

    const isLiked = likeBy.includes(userId);

    try {
        if (isLiked) {
        // Nếu đã thích, giảm lượt thích và xóa userId khỏi `likeBy`
        await updateDoc(postRef, {
            likes: increment(-1),
            likeBy: arrayRemove(userId),
        });
        } else {
        // Nếu chưa thích, tăng lượt thích và thêm userId vào `likeBy`
        await updateDoc(postRef, {
            likes: increment(1),
            likeBy: arrayUnion(userId),
        });
        }
    } catch (error) {
        console.log("Lỗi khi cập nhật lượt thích:", error); 
    }
}   

export const createArticle = async(userId, imageUrl, newData) => {
    // const articleRef = doc(articlesCollection, userId);
    const image = await uploadImageAsync(imageUrl, userId);

    const formattedDate = moment().format("DD/MM/YYYY HH:mm:ss");
    try {
        const data = {
            ...newData, //userName, userImage, postTitle, postContent, postImageUrl, postCategory
            userId: userId,
            postImageUrl: image,
            likeBy: [],
            likes: 0,
            postCreatedAt: formattedDate,
            postId: Date.now().toString(),
            views: 0
        }

        const docRef = await addDoc(articlesCollection, data);
        console.log("Complete createArticle");
        return docRef.id;
    } catch (error) {
        console.log(error, "in createArticle");
        return null;
    }

}

export const deleteArticle = async(articleId, imageUrl) => {
    try {
        const articleRef = doc(articlesCollection, articleId);

        await deleteDoc(articleRef);
        console.log("Xoa bai viet complete");

        if(imageUrl){
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
            console.log("Xoa hinh anh complete");
        }
    } catch (error) {
        console.log("Loi xxoa bai viet");
        throw error;
    }
}

export const updatedArticle = async(articleId, userId, data, newImageUrl, currentImageUrl) => {
    const articleRef = doc(articlesCollection, articleId);
    let updatedImageUrl = currentImageUrl;

    try {
        if(newImageUrl){
            const response = await fetch(newImageUrl);
            const blob = await response.blob();

            const newImageRef = ref(storage, `articles/${userId}/${Date.now()}`);
            await uploadBytes(newImageRef, blob);

            updatedImageUrl = await getDownloadURL(newImageRef);

            if(currentImageUrl) {
                const oldImage = ref(storage, currentImageUrl);
                await deleteObject(oldImage);
            }
        }

        //cap nhat bai viet
        await updateDoc(articleRef, {
            postTitle: data.newTitle,
            postContent: data.newContent,
            postCategory: data.newCategory,
            postImageUrl: updatedImageUrl,
        });

        console.log("Successfully updated article");
    } catch (error) {
        console.log("Error updating article");
    }
}

export const uploadImageAsync = async(uri, userId) => {
    try {
        const response = await fetch(uri);  
        const blob = await response.blob();
        const imageRef = ref(storage, `articles/${userId}/${Date.now()}`);

        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);

        return downloadURL;
    } catch (error) {
        console.log(error);
        return null;
    }
}