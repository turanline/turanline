//Routes
export const SHOP_ROUTE = "/",
  SHOP_TELEGRAM = "https://t.me/misexpress",
  SHOP_WHATSAPP = "https://wa.me/+905010008882",
  SHOP_INSTAGRAM = "https://www.instagram.com/misexpress",
  ADMIN_ROUTE = "/admin",
  ACCOUNT_ROUTE = "/account",
  LOGIN_ROUTE = "/login",
  REGISTRATION_ROUTE = "/registration",
  BASKET_ROUTE = "/basket",
  ABOUT_ROUTE = "/about",
  CATALOG_ROUTE = "/catalog",
  CATEGORY_ROUTE = "/category",
  CONTACTS_ROUTE = "/contacts",
  DELIVERY_ROUTE = "/delivery",
  FAVORITES_ROUTE = "/favorites",
  MANUFACTURES_ROUTE = "/manufacturers",
  ORDER_ROUTE = "/order",
  PAYMENT_ROUTE = "/payment",
  POLITIC_ROUTE = "/politics",
  PROFILE_ROUTE = "/profile",
  SUCCESS_ROUTE = "/successfulPaymentPage",
  PROVIDER_SITE ="https://partners.tyranshop.com/login";
export const SHOP_LINK = "https://mis-express.com/";

//Shop Information
export const SHOP_NAME = "TuranLine",
  SHOP_PHONE = "+905010019888",
  SHOP_SECOND_PHONE = "+905010008882",
  SHOP_EMAIL = "mis.express@mail.ru",
  SHOP_ADDRESS_2 = "Antalya/Alanya: 07400. İlçe Alanya, Oba Mahallesi, 225",
  SHOP_ADDRESS = "Oba Mahallesi 225 Dk. Summer Park Sitesi C Block Kat: 3 No: 13 ALANYA";

//Regular Matches
export const passwordRegular = /^[a-zA-Z0-9]+$/;
export const nameRegular = /^[A-ZА-ЯЁĞÜŞİÖÇ][a-zA-Zа-яёА-ЯЁğüşiöç]*$/;
export const surnameRegular = /^[A-ZА-ЯЁĞÜŞİÖÇ][a-zA-Zа-яёА-ЯЁğüşiöç]*$/;
export const usernameRegular = /^[a-zA-Z0-9_]{3,20}$/;
export const addressRegular = /^[a-zA-Zа-яА-ЯёЁĞÜŞİÖÇğüşiöç0-9\s,.-]+$/;
export const companyNameRegular = /^[a-zA-Z0-9\s\-_.,!@#$%^&*()+=]+$/;
export const emailRegular = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
export const phone_login_Regular = /(?:)/;
// export const phone_login_Regular = /^\+[0-9]+$/;
export const phoneRegular = /(?:)/;
export const codeRegular = /^\d+$/;

//cards
export const cardNumberRegular = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
export const cardHolderNameRegular = /^[A-ZА-Я][a-zа-я]*\s[A-ZА-Я][a-zа-я]*$/;
export const cvvRegular = /^\d{3,4}$/;
export const expirationDateRegular = /^\d+$/;
export const cardTypeRegular = /^\d+$/;
export const paymentSystemRegular = /^\d+$/;

