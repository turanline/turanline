"use client";

//Global
import React from "react";
import Image from "next/image";

//Hooks
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useLanguage } from "@/hooks/useLanguage";

//Images
import rus from "@/public/rus.png";
import tur from "@/public/tur.png";
import chn from "@/public/chn.png";
import eng from "@/public/eng.png";
import esp from "@/public/esp.png";
import isr from "@/public/isr.png";
import jpn from "@/public/jpn.png";
import kor from "@/public/kor.png";
import prt from "@/public/prt.png";

//Components
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const LanguageSelect = () => {
  const { selectedLanguage } = useTypedSelector(state => state.language);

  const { changeSelectedLanguage } = useLanguage();

  const returnImageByState = (language: string) => {
    switch (language) {
      case "TUR":
        return tur;
      case "CHN":
        return chn;
      case "ENG":
        return eng;
      case "ESP":
        return esp;
      case "ISR":
        return isr;
      case "JPN":
        return jpn;
      case "KOR":
        return kor;
      case "PRT":
        return prt;
      default:
        return rus;
    }
  };

  const flags = ["RUS", "TUR", "CHN", "ENG", "ESP", "ISR", "JPN", "KOR", "PRT"];

  return (
    <Dropdown isKeyboardDismissDisabled>
      <DropdownTrigger>
        <Button variant="light" style={{ padding: 0 }}>
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
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[selectedLanguage]}
        onSelectionChange={keys =>
          //@ts-ignore
          changeSelectedLanguage(keys.anchorKey)
        }
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
