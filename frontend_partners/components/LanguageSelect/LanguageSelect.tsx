"use client";
//Global
import React, { FC, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
//Images
import rus from "@/public/rus.png";
import tur from "@/public/tur.png";
import eng from "@/public/eng.png";
//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useLanguage } from "@/hooks/useLanguage";
//Components
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
//Cookies
import { getCookie, setCookie } from 'cookies-next';
//Styles
import './LanguageSelect.scss'



const LanguageSelect: FC<{ color: string }> = ({ color }) => {
  const flags = ["ru", "tr", "en"];
  const { selectedLanguage } = useTypedSelector(state => state.language);
  const { changeSelectedLanguage } = useLanguage();
  const { refresh } = useRouter()

  const onChangeLanguage = (language: string) => {
    setCookie("selectedLanguage", language);
    changeSelectedLanguage(language);
    refresh();
  };

  useEffect(() => {
    const language = getCookie("selectedLanguage");

    if (language) changeSelectedLanguage(language);
  }, [changeSelectedLanguage,onChangeLanguage]);



  const returnImageByState = (language: string) => {
    switch (language) {
      case "tr":
        return tur;
      case "en":
        return eng;
      default:
        return rus;
    }
  };
  const renderFlags = () => (
    flags.map(flag => (
      <DropdownItem
        key={flag}
        startContent={
          <Image src={returnImageByState(flag)} alt={flag} width={24} />
        }
      >
        {flag.toUpperCase()}
      </DropdownItem>
    ))
  );


  return (
    <Dropdown isKeyboardDismissDisabled classNames={{ content: "language-wrapper" }}>
      <DropdownTrigger>
        <Button variant="light" style={{ padding: 0, color }}>
          <Image
            src={returnImageByState(selectedLanguage)}
            alt={selectedLanguage}
            width={24}
            height={18}
          />
          {selectedLanguage?.toUpperCase()}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        //@ts-ignore
        onSelectionChange={keys => onChangeLanguage(keys?.anchorKey)}
        classNames={{ base: "language-wrapper" }}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[selectedLanguage]}
      >
        {renderFlags()}
      </DropdownMenu>
    </Dropdown>
  );
};

export { LanguageSelect };
