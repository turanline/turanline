"use client";

//Global
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

//Components
import { Button, Badge, RadioGroup, Radio } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";

//Utils
import { ADMIN_PROVIDER_ROUTE, SUPER_ADMIN_APPLICATIONS } from "@/utils/Consts";

//Styles
import "./superadmin.scss";

const SuperAdmin = () => {
  const { orderPageSearch } = useTranslate();

  const { push } = useRouter();

  return (
    <div className="admin-page_wrapper">
      <div className="admin-page_content">
        <nav className="admin-page_links">
          <Badge
            classNames={{ badge: "right-[-10px] top-0" }}
            content="2"
            color="danger"
          >
            <div className="admin-page_link">
              <h5>Заявки на модерации</h5>

              <Button onClick={() => push(SUPER_ADMIN_APPLICATIONS)}>
                Открыть
              </Button>
            </div>
          </Badge>

          <Badge
            classNames={{ badge: "right-[-10px] top-0" }}
            content="2"
            color="danger"
          >
            <div className="admin-page_link">
              <h5>Заказы на модерации</h5>

              <Button>Открыть</Button>
            </div>
          </Badge>

          <div className="admin-page_link">
            <h5>Поставщики</h5>

            <div className="search-wrapper">
              <Icons id="search2" />

              <input
                className="search-wrapper_input"
                placeholder={orderPageSearch}
              />
            </div>
          </div>
        </nav>

        <div className="admin-page_news-providers">
          <div className="admin-page_news">
            <h4>Новости</h4>

            <div className="admin-page_news-block">
              <h5>Новости</h5>

              <div className="admin-page_news-block_item">
                <h5>
                  Теперь вы можете загружать товары на сайт из своей панели
                </h5>

                <div className="admin-page_news-block_item-date">
                  <span>30.04.2024</span>

                  <span>Возможности</span>
                </div>

                <p>
                  Ранее данная функция была доступна только через
                  администраторов сайта, теперь же вы сможете...
                </p>
              </div>

              <div className="admin-page_news-block_item">
                <h5>Новые способы аналитики</h5>

                <div className="admin-page_news-block_item-date">
                  <span>04.04.2024</span>

                  <span>Возможности</span>
                </div>

                <p>
                  Теперь вы сможете выводить средства не только с помощью
                  банковских переводов, но и в криптова...
                </p>
              </div>

              <div className="admin-page_news-block_item">
                <h5>Обновление комиссий</h5>

                <div className="admin-page_news-block_item-date">
                  <span>04.04.2024</span>

                  <span>Условия партнёрства</span>
                </div>

                <p>
                  Мы обновили тарифы в связи с инфляцией. Теперь комиссии
                  площадки повышены с 5% до 7%...
                </p>
              </div>
            </div>

            <Button>Написать новость</Button>
          </div>

          <div className="admin-page_providers">
            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <div className="admin-page_provider">
              <span>ООО Плащи и куртки</span>

              <Link href={ADMIN_PROVIDER_ROUTE}>Подробнее</Link>
            </div>

            <Link href="#">Смотреть все</Link>
          </div>
        </div>

        <div className="admin-page_products-list">
          <h5 className="admin-page_products-list_title">Лента товаров</h5>

          <div className="admin-page_products-product">
            <div className="admin-page_products-product_top">
              <Image
                width={278}
                height={202}
                src=""
                alt="image"
                className="bg-black"
              />

              <div className="admin-page_products-product_top-options">
                <h5>Название товара</h5>

                <span>Категория</span>

                <RadioGroup
                  className="mt-[20px]"
                  classNames={{ wrapper: "flex flex-col gap-[30px]" }}
                >
                  <Radio value="price" classNames={{ base: "gap-[10px]" }}>
                    <span className="option-price">$10.00</span>
                  </Radio>

                  <Radio value="size" classNames={{ base: "gap-[10px]" }}>
                    <div className="option-sizes">
                      <span className="option-sizes_size">XXL</span>

                      <span className="option-sizes_size">XL</span>

                      <span className="option-sizes_size">L</span>

                      <span className="option-sizes_size">M</span>

                      <span className="option-sizes_size">S</span>
                    </div>
                  </Radio>

                  <Radio value="color" classNames={{ base: "gap-[10px]" }}>
                    <div className="option-sizes">
                      <span className="option-colors_color bg-black" />

                      <span className="option-colors_color bg-blue" />

                      <span className="option-colors_color bg-white" />

                      <span className="option-colors_color bg-brown" />
                    </div>
                  </Radio>
                </RadioGroup>
              </div>

              <div className="admin-page_products-product_top-buttons">
                <Button>Одобрить</Button>

                <Button>Отправить на редактирование</Button>
              </div>
            </div>

            <div className="admin-page_products-product_bottom">
              <RadioGroup>
                <Radio
                  classNames={{ label: "radio-item_bottom" }}
                  value="article"
                >
                  Артикул: 123456789
                </Radio>

                <Radio
                  classNames={{ label: "radio-item_bottom" }}
                  value="compound"
                >
                  Состав: Хлопок - 53%, Акрил -...
                </Radio>

                <Radio
                  classNames={{ label: "radio-item_bottom" }}
                  value="manufacturer"
                >
                  Производитель: Uniqlo
                </Radio>

                <Radio
                  classNames={{ label: "radio-item_bottom" }}
                  value="season"
                >
                  Сезон: Мульти
                </Radio>

                <Radio
                  classNames={{ label: "radio-item_bottom" }}
                  value="pattern"
                >
                  Узор: Однотонный
                </Radio>

                <Radio
                  classNames={{ label: "radio-item_bottom" }}
                  value="country"
                >
                  Страна производства: Турция
                </Radio>

                <Radio
                  classNames={{ label: "radio-item_bottom" }}
                  value="color"
                >
                  Цвет: Белый
                </Radio>
              </RadioGroup>

              <div className="admin-page_products-product_bottom-description">
                <p className="admin-page_products-product_bottom-description-text">
                  Джемпер из коллекции теплосберегающего белья HEATTECH.
                  Инновационный материал помогает сохранить тепло вашего тела,
                  быстро сохнет и обеспечивает ощущение комфорта в течение дня,
                  несмотря на перепады температур. Лонгслив HEATTECH С ХЛОПКОМ
                  от UNIQLO по выгодной цене с доставкой по всему миру купить
                  онлайн от проверенного поставщика.
                </p>

                <span className="admin-page_products-product_bottom-description-provider">
                  Поставщик: ООО Плащи и Куртки
                </span>

                <div className="admin-page_products-product_bottom-description-comments">
                  <span>Комментарии для поставщика</span>

                  <input
                    type="text"
                    placeholder="Товар не принят по причине..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
