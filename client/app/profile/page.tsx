"use client";

//Global
import React, { useEffect, useContext, useState, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getUser } from "../layout";

//Context
import { SidebarContext } from "../layout";

//Components
import { Icons } from "@/components/Icons/Icons";
import { UserOrderWrapper } from "@/components/UserOrderWrapper/UserOrderWrapper";
import UserReviewItem from "@/components/UserReviewItem/UserReviewItem";
import { ModalChange } from "@/components/ModalChange/ModalChange";
import { EmptyComponent } from "@/components/EmptyComponent/EmptyComponent";

//Services
import {
  getUserData,
  getUserOrders,
  getUserReviews,
} from "@/services/usersAPI";
import { postVerifyToken } from "@/services/authAPI";

//Utils
import { CATALOG_ROUTE, SHOP_ROUTE } from "@/utils/Consts";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Types
import {
  IProfileInputs,
  IUserDataFromServer,
  IUserOrdersState,
  IUserReviewState,
} from "@/types/types";

//Images
import profile from "../../public/assets/other/profile-photo.png";

//Styles
import "./profile.scss";

const Profile = () => {
  const [userState, setUserState] = useState<IUserDataFromServer | null>(null);
  const [userOrders, setUserOrders] = useState<IUserOrdersState[]>([]);
  const [userReviews, setUserReviews] = useState<IUserReviewState[]>([]);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [inputsValue, setInputsValue] = useState<IProfileInputs>({
    address: "",
    company: "",
    phone_number: "",
    first_name: "",
    last_name: "",
  });

  const { isActive, setIsActive } = useContext(SidebarContext);

  const router = useRouter();

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
    isAuthUser();
  }, [router]);

  useEffect(() => {
    getUserDataFromServer();
  }, []);

  useEffect(() => {
    getUserOrdersFromServer();
  }, []);

  useEffect(() => {
    getUserReviewsFromServer();
  }, []);

  const handleInputsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputsValue(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function isAuthUser() {
    try {
      const { status, error } = await getUser();

      if (status === 200) setIsActive(true);

      if (error) router.push(SHOP_ROUTE);
    } catch (error) {
      console.error(error as Error);
      setIsActive(false);
      if (error) router.push(SHOP_ROUTE);
    }
  }

  async function getUserDataFromServer() {
    try {
      const token = localStorage.getItem("AuthTokenMis");

      if (token) {
        const { user } = await postVerifyToken(token);
        const data = await getUserData(user, token);

        setUserState(data);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async function getUserOrdersFromServer() {
    try {
      const token = localStorage.getItem("AuthTokenMis");

      if (token) {
        const { user } = await postVerifyToken(token);
        const data = await getUserOrders(user, token);

        setUserOrders(data);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async function getUserReviewsFromServer() {
    try {
      const token = localStorage.getItem("AuthTokenMis");

      if (token) {
        const { user } = await postVerifyToken(token);
        const data = await getUserReviews(user, token);

        setUserReviews(data);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  const returnUserReviews = () => {
    if (!userOrders.length) {
      return (
        <EmptyComponent
          buttonText={emptyBasketButtonText}
          route={CATALOG_ROUTE}
          text={profileReviewsText}
          title={profileReviewsTitle}
        />
      );
    }

    return (
      <div className="profile-content_reviews-list">
        {userReviews.map(review => (
          <UserReviewItem
            reviewStatus="published"
            reviewText={review.text}
            reviewTitle={review.product.name}
          />
        ))}
      </div>
    );
  };

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

  if (!isActive || !userState) return <Icons id="spiner" />;

  return (
    <main className="profile-wrapper">
      <div className="profile-content">
        <div className="profile-content_header">
          <div className="profile-content_header-user">
            <Image src={profile} alt="profile-photo" width={200} height={200} />

            <div className="profile-content_header-user-data">
              <h5 className="profile-content_header-user-data-title">
                {userState.first_name} {userState.last_name}
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

      <ModalChange
        setInputsValue={setInputsValue}
        userState={userState}
        setUserState={setUserState}
        inputsValue={inputsValue}
        handleInputsChange={handleInputsChange}
        isChange={isChange}
        setIsChange={setIsChange}
      />
    </main>
  );
};

export default Profile;
