"use client";
//Global
import { useState, useMemo, useEffect, CSSProperties } from "react";
//Components
import { Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { Filter } from "@/components/Modals/Filter/Filter";
import { ProductCard } from "@/components/ProductCard/productCard";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";
import { Icons } from "@/components/Icons/Icons";
//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useProducts } from "@/hooks/useProducts";
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import { SHOP_ROUTE } from "@/utils/Consts";
//Types
import { IProductsState } from "@/types/reduxTypes";
//Styles
import "swiper/css/pagination";
import "./catalog.scss";
import "swiper/css";

export default function Category() {
  const [isOpen, setIsOpen] = useState(false);
  //Hooks
  const { filtered, category, filters, status, searchText,products } = useTypedSelector(state => state.products);

  const {  setAllProducts, handleSearch,onSetFilters } = useProducts();
  const translate = useTranslate();

  //Styles
  const buttonStyles: CSSProperties = {
    background: isOpen ? "#282828" : "#0ABAB5",
    color: "white",
    fontSize: "22px",
    textTransform: 'none'
  };
  //ClassNames
  const filterWrapperClassName = isOpen ? "filter_wrapper active" : "filter_wrapper";


  const newProducts = handleSearch(searchText, products);
  const setOpen = () => setIsOpen(!isOpen);



  let productsArray = filtered.length ? filtered : newProducts


  const mapAllProducts = useMemo(() => {
    if (status === "pending") return <Icons id="spiner" />;



    if (!productsArray?.length && status === "fulfilled") {
      return (
        <EmptyComponent
          title={translate.emptyCatalogTitle}
          text={translate.emptyCatalogText}
          route={SHOP_ROUTE}
          buttonText={translate.emptyCatalogButtonText}
        />
      );
    }

    if (productsArray.length && status === "fulfilled")
      return (
        <div className="main-product-wrapper">
          {productsArray?.map(productInfo => (
            <ProductCard key={productInfo?.id} productInfo={productInfo} />
          ))}
        </div>
      );
  }, [translate,productsArray,status]);



  useEffect(() => {
    setAllProducts();
  }, [setAllProducts]);

  useEffect(()=>{
    const newFilters: IProductsState["filters"] = {
      brand: null,
      color: 0,
      price_max:10000,
      price_min:0,
      mold: null,
      material: null,
      season: null,
    };

    onSetFilters(newFilters)
  },[])


  return (
    <main className="catalog-wrapper container mx-auto px-[15px] lg:px-[30px]">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{translate.mainPageRoute}</BreadcrumbItem>

        <BreadcrumbItem>{translate.headerCatalog}</BreadcrumbItem>
      </Breadcrumbs>

      <Button
        style={buttonStyles}
        onClick={setOpen}
        className="filters"
        startContent={<Icons id="filter" />}
      >
        {translate.catalogFilter}
      </Button>

      <div className={filterWrapperClassName}>
        <Filter />
      </div>

      {mapAllProducts}
    </main>
  );
}
