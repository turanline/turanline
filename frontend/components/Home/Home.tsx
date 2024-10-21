"use client";
//Global
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
import Link from "next/link";
import { getCookie, setCookie } from "cookies-next";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useProducts } from "@/hooks/useProducts";
//Images
import slide1 from "../../public/assets/other/slide1.png";
import back1 from "../../public/assets/other/back1.png";
import back2 from "../../public/assets/other/back2.png";
import back3 from "../../public/assets/other/back3.png";
import airplane from "../../public/assets/other/airplane.png";
import packageImg from "../../public/assets/other/package.png";
//Components
import { Icons } from "@/components/Icons/Icons";
import { ProductCard } from "../ProductCard/productCard";
import { Filter } from "../Modals/Filter/Filter";
import { EmptyComponent } from "../EmptyComponent/EmptyComponent";
//Utils
import {
  CATALOG_ROUTE,
  DELIVERY_ROUTE,
  SHOP_ROUTE,
  PROVIDER_SITE
} from "@/utils/Consts";
//Styles
import "swiper/css/pagination";
import "./Home.scss";
import "swiper/css";

const Home = () => {
  const translate = useTranslate();
  const { setAllProducts } = useProducts();
  const { products, status } = useTypedSelector(state => state.products);


  const mapAllProducts = () => {
    const threeProducts = products.slice(0, 3);

    if (status === "pending") return <Icons id="spiner" />;

    if (!threeProducts?.length && status === "fulfilled")
    return (
        <EmptyComponent
          title={translate.emptyCatalogTitle}
          text={translate.emptyCatalogText}
          route={SHOP_ROUTE}
          buttonText={translate.emptyCatalogButtonText}
        />
      );

    return (
      <div className="home-products-wrapper">
        {threeProducts?.map(product => (
          <ProductCard key={product?.id} productInfo={product} />
        ))}
      </div>
    );
  };

  const renderSlider = () => (
    <Swiper
      className="sm:min-w-[400px] max-h-[231px] w-full h-[177px] lg:max-w-[400px] sm:h-[230px] rounded-lg"
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
            {translate.manufacturer}
          </h5>
          <p className="relative z-10 font-light">{translate.manufacturerText}</p>
        </div>
      </SwiperSlide>
    </Swiper>
  );

  useEffect(() => {
    setAllProducts();
  }, [setAllProducts]);

  useEffect(() => {
    const language = getCookie("selectedLanguage");

    if (!language) setCookie("selectedLanguage", "RU");
  }, []);

  return (
    <main className="container mx-auto px-[15px] lg:px-[30px]">
      <div className="flex flex-col lg:flex-row gap-[15px] lg:gap-[24px] mb-[15px] lg:mb-[24px]">
        <Link className="lg:h-auto   w-full  " href={CATALOG_ROUTE}>
          <div className="h-[200px]  lg:max-h-[230px] max-h-[300px] flex-col p-[24px] sm:p-[36px] sm:h-[240px] text-white relative">
            <Image
              className="absolute top-0 left-0 w-full h-full rounded-md z-0"
              src={back1}
              alt="back1"
            />
            <h3 className="family_bold relative z-10 text-[26px] sm:text-[42px]">
              {translate.newRevenues}
            </h3>
            <p className="relative z-10">{translate.newRevenuesText}</p>
            <div className="flex absolute right-[20px] bottom-[16px] gap-[7px] items-center">
              <p>{translate.newRevenuesLink}</p>
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
            <h5 className="family_bold text-[26px]">{translate.headerDelivery}</h5>
            <p className="font-light">{translate.deliveryText}</p>
          </div>
          {renderSlider()}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 sm:h-[230px] gap-[15px] lg:gap-[24px]">
        <Link className="relative rounded-md text-white h-[177px] sm:h-auto flex flex-col items-center justify-center"
            href={PROVIDER_SITE}>
          <Image
            className="absolute w-full h-full z-0"
            src={back2}
            alt="back2"      
          />
          <h5 className="family_bold relative z-10 text-[26px]">
            {translate.workWithUs}
          </h5>
          {/* <p className="relative z-10 font-light">{translate.promotionsText}</p> */}
          </Link>

        <Link
          className="hidden lg:flex relative rounded-md text-white bg-pink flex-col py-[30px] px-[24px]"
          href={DELIVERY_ROUTE}
        >
          <Image
            className="absolute bottom-0 right-0"
            src={airplane}
            alt="airplane"
          />
          <h5 className="family_bold text-[26px]">{translate.headerDelivery}</h5>
          <p className="font-light">{translate.deliveryText}</p>
        </Link>

        <div className="relative rounded-md text-white h-[177px] sm:h-auto flex flex-col items-center justify-center p-4">
          <Image
            className="absolute object-cover w-full h-full rounded-md z-0"
            src={back3}
            alt="back3"
          />
          <h5 className="family_bold relative z-10 text-[26px] text-center">
            {translate.seasonThings}
          </h5>
        </div>
        <Link href={"#filter"} className="choose_good_card">
          <Image src={packageImg} alt="packageImg" width={500} height={500} />

          <p className="text-[26px] family_bold sm:text-[20px]">
            {translate.productSelection}
          </p>
        </Link>
      </div>
     
      <div className="flex flex-col mt-[30px] w-full">
        <div className="flex items-center justify-between mb-[26px]">
          <h5 className="text-[24px]">{translate.bestsellers}</h5>

          <div className="flex gap-[7px] items-center">
            <Link
              className="hover:text-tiffani transition-colors"
              href={CATALOG_ROUTE}
            >
              {translate.lookAll}
            </Link>

            <Icons id="arrowBlack" />
          </div>
        </div>

        {mapAllProducts()}
      </div>

      <h5 className="text-[24px] mt-[30px] mb-[25px]">{translate.foundation}</h5>

      <Filter />
    </main>
  );
};

export default Home;
