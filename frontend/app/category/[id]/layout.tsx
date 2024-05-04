"use client";

//Global
import { useState, useEffect } from "react";
import { AxiosError } from "axios";

//Icons
import { Icons } from "@/components/Icons/Icons";
import { getCategoryById } from "@/services/categoriesAPI";

export default function categoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  async function getCategory() {
    try {
      const { rows } = await getCategoryById(params?.id);

      return {
        category: rows,
        error: null,
      };
    } catch (e) {
      const error = e as AxiosError;

      return {
        category: null,
        error,
      };
    }
  }

  useEffect(() => {
    (async () => {
      const { error } = await getCategory();

      if (error) {
        setError(error);
      }

      setIsSuccess(true);
    })();
  }, []);

  if (error) console.error(error);

  if (!isSuccess) return <Icons id="spiner" />;

  return <div>{children}</div>;
}
