"use client";
//glogal
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//icons
import { Icons } from "@/components/Icons/Icons";

export default function deliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
