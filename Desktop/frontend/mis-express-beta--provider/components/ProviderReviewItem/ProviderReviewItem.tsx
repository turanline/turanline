//Global
import React, { FC } from "react";
import { Button } from "@nextui-org/react";
//Types
import { IUserReviewItemProps } from "@/types/componentsTypes";
//Styles
import "./ProviderReviewItem.scss";

const ProviderReviewItem: FC<IUserReviewItemProps> = ({reviewStatus,reviewText,reviewTitle,}) => {

  const status = reviewStatus === "moderation" ? "на модерации" : "опубликован";

  const statusStyles = { background: status === "на модерации" ? "#e30387" : "#0ABAB5" };

  const articleClassName = { borderLeft: status === "на модерации" ? "5px solid #e30387" : "1px solid #ebebeb" };

  const renderCheckSpam = () => {
    if(reviewStatus === "moderation")
    return (
      <div className="flex items-center justify-end gap-[10px]">
        <Button className="review-button">это спам!</Button>
        <Button className="review-button">опубликовать</Button>
      </div>
    )
  };

  return (
    <article style={articleClassName}className="provider-content_review">
      <div className="provider-content_review-header">
        <h6 className="provider-content_review-header-title">{reviewTitle}</h6>

        <span style={statusStyles} className="provider-content_review-header-status">
          {status}
        </span>
      </div>
      <p className="provider-content_review-text">{reviewText}</p>

      {renderCheckSpam()}
    </article>
  );
};

export { ProviderReviewItem };
