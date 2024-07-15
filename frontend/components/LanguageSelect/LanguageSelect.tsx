"use client";

//Global
import React, { FC, useEffect } from "react";
import Image from "next/image";

//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useLanguage } from "@/hooks/useLanguage";

//Images
import rus from "@/public/rus.png";
import tur from "@/public/tur.png";
import eng from "@/public/eng.png";

//Components
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

//Styles
import "./LanguageSelect.scss";

const LanguageSelect: FC<{ color: string }> = ({ color }) => {
  const { selectedLanguage } = useTypedSelector(state => state.language);

  const { changeSelectedLanguage } = useLanguage();

  useEffect(() => {
    const language = localStorage.getItem("selectedLanguage");

    if (language) changeSelectedLanguage(language);
  }, [changeSelectedLanguage]);

  const onChangeLanguage = (language: string) => {
    localStorage.setItem("selectedLanguage", language);
    changeSelectedLanguage(language);
  };

  const returnImageByState = (language: string) => {
    switch (language) {
      case "TUR":
        return tur;
      case "ENG":
        return eng;
      default:
        return rus;
    }
  };

  const flags = ["RUS", "TUR", "ENG"];

  return (
    <Dropdown
      classNames={{ content: "dropdown-content" }}
      isKeyboardDismissDisabled
    >
      <DropdownTrigger>
        <Button variant="light" style={{ padding: 0, color }}>
          <Image
            src={returnImageByState(selectedLanguage)}
            alt={selectedLanguage}
            width={24}
            height={18}
          />
          {selectedLanguage}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        //@ts-ignore
        onSelectionChange={keys => onChangeLanguage(keys.anchorKey)}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[selectedLanguage]}
        classNames={{ base: "dropdown-content" }}
      >
        {flags.map(flag => (
          <DropdownItem
            key={flag}
            startContent={
              <Image src={returnImageByState(flag)} alt={flag} width={24} />
            }
          >
            {flag}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export { LanguageSelect };
