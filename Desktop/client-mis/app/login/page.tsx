//Global
import React from "react";

//Utils
import { REGISTRATION_ROUTE } from "@/utils/Consts";

//Components
import { LogInComponent } from "@/components/LogInComponent/LogInComponent";

export default function LogIn() {
  return <LogInComponent route={REGISTRATION_ROUTE} />;
}
