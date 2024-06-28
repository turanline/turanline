//Global
import React from "react";

//Utils
import { FIRST_STAGE_ROUTE } from "@/utils/Consts";

//Components
import { LogInComponent } from "@/components/LogInComponent/LogInComponent";

export default function LogIn() {
  return <LogInComponent route={FIRST_STAGE_ROUTE} />;
}
