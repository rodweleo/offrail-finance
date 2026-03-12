import BottomNav from "@/components/BottomNav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased flex flex-col w-full`}>
        <section className="w-full min-h-screen">{children}</section>
        <BottomNav />
      </body>
    </html>
  );
}
