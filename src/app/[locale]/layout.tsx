import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { esES, enUS } from "@clerk/localizations";
import { EdgeStoreProvider } from "../../lib/edgestore";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { unstable_setRequestLocale } from "next-intl/server";
import { locales } from "@/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Volt Riders",
  description: "Página web del club de movilidad eléctrica Volt Riders",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: {
    locale: "en" | "es";
  };
};

const RootLayout: React.FC<Props> = ({ children, params: { locale } }) => {
  unstable_setRequestLocale(locale);
  const messages = useMessages();
  return (
    <ClerkProvider localization={esES}>
      <html
        lang={locale}
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <body className={inter.className}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <EdgeStoreProvider>{children}</EdgeStoreProvider>
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
