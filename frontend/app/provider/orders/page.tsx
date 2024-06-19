"use client";

//Global
import React from "react";
import Link from "next/link";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Components
import { Icons } from "@/components/Icons/Icons";
import { ProviderOrderWrapper } from "@/components/ProviderOrderWrapper/ProviderOrderWrapper";
import { ProviderReviewItem } from "@/components/ProviderReviewItem/ProviderReviewItem";

//Utils
import { PROVIDER_PRODUCTS_ROUTE, PROVIDER_ROUTE } from "@/utils/Consts";

//Styles
import "./orders.scss";
import "../provider.scss";

const ProviderOrders = () => {
  const { profilePageOrders, orderPageSearch, profilePageReviews } =
    useTranslate();

  return (
    <div className="provider-page_wrapper">
      <div className="provider-page_content">
        <div className="provider-page_header">
          <nav className="provider-page_header-links">
            <Link href="#">Партнеры</Link>

            <Link href={PROVIDER_ROUTE}>Главная</Link>

            <Link href={PROVIDER_PRODUCTS_ROUTE}>Товары и цены</Link>

            <Link style={{ color: "#0ABAB5" }} href="#">
              Заказы и отзывы
            </Link>
          </nav>

          <span className="provider-link">ООО Плащи и куртки</span>
        </div>

        <div className="provider-content_orders">
          <div className="provider-content_orders-header">
            <h5 className="provider-content_orders-header-text">
              {profilePageOrders}
            </h5>

            <div className="search-wrapper">
              <Icons id="search2" />

              <input
                className="provider-content_orders-header-input"
                placeholder={orderPageSearch}
                type="search"
              />
            </div>
          </div>

          <div className="provider-content_orders-content">
            <div className="provider-content_orders-content-filters">
              <button className="provider-content_orders-content-filters-button">
                Название
                <Icons id="arrowDownProfile" />
              </button>

              <button className="provider-content_orders-content-filters-button">
                Дата
                <Icons id="arrowDownProfile" />
              </button>

              <button className="provider-content_orders-content-filters-button">
                Стоимость
                <Icons id="arrowDownProfile" />
              </button>

              <button className="provider-content_orders-content-filters-button">
                Статус
                <Icons id="arrowDownProfile" />
              </button>
            </div>

            <div className="provider-content_orders-content-list">
              <ProviderOrderWrapper
                orderDate={"20.09.2005"}
                orderNumber={1}
                orderPrice={"500"}
                orderStatus={"delivered"}
              />

              <ProviderOrderWrapper
                orderDate={"20.09.2005"}
                orderNumber={1}
                orderPrice={"500"}
                orderStatus={"processing"}
              />

              <ProviderOrderWrapper
                orderDate={"20.09.2005"}
                orderNumber={1}
                orderPrice={"500"}
                orderStatus={"delivered"}
              />
            </div>
          </div>

          <div className="provider-content_reviews">
            <h5 className="provider-content_reviews-title">
              {profilePageReviews}
            </h5>
            <div className="flex flex-col">
              <ProviderReviewItem
                reviewStatus="published"
                reviewText={
                  "Лонгсливы хорошие, партия пришла без брака. Доставлялись из Турции в Алматы. Заказ пришёл даже немного раньше. Всё было упаковано в отдельные пакетики, что не может не радовать. Не пришлось заниматься переупаковкой. Качество на достаточно высоком уровне."
                }
                reviewTitle={"Лонгслив HEATTECH С ХЛОПКОМ"}
              />

              <ProviderReviewItem
                reviewStatus="moderation"
                reviewText={
                  "Лонгсливы хорошие, партия пришла без брака. Доставлялись из Турции в Алматы. Заказ пришёл даже немного раньше. Всё было упаковано в отдельные пакетики, что не может не радовать. Не пришлось заниматься переупаковкой. Качество на достаточно высоком уровне, весь крой и строчки сделаны хорошо"
                }
                reviewTitle={"Лонгслив HEATTECH С ХЛОПКОМ"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderOrders;
