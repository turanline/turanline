import React, { FC, useEffect, ChangeEvent, useState, DragEvent } from "react";
import Link from "next/link";
import { Icons } from "../../Icons/Icons";
import { Button } from "@nextui-org/react";
import { useTranslate } from "@/hooks/useTranslate";
import { putProductReciept } from "@/services/productsAPI";
import "./ModalImport.scss";
import { showToastMessage } from "@/app/toastsChange";

const ModalImport: FC<any> = ({ isOpen, setIsOpen, receiptId }) => {
  const text = useTranslate();

  const [isDragging, setIsDragging] = useState(false);
  const [table, setTable] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileClassName = `file-upload-wrapper ${isDragging && "dragging"}`;
  const dragingClassName = `import-icon ${isDragging && "active"}`;
  const wrapperClassName = `import-wrapper ${isOpen && "active"}`;
  const contentClassName = `import-content ${isOpen && "active"}`;

  const setOpen = () => setIsOpen(false);
  const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTable(e.target.files[0]);
    }
  };



  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setTable(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };


  const convertToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
    

  const handleSendReceipt = async () => {
    if (!table) return;

    setIsLoading(true);

    try {
        const check_file = await convertToBase64(table); 

        const changes = {
          // id: 0,
          // delivery: {
          //   id: 0,
          //   price: "100",
          //   days_min: 7,
          //   days_max: 9,
          //   city: 3,
          //   tariff: 3
          // },
          check_file: check_file,
          // order_id: receiptId,
          // total_sum: "-"
        }

        

        await putProductReciept(receiptId, changes); 
        setOpen();
        setTable(null);
        setIsLoading(false);
        showToastMessage('success','Чек успешно загружен !')
    } catch (error) {
        setIsLoading(false);
        showToastMessage('error','Произошла ошибка при загруке')
    }
};

  const renderButtons = () => {
    if (!table?.name) {
      return (
        <label htmlFor="file-upload" className="file-upload-label">
          {text.importButton}
        </label>
      );
    }

    return (
      <Button className="file-upload-label" onClick={handleSendReceipt}>
        Отправить
      </Button>
    );
  };

  const renderModalContent = () => {
    if (isLoading) return <Icons id="spiner" />;

    return (
      <>
        <div
          className={fileClassName}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={dragingClassName}>
            <Icons id="importPlus" />
          </div>

          <input
            required
            type="file"
            id="file-upload"
            className="file-upload-input"
            onChange={handleChangeInput}
          />

          <h5 className="import-title">{text.importTitle}</h5>

          {renderButtons()}

          {table && (
            <span className="file-upload-filename">
              {text.selectedFile}: {table.name}
            </span>
          )}
        </div>

        <div onClick={setOpen} className="delete-icon">
          <Icons id="deleteCard" />
        </div>
      </>
    );
  };

  return (
    <div onClick={setOpen} className={wrapperClassName}>
      <div onClick={stopPropagation} className={contentClassName}>
        {renderModalContent()}
      </div>
    </div>
  );
};

export default ModalImport;