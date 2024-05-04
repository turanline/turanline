"use client";

//GloBal
import { useState, useEffect } from "react";
import { getProductBySlug } from "@/services/productsAPI";
import { AxiosError } from "axios";

//Icons
import { Icons } from "@/components/Icons/Icons";

export default function ProductsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    isSuccessData();
  }, []);

  async function getCard() {
    try {
      const { rows } = await getProductBySlug(params?.slug);

      return {
        goods: rows,
        error: null,
      };
    } catch (e) {
      const error = e as AxiosError;

      return {
        goods: null,
        error,
      };
    }
  }

  async function isSuccessData() {
    try {
      const { error } = await getCard();

      if (error) {
        setError(error);
      }

      setIsSuccess(true);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  if (!isSuccess) return <Icons id="spiner" />;

  return <div>{children}</div>;
}
