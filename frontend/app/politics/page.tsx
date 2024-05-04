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
  const text = useTranslate();

  return (
    <main className="politics-wrapper">
      <div className="politics-content">
        <div className="politics-content_header">
          <span className="politics-content_header-span">
            {text.footerPolitics}
          </span>

          <h5 className="politics-content_header-title">{SHOP_NAME}</h5>
        </div>
        <div className="politics-content_wrapper">
          <p className="politics-content_text">
            1. {text.politicsGeneralProvisions}
          </p>
          <p className="politics-content_text">
            {text.politicsGeneralProvisionsText}
          </p>
          <p className="politics-content_text">1.1. {text["politics.1.1"]}</p>
          <p className="politics-content_text">1.2. {text["politics.1.2"]}</p>
          <p className="politics-content_text">2. {text["politics.2"]}</p>
          <p className="politics-content_text">2.1. {text["politics.2.1"]}</p>
          <p className="politics-content_text">2.2. {text["politics.2.2"]}</p>
          <p className="politics-content_text">2.3. {text["politics.2.3"]}</p>
          <p className="politics-content_text">2.4. {text["politics.2.4"]}</p>
          <p className="politics-content_text">2.5. {text["politics.2.5"]}</p>
          <p className="politics-content_text">2.6. {text["politics.2.6"]}</p>
          <p className="politics-content_text">2.7. {text["politics.2.7"]}</p>
          <p className="politics-content_text">2.8. {text["politics.2.8"]}</p>
          <p className="politics-content_text">2.9. {text["politics.2.9"]}</p>
          <p className="politics-content_text">2.10. {text["politics.2.10"]}</p>
          <p className="politics-content_text">2.11. {text["politics.2.11"]}</p>
          <p className="politics-content_text">2.12. {text["politics.2.12"]}</p>
          <p className="politics-content_text">2.13. {text["politics.2.13"]}</p>
          <p className="politics-content_text">2.14. {text["politics.2.14"]}</p>
          <p className="politics-content_text">3. {text["politics.3"]}</p>
          <p className="politics-content_text">3.1. {text["politics.3.1"]}</p>
          <p className="politics-content_text">— {text["politics.3.line.1"]}</p>
          <p className="politics-content_text">— {text["politics.3.line.2"]}</p>
          <p className="politics-content_text">— {text["politics.3.line.3"]}</p>
          <p className="politics-content_text">3.2. {text["politics.3.2"]}</p>
          <p className="politics-content_text">
            — {text["politics.3.2.line.1"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.3.2.line.2"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.3.2.line.3"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.3.2.line.4"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.3.2.line.5"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.3.2.line.6"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.3.2.line.7"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.3.2.line.8"]}
          </p>
          <p className="politics-content_text">4. {text["politics.4"]}</p>
          <p className="politics-content_text">4.1. {text["politics.4.1"]}</p>
          <p className="politics-content_text">
            — {text["politics.4.1.line.1"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.4.1.line.2"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.4.1.line.3"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.4.1.line.4"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.4.1.line.5"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.4.1.line.6"]}
          </p>
          <p className="politics-content_text">4.2. {text["politics.4.2"]}</p>
          <p className="politics-content_text">
            — {text["politics.4.2.line.1"]}
          </p>
          <p className="politics-content_text">
            — {text["politics.4.2.line.2"]}
          </p>
          <p className="politics-content_text">4.3. {text["politics.4.3"]}</p>
          <p className="politics-content_text">5. {text["politics.5"]}</p>
          <p className="politics-content_text">5.1. {text["politics.5.1"]}</p>
          <p className="politics-content_text">5.2. {text["politics.5.2"]}</p>
          <p className="politics-content_text">5.3. {text["politics.5.3"]}</p>
          <p className="politics-content_text">5.4. {text["politics.5.4"]}</p>
          <p className="politics-content_text">5.5. {text["politics.5.5"]}</p>
          <p className="politics-content_text">5.6. {text["politics.5.6"]}</p>
          <p className="politics-content_text">5.7. {text["politics.5.7"]}</p>
          <p className="politics-content_text">6. {text["politics.6"]}</p>
          <p className="politics-content_text">{text["politics.6.targets"]}</p>
          <li className="politics-content_text">{text["politics.6.dot.1"]}</li>
          <p className="politics-content_text">{text["politics.6.personal"]}</p>
          <li className="politics-content_text"> {text["politics.6.dot.2"]}</li>
          <p className="politics-content_text">{text["politics.6.grounds"]}</p>
          <li className="politics-content_text">{text["politics.6.dot.3"]}</li>
          <p className="politics-content_text">
            {text["politics.6.personal.2"]}
          </p>
          <li className="politics-content_text">{text["politics.6.dot.4"]}</li>
          <p className="politics-content_text">7. {text["politics.7"]}</p>
          <p className="politics-content_text">7.1. {text["politics.7.1"]}</p>
          <p className="politics-content_text">7.2. {text["politics.7.2"]}</p>
          <p className="politics-content_text">7.3. {text["politics.7.3"]}</p>
          <p className="politics-content_text">7.4. {text["politics.7.4"]}</p>
          <p className="politics-content_text">7.5. {text["politics.7.5"]}</p>
          <p className="politics-content_text">7.6. {text["politics.7.6"]}</p>
          <p className="politics-content_text">7.7. {text["politics.7.7"]}</p>
          <p className="politics-content_text">8. {text["politics.8"]}</p>
          <p className="politics-content_text">{text["politics.8.text"]}</p>
          <p className="politics-content_text">8.1. {text["politics.8.1"]}</p>
          <p className="politics-content_text">8.2. {text["politics.8.2"]}</p>
          <p className="politics-content_text">8.3. {text["politics.8.3"]}</p>
          <p className="politics-content_text">8.4. {text["politics.8.4"]}</p>
          <p className="politics-content_text">{text["politics.8.4.text"]}</p>
          <p className="politics-content_text">8.5. {text["politics.8.5"]}</p>
          <p className="politics-content_text">8.6. {text["politics.8.6"]}</p>
          <p className="politics-content_text">8.7. {text["politics.8.7"]}</p>
          <p className="politics-content_text">8.8. {text["politics.8.8"]}</p>
          <p className="politics-content_text">8.9. {text["politics.8.9"]}</p>
          <p className="politics-content_text">9. {text["politics.9"]}</p>
          <p className="politics-content_text">9.1. {text["politics.9.1"]}</p>
          <p className="politics-content_text">9.2. {text["politics.9.2"]}</p>
          <p className="politics-content_text">10. {text["politics.10"]}</p>
          <p className="politics-content_text">10.1. {text["politics.10.1"]}</p>
          <p className="politics-content_text">10.2. {text["politics.10.2"]}</p>
          <p className="politics-content_text">11. {text["politics.11"]}</p>
          <p className="politics-content_text">{text["politics.11.text"]}</p>
          <p className="politics-content_text">12. {text["politics.12"]}</p>
          <p className="politics-content_text">12.1. {text["politics.12.1"]}</p>
          <p className="politics-content_text">12.2. {text["politics.12.2"]}</p>
          <p className="politics-content_text">12.3. {text["politics.12.3"]}</p>
        </div>
      </div>
    </main>
  );
};

export default Politics;
