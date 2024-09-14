import { use, useEffect, useRef, useState } from "react";
import styles from "./ShareModal.module.scss";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
export default function ShareModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathName = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showNotification, setShowNotification] = useState(false);
  const t = useTranslations("ShareModal");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!open) return;
      if (!modalRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => (touchStartY = e.changedTouches[0].screenY);
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].screenY;
      if (touchEndY > touchStartY) setOpen(false); 
    }
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [setOpen, open]);

  const copyToClipboard = () => {
    if (inputRef.current) {
      navigator.clipboard
        .writeText(inputRef.current.value)
        .then(() => {
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
          }, 2000);
        })
        .catch((err) => {
          console.error("Error in copying: ", err);
        });
    }
  };

  return (
    <>
    <div
        className={classNames(styles.overlay, { [styles.active]: open })}
      ></div>
      <div ref={modalRef} className={classNames(styles.container, { [styles.active]: open })}>
        <h2 className={styles.title}>{t("Поделиться")}</h2>
        <Image
          onClick={() => setOpen(false)}
          className={styles.close}
          src={"/closeShare.svg"}
          width={14}
          height={14}
          alt="close"
        />
        <div className={styles.links}>
          <Link
            href={`https://vkontakte.ru/share.php?url=${pathName}`}
            target="_blank"
          >
            <Image src={"/VkMb.svg"} width={64} height={64} alt="vk" />
          </Link>
          <Link
            href={`https://telegram.me/share/url?url=${pathName}`}
            target="_blank"
          >
            <Image src={"/TgMb.svg"} width={64} height={64} alt="tg" />
          </Link>
          <Link
            href={`https://twitter.com/intent/tweet?text=${pathName}`}
            target="_blank"
          >
            <Image
              src={"/TwitterMb.svg"}
              width={64}
              height={64}
              alt={"twitter"}
            />
          </Link>
          <Link
            href={`https://api.whatsapp.com/send/?text=${pathName}`}
            target="_blank"
          >
            <Image src={"/WpMb.svg"} width={64} height={64} alt={"wp"} />
          </Link>
          <Link href={`${pathName}`} target="_blank">
            <Image src={"/FbMb.svg"} width={64} height={64} alt={"fb"} />
          </Link>
        </div>
        <h3 className={styles.copy_title}>{t("Скопировать")}</h3>
        <div className={styles.input_container}>
          <div
            className={classNames(styles.notification, {
              [styles.active]: showNotification,
            })}
          >
            {t("Ссылка скопирована")}
          </div>
          <Image
            onClick={copyToClipboard}
            className={styles.image}
            src={"/shareIcon.svg"}
            width={18}
            height={20}
            alt="copy"
          />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={`https://teleshtorm.org${pathName}`}
            aria-label={t("Ссылка на канал")}
            readOnly
          />
        </div>
      </div>
    </>
  );
}
