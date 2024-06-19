//Global
import React, { FC } from "react";

//Types
import { IUserReviewItemProps } from "@/types/types";

//Styles
import "./UserReviewItem.scss";

const UserReviewItem: FC<IUserReviewItemProps> = ({
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
      className="profile-content_review"
    >
      <div className="profile-content_review-header">
        <h6 className="profile-content_review-header-title">{reviewTitle}</h6>

        <span
          style={statusStyles}
          className="profile-content_review-header-status"
        >
          {status}
        </span>
      </div>

      <p className="profile-content_review-text">{reviewText}</p>
    </article>
  );
};

export { UserReviewItem };
