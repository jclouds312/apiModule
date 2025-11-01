'use client';

import AuthForm from '@/components/auth-form';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import VantaBackground from '@/components/vanta-background';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Loading...</p></div>;
  }

  return (
    <>
      <VantaBackground />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <div className="absolute top-8 left-8">
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                <Terminal className="h-7 w-7 text-primary" />
                <span className="text-lg font-semibold font-headline">Modular APIs</span>
            </Link>
        </div>
        <Card className="w-full max-w-md bg-card/80 dark:bg-card/60 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>Join to start managing your APIs.</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="register" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
