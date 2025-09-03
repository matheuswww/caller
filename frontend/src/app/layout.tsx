import "./globals.css";

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