//Global
import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

//Components
import { Icons } from "@/components/Icons/Icons";
import { Button } from "@nextui-org/react";

//Styles
import "./product.scss";

const ProviderProduct: NextPage = () => {
  return (
    <div className="products-product-wrapper">
      <div className="products-product-content">
        <nav className="products-product-content_link-block">
          <Link className="products-product-content_link" href="/adminpanel">
            назад
          </Link>
        </nav>

        <div className="products-product-card">
          <div className="products-product-card_header">
            <h5 className="products-product-card_header-title">
              Название товара
            </h5>

            <Icons id="pencil" />
          </div>

          <div className="products-product-card_content">
            <div className="bg-black w-[407px] h-[407px]" />

            <div className="products-product-card_content-description">
              <div className="products-product-card_content-description-block">
                <div className="products-product-card_content-description-changes">
                  <div className="products-product-card_content-description-change">
                    Артикул: 123456789
                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-change">
                    Атрибут 1: Значение
                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-change">
                    Атрибут 2: Значение
                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-change">
                    Атрибут 3: Значение
                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-change">
                    Атрибут 4: Значение
                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-change">
                    Атрибут 5: Значение
                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-change">
                    Атрибут 6: Значение
                    <Icons id="pencilSmall" />
                  </div>
                </div>

                <div className="products-product-card_content-description-options">
                  <div className="products-product-card_content-description-option">
                    <h5 className="products-product-card_content-option-price">
                      10.00 $
                    </h5>

                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-option">
                    <span className="products-product-card_content-option-text">
                      В наличии
                    </span>

                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-option-sizes">
                    {["XL", "L", "M", "S"].map(size => (
                      <button
                        key={size}
                        className="products-product-card_content-description-option-size"
                      >
                        {size}
                      </button>
                    ))}

                    <Icons id="pencilSmall" />
                  </div>

                  <div className="products-product-card_content-description-option-colors">
                    {["#373737", "#CDCDCD", "#777777", "#E6E6E6"].map(color => (
                      <button
                        key={color}
                        style={{ background: `${color}` }}
                        className="products-product-card_content-description-option-color"
                      ></button>
                    ))}

                    <Icons id="pencilSmall" />
                  </div>
                </div>
              </div>

              <div className="products-product-card_content-description-button-block">
                <Button className="products-product-card_content-description-button">
                  сохранить
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="products-product-card_description">
          <div className="products-product-card_description-header">
            <h5 className="products-product-card_description-title">
              Описание товара
            </h5>

            <Icons id="pencilSmall" />
          </div>

          <p className="products-product-card_description-text">
            Здесь будет написано описание товара. Мы предлагаем сделать его
            шаблонным и заполнять данные исходя из таблицы. То есть, условно,
            здесь будет Название товара по выгодной цене с доставкой по всему
            миру купить онлайн от проверенного поставщика. Этот текст будет
            прописан с учётом seo-стратегии
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderProduct;
