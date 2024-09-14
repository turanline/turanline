"use client";
// Global
import { useEffect } from "react";
import { redirect } from "next/navigation";
// Redux
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
// Icons
import { Icons } from "@/components/Icons/Icons";
import { LOGIN_ROUTE } from "@/utils/Consts";
//Styles
import './product.scss';

export default function ProductLayout({children}: {children: React.ReactNode}) {
    
  const { isProviderAuth ,status} = useTypedSelector(state => state.user);
  const { onGetUser } = useUserActions();

  //checkAuth
  useEffect(() => {
    onGetUser();    
  }, [onGetUser]);

  useEffect(() => {
    if (!isProviderAuth && status === "fulfilled") redirect(LOGIN_ROUTE);

  }, [isProviderAuth, status]);

  if(!isProviderAuth)
  return(
      <div className="products-content_spiner">
        <Icons id="spiner" />
      </div>
  );


  return <div className="product-wrapper">{children}</div>;
}
