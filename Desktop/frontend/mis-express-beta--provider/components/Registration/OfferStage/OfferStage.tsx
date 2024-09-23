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

        <div className="provider-text">
          <p className="politics-content_text">
            1. {text.politicsGeneralProvisions}
          </p>
          <p className="politics-content_text">
            {text.politicsGeneralProvisionsText}
          </p>
          <p className="politics-content_text">1.1. {text["politics.1.1"]}</p>
          <p className="politics-content_text">1.2. {text["politics.1.2"]}</p>
          <p className="politics-content_text">2. {text["politics.2"]}</p>
          <p className="politics-content_text">2.1. {text["politics.2.1"]}</p>
          <p className="politics-content_text">2.2. {text["politics.2.2"]}</p>
          <p className="politics-content_text">2.3. {text["politics.2.3"]}</p>
          <p className="politics-content_text">2.4. {text["politics.2.4"]}</p>
          <p className="politics-content_text">2.5. {text["politics.2.5"]}</p>
          <p className="politics-content_text">2.6. {text["politics.2.6"]}</p>
          <p className="politics-content_text">2.7. {text["politics.2.7"]}</p>
          <p className="politics-content_text">2.8. {text["politics.2.8"]}</p>
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
