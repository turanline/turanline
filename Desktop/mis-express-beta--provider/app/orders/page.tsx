"use client";
//Global
import React, { useEffect, useState, useCallback, useMemo,lazy } from "react";
import { useRouter } from "next/navigation";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
//Components
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";
import OrderStatus from "@/components/OrderStatus/OrderStatus";
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
  const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure();
  const { providersOrders,statusProduct } = useTypedSelector(state => state.product);
  const { isProviderAuth, status } = useTypedSelector(state => state.authorization);
  const { onGetProviderOrders, onGetUser } = useUserActions();
  const translate = useTranslate();
  const { push } = useRouter();


  const [appealModal, setAppealModal] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchID, setSearchID] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<IProvidersOrders | null>(null);


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
          const priceA = parseFloat(a.sum_for_period);
          const priceB = parseFloat(b.sum_for_period);
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


  const handleModalOpen = (good: IProvidersOrders) => {
    setSelectedOrder(good);
    onModalOpen();
  };
  const renderModalGood = () => {
    if (!selectedOrder) return null;
    
    return(
        <Modal
          closeButton={ 
          <button>
            <Icons id="deleteCard" />
          </button>}
          isOpen={isModalOpen}
          onOpenChange={onModalOpenChange}
          radius="sm"
          size="sm"
        >
          <ModalContent className="provider-modal">
            {(onClose) => (
              <>
                <ModalHeader className="provider-modal__header">
                  <p># {selectedOrder.id}</p>
                </ModalHeader>
                <ModalBody className="provider-modal__body">
                
                  <div className="provider-modal__item">
                    <p className="provider-modal__title">{translate.productsPageStatus}</p>
                    <p className="provider-modal__text"><OrderStatus status={selectedOrder.status}/></p>
                  </div>
                  <div className="provider-modal__item">
                    <p className="provider-modal__title">{translate.cartItemPrice}</p>
                    <p className="provider-modal__text">{selectedOrder.sum_for_period}</p>
                  </div>
                  <div className="provider-modal__item">
                    <p className="provider-modal__title">{translate.productsPageDate}</p>
                    <p className="provider-modal__text"> 
                      {new Date(selectedOrder.created_date)
                      .toLocaleString('ru-RU', {
                        day: '2-digit',   
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        timeZone: 'UTC'
                      }).replace(',', ' -')}
                  </p>
                  </div>
                  <div className="provider-modal__item">
                    <p className="provider-modal__title">{translate.makeAppealOrders}</p>
                    <button onClick={() => {setAppealModal(!appealModal)}} className="provider-content_orders-content-order-button">
                      <Icons id="flag" />
                      {translate.makeAppealOrders}
                    </button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      );
  };
  const renderAllProviderOrders = () => {

    if (!sortedOrders?.length && statusProduct === "pending") return <Icons id="spiner" />;

    if (!sortedOrders?.length && statusProduct === "fulfilled")
      return (
        <h3 className="orders-content_cards-item-span-empty">{translate.ordersEmpty}</h3>
    );

    return sortedOrders?.map(order => (
      <ProviderOrderWrapper
        key={order?.id}
        orderDate={order?.created_date}
        orderNumber={order?.id}
        orderPrice={order?.sum_for_period}
        orderStatus={order?.status}
        appealModal={appealModal}
        setAppealModal={setAppealModal}
        orderInformation={order?.order_products}
        onItemClick={() => {handleModalOpen(order)}}
      />
    ));
  };

  const renderAppealModal = useCallback(() => {
    if (!providersOrders?.length && statusProduct === "fulfilled") return null;


    return providersOrders?.map(clientData => (
      <MakeAnAppeal
        key={clientData?.id}
        clientEmail={clientData?.customer?.user?.email}
        clientPhone={clientData?.customer?.user?.phone_number}
        appealModal={appealModal}
        setAppealModal={setAppealModal}
      />
    ));
  }, [providersOrders, statusProduct, appealModal]);

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
              <div
                data-name
                className="provider-content_orders-content-filters-button"
              >
                {translate.productsPageName}
              </div>

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

              <div className="provider-content_orders-content-filters-button">
                {translate.productsPageStatus}
              </div>
            </div>

            <div className="provider-content_orders-content-list">
              {renderAllProviderOrders()}
            </div>
          </div>
        </div>
        {renderModalGood()}
        {renderAppealModal()}
      </div>
    </div>
  );
};

export default ProviderOrders;
