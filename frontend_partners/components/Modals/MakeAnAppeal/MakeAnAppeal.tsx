import React, { FC, useEffect } from "react";
import { Link } from "@nextui-org/react";
//types
import { IModalAppeal } from "@/types/componentsTypes";
//utils
import { Icons } from "../../Icons/Icons";
//hooks
import { useTranslate } from "@/hooks/useTranslate";
//styles
import "./MakeAnAppeal.scss";

const MakeAnAppeal: FC<IModalAppeal> = ({ appealModal, setAppealModal,clientEmail,clientPhone }) => {
  //hook
  const { MakeAnAppeal } = useTranslate();

  const closeModal = () => setAppealModal(false);
  const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

  //колхоз.
  useEffect(() => {
    if (appealModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [appealModal]);

  const wrappeClassName = !appealModal ? "appealModal-wrapper" : "appealModal-wrapper active";
  const contentClassName = !appealModal ? "appealModal-content" : "appealModal-content active";

  return (
    <main onClick={closeModal} className={wrappeClassName}>
      <div className={contentClassName}onClick={stopPropagation}>
        <h4 className="appealModal-content-title">{MakeAnAppeal}</h4>

        <div className="contacts-block">
          <span className="contact-wrapper">
            Email:
            <Link href={`mailto:${clientEmail}`} className="contacts">
              {clientEmail}
            </Link>
          </span>
          <span className="contact-wrapper">
            Phone:
            <Link href={`tel:${clientPhone}`} className="contacts">
              {clientPhone}
            </Link>
          </span>
        </div>

        <button onClick={closeModal} className="close-appealModal-button">
          <Icons id="deleteCard" />
        </button>
      </div>
    </main>
  );
};

export default MakeAnAppeal;
