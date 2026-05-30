import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { AppCheckInit } from "@/components/site/AppCheckInit";

/** Public site shell — wraps every public page with nav, footer, and scroll behaviour. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppCheckInit />
      <SmoothScroll />
      <ScrollProgress />
      <Nav />
      {/* Padding offsets the fixed header so content isn't hidden underneath. */}
      <main className="pt-20">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
