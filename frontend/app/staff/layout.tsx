import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-white w-full px-6 py-4">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="dfcu logo"
            width={80}
            height={80}
            priority
          />
        </Link>
      </nav>
      <main className="flex-1 bg-neutral-200 px-4 md:px-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
