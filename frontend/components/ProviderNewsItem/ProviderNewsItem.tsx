//Global
import React, { FC } from "react";

//Types
import { IProviderNewsObj } from "@/types/types";

export const ProviderNewsItem: FC<Omit<IProviderNewsObj, "id">> = ({
  data,
  image,
  text,
  title,
}) => {
  return (
    <div className="provider-page_blocks-news_item">
      <h5>{title}</h5>

      <div className="provider-page_blocks-news_item-block">
        <span>{data}</span>

        <span>Возможности</span>
      </div>

      <p>{text}</p>
    </div>
  );
};
