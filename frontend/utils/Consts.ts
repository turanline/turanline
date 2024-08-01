//Routes
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

//Shop Information
export const SHOP_NAME = "Mis Express",
  SHOP_PHONE = "+905525977888",
  SHOP_EMAIL = "mis.express@mail.ru",
  SHOP_ADDRESS_2 = "Antalya/Alanya: 07400. İlçe Alanya, Oba Mahallesi, 225",
  SHOP_ADDRESS =
    "Oba Mahallesi 225 Dk. Summer Park Sitesi C Block Kat: 3 No: 13 ALANYA";

//Regular Matches
export const passwordRegular = /^[a-zA-Z0-9]+$/,
  nameRegular = /^[A-Z][a-zA-Z]*$/,
  surnameRegular = /^[A-Z][a-zA-Z]*$/,
  usernameRegular = /^[a-zA-Z0-9_]{3,20}$/,
  addressRegular = /^[a-zA-Z0-9\s,.-]+$/,
  companyNameRegular = /^[a-zA-Z0-9\s\-_.,!@#$%^&*()+=]+$/,
  emailRegular = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  phoneRegular = /\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}[-.\s]?\d{0,4}/;

//All Cities
export const cities: string[] = [
  "Москва",
  "Красноярск",
  "Иркутск",
  "Казань",
  "Якутск",
  "Екатеринбург",
  "Стамбул (Лалели)",
  "Омск",
  "Ростов-на-Дону",
  "Краснодар",
  "Оренбург",
  "Крым",
  "Ульяновск",
  "Челябинск",
  "Новосибирск",
  "Самара",
  "Санкт-Петербург",
  "Ханты-Мансийск",
  "Липецк",
  "Нальчик",
  "Пятигорск",
  "Махачкала",
  "Грозный",
  "Дербент",
  "Хасавюрт",
  "Буйнакск",
  "Каспийск",
  "Кизляр",
  "Кизилюрт",
  "Минеральные воды",
  "Ессентуки",
  "Магас",
  "Сургут",
  "Чита",
  "Бурса",
  "Стамбул (Еникапы)",
  "Стамбул (Велиефенди)",
];

export const tariffes: string[] = [
  "Скоростной",
  "Оптимальный",
  "Бюджетный",
  "Express",
];
