//Components
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import '../globals.scss'


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        <Header />
        {children}
        {/* <Footer /> */}
      </>
  );
}
