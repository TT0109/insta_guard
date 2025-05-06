import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AutoNotifications from "./components/AutoNotifications";
import AutoUserMessages from "./components/AutoUserMessages";
import { PaymentProvider } from "./components/payment/PaymentContext";
import { Suspense } from "react";
import gtmBody from "./scripts/gtm-body";
import Head from "./head";
import CheckoutRedirect from "./components/CheckoutRedirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
  
export const metadata: Metadata = {
  title: "Instagram Guard",
  description: "Instagram Guard", 
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //commit
  return (
    <html lang="en">
      <Head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div dangerouslySetInnerHTML={{ __html: gtmBody }} />  
       <Suspense>
        <PaymentProvider>
          <CheckoutRedirect />
          {children}
          <AutoNotifications />
          <AutoUserMessages />
        </PaymentProvider>
        </Suspense>
      </body>
    </html>
  );
}
