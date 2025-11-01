'use client';

import AuthForm from '@/components/auth-form';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Terminal } from 'lucide-react';


export default function RegisterPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">Modular APIs Hub</span>
            </div>
            <p className="text-muted-foreground">
              Create an account to get started.
            </p>
        </div>
        <AuthForm type="register" />
      </div>
    </div>
  );
}
