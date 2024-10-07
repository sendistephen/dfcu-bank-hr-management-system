"use server";
import { CommandIcon, HomeIcon, Users } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { signOut } from "@/auth";
import { Toaster } from "sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-white p-4">
      {/* Sidebar */}
      <div className="w-full sm:w-64 flex flex-col">
        <div className="p-4">
          <Image
            src="/logo.png"
            alt="dfcu logo"
            width={80}
            height={80}
            priority
          />
        </div>
        <nav className="mt-6 flex-grow">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/employees">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Employees
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/generate-code">
                <Button variant="ghost" className="w-full justify-start">
                  <CommandIcon className="mr-2 h-4 w-4" />
                  Generate Code
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          {/* <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form> */}
        </div>
      </div>

      {/* Main content - page-specific content goes here */}
      <div className="flex-1 overflow-auto p-8 mt-16">{children}</div>
      <Toaster />
    </div>
  );
}
