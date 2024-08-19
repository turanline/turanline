"use client";
//Global
import Link from "next/link";
import { useEffect, useState } from "react";
import { showToastMessage } from "@/app/toastsChange";
import { getAllCities } from "@/services/productsAPI";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
//Components
import {
  Button,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useCart } from "@/hooks/useCart";
//Utils
import {
  BASKET_ROUTE,
  POLITIC_ROUTE,
  SHOP_ROUTE,
} from "@/utils/Consts";
//Services
import { postToOrder,getAllTariffies } from "@/services/paymentAPI";
//Styles
import "./ConfirmOrder.scss";




interface City {
  id: number;
  name: string;
};
interface Tariffes{
  id: number;
  name: string;
};

export default function ConfirmOrder({nextStep}: {nextStep: () => void}) {
  //Hooks
  const translate = useTranslate();
  const { cart } = useTypedSelector(state => state.cart);
  const { userState } = useTypedSelector(state => state.user);
  const { returnAllProductsCounter, calculateTotalPrice,onFetchCart } = useCart();

  const [allCities,setAllCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<number>(0);
  const [selectedTarif, setSelectedTarif] = useState<string>('0');
  const [allTariffies,setAllTariffies] = useState<Tariffes[]>([]);

  //get
  const getCities = async () => {
    try {
      const response = await getAllCities();
      if (response?.status === 200) {

        setAllCities(response?.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const getTariffies = async () => {
    try {
      const response = await getAllTariffies();

      if(response?.status === 200){
        setAllTariffies(response?.data);
        return;
      };
      if(response?.response?.status){
        showToastMessage('warn','Ошибка получения трафов');
        return;
      };
    } catch (error) {
      console.error(error);
    }
  };

  //Render
  const mapTariffes = () => (
    allTariffies?.map(({name,id}) => (
      <Radio aria-label="select-tatif" key={id} classNames={{ label: "text-textAcc" }} value={String(id)}>
        {name}
      </Radio>
    ))
  );
  const renderCities = () => (
    allCities?.map(({name,id}) => (
      <SelectItem aria-label='selected-city' key={name} onClick={()=> setSelectedCity(id)}>{name}</SelectItem>
    ))
  );

  //Handle
  const handlePostUserOrder = async () => {
    try {
      const productsId = cart?.order_products.map(({id}) => id);

      const requestBody = {
        delivery: {
          city: selectedCity,
          tariff: selectedTarif
        },
        order_products: productsId,
      };

      const response = await postToOrder(requestBody);
        if(response?.status === 201){
          showToastMessage('success','Заказ успешно создан');
          showToastMessage('warn','Переход к оплате');
          localStorage.setItem('deliveryCost',response?.data?.delivery?.price);
          nextStep();
        }
        if(response?.response?.status === 400){
          showToastMessage('warn','Заполните все данные');
        }
        if(response?.response?.status === 401){
          showToastMessage('error','Пользователь не авторизован');
        }
     

    } catch (error) {
        showToastMessage('error','Ошибка при создании ');
    }
  };


  useEffect(()=>{
    onFetchCart();

    localStorage.removeItem('deliveryCost');
  },[])

  useEffect(()=>{
    onFetchCart();
  },[onFetchCart])

  useEffect(()=>{
    getTariffies();
    getCities();
  },[translate]);


  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] md:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem href={BASKET_ROUTE}>{translate.headerCart}</BreadcrumbItem>
        <BreadcrumbItem>{translate.orderPageButton}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full flex flex-col lg:grid grid-cols-2 gap-[79px]">
        <div className="flex flex-col gap-[45px]">
          <h2 className="family-medium text-[32px]">{translate.orderPagePersonalData}</h2>

          <form className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.registrationLabelName}

                <div className='inputs-order'>{userState?.user.first_name}</div>
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.orderPagePhone}
                <div className='inputs-order'>{userState?.user.phone_number}</div>
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.registrationLabelEmail}

                <div className='inputs-order'>{userState?.user.email}</div>

                <span className="text-[12px] text-textAcc">
                  {translate.orderPageEmailText}
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
              {translate.paymentSelectCity}
                <Select
                  label={translate.paymentSelectCity}
                  aria-label="select-cities"
                  radius="none"
                  disallowEmptySelection
                  classNames={{
                    trigger: "border-1 border-border shadow-none rounded-md",
                  }}
                >
                  
                  {renderCities()}
                </Select>
              </label>
            </div>


          </form>
        </div>

        <div className="flex flex-col gap-[15px]">
          <h2 className="text-[32px] family-medium">{translate.orderPageCart}</h2>

          <p className="text-[20px] text-textGray">{translate.orderPageTotal}:</p>

          <div className="flex flex-col gap-[4px] text-textGray">
            <div className="flex justify-between">
              <p className="text-[24px] text-textGray">{translate.orderPageSum}</p>

              <p className="text-[24px] text-tiffani">
                {(calculateTotalPrice()).toFixed(2)} $
              </p>
            </div>

            <div className="flex justify-between">
              <p>
                {returnAllProductsCounter()} {translate.orderPageProductsText}
              </p>

              <p>{calculateTotalPrice().toFixed(2)} $</p>
            </div>

     
          </div>

          <Button
            onClick={handlePostUserOrder}
            className="bg-tiffani text-[24px] text-white rounded-lg w-full h-[73px] py-[10px]"
          >
            {translate.orderPageButton}
          </Button>

          <div className="text-textAcc">
            {translate.orderPageLinkText}{" "}
            <Link href={POLITIC_ROUTE} className="text-textGray politics">
              {translate.orderPageLink}
            </Link>
          </div>

          <div className="flex flex-col">
            <p className="text-[18px] mb-[10px]">{translate.paymentSelectTarif}</p>

            <RadioGroup aria-label="select-cardSystem" value={String(selectedTarif)} onValueChange={setSelectedTarif}>
              {mapTariffes()}
            </RadioGroup>
          </div>
        </div>
      </div>
    </main>
  );
}
