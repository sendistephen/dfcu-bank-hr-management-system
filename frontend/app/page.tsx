import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center p-4 bg-white rounded">
        <div className="flex flex-col gap-4">
          <Image
            src="/logo.png"
            alt="dfcu logo"
            width={80}
            height={80}
            priority
          />
          <div>
            <h3 className="text-2xl font-black">HR Management System</h3>
            <p className="text-sm text-neutral-500">
              Welcome to HR Management System
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <Link href="/staff/new" className="flex flex-col">
              <Button variant="outline">Staff Registration</Button>
            </Link>
            <Link href="/login" className="flex flex-col">
              <Button variant="secondary">Admin login</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
