//Global
import React from "react";

//Styles
import "./provider.scss";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
