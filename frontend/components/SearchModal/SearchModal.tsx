//Global
import React, { FC } from "react";

//Component Types
import { ISearchModalProps } from "@/types/componentTypes";

//Components
import { HeaderSearch } from "../HeaderSearch/HeaderSearch";

//Styles
import "./SearchModal.scss";

const SearchModal: FC<ISearchModalProps> = ({
  setSearchModal,
  searchModal,
  allCategories,
  category,
  onSetCategory,
}) => {
  return (
    <div
      onClick={() => setSearchModal(false)}
      className={
        searchModal ? "search-modal-wrapper active" : "search-modal-wrapper"
      }
    >
      <div
        onClick={e => e.stopPropagation()}
        className={
          searchModal ? "search-modal-content active" : "search-modal-content"
        }
      >
        <HeaderSearch
          isHidden={false}
          allCategories={allCategories}
          onSetCategory={onSetCategory}
          category={category}
        />
      </div>
    </div>
  );
};

export { SearchModal };
