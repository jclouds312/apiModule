'use client';

import { useState } from 'react';
import { apiModules, type ApiModule } from '@/lib/apis';
import ApiCard from '@/components/api-card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar';
import Header from './header';
import { useUser } from '@/firebase';
import AuthForm from './auth-form';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type ApiModuleWithState = ApiModule & { active: boolean };

function ApiModulesGrid() {
  const [modules, setModules] = useState<ApiModuleWithState[]>(
    apiModules.map((m) => ({ ...m, active: m.defaultActive }))
  );

  const toggleApiModule = (id: string) => {
    setModules((currentModules) =>
      currentModules.map((mod) =>
        mod.id === id ? { ...mod, active: !mod.active } : mod
      )
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
          API Modules
        </h1>
        <p className="text-muted-foreground">
          Activate, deactivate, and manage your APIs.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {modules.map((mod) => (
          <ApiCard
            key={mod.id}
            module={mod}
            onToggle={() => toggleApiModule(mod.id)}
          />
        ))}
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { user, loading } = useUser();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={user ? "lg:col-span-3" : "lg:col-span-2"}>
              <ApiModulesGrid />
            </div>
            {!user && !loading && (
               <div className="lg:col-span-1">
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl font-headline">Get Started</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <AuthForm type="login" />
                   </CardContent>
                 </Card>
               </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
