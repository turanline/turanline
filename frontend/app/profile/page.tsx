"use client";

//Global
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

//Components
import { Icons } from "@/components/Icons/Icons";
import { UserOrderWrapper } from "@/components/UserOrderWrapper/UserOrderWrapper";
import { UserReviewItem } from "@/components/UserReviewItem/UserReviewItem";
import { ModalChange } from "@/components/ModalChange/ModalChange";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";

//Utils
import { CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/Consts";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";

//Images
import profile from "../../public/assets/other/profile-photo.png";

//Styles
import "./profile.scss";

const Profile = () => {
  const { isAuth, userState, status, userOrders, userReviews } =
    useTypedSelector(state => state.user);

  const [isChange, setIsChange] = useState<boolean>(false);

  const { push } = useRouter();

  const { onGetUser, onGetOrders, onGetReviews } = useUserActions();

  const {
    profileOrdersText,
    profileOrdersTitle,
    profilePageAddress,
    profilePageCompany,
    profilePageOrders,
    profilePageReviews,
    profileReviewsText,
    profileReviewsTitle,
    orderPagePhone,
    emptyBasketButtonText,
    orderPageSearch,
  } = useTranslate();

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (!isAuth && status === "fulfilled") push(SHOP_ROUTE);
  }, [isAuth, status, push]);

  useEffect(() => {
    if (isAuth) {
      onGetOrders();
      onGetReviews();
    }
  }, [onGetOrders, onGetReviews, isAuth]);

  const returnUserOrders = () => {
    if (!userOrders.length) {
      return (
        <EmptyComponent
          buttonText={emptyBasketButtonText}
          route={CATALOG_ROUTE}
          text={profileOrdersText}
          title={profileOrdersTitle}
        />
      );
    }

    return (
      <div className="profile-content_orders-content">
        <div className="profile-content_orders-content-filters">
          <button className="profile-content_orders-content-filters-button">
            Название
            <Icons id="arrowDownProfile" />
          </button>

          <button className="profile-content_orders-content-filters-button">
            Дата
            <Icons id="arrowDownProfile" />
          </button>

          <button className="profile-content_orders-content-filters-button">
            Стоимость
            <Icons id="arrowDownProfile" />
          </button>

          <button className="profile-content_orders-content-filters-button">
            Статус
            <Icons id="arrowDownProfile" />
          </button>
        </div>

        <div className="profile-content_orders-content-list">
          {userOrders.map(order => (
            <UserOrderWrapper
              key={order.id}
              orderDate={order.created_date}
              orderNumber={order.id}
              orderPrice={order.total_sum}
              orderStatus={order.status}
            />
          ))}
        </div>
      </div>
    );
  };

  const returnUserReviews = () => {
    return (
      <>
        {!userReviews.length ? (
          <EmptyComponent
            buttonText={emptyBasketButtonText}
            route={CATALOG_ROUTE}
            text={profileReviewsText}
            title={profileReviewsTitle}
          />
        ) : (
          <div className="profile-content_reviews-list">
            {userReviews.map(review => (
              <UserReviewItem
                key={review.id}
                reviewStatus="published"
                reviewText={review.text}
                reviewTitle={review.product.name}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  if (!userState) return <Icons id="spiner" />;

  return (
    <main className="profile-wrapper">
      <div className="profile-content">
        <div className="profile-content_header">
          <div className="profile-content_header-user">
            <Image src={profile} alt="profile-photo" width={200} height={200} />

            <div className="profile-content_header-user-data">
              <h5 className="profile-content_header-user-data-title">
                {userState.user.first_name} {userState.user.last_name}
              </h5>

              <div className="profile-content_header-user-data-blocks">
                <div className="profile-content_header-user-data-block">
                  <span className="profile-content_header-user-data-block-bold">
                    {profilePageCompany}:
                  </span>

                  <span className="profile-content_header-user-data-block-light">
                    {!userState.company ? "Не указана" : userState.company}
                  </span>
                </div>

                <div className="profile-content_header-user-data-block">
                  <span className="profile-content_header-user-data-block-bold">
                    {orderPagePhone}:
                  </span>

                  <span className="profile-content_header-user-data-block-light">
                    {userState.phone_number}
                  </span>
                </div>

                <div className="profile-content_header-user-data-block">
                  <span className="profile-content_header-user-data-block-bold">
                    {profilePageAddress}:
                  </span>

                  <span className="profile-content_header-user-data-block-light">
                    {!userState.address ? "Не указан" : userState.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => setIsChange(!isChange)}>
            <Icons id="pencil" />
          </button>
        </div>

        <div className="profile-content_orders">
          <div className="profile-content_orders-header">
            <h5 className="profile-content_orders-header-text">
              {profilePageOrders}
            </h5>

            <div className="search-wrapper">
              <Icons id="search2" />

              <input
                className="profile-content_orders-header-input"
                placeholder={orderPageSearch}
                type="search"
              />
            </div>
          </div>

          {returnUserOrders()}
        </div>

        <div className="profile-content_reviews">
          <h5 className="profile-content_reviews-title">
            {profilePageReviews}
          </h5>

          {returnUserReviews()}
        </div>
      </div>

      <ModalChange isChange={isChange} setIsChange={setIsChange} />
    </main>
  );
};

export default Profile;
