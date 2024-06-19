//Global
import React from "react";
import Link from "next/link";

//Components
import { Icons } from "@/components/Icons/Icons";

//Utils
import {
  FIRST_STAGE_ROUTE,
  SECOND_STAGE_ROUTE,
  THIRD_STAGE_ROUTE,
} from "@/utils/Consts";

//Styles
import "../first-stage/first-stage.scss";
import "./third-stage.scss";

export default function ThirdStage() {
  return (
    <div className="first-stage_wrapper">
      <div className="first-stage_content">
        <div className="first-stage_header">
          <h3 className="first-stage_title">Модерация</h3>

          <div className="provider-stages">
            <nav className="provider-stages-block">
              <Link href={FIRST_STAGE_ROUTE} className="stage-link active" />
              <Link href={SECOND_STAGE_ROUTE} className="stage-link active" />
              <Link href={THIRD_STAGE_ROUTE} className="stage-link active" />
            </nav>

            <p className="provider-stages-text">Регистрация. Этап 3/3</p>
          </div>
        </div>

        <div className="provider-moderation">
          <div className="provider-moderation-left">
            <Icons id="spiner" />

            <p className="provider-moderation-left-text">
              Запрос на подключение к маркетплейсу направлен. Прямо сейчас наши
              специалисты проверяют корректность введённых данных
            </p>
          </div>

          <div className="provider-moderation-right">
            <span className="provider-moderation-right-text">
              Ориентировочное время проверки
            </span>

            <span className="provider-moderation-right-timer">11:10:10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
