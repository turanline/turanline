"use client";
//Global
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { subWeeks, subMonths, subYears } from "date-fns";
//Components
import { Button } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";
import { ProviderNewsItem } from "@/components/ProviderNewsItem/ProviderNewsItem";
//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import { LOGIN_ROUTE, CREATE_PRODUCT_ROUTE } from "@/utils/Consts";
//Services
import { getProvidersOrdersPeriodPrice } from "@/services/providerAPI";
//Types
import {
  IProvidersNotificationsResult,
  IProvidersOrders,
} from "@/types/additionalTypes";
//Styles
import "./MainPage.scss";

export default function Home() {
  const translate = useTranslate();
  const { isProviderAuth, status } = useTypedSelector(
    (state) => state.authorization
  );
  const { providerNews, providersNotifications, providerReviews, balance } =
    useTypedSelector((state) => state.user);
  const {
    onGetUser,
    onGetProviderNews,
    onGetProviderReviews,
    onGetProviderNotifications,
    onGetProviderBalance,
  } = useUserActions();

  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "halfYear" | "quarter" | null
  >("week");
  const [prices, setPrices] = useState<number | null>(null);

  const loadOrders = async (startDate?: Date | null | string) => {
    let formattedDate = null;

    if (startDate instanceof Date) {
      formattedDate = startDate.toISOString();
    } else if (typeof startDate === "string") {
      formattedDate = startDate;
    }

    const pricesData: IProvidersOrders[] = await getProvidersOrdersPeriodPrice(
      formattedDate
    );

    const totalPrice = pricesData?.reduce((total, order) => {
      return total + Number(order?.sum_for_period);
    }, 0);

    const formattedTotalPrice = Number(totalPrice);

    setPrices(formattedTotalPrice);
  };

  const renderProviderNews = () => {
    if (!providerNews?.length)
      return <h3 className="text-tiffani">{translate.mainPageText}</h3>;

    return providerNews?.map((news) => (
      <ProviderNewsItem
        key={news?.id}
        date={news?.date}
        image={news?.image}
        text={news?.text}
        title={news?.title}
        category={news?.category}
      />
    ));
  };

  const renderProvideReviews = () => {
    if (!providerReviews?.length)
      return (
        <>
          <h5>{translate.mainPageReviewsText}</h5>

          <p>{translate.mainPageReviewsTextUnder}</p>
        </>
      );

    providerReviews?.map((review) => <h5 key={review}>{review}</h5>);
  };

  const renderProviderNotifications = () => {
    type notifyGropType = {
      rejectedProducts: IProvidersNotificationsResult[];
      approvedProducts: IProvidersNotificationsResult[];
      cartProducts: IProvidersNotificationsResult[];
      archiveProducts: IProvidersNotificationsResult[];
      cargoProducts: IProvidersNotificationsResult[];
    };

    // Фильтрация товаров по статусам
    const notificationGroups: notifyGropType = {
      rejectedProducts: [],
      approvedProducts: [],
      cartProducts: [],
      archiveProducts: [],
      cargoProducts: [],
    };

    providersNotifications?.results?.forEach((notification) => {
      switch (notification.new_status) {
        case "R":
          notificationGroups.rejectedProducts.push(notification);
          break;
        case "AR":
          notificationGroups.archiveProducts.push(notification);
          break;
        case "CT":
          notificationGroups.cargoProducts.push(notification);
          break;
        case "A":
          notificationGroups.approvedProducts.push(notification);
          break;
        case "B":
          notificationGroups.cartProducts.push(notification);
          break;
        default:
          break;
      }
    });

    // Проверка на наличие уведомлений
    if (!providersNotifications?.count) {
      return (
        <h3 style={{ color: "#282828" }}>
          {translate.mainPageNotificationsText}
        </h3>
      );
    }

    // Универсальная функция рендера
    const renderNotificationBlock = (
      title: string,
      color: string,
      products: IProvidersNotificationsResult[]
    ) => (
      <div className="provider-page_blocks-notifications_item">
        <h5 style={{ color }}>{title}</h5>
        {products.map((product) => (
          <div key={product.id}>
            <div className="provider-page_blocks-notifications_item-block">
              <span>{new Date(product.changed_at).toLocaleDateString()}</span>
              <span>{translate.products}</span>
            </div>
            <div className="provider-page_blocks-notifications_item-products">
              <span>{product.product.name}</span>
              <Link href={`/product/${product.product.article_number}`}>
                {translate.details}
              </Link>
            </div>
          </div>
        ))}
      </div>
    );

    // Определение, что рендерить
    if (notificationGroups.rejectedProducts.length) {
      return renderNotificationBlock(
        translate.productsNotModerated,
        "#E30387",
        notificationGroups.rejectedProducts
      );
    }

    if (notificationGroups.archiveProducts.length) {
      return renderNotificationBlock(
        translate.productsInArchive,
        "#E30387",
        notificationGroups.archiveProducts
      );
    }

    if (notificationGroups.approvedProducts.length) {
      return renderNotificationBlock(
        translate.productsModerated,
        "#000000",
        notificationGroups.approvedProducts
      );
    }

    if (notificationGroups.cartProducts.length) {
      return renderNotificationBlock(
        translate.productsInCart,
        "#000000",
        notificationGroups.cartProducts
      );
    }

    if (notificationGroups.cargoProducts.length) {
      return renderNotificationBlock(
        translate.productsInCargo,
        "#000000",
        notificationGroups.cartProducts
      );
    }

    return null;
  };

  const renderPeriodClick = (
    period: "week" | "month" | "halfYear" | "quarter"
  ) => {
    let startDate: Date | null = null;

    switch (period) {
      case "week":
        startDate = subWeeks(new Date(), 1); // Минус неделя
        break;
      case "month":
        startDate = subMonths(new Date(), 1); // Минус месяц
        break;
      case "quarter":
        startDate = subMonths(new Date(), 3); // Минус квартал
        break;
      case "halfYear":
        startDate = subMonths(new Date(), 6); // Минус год
        break;
      default:
        startDate = subWeeks(new Date(), 1);
    }

    // Загружаем данные за выбранный период
    loadOrders(startDate);
    setSelectedPeriod(period);
  };

  //checkAuth
  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    renderPeriodClick("week");
  }, []);

  useEffect(() => {
    onGetProviderBalance();
  }, [onGetProviderBalance]);

  useEffect(() => {
    if (isProviderAuth) {
      onGetProviderNews();
      onGetProviderReviews();
      onGetProviderNotifications();
    }
  }, [
    isProviderAuth,
    onGetProviderNews,
    onGetProviderReviews,
    onGetProviderNotifications,
  ]);

  useEffect(() => {
    if (!isProviderAuth && status === "fulfilled") redirect(LOGIN_ROUTE);
  }, [isProviderAuth, status]);

  if (!isProviderAuth)
    return (
      <div className="products-content_spiner">
        <Icons id="spiner" />
      </div>
    );

  return (
    <div className="provider-page_wrapper">
      <div className="provider-page_content">
        <div className="provider-page_blocks">
          {/* money */}
          <div className="provider-page_blocks-total">
            <div className="provider-page_blocks-total_block">
              <div className="provider-page_blocks-total_block-account">
                <span className="account">{balance?.balance || "0.00"} $</span>

                <span className="account-text">
                  {translate.mainPageAccount}
                </span>
              </div>

              <p className="provider-page_blocks-total_block-text">
                {translate.mainPageTotalSum}
              </p>
            </div>

            <div className="provider-page_blocks-total_block">
              <div className="provider-page_blocks-total_block-account">
                <span className="account">{balance?.balance || "0.00"} $</span>

                <span className="account-text">
                  {translate.mainPageWithdrawal}
                </span>
              </div>

              <div className="provider-page_blocks-total_block-button">
                <Button className="bg-black text-white rounded-[5px] w-[144px]">
                  {translate.mainPageWithdraw}
                </Button>

                <span className="provider-page_blocks-total_block-text">
                  {translate.mainPageWithdrawHistory}
                </span>
              </div>
            </div>
          </div>
          {/* date */}
          <div className="provider-page_blocks-wrapper">
            <span className="account">{prices || "0.00"} $</span>

            <div className="provider-page_blocks-chart">
              <Button
                className={
                  selectedPeriod === "week" ? "bg-selected" : "bg-normal"
                }
                onClick={() => renderPeriodClick("week")}
              >
                {translate.mainPageWeek}
              </Button>
              <Button
                className={
                  selectedPeriod === "month" ? "bg-selected" : "bg-normal"
                }
                onClick={() => renderPeriodClick("month")}
              >
                {translate.mainPageMonth}
              </Button>
              <Button
                className={
                  selectedPeriod === "quarter" ? "bg-selected" : "bg-normal"
                }
                onClick={() => renderPeriodClick("quarter")}
              >
                {translate.mainPageQuarter}
              </Button>
              <Button
                className={
                  selectedPeriod === "halfYear" ? "bg-selected" : "bg-normal"
                }
                onClick={() => renderPeriodClick("halfYear")}
              >
                {translate.mainPageHalfYear}
              </Button>
            </div>
          </div>
          {/* news */}
          <div className="provider-page_blocks-news">
            <h3>{translate.mainPageNews}</h3>
            {renderProviderNews()}
          </div>
          {/* notifications */}
          <div className="provider-page_blocks-notifications">
            <h3>{translate.mainPageNotifications}</h3>
            {renderProviderNotifications()}
          </div>
          {/* reviews */}
          <div className="provider-page_blocks-reviews">
            <h3>{translate.mainPageReviews}</h3>

            <div className="provider-page_blocks-reviews_item">
              {renderProvideReviews()}
            </div>
          </div>
          {/* newProductLink */}
          <div className="provider-page_blocks-reviews">
            <h3>{translate.mainNewProduct}</h3>

            <div className="provider-page_blocks-reviews_item">
              <Link href={CREATE_PRODUCT_ROUTE}>
                <Button className="bg-black text-white rounded-[5px] w-[144px]">
                  {translate.mainNewProductText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
