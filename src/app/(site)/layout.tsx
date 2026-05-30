import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { AppCheckInit } from "@/components/site/AppCheckInit";
import { MainSpacer } from "@/components/site/MainSpacer";
import { VisitTracker } from "@/components/site/VisitTracker";

/** Public site shell — wraps every public page with nav, footer, and scroll behaviour. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppCheckInit />
      <VisitTracker />
      <SmoothScroll />
      <ScrollProgress />
      <Nav />
      <MainSpacer>{children}</MainSpacer>
      <Footer />
      <ScrollToTop />
    </>
  );
}
