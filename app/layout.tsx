//Global
import { ToastContainer } from "react-toastify";

//Components
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
//Redux-Wrapper
import { ProviderComponent } from "@/redux/provider";

//Styles
import "./globals.scss";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <title>TuranLine</title>
      </head>
      <body>
        <ProviderComponent>
          <div className="wrapper">
            {/* <Header /> */}
            {children}
            {/* <Footer /> */}
          </div>
        </ProviderComponent>

        <ToastContainer />
      </body>
    </html>
  );
}
