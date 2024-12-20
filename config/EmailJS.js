import emailjs from 'emailjs-com';
import { Alert } from 'react-native';

// const SERVICE_ID = process.env.SERVICE_ID;
// const TEMPLATE_ID = process.env.TEMPLATE_ID;
// const USER_ID = process.env.USER_ID;

const SERVICE_ID = 'service_782srak';
const TEMPLATE_ID = 'template_m9l61lw';
const USER_ID = 'NYsqArqVrR-dALTgR';

export const sendEmail = async(customerEmail, customerName, orderID, totalPrice) => {
    try {
        const emailParams = {
            to_email: customerEmail,
            customer_name: customerName,
            order_id: orderID,
            totalPrice: totalPrice,
        }

        const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailParams, USER_ID);
        Alert.alert("Thông báo", "Vui lòng kiểm tra email xác nhận");
        return result;
    } catch (error) {
        console.error("Lỗi khi gửi email xác nhận:", error);
    }
}