//Global
import React, { FC } from "react";
//Types
import { IProviderNewsObj } from "@/types/additionalTypes";

export const ProviderNewsItem: FC<Omit<IProviderNewsObj, "id">> = ({date,text,title,category}) => {

  return (
    <div className="provider-page_blocks-news_item">
      <h5>{title}</h5>

      <div className="provider-page_blocks-news_item-block">
        <span>{date}</span>

        <span>Возможности</span>
      </div>

      <p>{text}</p>
    </div>
  );
};
