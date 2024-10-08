"use client";
//Global
import React, { FC, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
//Cookies
import { getCookie, setCookie } from "cookies-next";
//Styles
import "./LanguageSelect.scss";

const LanguageSelect: FC<{ color: string }> = ({ color }) => {
  const { selectedLanguage } = useTypedSelector(state => state.language);
  const { refresh } = useRouter();
  const { changeSelectedLanguage } = useLanguage();

  const flags = ["TR", "EN", "RU"];

  const onChangeLanguage = (language: string) => {
    setCookie("selectedLanguage", language);
    changeSelectedLanguage(language);
    refresh();
  };

  const returnImageByState = (language: string) => {
    switch (language) {
      case "TR":
        return tur;
      case "RU":
        return rus;
      case "EN":
        return eng;
      default:
        return tur;
    }
  };

  const renderAllFlags = () => (
    flags.map(flag => (
      <DropdownItem
        key={flag}
        startContent={
          <Image src={returnImageByState(flag)} alt={flag} width={24} />
        }
      >
        {flag}
      </DropdownItem>
    ))
  );

  useEffect(() => {
    const language = getCookie("selectedLanguage");

    if (language) changeSelectedLanguage(language);
  }, [changeSelectedLanguage]);

  return (
    <Dropdown classNames={{ content: "dropdown-content" }} isKeyboardDismissDisabled>
      <DropdownTrigger>
        <Button variant="light" style={{ padding: 0, color }}>
          <Image
            src={returnImageByState(selectedLanguage)}
            alt={selectedLanguage}
            width={24}
            height={18}
          />
          {selectedLanguage.toUpperCase()}
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
        {renderAllFlags()}
      </DropdownMenu>
    </Dropdown>
  );
};

export { LanguageSelect };
