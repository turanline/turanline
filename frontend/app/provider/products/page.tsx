//Global
import React from "react";
import Link from "next/link";

//Components
import { Icons } from "@/components/Icons/Icons";
import { Checkbox, Button } from "@nextui-org/react";
import { ProviderCardItem } from "@/components/ProviderCardItem/ProviderCardItem";

//Utils
import {
  PROVIDER_ORDERS_ROUTE,
  PROVIDER_PRODUCTS_ROUTE,
  PROVIDER_ROUTE,
} from "@/utils/Consts";

//Styles
import "./products.scss";

const ProviderProducts = () => {
  return (
    <div className="products-wrapper">
      <div className="products-content">
        <nav className="products-content_navigation">
          <Link className="products-content_navigation-link active" href={"/"}>
            Товары
          </Link>

          <Link className="products-content_navigation-link" href={"/"}>
            Добавить
          </Link>

          <Link className="products-content_navigation-link" href={"/"}>
            Экспорт
          </Link>

          <Link className="products-content_navigation-link" href={"/"}>
            Импорт
          </Link>
        </nav>

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
  );
};

export default ProviderProducts;
