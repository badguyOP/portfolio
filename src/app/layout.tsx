import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import WebGLBackground from "@/components/canvas/WebGLBackground";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { LoadProvider } from "@/context/LoadContext";
import Preloader from "@/components/ui/Preloader";
import ScrollOverlay from "@/components/ui/ScrollOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
import Nav from "@/components/ui/Nav";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

// 1. Primary Display Font (Massive, Wide)
const oneMore = localFont({
  src: "./fonts/TbjOneMore.ttf",
  variable: "--font-one-more",
  display: "swap",
});

// 2. Secondary Font (Clean, UI, Paragraphs)
const gambio = localFont({
  src: "./fonts/GcGambioSans.ttf",
  variable: "--font-gambio",
  display: "swap",
});

// 3. Accent Font (Elegant, Italic Serifs)
const onceAfter = localFont({
  src: [
    { path: "./fonts/GconceafterRegular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/GconceafterItalic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-once-after",
  display: "swap",
});

const agno = localFont({
  src: "./fonts/Agnotech.ttf",
  variable: "--font-agno",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atharv.is-a-good.dev"),
  title: {
    default: "AC :)",
    template: "%s | AC :)",
  },
  description: "Just a Human, trying to achieve the extraordinary",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "AC :)",
    description: "Just a Human, trying to achieve the extraordinary",
    url: "https://atharv.is-a-good.dev",
    siteName: "Anish's Portfolio",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AC :)",
    description: "Just a Human, trying to achieve the extraordinary",
    creator: "@AGachchi",
    site: "@AGachchi",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Added cursor-none to hide default mouse */}
      <body className={`${gambio.className} ${oneMore.variable} ${gambio.variable} ${onceAfter.variable} ${agno.className} `}>
        <LoadProvider>
          <SmoothScroll>
            <Preloader />
            <WebGLBackground />
            <ScrollOverlay /> 
            <CustomCursor />
            <Nav />
            <main className="relative z-10 w-full min-h-screen">
              {children}
            </main>
          </SmoothScroll>
        </LoadProvider>
        <Analytics />
        {/*
          Required for the CMS at /admin: invite/reset-password emails from
          Netlify Identity link back to this root page with a token in the
          URL. This widget is what catches that token and shows the
          "set your password" modal — without it, clicking the invite link
          just loads the homepage and does nothing.
        */}
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="afterInteractive" />
        <Script id="netlify-identity-redirect" strategy="afterInteractive">
          {`
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", (user) => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}