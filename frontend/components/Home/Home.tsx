"use client";

//Global
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import Link from "next/link";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useProducts } from "@/hooks/useProducts";

//Images
import slide1 from "../../public/assets/other/slide1.png";
import back1 from "../../public/assets/other/back1.png";
import back2 from "../../public/assets/other/back2.png";
import back3 from "../../public/assets/other/back3.png";
import airplane from "../../public/assets/other/airplane.png";
import packageImg from "../../public/assets/other/package.png";
import lcWaikiki from "../../public/assets/companies/lcWaikiki.png";
import armani from "../../public/assets/companies/armani.png";
import mavi from "../../public/assets/companies/mavi.png";
import koton from "../../public/assets/companies/koton.png";
import prada from "../../public/assets/companies/prada.png";
import fangi from "../../public/assets/companies/fangi.png";
import chanel from "../../public/assets/companies/chanel.png";
import defacto from "../../public/assets/companies/defacto.png";
import dior from "../../public/assets/companies/dior.png";
import luiviton from "../../public/assets/companies/luiviton.png";
import rolex from "../../public/assets/companies/rolex.png";
import colins from "../../public/assets/companies/colins.png";

//Components
import { Icons } from "@/components/Icons/Icons";
import { ProductCard } from "../ProductCard/productCard";
import { Filter } from "../Filter/Filter";

//Utils
import {
  CATALOG_ROUTE,
  DELIVERY_ROUTE,
  MANUFACTURES_ROUTE,
} from "@/utils/Consts";

//Styles
import "swiper/css/pagination";
import "./Home.scss";
import "swiper/css";

