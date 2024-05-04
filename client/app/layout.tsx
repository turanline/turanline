"use client";

//Global
import { ToastContainer } from "react-toastify";
import { useEffect, useState, useMemo, createContext } from "react";
import { AxiosError } from "axios";

//Hooks
import { useCart } from "@/hooks/useCart";

//Services
import { postTokenRefresh, postVerifyToken } from "@/services/authAPI";
import { getFavorites } from "@/services/favoritesAPI";

//Components
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

//Redux-Wrapper
import { ProviderComponent } from "@/redux/provider";

//Types
import {
  IProductMainPage,
  IContext,
  IUserResponse,
  IProductCart,
} from "@/types/types";

//Styles
import "./globals.css";

export const SidebarContext = createContext<IContext>({
  favorites: [],
  setFavorites: () => {},
  userCart: [],
  setUserCart: () => {},
  isActive: false,
  setIsActive: () => {},
});

export async function getUser(): Promise<IUserResponse> {
  try {
    const authToken = localStorage.getItem("AuthTokenMis");
    const refToken = localStorage.getItem("AuthTokenMisRef");

    if (!authToken || !refToken) {
      return {
        status: 401,
        error: new Error("User not authenticated"),
      };
    }

    await postVerifyToken(authToken);

    return {
      status: 200,
      error: null,
    };
  } catch (e) {
    const error = e as AxiosError;
    if (error.response && error.response.status === 401) {
      try {
        await postTokenRefresh();
        return await getUser();
      } catch (refreshError) {
        return {
          status: 401,
          error: refreshError,
        };
      }
    } else {
      return {
        status: 401,
        error: error,
      };
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [userCart, setUserCart] = useState<IProductCart[]>([]);
  const [favorites, setFavorites] = useState<IProductMainPage[]>([]);

  const { fetchCart } = useCart();

  useEffect(() => {
    isAuthUser();
  }, []);

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  useEffect(() => {
    if (isActive) fetchCart().catch(error => console.log(error));
  }, [isActive, fetchCart]);

  async function fetchUserFavorites() {
    try {
      const token = localStorage.getItem("AuthTokenMis");

      if (token) {
        const { user } = await postVerifyToken(token);
        const allFavorites = await getFavorites(user);

        setFavorites(allFavorites);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async function isAuthUser() {
    try {
      const { status } = await getUser();

      if (status === 200) setIsActive(true);
    } catch (error) {
      setIsActive(false);
      throw new Error(`${error}`);
    }
  }

  const contextValue = useMemo(
    () => ({
      favorites,
      setFavorites,
      userCart,
      isActive,
      setIsActive,
      setUserCart,
    }),
    [userCart, isActive, favorites]
  );

  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logotype.png" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <ProviderComponent>
          <div className="wrapper">
            <Header
              favorites={favorites}
              isActive={isActive}
              userCart={userCart}
            />

            <SidebarContext.Provider value={contextValue}>
              <main className="main">{children}</main>
            </SidebarContext.Provider>

            <Footer />
          </div>
        </ProviderComponent>

        <ToastContainer />
      </body>
    </html>
  );
}
