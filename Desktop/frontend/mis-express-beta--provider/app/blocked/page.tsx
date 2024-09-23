'use client'
//Global
import React from "react";
//Components
import { Icons } from "@/components/Icons/Icons";
import { Button } from "@nextui-org/react";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Styles
import "./blocked.scss";



export default function Blocked() {

  const text = useTranslate();


  return (
    <div className="blocked-wrapper">
      <div className="blocked-content">
        <h3 className="blocked-title">{text.blockedPageTitle}</h3>

        <div className="blocked-content_main">
          <div className="blocked-content_main-spinner">
            <Icons id="spiner" />

            <p className="blocked-content_main-text">
              По причине содержания запрещенного контента, который не может
              содержаться на данной площадке!
            </p>
          </div>

          <Button className="blocked-button">{text.blockedPageButton}</Button>
        </div>
      </div>
    </div>
  );
}
