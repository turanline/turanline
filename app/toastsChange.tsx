//Global
import { toast } from "react-toastify";
//Styles
import "./globals.scss";
import "react-toastify/dist/ReactToastify.css";

export const showToastMessage = (status: "error" | "success" | "warn", message: string) => {
  toast[status](message, {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    style: { borderRadius: 8, textAlign: "left" },
  });
};
