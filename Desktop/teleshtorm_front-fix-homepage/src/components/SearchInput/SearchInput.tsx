"use client";
import React, { useEffect } from "react";
import styles from "./SearchInput.module.scss";
import { SearchIcon } from "../svgs";
import Link from "next/link";
import cn from "classnames";
import axios from "axios";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { changeSubscribers } from "@/helpers/changeSubs";
import classNames from "classnames";

interface SearchResult {
  id: number;
  name: string;
  hidden: boolean;
  description: string;
  image: string;
  subscribers: number;
}

const active = cn(styles._active, styles.dropdown);

export default function SearchInput({open,setOpenSearch = () => {}}: {open?: boolean,setOpenSearch?:React.Dispatch<React.SetStateAction<boolean>>}) {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = React.useState("");
  const [activeMenu, setActiveMenu] = React.useState(false);
  const t = useTranslations("Header");
  const [searchResult, setSearchResult] = React.useState<SearchResult[] | null>(
    null
  );
  const {replace} = useRouter()
  const locale = useLocale();

  const dropRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const searchRequest = (value: string) => {
    if (value) {
      axios
        .get(
          `https://test-api-teleshtorm.teleshtorm.org/channels/search_suggest?query=${value}`
        )
        .then((res) => {
          setSearchResult(res.data);
        });
    }
  };

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (value === "") return setSearchResult(null);
      searchRequest(value);
    },
    300
  );

  const handleSearchParams = () => {
    const search = new URLSearchParams(searchParams);
    search.set("term", inputValue);
    replace(`/${locale}/search?${search.toString()}`);
  };

  const handleKeyPress = (event: { key: any; }) => {

    if (event.key === "Enter"){
      handleSearchParams()
      setActiveMenu(false)
    }

}

  const handleOverlayClick = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
      setActiveMenu(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener("click", handleOverlayClick);
    return () => document.removeEventListener("click", handleOverlayClick);
  }, []);

  return (
    <div ref={dropRef} className={styles.input_container}>
      <SearchIcon className={styles.icon} />
      {open && <Image onClick={() => setOpenSearch(false)} className={styles.close_icon} src={'/CloseIcon.svg'} width={15} height={15} alt="close"/>}
      <input
        required
        minLength={1}
        min={1}
        onKeyUp={handleKeyPress}
        onFocus={() => setActiveMenu(true)}
        onChange={(e) => {
          setInputValue(e.target.value);
          handleSearch(e);
        }}
        placeholder={t("Поиск")}
        className={styles.input}
        type="text"
        value={inputValue}
      />
      <div className={activeMenu ? active : styles.dropdown}>
        <div className={styles.dropdown_list}>
          {searchResult?.map((item) => (
            <div onClick={() => setActiveMenu(false)} key={item.id} className={styles.dropdown_content}>
            <Image className={styles.arrow} alt="arrow" src={'/arrow-return-right.svg'} width={15} height={15}/>
              <Link
                className={styles.dropdown_item}
                href={`/${locale}/${item.id}`}
              >
                <Image
                  width={55}
                  height={55}
                  alt="Картинка из поиска"
                  className={styles.dropdown_img}
                  src={item.image}
                />
                <div className={styles.dropdown_text}>
                  <p className={styles.dropdown_name}>{item.name}</p>
                  <p className={styles.dropdown_subscribe}>
                    <span className={styles.dropdown_number}>
                      {item.subscribers}
                    </span>
                    {changeSubscribers(item.subscribers.toString())}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div onClick={() => {
          handleSearchParams()
          setActiveMenu(false);
          }} className={styles.dropdown_button} />
      </div>
      <div onClick={() => setActiveMenu(false)} className={classNames(styles.overlay, !activeMenu && styles.hidden)}></div>
    </div>
  );
}
