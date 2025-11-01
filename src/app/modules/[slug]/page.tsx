
'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import Header from '@/components/header';
import { apiModules } from '@/lib/apis';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AiPlayground from '@/components/ai-playground';
import GoogleMapsTool from '@/components/google-maps-tool';
import VoiceQuoteTool from '@/components/voice-quote-tool';

const categoryStyles: Record<string, string> = {
    'Commerce': 'text-green-500 bg-green-500/10 border-green-500/20',
    'Reservations': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'Location': 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    'AI': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    'Voice': 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    'System': 'text-slate-500 bg-slate-500/10 border-slate-500/20'
};

const ModuleTools: Record<string, React.ComponentType> = {
    'gemini-ai': AiPlayground,
    'google-maps': GoogleMapsTool,
    'voice-to-text': VoiceQuoteTool,
}

export default function ModuleDetailPage({ params }: { params: { slug: string } }) {
  const module = apiModules.find((m) => m.id === params.slug);

  if (!module) {
    notFound();
  }

  const { name, description, Icon, category } = module;
  const categoryStyle = categoryStyles[category] || categoryStyles['System'];
  const SpecificTool = ModuleTools[module.id];


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
          <div className="flex items-center gap-4 mb-6">
              <div className={cn("flex h-16 w-16 items-center justify-center rounded-lg", categoryStyle)}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <Badge variant="outline" className={cn("mb-2 border", categoryStyle)}>{category}</Badge>
                <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
                    {name}
                </h1>
              </div>
          </div>

          <Card>
            <CardHeader>
                <CardTitle>About this Module</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            {SpecificTool && (
                <CardContent>
                   <SpecificTool />
                </CardContent>
            )}
          </Card>
          
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  );
}
