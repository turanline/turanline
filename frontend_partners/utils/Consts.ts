//routes
export const SHOP_ROUTE = "/",
  SHOP_TELEGRAM = "https://t.me/misexpress",
  SHOP_WHATSAPP = "https://wa.me/+905010008882",
  SHOP_INSTAGRAM = "https://www.instagram.com/misexpress",
  LOGIN_ROUTE = "/login",
  REGISTRATION_ROUTE = "/registration",
  PAYMENT_ROUTE = "/payment",
  POLITIC_ROUTE = "/politics",
  PROFILE_ROUTE = "/profile",
  PROVIDER_ROUTE = "/",
  PROVIDER_BLOCKED_ROUTE = "/blocked/",
  FIRST_STAGE_ROUTE = "/registration",
  PROVIDER_PRODUCTS_ROUTE = "/products",
  PROVIDER_PRODUCT_ROUTE = "/product",
  PROVIDER_ORDERS_ROUTE = "/orders",
  SUPER_ADMIN_APPLICATIONS = "/superadmin/applications",
  ADMIN_PROVIDER_ROUTE = "/superadmin/provider",
  CREATE_PRODUCT_ROUTE = "/createNewProduct",
  CLIENT_ROUTE ="https://mis-express.com/",
  IMPORT_INSTRUCTION ="https://docs.google.com/spreadsheets/d/1LrSJ3yBKldxbKB4B78YdaN0LHvp_XxSy0CzO8f47VQA/edit?usp=sharing";

//SHOP_INFO
export const SHOP_NAME = "TuranLine";
export const SHOP_PHONE = "+905010019888";
export const SHOP_SECOND_PHONE = "+905010008882";
export const SHOP_EMAIL = "mis.express@mail.ru";
export const SHOP_EMAIL_SUPPORT = "admin@mis-express.com";
export const SHOP_ADDRESS = "Oba Mahallesi 225 Dk. Summer Park Sitesi C Block Kat: 3 No: 13 ALANYA";
export const SHOP_ADDRESS_2 = "Antalya/Alanya: 07400. İlçe Alanya, Oba Mahallesi, 225";

//regulars
export const phone_login_Regular = /(?:)/;
// export const phone_login_Regular = /^\+[0-9]+$/;
export const phoneRegular = /(?:)/;



export const compoundRegular = /(?:)/;
export const clothesSizeRegular = /^[A-Za-z0-9.]+$/;
// export const compoundRegular = /^[a-zA-Z0-9\s,.-]+$/;
export const seasonRegular = /^[a-zA-Z0-9\s,.-]+$/;
export const articleRegular = /^[a-zA-Z0-9\s,.-]+$/;
export const brandRegular = /^[a-zA-Z0-9\s,.-]+$/;
export const patternRegular = /^[a-zA-Z0-9\s,.-]+$/;
// export const patternRegular = /^[a-zA-Z0-9\s,.-]+$/;
export const countryRegular = /^[a-zA-Z0-9\s,.-]+$/;
export const priceRegular = /^\d*(\.\d{0,2})?$/;
export const titleRegular = /^[A-Za-zА-Яа-яЁёÇĞİÖŞÜçğıöşü0-9\s]*$/;
export const descriptionRegular = /^[A-Za-zА-Яа-яЁёÇĞİÖŞÜçğıöşü0-9\s.,:;!?()-]*$/;



// export const priceRegular = /^\d+$/;
export const codeRegular = /^\d+$/;
// export const weightRegular = /^\d*\.?\d+$/;
export const weightRegular = /^\d*(\.\d{0,2})?$/;






export const passwordRegular = /^[a-zA-Z0-9]+$/;
export const nameRegular = /^[A-ZА-ЯЁĞÜŞİÖÇ][a-zA-Zа-яёА-ЯЁğüşiöç]*$/;
export const surnameRegular = /^[A-ZА-ЯЁĞÜŞİÖÇ][a-zA-Zа-яёА-ЯЁğüşiöç]*$/;
export const usernameRegular = /^[a-zA-Z0-9_]{3,20}$/;
export const addressRegular = /^[a-zA-Zа-яА-ЯёЁĞÜŞİÖÇğüşiöç0-9\s,.-]+$/;
export const companyNameRegular = /^[a-zA-Z0-9\s\-_.,!@#$%^&*()+=çğıöşüÇĞİÖŞÜ]+$/;
export const emailRegular = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;