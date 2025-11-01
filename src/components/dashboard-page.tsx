'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { apiModules, type ApiModule } from '@/lib/apis';
import ApiCard from '@/components/api-card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar';
import Header from './header';
import { Skeleton } from '@/components/ui/skeleton';

type ApiModuleWithState = ApiModule & { active: boolean };

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [modules, setModules] = useState<ApiModuleWithState[]>(
    apiModules.map((m) => ({ ...m, active: m.defaultActive }))
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const toggleApiModule = (id: string) => {
    setModules((currentModules) =>
      currentModules.map((mod) =>
        mod.id === id ? { ...mod, active: !mod.active } : mod
      )
    );
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
              Loading dashboard...
            </h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
              API Modules
            </h1>
            <p className="text-muted-foreground">
              Activate, deactivate, and manage your APIs.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modules.map((mod) => (
              <ApiCard
                key={mod.id}
                module={mod}
                onToggle={() => toggleApiModule(mod.id)}
              />
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
