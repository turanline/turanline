"use client";

//Global
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//Components
import { Button } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";
import { ProviderNewsItem } from "@/components/ProviderNewsItem/ProviderNewsItem";

//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";

//Utils
import { SHOP_ROUTE } from "@/utils/Consts";

//Styles
import "./provider.scss";

export default function Provider() {
  const {
    isProviderAuth,
    status,
    providerState,
    providerNews,
    providerReviews,
  } = useTypedSelector(state => state.user);

  const { push } = useRouter();

  const { onGetUser, onGetProviderNews, onGetProviderReviews } =
    useUserActions();

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (isProviderAuth) {
      onGetProviderNews();
      onGetProviderReviews();
    }
  }, [isProviderAuth, onGetProviderNews, onGetProviderReviews]);

  useEffect(() => {
    if (!isProviderAuth && status === "fulfilled") push(SHOP_ROUTE);
  }, [isProviderAuth, status, push]);

  if (!providerState) return <Icons id="spiner" />;

  return (
    <div className="provider-page_wrapper">
      <div className="provider-page_content">
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

            {providerNews.length ? (
              providerNews.map(news => (
                <ProviderNewsItem
                  key={news.id}
                  data={news.data}
                  image={news.image}
                  text={news.text}
                  title={news.title}
                />
              ))
            ) : (
              <h3 className="text-tiffani">Пока никаких новостей нет!</h3>
            )}
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
              {providerReviews.length ? (
                providerReviews.map(review => <h5 key={review}>Новость ...</h5>)
              ) : (
                <>
                  <h5>Пока ничего нет</h5>

                  <p>Как только вам оставят отзыв, он появится здесь</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
