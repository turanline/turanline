'use client'

import styles from "./Modal.module.scss";
import cn from "classnames";
import Form from "./Form";
import { useEffect } from "react";

const active = cn(styles.close, styles.overlay);
export default function Modal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);
  
  return (
    <div
      onClick={() => {
        setOpen(false);
      }}
      className={open ? styles.overlay : active}
    >
      <Form setOpen={setOpen}/>
    </div>
  );
}
