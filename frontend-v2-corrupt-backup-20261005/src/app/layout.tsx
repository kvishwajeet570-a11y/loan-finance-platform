import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "India Loan Finance",
  description:
    "Loan finance platform for customers and DSA partners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
