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
  PROVIDER_SITE ="https://mis-express-beta-git-provider-abramovs-projects.vercel.app/login";
export const SHOP_LINK = "https://mis-express.com/";

//Shop Information
export const SHOP_NAME = "Mis Express",
  SHOP_PHONE = "+905525977888",
  SHOP_SECOND_PHONE = "+905010008882",
  SHOP_EMAIL = "mis.express@mail.ru",
  SHOP_ADDRESS_2 = "Antalya/Alanya: 07400. İlçe Alanya, Oba Mahallesi, 225",
  SHOP_ADDRESS =
    "Oba Mahallesi 225 Dk. Summer Park Sitesi C Block Kat: 3 No: 13 ALANYA";

//Regular Matches
export const passwordRegular = /^[a-zA-Z0-9]+$/;
export const nameRegular = /^[A-ZА-ЯЁĞÜŞİÖÇ][a-zA-Zа-яёА-ЯЁğüşiöç]*$/;
export const surnameRegular = /^[A-ZА-ЯЁĞÜŞİÖÇ][a-zA-Zа-яёА-ЯЁğüşiöç]*$/;
export const usernameRegular = /^[a-zA-Z0-9_]{3,20}$/;
export const addressRegular = /^[a-zA-Zа-яА-ЯёЁĞÜŞİÖÇğüşiöç0-9\s,.-]+$/;
export const companyNameRegular = /^[a-zA-Z0-9\s\-_.,!@#$%^&*()+=]+$/;
export const emailRegular = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
export const phone_login_Regular = /^\+[0-9]+$/;
export const phoneRegular = /(?:)/;
export const codeRegular = /^\d+$/;
//All Cities
export const cities = [
  { city: "Москва", value: "Moscow" },
  { city: "Красноярск", value: "Krasnoyarsk" },
  { city: "Иркутск", value: "Irkutsk" },
  { city: "Казань", value: "Kazan" },
  { city: "Якутск", value: "Yakutsk" },
  { city: "Екатеринбург", value: "Yekaterinburg" },
  { city: "Стамбул (Лалели)", value: "Istanbul (Laleli)" },
  { city: "Омск", value: "OMSK" },
  { city: "Ростов-на-Дону", value: "Rostov-on-Don" },
  { city: "Краснодар", value: "Krasnodar" },
  { city: "Оренбург", value: "Orenburg" },
  { city: "Крым", value: "Crimea" },
  { city: "Ульяновск", value: "Ulyanovsk" },
  { city: "Челябинск", value: "Chelyabinsk" },
  { city: "Новосибирск", value: "Novosibirsk" },
  { city: "Самара", value: "Samara" },
  { city: "Санкт-Петербург", value: "Saint Petersburg" },
  { city: "Ханты-Мансийск", value: "Khanty-Mansiysk" },
  { city: "Липецк", value: "Lipetsk" },
  { city: "Нальчик", value: "Nalchik" },
  { city: "Пятигорск", value: "Pyatigorsk" },
  { city: "Махачкала", value: "Makhachkala" },
  { city: "Грозный", value: "Grozny" },
  { city: "Дербент", value: "Derbent" },
  { city: "Хасавюрт", value: "Khasavyurt" },
  { city: "Буйнакск", value: "Buynaksk" },
  { city: "Каспийск", value: "Kaspiysk" },
  { city: "Кизляр", value: "Kizlyar" },
  { city: "Кизилюрт", value: "Kizilyurt" },
  { city: "Минеральные воды", value: "Mineralnye Vody" },
  { city: "Ессентуки", value: "Yessentuki" },
  { city: "Магас", value: "Magas" },
  { city: "Сургут", value: "Surgut" },
  { city: "Чита", value: "Chita" },
  { city: "Бурса", value: "Bursa" },
  { city: "Стамбул (Еникапы)", value: "Istanbul (Yenikapı)" },
  { city: "Стамбул (Велиефенди)", value: "Istanbul (Veliefendi)" }
];


export const tariffes = [
  {
    name:"Скоростной",
    id:1,
  },
  {
    name:"Оптимальный",
    id:2,
  },
  {
    name: "Бюджетный",
    id:3,
  },
  {
    name:"Express",
    id:4,
  },
  
];
