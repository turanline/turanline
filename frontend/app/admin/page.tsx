"use client";

//Global
import React from "react";

//Components
import { Checkbox } from "@nextui-org/react";

//Custom Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";

//Styles
import "./admin.scss";

const Admin = () => {
  const { returnInputError, returnInputProperties } = useCustomForm();

  return (
    <div className="form-wrapper">
      <form action="#" className="form-content">
        <div className="form-content_header">
          <h5 className="form-content_header-title">Вход в админ-панель</h5>

          <p className="form-content_header-text">Добро пожаловать!</p>
        </div>

        <div className="form-content_bottom">
          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">Email</span>
            <input
              {...returnInputProperties("email")}
              placeholder="Введите свой email"
              type="email"
              className="form-content_bottom-label-input"
            />
            {returnInputError("email")}
          </label>
          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">Пароль</span>
            <input
              {...returnInputProperties("password")}
              placeholder="Введите свой пароль"
              type="password"
              className="form-content_bottom-label-input"
            />
            {returnInputError("password")}
          </label>

          <div className="form-content_checkbox">
            <Checkbox
              className="form-content_checkbox-content"
              value="Запомнить на 30 дней"
            >
              Запомнить на 30 дней
            </Checkbox>

            <button className="form-content_checkbox-button">
              Забыли пароль
            </button>
          </div>

          <button type="submit" className="form-content-button">
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
