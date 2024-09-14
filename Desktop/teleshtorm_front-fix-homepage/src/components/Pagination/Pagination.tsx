"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./Pagination.module.scss";
import Link from "next/link";
import { BackButton, ForwardButton } from "../svgs";
import cn from "classnames";
import { useSearchParams, useRouter } from "next/navigation";
import { getTotalPages } from "@/helpers/getTotalPages";

const active = cn(styles._active, styles.link);

export default function Pagination({ data }: { data: any }) {
  const [pageNumber, setPageNumber] = useState(1);
  const router = useRouter();
  const pageParams = useSearchParams();

  const totalPages = useMemo(() => getTotalPages(pageNumber, data), [pageNumber, data]);
  const params = useMemo(() => new URLSearchParams(pageParams), [pageParams]);

  const getCurrentQuery = useMemo(() => {

    return (page: number) => {
      const newParams = new URLSearchParams(params);
      if (page > 0) {
        newParams.set("page", String(page));
      } else {
        newParams.delete("page");
      }
      return `?${newParams.toString()}`;
    };

  }, [params]);

  const handleClick = (page: number) => {
    const newParams = new URLSearchParams(params);

    if (page > 0){
      newParams.set("page", String(page));
    } else{
      newParams.delete("page");
    }
    
    setPageNumber(page);
    router.replace(`?${newParams.toString()}`);
  };

  useEffect(() => {
    const page = pageParams.get("page");
    if (page) setPageNumber(Number(page));
    
  }, [pageParams]);


  return (
    <div className={styles.container}>
      {pageNumber > 1 && (
        <div
          onClick={() => handleClick(pageNumber - 1)}
          className={styles.next_button}
        >
          <BackButton style={{ transform: "rotate(180deg)" }} />
        </div>
      )}
      <div className={styles.counter}>
        {totalPages && totalPages.length > 0
          ? totalPages.map((item, index) => (
              <Link
                key={index}
                href={getCurrentQuery(item)}
                className={pageNumber === item ? active : styles.link}
              >
                <p style={{ margin: "0", padding: "0" }}>{item}</p>
              </Link>
            ))
          : (
              <Link href={getCurrentQuery(1)} className={active}>
                <p style={{ margin: "0", padding: "0" }}>1</p>
              </Link>
            )}
      </div>
      {totalPages && pageNumber < totalPages[totalPages.length - 1] && (
        <div
          onClick={() => handleClick(pageNumber + 1)}
          className={styles.next_button}
        >
          <ForwardButton />
        </div>
      )}
    </div>
  );
}
