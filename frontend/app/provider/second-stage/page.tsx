"use client";

//Global
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//Components
import { Button } from "@nextui-org/react";
import { Icons } from "@/components/Icons/Icons";

//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useUserActions } from "@/hooks/useUserActions";

//Utils
import {
  FIRST_STAGE_ROUTE,
  PROVIDER_ROUTE,
  SECOND_STAGE_ROUTE,
  THIRD_STAGE_ROUTE,
} from "@/utils/Consts";

//Styles
import "../first-stage/first-stage.scss";
import "./second-stage.scss";

export default function SecondStage() {
  const { status, isProviderAuth } = useTypedSelector(state => state.user);

  const { onGetUser } = useUserActions();

  const { push } = useRouter();

  const text = useTranslate();

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (isProviderAuth && status === "fulfilled") push(PROVIDER_ROUTE);
  }, [isProviderAuth, status, push]);

  if (isProviderAuth || status === "pending") return <Icons id="spiner" />;

  return (
    <div className="first-stage_wrapper">
      <div className="first-stage_content">
        <div className="first-stage_header">
          <h3 className="first-stage_title">Договор оферты</h3>

          <div className="provider-stages">
            <div className="provider-stages-block">
              <Link href={FIRST_STAGE_ROUTE} className="stage-link active" />
              <Link href={SECOND_STAGE_ROUTE} className="stage-link active" />
              <Link href={THIRD_STAGE_ROUTE} className="stage-link" />
            </div>

            <p className="provider-stages-text">Регистрация. Этап 2/3</p>
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
          <Button className="read">Читать дальше</Button>

          <Button
            onClick={() => push(THIRD_STAGE_ROUTE)}
            className="submit-form"
          >
            Я ознакомлен(а) и согласен(а)
          </Button>
        </div>
      </div>
    </div>
  );
}
