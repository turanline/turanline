//Global
import React, { FC } from "react";
//Component Types
import { ISearchModalProps } from "@/types/componentTypes";
//Components
import { HeaderSearch } from "@/components/HeaderSearch/HeaderSearch";
//Styles
import "./SearchModal.scss";

const SearchModal: FC<ISearchModalProps> = ({ setSearchModal, searchModal, allCategories, category, onSetCategory}) => {

  const searchWrapperClassName = searchModal ? "search-modal-wrapper active" : "search-modal-wrapper";
  const searchContentClassName = searchModal ? "search-modal-content active" : "search-modal-content";

  const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();
  const setModal = () => setSearchModal(false);

  return (
    <div onClick={setModal} className={searchWrapperClassName}>
      <div onClick={stopPropagation}className={searchContentClassName}>
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
