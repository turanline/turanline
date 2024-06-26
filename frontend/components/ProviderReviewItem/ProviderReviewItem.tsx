//Global
import React, { FC } from "react";

//Types
import { IUserReviewItemProps } from "@/types/types";

//Styles
import "./ProviderReviewItem.scss";
import { Button } from "@nextui-org/react";

const ProviderReviewItem: FC<IUserReviewItemProps> = ({
  reviewStatus,
  reviewText,
  reviewTitle,
}) => {
  const status = reviewStatus === "moderation" ? "на модерации" : "опубликован";

  const statusStyles = {
    background: status === "на модерации" ? "#e30387" : "#0ABAB5",
  };

  return (
    <article
      style={{
        borderLeft:
          status === "на модерации" ? "5px solid #e30387" : "1px solid #ebebeb",
      }}
      className="provider-content_review"
    >
      <div className="provider-content_review-header">
        <h6 className="provider-content_review-header-title">{reviewTitle}</h6>

        <span
          style={statusStyles}
          className="provider-content_review-header-status"
        >
          {status}
        </span>
      </div>
      <p className="provider-content_review-text">{reviewText}</p>

      {reviewStatus === "moderation" && (
        <div className="flex items-center justify-end gap-[10px]">
          <Button className="review-button">это спам!</Button>

          <Button className="review-button">опубликовать</Button>
        </div>
      )}
    </article>
  );
};

export { ProviderReviewItem };
