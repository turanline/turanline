"use client";
//Global
import React from "react";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import { SHOP_NAME } from "@/utils/Consts";
//Styles
import "./politics.scss";

const Politics = () => {
  const translate = useTranslate();

  return (
    <main className="politics-wrapper">
      <div className="politics-content">
        <div className="politics-content_header">
          <span className="politics-content_header-span">
            {translate.footerPolitics}
          </span>

          <h5 className="politics-content_header-title">{SHOP_NAME}</h5>
        </div>
        <div className="politics-content_wrapper">
          <p className="politics-content_translate">
            1. {translate.politicsGeneralProvisions}
          </p>
          <p className="politics-content_translate">
            {translate.politicsGeneralProvisions}
          </p>
          <p className="politics-content_translate">1.1. {translate["politics.1.1"]}</p>
          <p className="politics-content_translate">1.2. {translate["politics.1.2"]}</p>
          <p className="politics-content_translate">2. {translate["politics.2"]}</p>
          <p className="politics-content_translate">2.1. {translate["politics.2.1"]}</p>
          <p className="politics-content_translate">2.2. {translate["politics.2.2"]}</p>
          <p className="politics-content_translate">2.3. {translate["politics.2.3"]}</p>
          <p className="politics-content_translate">2.4. {translate["politics.2.4"]}</p>
          <p className="politics-content_translate">2.5. {translate["politics.2.5"]}</p>
          <p className="politics-content_translate">2.6. {translate["politics.2.6"]}</p>
          <p className="politics-content_translate">2.7. {translate["politics.2.7"]}</p>
          <p className="politics-content_translate">2.8. {translate["politics.2.8"]}</p>
          <p className="politics-content_translate">2.9. {translate["politics.2.9"]}</p>
          <p className="politics-content_translate">2.10. {translate["politics.2.10"]}</p>
          <p className="politics-content_translate">2.11. {translate["politics.2.11"]}</p>
          <p className="politics-content_translate">2.12. {translate["politics.2.12"]}</p>
          <p className="politics-content_translate">2.13. {translate["politics.2.13"]}</p>
          <p className="politics-content_translate">2.14. {translate["politics.2.14"]}</p>
          <p className="politics-content_translate">3. {translate["politics.3"]}</p>
          <p className="politics-content_translate">3.1. {translate["politics.3.1"]}</p>
          <p className="politics-content_translate">— {translate["politics.3.line.1"]}</p>
          <p className="politics-content_translate">— {translate["politics.3.line.2"]}</p>
          <p className="politics-content_translate">— {translate["politics.3.line.3"]}</p>
          <p className="politics-content_translate">3.2. {translate["politics.3.2"]}</p>
          <p className="politics-content_translate">
            — {translate["politics.3.2.line.1"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.3.2.line.2"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.3.2.line.3"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.3.2.line.4"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.3.2.line.5"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.3.2.line.6"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.3.2.line.7"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.3.2.line.8"]}
          </p>
          <p className="politics-content_translate">4. {translate["politics.4"]}</p>
          <p className="politics-content_translate">4.1. {translate["politics.4.1"]}</p>
          <p className="politics-content_translate">
            — {translate["politics.4.1.line.1"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.4.1.line.2"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.4.1.line.3"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.4.1.line.4"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.4.1.line.5"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.4.1.line.6"]}
          </p>
          <p className="politics-content_translate">4.2. {translate["politics.4.2"]}</p>
          <p className="politics-content_translate">
            — {translate["politics.4.2.line.1"]}
          </p>
          <p className="politics-content_translate">
            — {translate["politics.4.2.line.2"]}
          </p>
          <p className="politics-content_translate">4.3. {translate["politics.4.3"]}</p>
          <p className="politics-content_translate">5. {translate["politics.5"]}</p>
          <p className="politics-content_translate">5.1. {translate["politics.5.1"]}</p>
          <p className="politics-content_translate">5.2. {translate["politics.5.2"]}</p>
          <p className="politics-content_translate">5.3. {translate["politics.5.3"]}</p>
          <p className="politics-content_translate">5.4. {translate["politics.5.4"]}</p>
          <p className="politics-content_translate">5.5. {translate["politics.5.5"]}</p>
          <p className="politics-content_translate">5.6. {translate["politics.5.6"]}</p>
          <p className="politics-content_translate">5.7. {translate["politics.5.7"]}</p>
          <p className="politics-content_translate">6. {translate["politics.6"]}</p>
          <p className="politics-content_translate">{translate["politics.6.targets"]}</p>
          <li className="politics-content_translate">{translate["politics.6.dot.1"]}</li>
          <p className="politics-content_translate">{translate["politics.6.personal"]}</p>
          <li className="politics-content_translate"> {translate["politics.6.dot.2"]}</li>
          <p className="politics-content_translate">{translate["politics.6.grounds"]}</p>
          <li className="politics-content_translate">{translate["politics.6.dot.3"]}</li>
          <p className="politics-content_translate">
            {translate["politics.6.personal.2"]}
          </p>
          <li className="politics-content_translate">{translate["politics.6.dot.4"]}</li>
          <p className="politics-content_translate">7. {translate["politics.7"]}</p>
          <p className="politics-content_translate">7.1. {translate["politics.7.1"]}</p>
          <p className="politics-content_translate">7.2. {translate["politics.7.2"]}</p>
          <p className="politics-content_translate">7.3. {translate["politics.7.3"]}</p>
          <p className="politics-content_translate">7.4. {translate["politics.7.4"]}</p>
          <p className="politics-content_translate">7.5. {translate["politics.7.5"]}</p>
          <p className="politics-content_translate">7.6. {translate["politics.7.6"]}</p>
          <p className="politics-content_translate">7.7. {translate["politics.7.7"]}</p>
          <p className="politics-content_translate">8. {translate["politics.8"]}</p>
          <p className="politics-content_translate">{translate["politics.8"]}</p>
          <p className="politics-content_translate">8.1. {translate["politics.8.1"]}</p>
          <p className="politics-content_translate">8.2. {translate["politics.8.2"]}</p>
          <p className="politics-content_translate">8.3. {translate["politics.8.3"]}</p>
          <p className="politics-content_translate">8.4. {translate["politics.8.4"]}</p>
          <p className="politics-content_translate">{translate["politics.8.4"]}</p>
          <p className="politics-content_translate">8.5. {translate["politics.8.5"]}</p>
          <p className="politics-content_translate">8.6. {translate["politics.8.6"]}</p>
          <p className="politics-content_translate">8.7. {translate["politics.8.7"]}</p>
          <p className="politics-content_translate">8.8. {translate["politics.8.8"]}</p>
          <p className="politics-content_translate">8.9. {translate["politics.8.9"]}</p>
          <p className="politics-content_translate">9. {translate["politics.9"]}</p>
          <p className="politics-content_translate">9.1. {translate["politics.9.1"]}</p>
          <p className="politics-content_translate">9.2. {translate["politics.9.2"]}</p>
          <p className="politics-content_translate">10. {translate["politics.10"]}</p>
          <p className="politics-content_translate">10.1. {translate["politics.10.1"]}</p>
          <p className="politics-content_translate">10.2. {translate["politics.10.2"]}</p>
          <p className="politics-content_translate">11. {translate["politics.11"]}</p>
          <p className="politics-content_translate">{translate["politics.11"]}</p>
          <p className="politics-content_translate">12. {translate["politics.12"]}</p>
          <p className="politics-content_translate">12.1. {translate["politics.12.1"]}</p>
          <p className="politics-content_translate">12.2. {translate["politics.12.2"]}</p>
          <p className="politics-content_translate">12.3. {translate["politics.12.3"]}</p>
        </div>
      </div>
    </main>
  );
};

export default Politics;
