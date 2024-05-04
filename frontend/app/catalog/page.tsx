"use client";

//Global
import { useState, useMemo, useEffect } from "react";

//Components
import { Button } from "@nextui-org/react";
import { Filter } from "@/components/Filter/Filter";
import { ProductCard } from "@/components/ProductCard/productCard";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";
import { Icons } from "@/components/Icons/Icons";

//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useProducts } from "@/hooks/useProducts";
import { useTranslate } from "@/hooks/useTranslate";

//Utils
import { SHOP_ROUTE } from "@/utils/Consts";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

//Styles
import "swiper/css/pagination";
import "./catalog.scss";
import "swiper/css";

export default function Category() {
  const [isOpen, setIsOpen] = useState(false);

  const { filtered, category, filters, status, products, searchText } =
    useTypedSelector(state => state.products);

  const { onSetFiltered, setAllProducts, handleSearch } = useProducts();

  const {
    catalogFilter,
    headerCatalog,
    mainPageRoute,
    emptyCatalogTitle,
    emptyCatalogButtonText,
    emptyCatalogText,
  } = useTranslate();

  useEffect(() => {
    onSetFiltered();
  }, [filters, category]);

  useEffect(() => {
    setAllProducts();
  }, []);

  const newProducts = handleSearch(searchText, filtered);

  const mapAllProducts = () => {
    if (!newProducts.length && status === "fulfilled")
      return (
        <EmptyComponent
          title={emptyCatalogTitle}
          text={emptyCatalogText}
          route={SHOP_ROUTE}
          buttonText={emptyCatalogButtonText}
        />
      );

    if (status === "pending") return <Icons id="spiner" />;

    return (
      <div className="main-product-wrapper">
        {newProducts.map(productInfo => (
          <ProductCard key={productInfo.id} productInfo={productInfo} />
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto mt-[30px] mb-[100px] px-[28px] md:px-0">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>{mainPageRoute}</BreadcrumbItem>
        <BreadcrumbItem>{headerCatalog}</BreadcrumbItem>
      </Breadcrumbs>

      <Button
        style={{ background: isOpen ? "#E30387" : "#0ABAB5" }}
        onClick={() => setIsOpen(!isOpen)}
        className="filters"
        startContent={<Icons id="filter" />}
      >
        {catalogFilter}
      </Button>

      <div className={isOpen ? "filter_wrapper active" : "filter_wrapper"}>
        <Filter products={products} />
      </div>

      {mapAllProducts()}
    </main>
  );
}
