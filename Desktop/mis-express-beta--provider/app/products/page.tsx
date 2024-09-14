"use client";
// Global
import React, { useEffect, useState, useMemo, useCallback, lazy } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
// Components
import { Icons } from "@/components/Icons/Icons";
const ModalImport = lazy(() => import("@/components/Modals/ModalImport/ModalImport"));
import { ProviderCardItem } from "@/components/ProviderCardItem/ProviderCardItem";
// Hooks
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useExcelTable } from "@/hooks/useExcelTable";
import { useTranslate } from "@/hooks/useTranslate";
// Types
import { IProvidersGoods } from "@/types/additionalTypes";
// Utils
import { LOGIN_ROUTE } from "@/utils/Consts";
// Styles
import "./products.scss";

const ProviderProducts = () => {
  const [filter, setFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // hooks
  const { providersGoods, status, isProviderAuth, providerState } = useTypedSelector(state => state.user);
  const { getExcelTable } = useExcelTable(isOpen, setIsOpen);
  const { onGetProviderGoods, onGetUser } = useUserActions();
  const { push } = useRouter();

  const {
    productsPageProducts,
    productsPageExport,
    productsPageImport,
    productsPageAll,
    productsPagePublished,
    productsPageNotAccepted,
    orderPageCart,
    productsPageName,
    productsPageArticle,
    productsPageStatus,
    productsPagePrice,
    productsPageCategories,
    productsPageDate,
    productsPageStatuR,
    productsPageStatuA,
    productsPageStatuB,
    productsPageStatuUC,
    productsPageStatuUN,
    productsEmpty,
  } = useTranslate()

  type SortOrder = "asc" | "desc";
  type SortField = "name" | "article_number" | "status" | "price" | "compound" | "date_and_time";

  const getStatusText = (status: string) => {
    switch (status) {
      case "R":
        return productsPageStatuR;
      case "A":
        return productsPageStatuA;
      case "B":
        return productsPageStatuB;
      case "UC":
        return productsPageStatuUC;
      default:
        return productsPageStatuUN;
    }
  };

  const filterGoods = useCallback((goods: IProvidersGoods[], filter: string) => {
    switch (filter) {
      case "A": // Принятые
        return goods?.filter(good => good?.status === "A");
      case "B": // Корзина
        return goods?.filter(good => good?.status === "B");
      case "R": // Отказ
        return goods?.filter(good => good?.status === "R");
      default: // Все
        return goods;
    }
  }, []);

  const countGoodsByStatus = useCallback((goods: IProvidersGoods[], status: string) => {
    return goods?.filter((good: IProvidersGoods) => good?.status === status)?.length;
  }, []);

  const sortGoods = useCallback((goods: IProvidersGoods[], field: string, order: SortOrder) => {
    if (!goods) return [];

      const sortedGoods = [...goods];

      sortedGoods?.sort((a, b) => {
        if (field === "name" || field === "compound") {
          if (a[field] < b[field]) return order === "asc" ? -1 : 1;
          if (a[field] > b[field]) return order === "asc" ? 1 : -1;
          return 0;
        }
        if (field === "article_number" || field === "price") {
          return order === "asc"
            ? Number(a[field]) - Number(b[field])
            : Number(b[field]) - Number(a[field]);
        }
        if (field === "date_and_time") {
          return order === "asc"
            ? new Date(a[field]).getTime() - new Date(b[field]).getTime()
            : new Date(b[field]).getTime() - new Date(a[field]).getTime();
        }
        return 0;
      });
    return sortedGoods;
  }, []);

  const sortedFilteredGoods = useMemo(() => {
    const filteredGoods = filterGoods(providersGoods, filter);
    return sortGoods(filteredGoods, sortField, sortOrder);
  }, [providersGoods, filter, sortField, sortOrder, filterGoods, sortGoods]);

  const renderAllGoods = () => {
    if (!providersGoods?.length && status === "pending")
      return (
        <div className="products-content_spiner">
          <Icons id="spiner" />
        </div>
      );

    if (sortedFilteredGoods?.length === 0 && status === "fulfilled")
      return (
        <span className="products-content_cards-item-span-empty">
          {productsEmpty}
        </span>
      );

    return sortedFilteredGoods?.map(good => {
      const dateTime = new Date(good?.date_and_time),
        cardDate = dateTime.toLocaleDateString("ru-RU"),
        cardStatusText = getStatusText(good?.status),
        cardStatus = good?.status,
        cardPrice = Math.floor(good?.price),
        cardTime = dateTime.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        });

      const cardImage: string | null = good?.images[0]?.image_file;

      return (
        <ProviderCardItem
          key={good?.id}
          cardArticle={good?.article_number}
          cardDate={cardDate}
          cardImage={cardImage}
          cardPrice={cardPrice}
          cardTime={cardTime}
          cardTitle={good?.name}
          cardStatusText={cardStatusText}
          cardCompound={good?.compound}
          cardStatus={cardStatus}
          cardSlug={good?.slug}
        />
      );
    });
  };

  const handleSort = (field: SortField) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortOrder(order);
  };

  const allCount      = useMemo(() => providersGoods?.length || 0, [providersGoods]);
  const acceptedCount = useMemo(() => countGoodsByStatus(providersGoods, "A") || 0, [providersGoods, countGoodsByStatus]);
  const basketCount   = useMemo(() => countGoodsByStatus(providersGoods, "B") || 0, [providersGoods, countGoodsByStatus]);
  const rejectedCount = useMemo(() => countGoodsByStatus(providersGoods, "R") || 0, [providersGoods, countGoodsByStatus]);

  const rejectedGoodsClassName = `products-content_filters-action-description-text ${filter === "R" ? "active" : ""} ${rejectedCount > 0 ? "danger" : ""}`;

  // checkAuth
  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(()=>{
    const language = getCookie('selectedLanguage');
   
    if(!language) setCookie("selectedLanguage",'ru');

  },[])

  useEffect(() => {
    if (isProviderAuth) onGetProviderGoods();
  }, [onGetProviderGoods, isProviderAuth]);

  useEffect(() => {
    if (!isProviderAuth && status === "fulfilled") push(LOGIN_ROUTE);
  }, [isProviderAuth, status, push]);

  if (!providerState) return (
    <div className="products-content_spiner">
      <Icons id="spiner" />
    </div>
  );

 


  return (
    <div className="products-wrapper">
      <div className="products-content">
        <nav className="products-content_navigation">
          <button className="products-content_navigation-link active">
            {productsPageProducts}
          </button>

          <button
            onClick={getExcelTable}
            className="products-content_navigation-link"
          >
            {productsPageExport}
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="products-content_navigation-link">
            {productsPageImport}
          </button>
        </nav>

        <div className="products-content_filters">
          <div className="products-content_filters-action">
            <div className="products-content_filters-action-description">
              <button
                onClick={() => setFilter("All")}
                className={`products-content_filters-action-description-text ${filter === "All" ? "active" : ""}`}>
                {productsPageAll} ({allCount})
              </button>

              <button
                onClick={() => setFilter("A")}
                className={`products-content_filters-action-description-text ${filter === "A" ? "active" : ""}`}>
                {productsPagePublished} ({acceptedCount})
              </button>

              <button
                onClick={() => setFilter("B")}
                className={`products-content_filters-action-description-text ${filter === "B" ? "active" : ""}`}
              >
                {orderPageCart} ({basketCount})
              </button>

              <button
                onClick={() => setFilter("R")}
                className={rejectedGoodsClassName}
              >
                {productsPageNotAccepted} ({rejectedCount})
              </button>
            </div>
          </div>
        </div>

        <div className="products-content_cards">
        <div className="products-content_cards-header">
            <div className="products-content_cards-header_title">
              <Icons id="adminImage" />
              <button
                className="products-content_cards-header-button"
                onClick={() => handleSort("name")}>
                {productsPageName}
              </button>
            </div>

            <div className="products-content_cards-header_options">
              <button
                className="products-content_cards-header-button"
                onClick={() => handleSort("article_number")}>
                {productsPageArticle}
              </button>

              <button
                className="products-content_cards-header-button"
               >
                {productsPageStatus}
              </button>

              <button
                className="products-content_cards-header-button"
                onClick={() => handleSort("price")}>
                {productsPagePrice} <Icons id="arrowDownProfile" />
              </button>

              <button
                className="products-content_cards-header-button"
                onClick={() => handleSort("compound")}>
                {productsPageCategories}
              </button>
            </div>

            <button
              className="products-content_cards-header-button"
              onClick={() => handleSort("date_and_time")}>
              {productsPageDate}
              <Icons id="arrowDownProfile" />
            </button>
      </div>

          <div className="products-content_cards">{renderAllGoods()}</div>
        </div>
      </div>

      <ModalImport isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default ProviderProducts;
