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
      {/* The home hero sits flush under the transparent nav; inner pages clear it
          via their first section's top padding (see SitePage wrapper below). */}
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
