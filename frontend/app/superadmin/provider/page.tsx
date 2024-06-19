"use client";

//Global
import React from "react";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Components
import { Input, Button, Checkbox } from "@nextui-org/react";
import { ProviderOrderWrapper } from "@/components/ProviderOrderWrapper/ProviderOrderWrapper";
import { Icons } from "@/components/Icons/Icons";
import { ProviderCardItem } from "@/components/ProviderCardItem/ProviderCardItem";

//Styles
import "./provider.scss";
import "@/app/provider/products/products.scss";

const Provider = () => {
  const { orderPageSearch } = useTranslate();

  return (
    <div className="admin-provider-page_wrapper">
      <div className="admin-provider-page_content">
        <h5>ООО Плащи и Куртки</h5>

        <form className="admin-provider-page_application">
          <div className="flex w-full justify-between">
            <div className="admin-provider-page_application-left">
              <label
                htmlFor="#"
                className="admin-provider-page_application-left_label"
              >
                Страна регистрации
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Российская Федерация"
                />
              </label>

              <label
                htmlFor="#"
                className="admin-provider-page_application-left_label"
              >
                Номер телефона
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="+7 (999) 999-99-99"
                />
              </label>

              <label
                htmlFor="#"
                className="admin-provider-page_application-left_label"
              >
                ИНН
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Введите ИНН"
                />
              </label>

              <label
                htmlFor="#"
                className="admin-provider-page_application-left_label"
              >
                Номер банковского счета
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Номер счета"
                />
              </label>
            </div>

            <div className="admin-provider-page_application-right">
              <label
                htmlFor="#"
                className="admin-provider-page_application-right_label"
              >
                Страна регистрации
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Российская Федерация"
                />
              </label>

              <label
                htmlFor="#"
                className="admin-provider-page_application-right_label"
              >
                Номер телефона
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="+7 (999) 999-99-99"
                />
              </label>

              <label
                htmlFor="#"
                className="admin-provider-page_application-right_label"
              >
                ИНН
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Введите ИНН"
                />
              </label>

              <label
                htmlFor="#"
                className="admin-provider-page_application-right_label"
              >
                Номер банковского счета
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Номер счета"
                />
              </label>
            </div>
          </div>

          <div className="admin-provider-page_application-bottom">
            <div className="flex flex-col gap-[10px]">
              <span className="comment-text">Комментарий для поставщика</span>

              <Input
                placeholder="Заявка не принята по причине..."
                classNames={{ inputWrapper: "comment-input" }}
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <span className="comment-date_text">Дата отправки</span>

              <span className="comment-date_date">03.05.2024 (10:00)</span>
            </div>

            <div className="flex flex-col gap-[10px]">
              <Button className="comment-button">Одобрить</Button>

              <Button className="comment-button">
                Отправить на редактирование
              </Button>
            </div>
          </div>
        </form>

        <div className="admin-provider-content_orders">
          <div className="admin-provider-content_orders-header">
            <h5 className="admin-provider-content_orders-header-text">
              Заказы поставщика
            </h5>

            <div className="search-wrapper">
              <Icons id="search2" />

              <input
                className="admin-provider-content_orders-header-input"
                placeholder={orderPageSearch}
                type="search"
              />
            </div>
          </div>

          <div className="admin-provider-content_orders-content">
            <div className="admin-provider-content_orders-content-filters">
              <button className="admin-provider-content_orders-content-filters-button">
                Название
                <Icons id="arrowDownProfile" />
              </button>

              <button className="admin-provider-content_orders-content-filters-button">
                Дата
                <Icons id="arrowDownProfile" />
              </button>

              <button className="admin-provider-content_orders-content-filters-button">
                Стоимость
                <Icons id="arrowDownProfile" />
              </button>

              <button className="admin-provider-content_orders-content-filters-button">
                Статус
                <Icons id="arrowDownProfile" />
              </button>
            </div>

            <div className="admin-provider-content_orders-content-list">
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
        </div>

        <div className="admin-provider-content_products">
          <h5 className="admin-provider-content_products-title">
            Товары поставщика
          </h5>

          <div className="products-content_filters">
            <div className="products-content_filters-action">
              <div className="products-content_filters-action-description">
                <span className="products-content_filters-action-description-text">
                  Все (10 403)
                </span>

                <span className="products-content_filters-action-description-text">
                  Опубликованные (10 403)
                </span>

                <span className="products-content_filters-action-description-text">
                  Корзина (1)
                </span>

                <span className="products-content_filters-action-description-text">
                  Не принятые товары (1)
                </span>
              </div>

              <div className="products-content_filters-buttons">
                <Button className="products-content_filters-button">
                  Действия <Icons id="arrowDownAction" />
                </Button>

                <Button className="products-content_filters-button">
                  Применить
                </Button>
              </div>
            </div>
          </div>

          <div className="products-content_cards">
            <div className="products-content_cards-header">
              <Checkbox className="products-checkbox" />

              <Icons id="adminImage" />

              <Button className="products-content_cards-header-button">
                Имя
                <Icons id="arrowDownProfile" />
              </Button>

              <Button className="products-content_cards-header-button">
                Артикул
                <Icons id="arrowDownProfile" />
              </Button>

              <Button className="products-content_cards-header-button">
                Статус
              </Button>

              <Button className="products-content_cards-header-button">
                Цена
                <Icons id="arrowDownProfile" />
              </Button>

              <Button className="products-content_cards-header-button">
                Категории
              </Button>

              <Button className="products-content_cards-header-button">
                Дата
                <Icons id="arrowDownProfile" />
              </Button>
            </div>

            <div className="products-content_cards-list">
              <ProviderCardItem
                cardArticle={110840}
                cardDate="26.12.2023"
                cardImage="/"
                cardPrice={10}
                cardTime="11:40"
                cardTitle="Название товара"
              />

              <ProviderCardItem
                cardArticle={110840}
                cardDate="26.12.2023"
                cardImage="/"
                cardPrice={10}
                cardTime="11:40"
                cardTitle="Название товара"
              />

              <ProviderCardItem
                cardArticle={110840}
                cardDate="26.12.2023"
                cardImage="/"
                cardPrice={10}
                cardTime="11:40"
                cardTitle="Название товара"
              />

              <ProviderCardItem
                cardArticle={110840}
                cardDate="26.12.2023"
                cardImage="/"
                cardPrice={10}
                cardTime="11:40"
                cardTitle="Название товара"
              />

              <ProviderCardItem
                cardArticle={110840}
                cardDate="26.12.2023"
                cardImage="/"
                cardPrice={10}
                cardTime="11:40"
                cardTitle="Название товара"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Provider;
