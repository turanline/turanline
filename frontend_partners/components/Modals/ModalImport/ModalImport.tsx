import React, { FC, useEffect, ChangeEvent, useState, DragEvent } from "react";
import Link from "next/link";
import { Icons } from "../../Icons/Icons";
import { Button } from "@nextui-org/react";
import { IMPORT_INSTRUCTION } from "@/utils/Consts";
import { IModalImportProps } from "@/types/componentsTypes";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useExcelTable } from "@/hooks/useExcelTable";
//Styles
import "./ModalImport.scss";

const ModalImport: FC<IModalImportProps> = ({ isOpen, setIsOpen }) => {
  const { postExcelTable, isLoading, table, setTable, handleResetFileInput, fileInputRef} = useExcelTable(isOpen, setIsOpen);
  const text = useTranslate();

  const [isDragging, setIsDragging] = useState(false);

  const fileClassName    = `file-upload-wrapper ${isDragging && "dragging"}`;
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

  const renderButtons = () => {
    if (!table?.name) {
      return (
        <label htmlFor="file-upload" className="file-upload-label">
          {text.importButton}
        </label>
      );
    }

    return (
      <Button className="file-upload-label" onClick={handleResetFileInput}>
        {text.buttonResetFile}
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
            ref={fileInputRef}
            required
            type="file"
            id="file-upload"
            className="file-upload-input"
            onChange={handleChangeInput}
          />

          <h5 className="import-title">{text.importTitle}</h5>

          <span className="import-text">
            <Link
              href={IMPORT_INSTRUCTION}
              target="_blank"
              className="import-link"
            >
              {text.importLink}
            </Link>{" "}
            {text.importText}
          </span>

          {renderButtons()}

          {table && (
            <span className="file-upload-filename">
              {text.selectedFile}: {table.name}
            </span>
          )}
        </div>

        <Button onClick={postExcelTable} className="import-button">
          <Icons id="import" />
          {text.importConfirm}
        </Button>

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