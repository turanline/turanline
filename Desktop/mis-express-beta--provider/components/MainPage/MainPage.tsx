"use client";
//Global
import React, { useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
//Components
import { Button } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";
import { ProviderNewsItem } from "@/components/ProviderNewsItem/ProviderNewsItem";
//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import { LOGIN_ROUTE } from "@/utils/Consts";
//Types
import { IProvidersNotificationsResult } from "@/types/additionalTypes";
//Styles
import "./MainPage.scss";

export default function Home() {
  const {isProviderAuth,status,providerNews,providersNotifications,providerReviews} = useTypedSelector(state => state.user);
  const { onGetUser, onGetProviderNews, onGetProviderReviews,onGetProviderNotifications } = useUserActions();

  const translate = useTranslate();


  const renderProviderNews = () => {
    if(!providerNews?.length) 
    return <h3 className="text-tiffani">{translate.mainPageText}</h3>;

      providerNews?.map(news => (
        <ProviderNewsItem
          key={news?.id}
          data={news?.data}
          image={news?.image}
          text={news?.text}
          title={news?.title}
        />
      ))
};

  const renderProvideReviews = () => {
    if(!providerReviews?.length)
    return(
      <>
        <h5>{translate.mainPageReviewsText}</h5>

        <p>{translate.mainPageReviewsTextUnder}</p>
      </>
    );

    providerReviews?.map(review => (
      <h5 key={review}>{review}</h5>
    ));
  
  }

  const renderProviderNotifications = () => {

    const rejectedProducts: IProvidersNotificationsResult[] = [];
    const approvedProducts: IProvidersNotificationsResult[] = [];
    const cartProducts:     IProvidersNotificationsResult[] = []; 
    //фильтрация по статусу товаров
    providersNotifications?.results?.forEach((notification) => {
      switch (notification.new_status) {
        case 'R':
          rejectedProducts.push(notification);
          break;
        case 'A':
          approvedProducts.push(notification);
          break;
        case 'B':
          cartProducts.push(notification);
          break;
        default:
          break;
      }
    });

    //проверка на кол-во уведомлений
    if (providersNotifications?.count === 0) {
      return <h3 style={{ color: "#0ebab5" }}>{translate.mainPageNotificationsText}</h3>;
    }

    //проверка и рендер на отклоненые товары
    if (rejectedProducts?.length > 0) {
      return (
        <div className="provider-page_blocks-notifications_item">
          <h5 style={{ color: "#E30387" }}>{translate.productsNotModerated}</h5>
          {rejectedProducts?.map((product: IProvidersNotificationsResult) => (
            <div key={product?.id}>
              <div className="provider-page_blocks-notifications_item-block">
                <span>{new Date(product.changed_at).toLocaleDateString()}</span>
                <span>{translate.products}</span>
              </div>
              <div className="provider-page_blocks-notifications_item-products">
                <span>{product?.product?.name}</span>
                <Link href={`/product/${product?.product?.slug}`}>{translate.details}</Link>
              </div>
            </div>
          ))}
      </div>
      )
    }

    //Проверка и рендер на одобренные товары
    if (approvedProducts?.length > 0) {
      return (
        <div className="provider-page_blocks-notifications_item">
          <h5>{translate.productsModerated}</h5>
          {approvedProducts?.map((product: IProvidersNotificationsResult) => (
            <div key={product?.id}>
              <div className="provider-page_blocks-notifications_item-block">
                <span>
                  {new Date(product?.changed_at).toLocaleDateString()}
                </span>
                <span>{translate.products}</span>
              </div>
              <div className="provider-page_blocks-notifications_item-products">
                <span>{product?.product?.name}</span>
                <Link href={`/product/${product?.product?.slug}`}>{translate.details}</Link>
              </div>
            </div>
          ))}
        </div>
      );
    }

    //Проверка на товары в корзине
    if (cartProducts?.length > 0) {
      return (
        <div className="provider-page_blocks-notifications_item">
          <h5>{translate.productsInCart}</h5>
          {cartProducts?.map((product: IProvidersNotificationsResult) => (
            <div key={product?.id}>
              <div className="provider-page_blocks-notifications_item-block">
                <span>
                  {new Date(product?.changed_at).toLocaleDateString()}
                </span>
                <span>{translate.products}</span>
              </div>
              <div className="provider-page_blocks-notifications_item-products">
                <span>{product?.product?.name}</span>
                <Link href={`/product/${product?.product?.slug}`}>{translate.details}</Link>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

   //checkAuth
   useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (isProviderAuth) {
      onGetProviderNews();
      onGetProviderReviews();
      onGetProviderNotifications();
    }

  }, [isProviderAuth, onGetProviderNews, onGetProviderReviews,onGetProviderNotifications]);

  useEffect(() => {

    if (!isProviderAuth && status === "fulfilled") redirect(LOGIN_ROUTE);
  }, [isProviderAuth, status]);
  
  if(!isProviderAuth)  return(
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
                <span className="account">1.43 $</span>

                <span className="account-text">{translate.mainPageAccount}</span>
              </div>

              <p className="provider-page_blocks-total_block-text">
               {translate.mainPageTotalSum}
              </p>
            </div>

            <div className="provider-page_blocks-total_block">
              <div className="provider-page_blocks-total_block-account">
                <span className="account">1.43 $</span>

                <span className="account-text">{translate.mainPageWithdrawal}</span>
              </div>

              <div className="provider-page_blocks-total_block-button">
                <Button className="bg-tiffani text-white rounded-[5px] w-[144px]">
                  {translate.mainPageWithdraw}
                </Button>

                <span className="provider-page_blocks-total_block-text">
                 {translate.mainPageWithdrawHistory}
                </span>
              </div>
            </div>
          </div>
          {/* date */}
          <div className="provider-page_blocks-chart">
            <Button>{translate.mainPageWeek}</Button>

            <Button>{translate.mainPageMonth}</Button>

            <Button>{translate.mainPageQuarter}</Button>

            <Button>{translate.mainPageHalfYear}</Button>
          </div>
          {/* news */}
          <div className="provider-page_blocks-news">
            <h3>{translate.mainPageNews}</h3>
            {renderProviderNews()}
          </div>
          {/* notifications */}
          <div className="provider-page_blocks-notifications">
            <h3>{translate.mainPageNotifications}</h3>
              {
                renderProviderNotifications()
              }
          </div>
          {/* reviews */}
          <div className="provider-page_blocks-reviews">
            <h3>{translate.mainPageReviews}</h3>

            <div className="provider-page_blocks-reviews_item">
              {renderProvideReviews()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
