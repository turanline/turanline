//Global
import { ToastContainer } from "react-toastify";

//Components
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";

//Redux-Wrapper
import { ProviderComponent } from "@/redux/provider";

//Styles
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/other/logo.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <ProviderComponent>
          <div className="wrapper">
            <Header />

            <main className="main">{children}</main>

            <Footer />
          </div>
        </ProviderComponent>

        <ToastContainer />
      </body>
    </html>
  );
}
