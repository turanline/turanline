"use client";
//Global
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
//Components
import { Icons } from "@/components/Icons/Icons";
//Hooks
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useTranslate } from "@/hooks/useTranslate";

//Styles
import "../RegistrationComponent/RegistrationComponent.scss";
import "./TimerComponent.scss";

export default function TimerComponent() {
  //hooks
  const {onGetProviderTime, onSetTimer} = useUserActions();
  const { time_left } = useTypedSelector(state => state.user);
  const { status } = useTypedSelector(state => state.authorization);

  const text = useTranslate();
  
  const formatTime = () => {
    const hours = Math.floor(time_left / 3600)
      .toString()
      .padStart(2, "0");

    const minutes = Math.floor((time_left % 3600) / 60)
      .toString()
      .padStart(2, "0");

    const remainingSeconds = (time_left % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${remainingSeconds}`;
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (time_left > 0) {
        onSetTimer(time_left - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ time_left]);



  useEffect(() => {
    onGetProviderTime();
  }, [onGetProviderTime]);


  if (status === "pending") return(
      <div className="products-content_spiner">
        <Icons id="spiner" />
      </div>
  );


  return (
    <div className="first-stage_wrapper">
      <div className="first-stage_content">
        <div className="first-stage_header">
          <h3 className="first-stage_title">{text.moderationTitle}</h3>

          <div className="provider-stages">
            <nav className="provider-stages-block">
              <div className="stage-link active"></div>
              <div className="stage-link active"></div>
              <div className="stage-link active"></div>
              <div className="stage-link active"></div>
            </nav>

            <p className="provider-stages-text">{text.registrationStage} 4/4</p>
          </div>
        </div>

        <div className="provider-moderation">
          <div className="provider-moderation-left">
            <Icons id="spiner" />

            <p className="provider-moderation-left-text">
              {text.moderationText}
            </p>
          </div>

          <div className="provider-moderation-right">
            <span className="provider-moderation-right-text">
              {text.moderationTimer}
            </span>

            <span className="provider-moderation-right-timer">
              {formatTime()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
