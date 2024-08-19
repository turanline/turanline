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
//Styles
import "swiper/css/pagination";
import "./catalog.scss";
import "swiper/css";

export default function Category() {
  const [isOpen, setIsOpen] = useState(false);
  //Hooks
  const { filtered, category, filters, status, searchText } = useTypedSelector(state => state.products);
  const { onSetFiltered, setAllProducts, handleSearch } = useProducts();
  const translate = useTranslate();

  //Styles
  const buttonStyles: CSSProperties = {
    background: isOpen ? "#E30387" : "#0ABAB5",
    color: "white",
    fontSize: "25px",
  };
  //ClassNames
  const filterWrapperClassName = isOpen ? "filter_wrapper active" : "filter_wrapper";

  const newProducts = handleSearch(searchText, filtered);
  const setOpen = () => setIsOpen(!isOpen);

  const mapAllProducts = useMemo(() => {
    if (status === "pending") return <Icons id="spiner" />;

    if (!newProducts?.length && status === "fulfilled")
    return (
        <EmptyComponent
          title={translate.emptyCatalogTitle}
          text={translate.emptyCatalogText}
          route={SHOP_ROUTE}
          buttonText={translate.emptyCatalogButtonText}
        />
      );

    if (newProducts.length && status === "fulfilled")
    return (
        <div className="main-product-wrapper">
          {newProducts?.map(productInfo => (
            <ProductCard key={productInfo?.id} productInfo={productInfo} />
          ))}
        </div>
      );
  }, [translate,newProducts,status]);


  useEffect(() => {
    onSetFiltered();
  }, [filters, category, onSetFiltered]);

  useEffect(() => {
    setAllProducts();
  }, [setAllProducts]);


  return (
    <main className="catalog-wrapper container mx-auto">
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
