//Global
import React from "react";

//Components
import { Button, Input } from "@nextui-org/react";

//Styles
import "./applications.scss";

const Applications = () => {
  return (
    <div className="applications-page_wrapper">
      <div className="applications-page_content">
        <h5>Заявки на модерации</h5>

        <form className="applications-page_application">
          <div className="flex w-full justify-between flex-wrap gap-[20px]">
            <div className="applications-page_application-left">
              <label
                htmlFor="#"
                className="applications-page_application-left_label"
              >
                Страна регистрации
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Российская Федерация"
                />
              </label>

              <label
                htmlFor="#"
                className="applications-page_application-left_label"
              >
                Номер телефона
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="+7 (999) 999-99-99"
                />
              </label>

              <label
                htmlFor="#"
                className="applications-page_application-left_label"
              >
                ИНН
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Введите ИНН"
                />
              </label>

              <label
                htmlFor="#"
                className="applications-page_application-left_label"
              >
                Номер банковского счета
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Номер счета"
                />
              </label>
            </div>

            <div className="applications-page_application-right">
              <label
                htmlFor="#"
                className="applications-page_application-right_label"
              >
                Страна регистрации
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Российская Федерация"
                />
              </label>

              <label
                htmlFor="#"
                className="applications-page_application-right_label"
              >
                Номер телефона
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="+7 (999) 999-99-99"
                />
              </label>

              <label
                htmlFor="#"
                className="applications-page_application-right_label"
              >
                ИНН
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Введите ИНН"
                />
              </label>

              <label
                htmlFor="#"
                className="applications-page_application-right_label"
              >
                Номер банковского счета
                <Input
                  classNames={{ inputWrapper: "label-input" }}
                  placeholder="Номер счета"
                />
              </label>
            </div>
          </div>

          <div className="application-page_application-bottom gap-[15px]">
            <label className="flex flex-col w-full max-w-450px">
              <span className="comment-text">Комментарий для поставщика</span>

              <Input
                placeholder="Заявка не принята по причине..."
                classNames={{ inputWrapper: "comment-input" }}
              />
            </label>

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
      </div>
    </div>
  );
};

export default Applications;
