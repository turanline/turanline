"use client";
// Global
import React, { useEffect, useState, useMemo, useCallback, lazy } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import Link from "next/link";
// Components
import { Icons } from "@/components/Icons/Icons";
const ModalImport = lazy(() => import("@/components/Modals/ModalImport/ModalImport"));
import { ProviderCardItem } from "@/components/ProviderCardItem/ProviderCardItem";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { IGoodModal } from "@/types/componentsTypes";
// Hooks
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useExcelTable } from "@/hooks/useExcelTable";
import { useTranslate } from "@/hooks/useTranslate";
// Types
import { IProvidersGoods } from "@/types/additionalTypes";
// Utils
import { CREATE_PRODUCT_ROUTE, LOGIN_ROUTE } from "@/utils/Consts";
// Styles
import "./products.scss";


const ProviderProducts = () => {
  const [filter, setFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isOpenExcel, setIsOpenExcel] = useState<boolean>(false);
  const [selectedGood, setSelectedGood] = useState<IGoodModal | null>(null);
  const {isOpen,onOpenChange} = useDisclosure();
  // hooks
  const { status, isProviderAuth, providerState } = useTypedSelector((state) => state.authorization);
  const { providersGoods, statusProduct } = useTypedSelector((state) => state.product);
  const { getExcelTable } = useExcelTable(isOpenExcel, setIsOpenExcel);
  const { onGetProviderGoods, onGetUser } = useUserActions();
  const translate = useTranslate();
  const { push } = useRouter();

  //types
  type SortOrder = "asc" | "desc";
  type SortField =
    | "name"
    | "article_number"
    | "status"
    | "price"
    | "compound"
    | "date_and_time";



  const getStatusText = (status: string) => {
    switch (status) {
      case "R":
        return translate.productsPageStatuR;
      case "A":
        return translate.productsPageStatuA;
      case "B":
        return translate.productsPageStatuB;
      case "UC":
        return translate.productsPageStatuUC;
      case "AR":
          return translate.productsPageNotArchive;
      default:
        return translate.productsPageStatuUN;
    }
  };

  const filterGoods = useCallback(
    (goods: IProvidersGoods[], filter: string) => {
      switch (filter) {
        case "A": // Принятые
          return goods?.filter((good) => good?.status === "A");
        case "B": // Корзина
          return goods?.filter((good) => good?.status === "B");
        case "R": // Отказ
          return goods?.filter((good) => good?.status === "R");
        case "AR": // Архив
          return goods?.filter((good) => good?.status === "AR");
        default: // Все
          return goods;
      }
    },
    []
  );

  const countGoodsByStatus = useCallback(
    (goods: IProvidersGoods[], status: string) => {
      return goods?.filter((good: IProvidersGoods) => good?.status === status)
        ?.length;
    },
    []
  );

  const sortGoods = useCallback(
    (goods: IProvidersGoods[], field: string, order: SortOrder) => {
      if (!goods) return [];

      const sortedGoods = [...goods];

      sortedGoods?.sort((a, b) => {
        if (field === "price") {
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
    },
    []
  );

  const sortedFilteredGoods = useMemo(() => {
    const filteredGoods = filterGoods(providersGoods, filter);
    return sortGoods(filteredGoods, sortField, sortOrder);
  }, [providersGoods, filter, sortField, sortOrder, filterGoods, sortGoods]);

  const allCount = useMemo(() => providersGoods?.length || 0, [providersGoods]);

  const basketCount = useMemo(() => countGoodsByStatus(providersGoods, "B"), [providersGoods, countGoodsByStatus]);
  const rejectedCount = useMemo(() => countGoodsByStatus(providersGoods, "R"), [providersGoods, countGoodsByStatus]);
  const acceptedCount = useMemo(() => countGoodsByStatus(providersGoods, "A"), [providersGoods, countGoodsByStatus]);
  const archiveCount = useMemo(() => countGoodsByStatus(providersGoods, "AR"), [providersGoods, countGoodsByStatus]);

  const renderModalGood = () => {
    if (!selectedGood) return null;

    return (
      <Modal
        closeButton={
          <button>
            <Icons id="deleteCard" />
          </button>
        }
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="sm"
        size="sm"
      >
        <ModalContent className="provider-modal">
          {(onClose) => (
            <>
              <ModalHeader className="provider-modal__header">
                <p>{selectedGood?.cardTitle}</p>
              </ModalHeader>
              <ModalBody className="provider-modal__body">
                <div className="provider-modal__item">
                  <p className="provider-modal__title">{translate.productsPageArticle}</p>
                  <p className="provider-modal__text">{selectedGood?.cardArticle}</p>
                </div>
                <div className="provider-modal__item">
                  <p className="provider-modal__title">{translate.productsPageStatus}</p>
                  <p className="provider-modal__text">{selectedGood?.cardStatusText}</p>
                </div>
                <div className="provider-modal__item">
                  <p className="provider-modal__title">{translate.productsPagePrice}</p>
                  <p className="provider-modal__text">{selectedGood?.cardPrice}$</p>
                </div>
                <div className="provider-modal__item">
                  <p className="provider-modal__title">{translate.productsPageCategories}</p>
                  <p className="provider-modal__text">{selectedGood?.cardCompound}</p>
                </div>
                <div className="provider-modal__item">
                  <p className="provider-modal__title">{translate.productsPageDate}</p>
                  <p className="provider-modal__text">{selectedGood?.cardDate} - {selectedGood?.cardTime}</p>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  const renderAllGoods = () => {
    if (!providersGoods?.length && statusProduct === "pending")
      return (
        <div className="products-content_spiner">
          <Icons id="spiner" />
        </div>
      );

    if (sortedFilteredGoods?.length === 0 && statusProduct === "fulfilled")
      return (
        <span className="products-content_cards-item-span-empty">
          {translate.productsEmpty}
        </span>
      );

    return sortedFilteredGoods?.map((good) => {
      const dateTime = new Date(good?.date_and_time);
      const cardDate = dateTime.toLocaleDateString("ru-RU");
      const cardStatusText = getStatusText(good?.status);
      const cardStatus = good?.status;
      const cardTime = dateTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", });

      const cardImage: string | null = good?.images[0]?.image_file;
    
      return (
        <ProviderCardItem
          key={good?.id}
          cardArticle={good?.article_number}
          cardDate={cardDate}
          cardImage={cardImage}
          cardPrice={good?.price}
          cardTime={cardTime}
          cardTitle={good?.name}
          cardStatusText={cardStatusText}
          cardCompound={good?.category?.name}
          cardStatus={cardStatus}
          onItemClick={onOpenChange}
          setSelectedGood={setSelectedGood}
        />
      );
    });
  };

  const handleSort = (field: SortField) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortOrder(order);
  };

  
  //ClassNames
  const rejectedGoodsClassName = `products-content_filters-action-description-text ${filter === "R" ? "active" : ""} ${rejectedCount > 0 ? "danger" : ""}`;
  const aceptedGoodsClassName  = `products-content_filters-action-description-text ${filter === "A" ? "active" : ""} ${rejectedCount > 0 ? "danger" : ""}`;
  const AllGoodsClassName      = `products-content_filters-action-description-text ${filter === "All" ? "active" : ""} ${rejectedCount > 0 ? "danger" : ""}`;
  const binGoodsClassName      = `products-content_filters-action-description-text ${filter === "B" ? "active" : ""} ${rejectedCount > 0 ? "danger" : ""}`;
  const archiveGoodsClassName  = `products-content_filters-action-description-text ${filter === "AR" ? "active" : ""} ${rejectedCount > 0 ? "danger" : ""}`;

  

  // checkAuth
  useEffect(() => {
    const language = getCookie("selectedLanguage");

    if (!language) setCookie("selectedLanguage", "ru");
  }, []);

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (isProviderAuth) onGetProviderGoods();
  }, [onGetProviderGoods, isProviderAuth]);

  useEffect(() => {
    if (!isProviderAuth && status === "fulfilled") push(LOGIN_ROUTE);
  }, [isProviderAuth, status, push]);

  if (!providerState)
  return (
      <div className="products-content_spiner">
        <Icons id="spiner" />
      </div>
    );

  return (
    <>
      <div className="products-wrapper">
        <div className="products-content">
          <nav className="products-content_navigation">
            <button className="products-content_navigation-link active">
              {translate.productsPageProducts}
            </button>

            <button
              onClick={getExcelTable}
              className="products-content_navigation-link"
            >
              {translate.productsPageExport}
            </button>

            <button
              onClick={() => setIsOpenExcel(true)}
              className="products-content_navigation-link"
            >
              {translate.productsPageImport}
            </button>
            <Link
              href={CREATE_PRODUCT_ROUTE}
              className="products-content_navigation-link"
            >
              {translate.productsPageCreate}
            </Link>
          </nav>

          <div className="products-content_filters">
            <div className="products-content_filters-action">
              <div className="products-content_filters-action-description">
                <button
                  onClick={() => setFilter("All")}
                  className={AllGoodsClassName}
                >
                  {translate.productsPageAll} ({allCount})
                </button>

                <button
                  onClick={() => setFilter("A")}
                  className={aceptedGoodsClassName}
                >
                  {translate.productsPagePublished} ({acceptedCount})
                </button>

                <button
                  onClick={() => setFilter("B")}
                  className={binGoodsClassName}
                >
                  {translate.orderPageCart} ({basketCount})
                </button>

                <button
                  onClick={() => setFilter("R")}
                  className={rejectedGoodsClassName}
                >
                  {translate.productsPageNotAccepted} ({rejectedCount})
                </button>
                
                <button
                  onClick={() => setFilter("AR")}
                  className={archiveGoodsClassName}
                >
                  {translate.productsPageNotArchive} ({archiveCount})
                </button>
              </div>
            </div>
          </div>

          <div className="products-content_cards">
            <div className="products-content_cards-header">
              <div className="products-content_cards-header_title">
                <Icons id="adminImage" />
                <div
                  className="products-content_cards-header-button"
                >
                  {translate.productsPageName}
                </div>
              </div>

              <div className="products-content_cards-header_options">
                <div
                  className="products-content_cards-header-button products-content_cards-header--off"
                >
                  {translate.productsPageArticle}
                </div>

                <div className="products-content_cards-header-button">
                  {translate.productsPageStatus}
                </div>

                <button
                  className="products-content_cards-header-button products-content_cards-header--off"
                  onClick={() => handleSort("price")}
                >
                  {translate.productsPagePrice} <Icons id="arrowDownProfile" />
                </button>

                <div
                  className="products-content_cards-header-button products-content_cards-header--off"
                >
                  {translate.productsPageCategories}
                </div>
              </div>

              <button
                className="products-content_cards-header-button products-content_cards-header--off"
                onClick={() => handleSort("date_and_time")}
              >
                {translate.productsPageDate}
                <Icons id="arrowDownProfile" />
              </button>
            </div>

            <div className="products-content_cards">{renderAllGoods()}</div>
          </div>
        </div>
        {renderModalGood()}
        <ModalImport isOpen={isOpenExcel} setIsOpen={setIsOpenExcel} />
      </div>
  </>
  );
};

export default ProviderProducts;
