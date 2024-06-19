"use client";

//Global
import React from "react";
import Link from "next/link";

//Components
import { Button } from "@nextui-org/react";

//Utils
import {
  PROVIDER_ROUTE,
  PROVIDER_PRODUCTS_ROUTE,
  PROVIDER_ORDERS_ROUTE,
} from "@/utils/Consts";

//Styles
import "./provider.scss";

export default function Provider() {
  return (
    <div className="provider-page_wrapper">
      <div className="provider-page_content">
        <nav className="provider-page_header">
          <div className="provider-page_header-links">
            <Link href="#">Партнеры</Link>

            <Link style={{ color: "#0ABAB5" }} href={PROVIDER_ROUTE}>
              Главная
            </Link>

            <Link href={PROVIDER_PRODUCTS_ROUTE}>Товары и цены</Link>

            <Link href={PROVIDER_ORDERS_ROUTE}>Заказы и отзывы</Link>
          </div>

          <span className="provider-link">ООО Плащи и куртки</span>
        </nav>

        <div className="provider-page_blocks">
          <div className="provider-page_blocks-total">
            <div className="provider-page_blocks-total_block">
              <div className="provider-page_blocks-total_block-account">
                <span className="account">1.500%</span>

                <span className="account-text">на счету</span>
              </div>

              <p className="provider-page_blocks-total_block-text">
                Общая сумма с учётом недоставленных заказов
              </p>
            </div>

            <div className="provider-page_blocks-total_block">
              <div className="provider-page_blocks-total_block-account">
                <span className="account">1.000%</span>

                <span className="account-text">к выводу</span>
              </div>

              <div className="provider-page_blocks-total_block-button">
                <Button className="bg-tiffani text-white rounded-[5px] w-[144px]">
                  Вывести
                </Button>

                <span className="provider-page_blocks-total_block-text">
                  История выводов
                </span>
              </div>
            </div>
          </div>

          <div className="provider-page_blocks-chart">
            <Button>Неделя</Button>

            <Button>Месяц</Button>

            <Button>Квартал</Button>

            <Button>Полгода</Button>
          </div>

          <div className="provider-page_blocks-news">
            <h3>Новости</h3>

            <div className="provider-page_blocks-news_item">
              <h5>
                Теперь вы сможете загружать товары на сайт из своей панели
              </h5>

              <div className="provider-page_blocks-news_item-block">
                <span>30.04.2024</span>

                <span>Возможности</span>
              </div>

              <p>
                Ранее данная функция была доступна только через администраторов
                сайта, теперь же вы сможете...
              </p>
            </div>

            <div className="provider-page_blocks-news_item">
              <h5>Новые способы аналитики</h5>

              <div className="provider-page_blocks-news_item-block">
                <span>04.04.2024</span>

                <span>Возможности</span>
              </div>

              <p>
                Теперь вы сможете выводить средства не только с помощью
                банковских переводов, но и в криптова...
              </p>
            </div>

            <div className="provider-page_blocks-news_item">
              <h5>Обновление комиссий</h5>

              <div className="provider-page_blocks-news_item-block">
                <span>04.04.2024</span>

                <span>Условия партнёрства</span>
              </div>

              <p>
                Мы обновили тарифы в связи с инфляцией. Теперь комиссии площадки
                повышены с 5% до 7%...
              </p>
            </div>
          </div>

          <div className="provider-page_blocks-notifications">
            <h3>Уведомления</h3>

            <div className="provider-page_blocks-notifications_item">
              <h5 style={{ color: "#E30387" }}>Товары не прошли модерацию</h5>

              <div className="provider-page_blocks-notifications_item-block">
                <span>04.04.2024</span>

                <span>Товары</span>
              </div>

              <div className="provider-page_blocks-notifications_item-products">
                <span>Плащ черный</span>

                <Link href="#">Подробнее</Link>
              </div>

              <div className="provider-page_blocks-notifications_item-products">
                <span>Плащ серый</span>

                <Link href="#">Подробнее</Link>
              </div>

              <div className="provider-page_blocks-notifications_item-products">
                <span>Плащ белый</span>

                <Link href="#">Подробнее</Link>
              </div>
            </div>

            <div className="provider-page_blocks-notifications_item">
              <h5>Товары прошли модерацию</h5>

              <div className="provider-page_blocks-notifications_item-block">
                <span>30.04.2024</span>

                <span>Товары</span>
              </div>

              <p>
                Мы обновили тарифы в связи с инфляцией. Теперь комиссии площадки
                повышены с 5% до 7%...
              </p>
            </div>
          </div>

          <div className="provider-page_blocks-reviews">
            <h3>Отзывы</h3>

            <div className="provider-page_blocks-reviews_item">
              <h5>Пока ничего нет</h5>

              <p>Как только вам оставят отзыв, он появится здесь</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
