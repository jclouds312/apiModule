'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import Header from '@/components/header';
import IntegrationsManager from '@/components/integrations-manager';
import { useUser } from '@/firebase';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function SettingsContent() {
    const { user, loading } = useUser();

    if (loading) {
        return (
             <div className="flex items-center justify-center h-[50vh]">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
             <motion.div 
                className="flex justify-center items-center h-[50vh]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Acceso Denegado</CardTitle>
                        <CardDescription>Debes iniciar sesión para ver los ajustes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login">Ir a Iniciar Sesión</Link>
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
                Settings
                </h1>
                <p className="text-muted-foreground">
                Gestiona las integraciones y configuraciones de tus APIs.
                </p>
            </div>
            <IntegrationsManager />
        </>
    );
}


export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <motion.main 
          className="p-4 md:p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <SettingsContent />
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  );
}
