//routes
export const SHOP_ROUTE = "/",
  SHOP_TELEGRAM = "/",
  SHOP_WHATSAPP = "/",
  SHOP_INSTAGRAM = "/",
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
  PROVIDER_SITE =
    "https://mis-express-beta-git-provider-abramovs-projects.vercel.app/login";

//SHOP_INFO
export const SHOP_NAME = "Mis Express";
export const SHOP_PHONE = "+905525977888";
export const SHOP_EMAIL = "mis.express@mail.ru";
export const SHOP_ADDRESS =
  "Oba Mahallesi 225 Dk. Summer Park Sitesi C Block Kat: 3 No: 13 ALANYA";
export const SHOP_ADDRESS_2 =
  "Antalya/Alanya: 07400. İlçe Alanya, Oba Mahallesi, 225";

//regulars
export const phoneRegular = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
export const passwordRegular = /^[a-zA-Z0-9]+$/;
export const nameRegular = /^[A-Z][a-zA-Z]*$/;
export const surnameRegular = /^[A-Z][a-zA-Z]*$/;
export const usernameRegular = /^[a-zA-Z0-9_]{3,20}$/;
export const addressRegular = /^[a-zA-Z0-9\s,.-]+$/;
export const companyNameRegular = /^[a-zA-Z0-9\s\-_.,!@#$%^&*()+=]+$/;
export const emailRegular =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
