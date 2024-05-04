//Global
import React, { FC } from "react";
import Link from "next/link";

//Components
import { Button } from "@nextui-org/react";

//Types
import { IEmptyComponentProps } from "@/types/types";

const EmptyComponent: FC<IEmptyComponentProps> = ({
  route,
  title,
  text,
  buttonText,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-[40px] text-center text-tiffani family-medium mb-[20px]">
        {title}
      </h1>
      <p className="text-gray/500 mb-[40px] text-center">{text}</p>
      <Button className="bg-tiffani text-white rounded-md w-[278px] h-[51px] py-[10px]">
        <Link
          className="w-full h-full flex items-center justify-center"
          href={route}
        >
          {buttonText}
        </Link>
      </Button>
    </div>
  );
};

export { EmptyComponent };
