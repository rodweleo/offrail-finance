import BottomNav from "@/components/BottomNav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
