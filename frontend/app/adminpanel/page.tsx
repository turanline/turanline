//Global
import React from "react";
import Link from "next/link";

//Components
import { Icons } from "@/components/Icons/Icons";
import { Checkbox } from "@nextui-org/react";
import { AdminCardItem } from "../../components/AdminCardItem/AdminCardItem";

//Styles
import "./adminpanel.scss";

const AdminPanel = () => {
  return (
    <div className="admin-wrapper">
      <div className="admin-content">
        <nav className="admin-content_navigation">
          <Link className="admin-content_navigation-link active" href={"/"}>
            Товары
          </Link>

          <Link className="admin-content_navigation-link" href={"/"}>
            Добавить
          </Link>

          <Link className="admin-content_navigation-link" href={"/"}>
            Экспорт
          </Link>

          <Link className="admin-content_navigation-link" href={"/"}>
            Импорт
          </Link>
        </nav>

        <div className="admin-content_filters">
          <div className="admin-content_filters-action">
            <div className="admin-content_filters-action-description">
              <span className="admin-content_filters-action-description-text">
                Все (10 403)
              </span>

              <span className="admin-content_filters-action-description-text">
                Опубликованные (10 403)
              </span>

              <span className="admin-content_filters-action-description-text">
                Корзина (1)
              </span>
            </div>

            <div className="admin-content_filters-buttons">
              <button className="admin-content_filters-button button-action">
                Действия <Icons id="arrowDownAction" />
              </button>

              <button className="admin-content_filters-button">
                Применить
              </button>
            </div>
          </div>
        </div>

        <div className="admin-content_cards">
          <div className="admin-content_cards-header">
            <Checkbox className="admin-checkbox" />

            <Icons id="adminImage" />

            <button className="admin-content_cards-header-button">
              Имя
              <Icons id="arrowDownProfile" />
            </button>

            <button className="admin-content_cards-header-button">
              Артикул
              <Icons id="arrowDownProfile" />
            </button>

            <button className="admin-content_cards-header-button">
              Статус
            </button>

            <button className="admin-content_cards-header-button">
              Цена
              <Icons id="arrowDownProfile" />
            </button>

            <button className="admin-content_cards-header-button">
              Категории
            </button>

            <button className="admin-content_cards-header-button">
              Дата
              <Icons id="arrowDownProfile" />
            </button>
          </div>

          <div className="admin-content_cards-list">
            <AdminCardItem
              cardArticle={110840}
              cardDate="26.12.2023"
              cardImage="/"
              cardPrice={10}
              cardTime="11:40"
              cardTitle="Название товара"
            />

            <AdminCardItem
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

export default AdminPanel;
