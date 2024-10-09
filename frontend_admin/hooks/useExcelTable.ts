'use client'
//Global
import { useState, useRef, SetStateAction, Dispatch } from "react";
import { showToastMessage } from "@/app/toastsChange";
//Hooks
import { useUserActions } from "./useUserActions";
import { useTranslate } from "./useTranslate";
//Services
import { getProviderExport, postProviderImport } from "@/services/providerAPI";


export const useExcelTable = (isOpen: boolean,setIsOpen: Dispatch<SetStateAction<boolean>>) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [table, setTable] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { onGetProviderGoods } = useUserActions();

  const translate = useTranslate()

  const getExcelTable = () => {
    getProviderExport()
      .then(data => {
        if ("last_downloaded_file" in data && data.last_downloaded_file) {
          window.location.href = data.last_downloaded_file;
          return;
        }
      })
      .catch(() => {
        showToastMessage("error",translate.notifyUnSuccessExportTable);
      });
  };

  const handleResetFileInput = () => {
    setTable(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const postExcelTable = () => {
    const tableData = new FormData(),
      tableExtension = table?.name.split(".").pop()?.toLowerCase(),
      fileExtensions = "xlsx";

    if (table) {
      if (tableExtension && !fileExtensions.includes(tableExtension)) {
        showToastMessage("warn", translate.notifyFomatFile);
        return;
      }

      setIsLoading(true);
      tableData.append("file", table);

      try {
       postProviderImport(tableData)
          .then((response) => {
            if(response){
              onGetProviderGoods();
              showToastMessage("success", translate.notifyWaitAddTable );
            }else{
              showToastMessage("error", translate.notifyErrorAddTable);
            }
          })
          .catch(error => {
            showToastMessage("error", translate.notifyErrorAddTable);
          })
          .finally(() => {
            setIsOpen(false);
            handleResetFileInput();
          });
      } catch (error) {
        showToastMessage("warn",translate.notifyErrorAddTable);
      }
    } else showToastMessage("warn", translate.notifyDontChoseFile);
  };

  return {
    getExcelTable,
    postExcelTable,
    isLoading,
    table,
    setTable,
    handleResetFileInput,
    fileInputRef,
    isOpen,
    setIsOpen,
  };
};
