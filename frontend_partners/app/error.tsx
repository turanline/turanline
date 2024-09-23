"use client";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Components
import { Button } from "@nextui-org/react";

export default function Error({error,reset}: {error: Error & { digest?: string };reset: () => void}) {

  const { emptyBasketButtonText, errorPageTitle, errorPageText } = useTranslate();


  return (
    <div className="h-[358px] flex justify-center items-center flex-col gap-[40px]">
      <div className="flex flex-col items-center gap-[20px]">
        <h5 className="text-tiffani font-medium text-[35px]">
          {errorPageTitle}
        </h5>

        <p className="text-gray/500 text-[16px] w-full max-w-[640px] text-center">
          {errorPageText}
        </p>
      </div>

      <Button
        className="w-[187px] h-[44px] flex justify-center items-center bg-tiffani text-white rounded-[5px] py-[10px] px-[20px] text-[14px]"
        onClick={() => reset()}
      >
        {emptyBasketButtonText}
      </Button>
    </div>
  );
}
