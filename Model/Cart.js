import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, where, query, getDoc, arrayUnion, setDoc, Timestamp } from 'firebase/firestore';
import { db } from "../config/FirebaseConfig";
import { Alert } from 'react-native';


const cartCollection = collection(db, 'Cart');
// const {user} = useUser();


export const getCartItems = async (userId) => {
  const q = query(cartCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addCartItem = async (item) => {
  await addDoc(cartCollection, item);
};

export const updateCartItem = async (id, item) => {
  const itemDoc = doc(db, 'Cart', id);
  await updateDoc(itemDoc, item);
};

export const deleteCartItem = async (id) => {
  const itemDoc = doc(db, 'Cart', id);
  await deleteDoc(itemDoc);
};

export const deleteProductById = async(cartId, productId) => {
  try {
    //tao bien tham chieu den gio hang
    const cartRef = doc(db, 'Cart', cartId);

    //Lay du lieu gio hang hien tai
    const cartSnap = await getDoc(cartRef);
    if(!cartSnap.exists()){
      console.log("Không tìm thấy giỏ hàng với ID: ", cartId);
      return;
    }

    const cartData = cartSnap.data();
    const updatedProducts = cartData.products.filter(product => product.productId !== productId);

    //Cap nhat lai truong product trong firestore
    await updateDoc(cartRef, {
      products: updatedProducts
    })

    console.log(`Đã xóa sản phẩm có productId: ${productId} khỏi giỏ hàng!`);
    
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
  }
} 

export const addProductToUserCart = async(userId, newProduct) => {
  try {
    const cartRef = doc(cartCollection, userId); //Lay gio hang tu id nguoi dung
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) { //Neu gio hang da ton tai thi chi can update lai gio hang

      const cartData = cartDoc.data();
      let updatedProducts = [...cartData.products];  //Sao chep tat ca thong tin cua truong products

      //Tim san pham trong gio hang
      const productIndex = updatedProducts.findIndex(
        (item) => item.productId === newProduct.productId
      );

      if (productIndex !== -1) {
        //Neu san pham da co trong gio hang thi tang len 1
        updatedProducts[productIndex].quantity += newProduct.quantity;
      } else {
        updatedProducts.push(newProduct);
      }

      //cap nhat lai total va products
      const newTotal = cartData.total + newProduct.price * newProduct.quantity;
      await updateDoc(cartRef, {
        products: updatedProducts, //Lay chuoi thong tin san pham moi duoc them vao
        total: newTotal //Cap nhat lai field Total
      });
    } else {
      //Neu gio hang chua ton tai thi tao mot gio hang moi voi san pham vua dc them vao
      await setDoc(cartRef, {
        userId: userId,
        products: [newProduct],
        total: newProduct.price * newProduct.quantity,
        status: 'pending',
        created_at: new Date().toISOString()
      })
    }

    // console.log('Sản phẩm đã được thêm vào giỏ hàng của bạn!');
    Alert.alert("Thông báo", "Sản phẩm đã được thêm vào giỏ hàng của bạn!");
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    Alert.alert("Thông báo", "Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
  }
}

export const removeProductFromCart = async(userId, productId, quantityToRemove) => {
  try {
    const cartRef = doc(cartCollection, userId); //lay id gio hang nguoi dung
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      let updatedProducts = [...cartData.products];  //Sao chep tat ca thong tin cua truong products
      const productIndex = updatedProducts.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex !== -1) {
        //Giam sl san pham
        updatedProducts[productIndex].quantity -= quantityToRemove;

        //neu sl con lai trong gio hang <=0 loai bo san pham ra khoi gio hang
        if(updatedProducts[productIndex].quantity <= 0){
          updatedProducts.splice(productIndex, 1);
        }

        //Tinh toan lai sl total cua san pham
        const newTotal = cartData.total - cartData.products[productIndex].price * quantityToRemove;

        await updateDoc(cartRef, {
          products: updatedProducts,
          total: newTotal>0 ? newTotal : 0, //Luon cho total bang 0 am
        });
      } else {
        Alert.alert("Thông báo", "Sản phẩm không có trong giỏ hàng!");
      }

    } else {
      Alert.alert("Thông báo", "Giỏ hàng không tồn tại!");
    }

    //Thong bao cap nhat gio hang theo sl thanh cong
    Alert.alert("Thông báo", "Cập nhật giỏ hàng thành công!!");
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error);
  }
}

export const addProductFromCart = async(userId, productId, quantityToRemove) => {
  try {
    const cartRef = doc(cartCollection, userId); //lay id gio hang nguoi dung
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      let updatedProducts = [...cartData.products];  //Sao chep tat ca thong tin cua truong products
      const productIndex = updatedProducts.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex !== -1) {
        //Giam sl san pham
        updatedProducts[productIndex].quantity += quantityToRemove;

        //neu sl con lai trong gio hang <=0 loai bo san pham ra khoi gio hang
        if(updatedProducts[productIndex].quantity <= 0){
          updatedProducts.splice(productIndex, 1);
        }

        //Tinh toan lai sl total cua san pham
        const newTotal = cartData.total + cartData.products[productIndex].price * quantityToRemove;

        await updateDoc(cartRef, {
          products: updatedProducts,
          total: newTotal, 
        });
      } else {
        Alert.alert("Thông báo", "Sản phẩm không có trong giỏ hàng!");
      }

    } else {
      Alert.alert("Thông báo", "Giỏ hàng không tồn tại!");
    }

    //Thong bao cap nhat gio hang theo sl thanh cong
    Alert.alert("Thông báo", "Cập nhật giỏ hàng thành công!!");
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error);
  }
}


export const checkoutCart = async (userId, paymentMethod, shippingInfo) => {
  try {
    const cartRef = doc(cartCollection, userId);
    const cartSnapShot = await getDoc(cartRef);

    if (!cartSnapShot.exists()) {
      throw new Error("Giỏ hàng không tồn tại!");
    }

    const cartData = cartSnapShot.data();

    const invoiceData = {
      userId,
      products: cartData.products,
      total: cartData.total,
      paymentMethod,
      shippingInfo, // Thêm thông tin giao hàng
      status: 'paid',
      created_at: Timestamp.now()
    };

    const invoiceRef = await addDoc(collection(db, 'Invoices'), invoiceData);

    // Tao thong tin gui email 
    // const userEmail = user?.primaryEmailAddress?.emailAddress;
    // const userName = user?.fullName;
    // const invoices_id = cartData?.id;
    // const totalPrice = cartData?.total;

    //Gui email bang API Grid
    // await sendOrderConfirmationEmail(userId, invoices_id)


    // Cập nhật giỏ hàng sau khi thanh toán
    await updateDoc(cartRef, {
      status: 'unpaid',
      products: [],
      total: 0,
    });

    // console.log("Thanh toán thành công!");
    
    Alert.alert("Thông báo", "Bạn đã thanh toán thành công!");

    return invoiceRef.id;
  } catch (error) {
    console.error("Lỗi khi thanh toán giỏ hàng:", error);
    throw error;
  }
};
