"use client";

import React, { useState } from "react";
import { Key } from 'react'; // Key tipini içe aktarın
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

// Styles
import "./tariff.scss";

const sehirDropdown = () => {
  const [selectedCity, setSelectedCity] = useState<string>("Select a city"); // Başlangıçta şehir seçili değil

  const handleSelect = (key: Key) => {
    if (typeof key === "string") { // Eğer key string ise güncelle
      setSelectedCity(key);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="button-option_left_table active">
          {selectedCity}
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Cities"
        onAction={handleSelect} // Seçim yapıldığında tetiklenen işlev
      >
        <DropdownItem key="Istanbul">Istanbul</DropdownItem>
        <DropdownItem key="Ankara">Ankara</DropdownItem>
        <DropdownItem key="Izmir">Izmir</DropdownItem>
        <DropdownItem key="Bursa">Bursa</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};


const Tariff: React.FC = () => {
  return (
    <div className="tariff-wrapper">
      <div className="tariff-content">
        <div className="border-1 border-border shadow-xl tariff-page_info">
          <div className="tariff-wrapper">
            <div className="tariff-block">
              <div className="tariff-info">
                <p className="text-textAcc">Şehir : </p>
                {sehirDropdown()}
              </div>
            </div>

            <div className="tariff-block">
              <div className="tariff-info">
                <p className="text-textAcc">Tarife : </p>
                <input
                  name="pattern"
                  className="provider-form-input active"
                  value={1}
                  placeholder={"abc"}
                  //  onChange={productForm.changeGoodInformation}
                  maxLength={24}
                />
              </div>
            </div>

            <div className="tariff-block">
              <div className="tariff-info">
                <p className="text-textAcc">Fiyat : </p>
                <input
                  name="pattern"
                  className="provider-form-input active"
                  value={1}
                  placeholder={"abc"}
                  //  onChange={productForm.changeGoodInformation}
                  maxLength={24}
                />
              </div>
            </div>
          </div>

          <div className="buttons-header-wrapper">
            <button
              style={{ display: "block", marginLeft: 25 }}
              //  onClick={createProductPost}
              //  disabled={disabledButtonSend}
            >
              {"Kaydet"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Tariff;
