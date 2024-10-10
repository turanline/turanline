"use client";
//Global
import React from "react";
//Components
import { Button } from "@nextui-org/react";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Styles
import "../RegistrationComponent/RegistrationComponent.scss";
import "./OfferStage.scss";



export default function OfferStage({nextStep}: {nextStep: () => void}) {
  //hooks
  const text = useTranslate();

  return (
    <div className="first-stage_wrapper">
      <div className="first-stage_content">
        <div className="first-stage_header">
          <h3 className="first-stage_title">{text.politicsTitle}</h3>

          <div className="provider-stages">
            <div className="provider-stages-block">
              <div className="stage-link active"></div>
              <div className="stage-link"></div>
              <div className="stage-link"></div>
              <div className="stage-link"></div>
            </div>

            <p className="provider-stages-text">{text.registrationStage} 1/4</p>
          </div>
        </div>

        <div className="provider-text max-h-[500px] overflow-auto">

          <p className="politics-content_text font-bold">1. {text["politics.1"]}</p>
          <p className="politics-content_text">1.1 {text["politics.1.1"]}</p>
          <p className="politics-content_text">1.2 {text["politics.1.2"]}</p>
          <p className="politics-content_text">{text["politics.1.2.1"]}</p>
          <p className="politics-content_text">{text["politics.1.2.2"]}</p>
          <p className="politics-content_text">{text["politics.1.2.3"]}</p>

          <p className="politics-content_text font-bold">2. {text["politics.2"]}</p>
          <p className="politics-content_text">2.1. {text["politics.2.1"]}</p>
          <p className="politics-content_text">{text["politics.2.1.1"]}</p>
          <p className="politics-content_text">{text["politics.2.1.2"]}</p>
          <p className="politics-content_text">{text["politics.2.1.3"]}</p>
          <p className="politics-content_text">2.2 {text["politics.2.2"]}</p>
          <p className="politics-content_text">2.3 {text["politics.2.3"]}</p>
          <p className="politics-content_text">2.4 {text["politics.2.4"]}</p>

          <p className="politics-content_text font-bold">3. {text["politics.3"]}</p>
          <p className="politics-content_text">3.1 {text["politics.3.1"]}</p>
          <p className="politics-content_text">3.2 {text["politics.3.2"]}</p>
          <p className="politics-content_text">3.3 {text["politics.3.3"]}</p>
          <p className="politics-content_text">3.4 {text["politics.3.4"]}</p>
          <p className="politics-content_text">3.5 {text["politics.3.5"]}</p>
          <p className="politics-content_text">3.6 {text["politics.3.6"]}</p>
          <p className="politics-content_text">3.7 {text["politics.3.7"]}</p>
          <p className="politics-content_text">3.8.1 {text["politics.3.8.1"]}</p>
          <p className="politics-content_text">3.8.2 {text["politics.3.8.2"]}</p>
          <p className="politics-content_text">3.8.3 {text["politics.3.8.3"]}</p>
          <p className="politics-content_text">3.8.4 {text["politics.3.8.4"]}</p>
          <p className="politics-content_text">3.8.5 {text["politics.3.8.5"]}</p>
          <p className="politics-content_text">3.9 {text["politics.3.9"]}</p>
          <p className="politics-content_text">3.10 {text["politics.3.10"]}</p>
          <p className="politics-content_text">3.11 {text["politics.3.11"]}</p>
          <p className="politics-content_text">3.12 {text["politics.3.12"]}</p>
          <p className="politics-content_text">3.13 {text["politics.3.13"]}</p>
          <p className="politics-content_text">3.14 {text["politics.3.14"]}</p>
          <p className="politics-content_text">3.15 {text["politics.3.15"]}</p>

          <p className="politics-content_text font-bold">4. {text["politics.4"]}</p>
          <p className="politics-content_text">4.1. {text["politics.4.1"]}</p>
          <p className="politics-content_text">{text["politics.4.2"]}</p>

          <p className="politics-content_text font-bold">5. {text["politics.5"]}</p>
          <p className="politics-content_text">{text["politics.5.1"]}</p>

          <p className="politics-content_text font-bold">6. {text["politics.6"]}</p>
          <p className="politics-content_text">6.1. {text["politics.6.1"]}</p>
          <p className="politics-content_text">6.2 {text["politics.6.2"]}</p>
          <p className="politics-content_text">6.3. {text["politics.6.3"]}</p>
          <p className="politics-content_text">6.4 {text["politics.6.4"]}</p>

          <p className="politics-content_text font-bold">7. {text["politics.7"]}</p>
          <p className="politics-content_text">{text["politics.7.1"]}</p>
          <p className="politics-content_text"> {text["politics.7.1.1"]}</p>

        </div>

        <div className="provider-text-buttons">
          <Button className="read">{text.politicsRead}</Button>

          <Button
            onClick={nextStep}
            className="bg-black submit-form"
          >
            {text.politicsAgree}
          </Button>
        </div>
      </div>
    </div>
  );
}