const Home = () => {
  const {
    newRevenues,
    newRevenuesLink,
    newRevenuesText,
    manufacturer,
    manufacturerText,
    headerDelivery,
    deliveryText,
    promotions,
    promotionsText,
    seasonThings,
    productSelection,
    lookAll,
    bestsellers,
    foundation,
  } = useTranslate();

  const { products, status } = useTypedSelector(state => state.products);

  const { setAllProducts } = useProducts();

  useEffect(() => {
    setAllProducts();
  }, [setAllProducts]);

  const mapAllProducts = () => {
    const threeProducts = products.slice(0, 3);

    if (status === "pending") return <Icons id="spiner" />;

    return (
      <div className="home-products-wrapper">
        {threeProducts.map(product => (
          <ProductCard key={product.id} productInfo={product} />
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto mt-[30px] px-[28px] sm:px-0">
      <div className="flex flex-col lg:flex-row gap-[15px] lg:gap-[24px] mb-[15px] lg:mb-[24px]">
        <Link className="lg:h-auto   w-full  " href={CATALOG_ROUTE}>
          <div className="h-[200px]  lg:max-h-[230px] max-h-[300px] flex-col p-[24px] sm:p-[36px] sm:h-[240px] text-white relative">
            <Image
              className="absolute top-0 left-0 w-full h-full rounded-md z-0"
              src={back1}
              alt="back1"
            />
            <h3 className="family_bold relative z-10 text-[26px] sm:text-[42px]">
              {newRevenues}
            </h3>
            <p className="relative z-10">{newRevenuesText}</p>
            <div className="flex absolute right-[20px] bottom-[16px] gap-[7px] items-center">
              <p>{newRevenuesLink}</p>
              <Icons id="arrow" />
            </div>
          </div>
        </Link>

        <div className="flex flex-col sm:flex-row gap-[15px]">
          <div className="relative rounded-md text-white bg-pink h-[177px] sm:h-auto flex lg:hidden flex-col py-[24px] sm:py-[30px] px-[20px] sm:px-[24px]">
            <Image
              className="absolute bottom-0 right-0"
              src={airplane}
              alt="airplane"
            />
            <h5 className="family_bold text-[26px]">{headerDelivery}</h5>
            <p className="font-light">{deliveryText}</p>
          </div>
          <Swiper
            className="sm:min-w-[400px] w-full h-[177px] lg:max-w-[400px] min-h-[230px]"
            spaceBetween={0}
            slidesPerView={1}
            watchSlidesProgress
            modules={[Pagination]}
            pagination={true}
          >
            <SwiperSlide>
              <div className="w-full h-full relative flex flex-col items-center justify-center text-center text-white">
                <Image
                  className="absolute w-full h-full z-0"
                  src={slide1}
                  alt="slide1"
                />
                <h5 className="relative z-10 family_bold text-[26px]">
                  {manufacturer}
                </h5>
                <p className="relative z-10 font-light">{manufacturerText}</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 sm:h-[230px] gap-[15px] lg:gap-[24px]">
        <div className="relative rounded-md text-white h-[177px] sm:h-auto flex flex-col items-center justify-center">
          <Image
            className="absolute w-full h-full z-0"
            src={back2}
            alt="back2"
          />
          <h5 className="family_bold relative z-10 text-[26px]">
            {promotions}
          </h5>
          <p className="relative z-10 font-light">{promotionsText}</p>
        </div>

        <Link
          className="hidden lg:flex relative rounded-md text-white bg-pink flex-col py-[30px] px-[24px]"
          href={DELIVERY_ROUTE}
        >
          <Image
            className="absolute bottom-0 right-0"
            src={airplane}
            alt="airplane"
          />
          <h5 className="family_bold text-[26px]">{headerDelivery}</h5>
          <p className="font-light">{deliveryText}</p>
        </Link>

        <div className="relative rounded-md text-white h-[177px] sm:h-auto flex flex-col items-center justify-center p-4">
          <Image
            className="absolute object-cover w-full h-full rounded-md z-0"
            src={back3}
            alt="back3"
          />
          <h5 className="family_bold relative z-10 text-[26px] text-center">
            {seasonThings}
          </h5>
        </div>
        <Link href={"#filter"} className="choose_good_card">
          <Image src={packageImg} alt="packageImg" width={500} height={500} />

          <p className="text-[26px] family_bold sm:text-[20px]">
            {productSelection}
          </p>
        </Link>
      </div>
      <div className="hidden md:flex flex-col items-center relative">
        <div className="w-full flex flex-col gap-[40px] mt-[100px]">
          <div className="flex gap-[30px] justify-between cursor-pointer">
            <Image
              className="w-[100px] object-contain"
              src={lcWaikiki}
              alt="lcWaikiki"
            />

            <Image
              className="w-[100px] object-contain"
              src={armani}
              alt="armani"
            />

            <Image className="w-[100px] object-contain" src={mavi} alt="mavi" />
            <Image
              className="w-[100px] object-contain"
              src={koton}
              alt="koton"
            />

            <Image
              className="w-[100px] object-contain"
              src={prada}
              alt="prada"
            />

            <Image
              className="w-[100px] object-contain"
              src={fangi}
              alt="fangi"
            />
          </div>
          <div className="flex justify-between lg:gap-[50px] cursor-pointer">
            <Image
              className="w-[100px] object-contain"
              src={chanel}
              alt="chanel"
            />

            <Image
              className="w-[100px] object-contain"
              src={defacto}
              alt="defacto"
            />

            <Image className="w-[100px] object-contain" src={dior} alt="dior" />
            <Image
              className="w-[100px] object-contain"
              src={luiviton}
              alt="luiviton"
            />

            <Image
              className="w-[100px] object-contain"
              src={rolex}
              alt="rolex"
            />

            <Image
              className="w-[100px] object-contain"
              src={colins}
              alt="colins"
            />
          </div>
        </div>

        <div className="absolute right-0 bottom-[-50px] flex gap-[7px] items-center mt-[30px]">
          <Link
            className="hover:text-tiffani transition-colors"
            href={MANUFACTURES_ROUTE}
          >
            {lookAll}
          </Link>

          <Icons id="arrowBlack" />
        </div>
      </div>
      <div className="flex flex-col mt-[90px] w-full">
        <div className="flex justify-between mb-[26px]">
          <h5 className="text-[24px]">{bestsellers}</h5>

          <div className="flex gap-[7px] items-center">
            <Link
              className="hover:text-tiffani transition-colors"
              href={CATALOG_ROUTE}
            >
              {lookAll}
            </Link>

            <Icons id="arrowBlack" />
          </div>
        </div>

        {mapAllProducts()}
      </div>

      <h5 className="text-[24px] mt-[80px] mb-[25px]">{foundation}</h5>

      <Filter products={products} />
    </main>
  );
};

export default Home;
