import "./globals.css";

export const metadata = {
  icons: {
    icon: "/img/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html translate="no">
      <body translate="no">
        {children}
      </body>
    </html>
  );
}