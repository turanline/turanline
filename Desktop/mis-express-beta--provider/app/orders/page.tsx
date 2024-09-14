"use client";
//Global
import React, { useEffect, useState, useCallback, useMemo,lazy } from "react";
import { useRouter } from "next/navigation";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
//Components
import { Icons } from "@/components/Icons/Icons";
import { ProviderOrderWrapper } from "@/components/ProviderOrderWrapper/ProviderOrderWrapper";
const MakeAnAppeal = lazy(() => import("@/components/Modals/MakeAnAppeal/MakeAnAppeal"));
//Utils
import { LOGIN_ROUTE } from "@/utils/Consts";
//Types
import { IProvidersOrders } from "@/types/additionalTypes";
//Styles
import "./orders.scss";
import "../../components/MainPage/MainPage.scss";

const ProviderOrders = () => {
  //hooks
  const { providersOrders, isProviderAuth, status } = useTypedSelector(state => state.user);
  const translate = useTranslate();
  const { onGetProviderOrders, onGetUser } = useUserActions();
  const { push } = useRouter();


  const [appealModal, setAppealModal] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchID, setSearchID] = useState<string>("");


  const sortOrders = useCallback(
    (orders: IProvidersOrders[]) => {
      if (sortBy === "date") {
        return [...orders].sort((a, b) => {
          const dateA = new Date(a.created_date).getTime();
          const dateB = new Date(b.created_date).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
      }

      if (sortBy === "price") {
        return [...orders].sort((a, b) => {
          const priceA = parseFloat(a.total_sum);
          const priceB = parseFloat(b.total_sum);
          return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
        });
      }

      return orders;
    },
    [sortBy, sortOrder]
  );

  const handleSort = (type: string) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
    }
  };

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    if (/^\d*$/.test(input)) setSearchID(input);
  }, []);

  const filteredOrders = useMemo(() => {
    return searchID
      ? providersOrders.filter(order => order?.id?.toString().includes(searchID))
      : providersOrders;
  }, [searchID, providersOrders]);

  const sortedOrders = useMemo(() => sortOrders(filteredOrders), [sortOrders, filteredOrders]);
 
  const renderAllProviderOrders = () => {

    if (!sortedOrders?.length && status === "pending") return <Icons id="spiner" />;

    if (!sortedOrders?.length && status === "fulfilled")
      return (
        <h3 className="orders-content_cards-item-span-empty">{translate.ordersEmpty}</h3>
    );


    return sortedOrders?.map(order => (
      <ProviderOrderWrapper
        key={order?.id}
        orderDate={order?.created_date}
        orderNumber={order?.id}
        orderPrice={order?.total_sum}
        orderStatus={order?.status}
        appealModal={appealModal}
        setAppealModal={setAppealModal}
        orderInformation={order?.order_products}
      />
    ));
  };

  const renderAppealModal = useCallback(() => {
    if (!providersOrders?.length && status === "fulfilled") return null;

    return providersOrders?.map(clientData => (
      <MakeAnAppeal
        key={clientData?.id}
        clientEmail={clientData?.customer?.user?.email}
        clientPhone={clientData?.customer?.phone_number}
        appealModal={appealModal}
        setAppealModal={setAppealModal}
      />
    ));
  }, [providersOrders, status, appealModal]);

  //checkAuth
  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (isProviderAuth) onGetProviderOrders();
  }, [onGetProviderOrders, isProviderAuth]);

  useEffect(() => {
    if (!isProviderAuth && status === "fulfilled") push(LOGIN_ROUTE);
  }, [isProviderAuth, status, push]);

  if (!providersOrders) return <Icons id="spiner" />;


  return (
    <div className="provider-page_wrapper">
      <div className="provider-page_content">
        <div className="provider-content_orders">
          <div className="provider-content_orders-header">
            <h5 className="provider-content_orders-header-text">
              {translate.profilePageOrders}
            </h5>

            <div className="search-wrapper">
              <Icons id="search2" />
              <input
                className="provider-content_orders-header-input"
                placeholder={translate.orderPageSearch}
                type="search"
                value={searchID}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="provider-content_orders-content">
            <div className="provider-content_orders-content-filters">
              <button
                data-name
                className="provider-content_orders-content-filters-button"
              >
                {translate.productsPageName}
              </button>

              <button
                className="provider-content_orders-content-filters-button"
                onClick={() => handleSort("date")}
              >
                {translate.productsPageDate}
                <Icons id="arrowDownProfile" />
              </button>

              <button
                data-price
                className="provider-content_orders-content-filters-button"
                onClick={() => handleSort("price")}
              >
                {translate.cartItemrice}
                <Icons id="arrowDownProfile" />
              </button>

              <button className="provider-content_orders-content-filters-button">
                {translate.productsPageStatus}
              </button>
            </div>

            <div className="provider-content_orders-content-list">
              {renderAllProviderOrders()}
            </div>
          </div>
        </div>

        {renderAppealModal()}
      </div>
    </div>
  );
};

export default ProviderOrders;
