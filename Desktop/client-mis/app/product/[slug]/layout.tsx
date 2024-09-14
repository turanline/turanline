"use client";

//GloBal
import { useState, useEffect } from "react";

//Icons
import { Icons } from "@/components/Icons/Icons";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    isSuccessData();
  }, []);

  async function isSuccessData() {
    try {
      setIsSuccess(true);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  if (!isSuccess) return <Icons id="spiner" />;

  return <div>{children}</div>;
}
