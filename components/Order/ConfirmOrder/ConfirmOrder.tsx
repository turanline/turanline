"use client";
//Global
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { showToastMessage } from "@/app/toastsChange";
import ReactInputMask from "react-input-mask";
import { getAllCategories } from "@/services/categoriesAPI";
import { getAllCities } from "@/services/productsAPI";
//Components
import {
  Button,
  DropdownMenu,
  DropdownItem,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  DropdownTrigger,
  Dropdown
} from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useCart } from "@/hooks/useCart";
//Utils
import {
  POLITIC_ROUTE,
  SHOP_ROUTE,
  tariffes,
} from "@/utils/Consts";
//Services
import { getDeliveryCost,postToOrder } from "@/services/paymentAPI";
//Styles
import "./ConfirmOrder.scss";



interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  level: number;
  parent: number | null;
}

interface City {
  id: number;
  name: string;
}

export default function ConfirmOrder({nextStep}: {nextStep: () => void}) {
  //Hooks
  const { push } = useRouter();
  const translate = useTranslate();
  const { status: cartStatus,cart } = useTypedSelector(state => state.cart);
  const { isAuth,status: userStatus,userState } = useTypedSelector(state => state.user);
  const { returnAllProductsCounter, calculateTotalPrice } = useCart();

  const [allCategories,setAllCategories] = useState<Category[]>([]);
  const [allCities,setAllCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<number>(0);
  const [selectedTarif, setSelectedTarif] = useState<string>('0');
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const [deliveryCost,setDeliveryCost] = useState<string>('0');


  //get
  const getCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response?.status === 200) {
        setAllCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
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
  const getUserDeliveryCost = async () => {
    try {
      const response = await getDeliveryCost(String(selectedCategory), String(selectedCity), selectedTarif);
  
      if (response?.status === 200 && response?.data?.length > 0) {
        localStorage.setItem('deliveryCost', response?.data[0]?.price);
        setDeliveryCost(response?.data[0]?.price);
      }else{
        setDeliveryCost('0');
        localStorage.removeItem('deliveryCost');
      } 

    } catch (error) {
      console.error('Error fetching delivery:', error);
      localStorage.removeItem('deliveryCost');
    }
  };

  //Render
  const mapTariffes = () => (
    tariffes?.map(({name,id}) => (
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
  const renderCategories = () => {
    if(!allCategories?.length) return(
      <SelectItem aria-label="select-error" key='error'>Error</SelectItem>
    );

    return(allCategories?.map(({name,id}) => (
      <SelectItem aria-label="select-cardSystem"  key={name} data-value={name} onClick={()=> setSelectedCategory(id)}>{name}</SelectItem>
  )));
  };

  //Handle
  const handlePostUserOrder = async () => {
    try {
      const productsId = cart?.order_products.map(({id}) => id);

      const requestBody = {
        delivery: selectedTarif,
        order_products: productsId,
      };

      const response = await postToOrder(requestBody);
        if(response?.status === 201){
          showToastMessage('success','Заказ успешно создан');
          showToastMessage('warn','Переход к оплате');
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
    localStorage.removeItem('deliveryCost');
  },[])
  useEffect(()=>{
   getUserDeliveryCost()
  },[selectedCategory,selectedCategory,selectedTarif])

  useEffect(()=>{
    getCategories();
    getCities();
  },[translate]);

  useEffect(() => {
    if (!isAuth && userStatus === "fulfilled") push(SHOP_ROUTE);
  }, [isAuth, userStatus, push]);

  if (!isAuth || userStatus === "pending" || cartStatus === "pending")
    return <Icons id="spiner" />;

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] md:px-0">
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
                Выберите город из списка
                <Select
                  label="Выберие город" 
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

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                Выберите категорию
                <Select
                  label="Выберие категорию" 
                  aria-label="select-categories"
                  radius="none"
                  disallowEmptySelection
                  classNames={{
                    trigger: "border-1 border-border shadow-none rounded-md",
                  }}
                >
                  {renderCategories()}
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
                {(Number(deliveryCost) + calculateTotalPrice()).toFixed(2)} $
              </p>
            </div>

            <div className="flex justify-between">
              <p>
                {returnAllProductsCounter()} {translate.orderPageProductsText}
              </p>

              <p>{calculateTotalPrice().toFixed(2)} $</p>
            </div>

            <div className="flex justify-between">
              <p>{translate.headerDelivery}</p>

              <p>{deliveryCost} $</p>
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
            <p className="text-[18px] mb-[10px]">Способ доставки</p>

            <RadioGroup aria-label="select-cardSystem" value={String(selectedTarif)} onValueChange={setSelectedTarif}>
              {mapTariffes()}
            </RadioGroup>
          </div>
        </div>
      </div>
    </main>
  );
}
