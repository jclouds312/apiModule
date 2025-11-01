
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Home, Settings, Terminal, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiModules } from '@/lib/apis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Get unique categories from apiModules
const categories = [...new Set(apiModules.map(m => m.category))];

export default function AppSidebar() {
  const pathname = usePathname();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Terminal className="h-7 w-7 text-primary" />
          <span className="text-lg font-semibold font-headline">API Hub</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 p-0">
         <SidebarMenu className="p-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/'}>
              <Link href="/">
                <LayoutGrid />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/settings'}>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />
        
        <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue={categories[0]} className="flex flex-col h-full">
                <div className="p-2">
                    <p className="p-2 text-xs font-medium text-sidebar-foreground/70">Modules</p>
                    <TabsList className="grid w-full grid-cols-3 h-auto p-1.5">
                        {categories.map((category) => (
                        <TabsTrigger key={category} value={category} className="text-xs h-7">
                            {category}
                        </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                
                <SidebarMenu className="p-2 pt-0 mt-auto flex-1">
                    {categories.map((category) => (
                    <TabsContent key={category} value={category} className="m-0 flex-1">
                        <div className="flex flex-col gap-1">
                        {apiModules
                            .filter((mod) => mod.category === category)
                            .map((mod) => (
                            <SidebarMenuItem key={mod.id}>
                                <SidebarMenuButton asChild isActive={pathname === `/modules/${mod.id}`}>
                                <Link href={`/modules/${mod.id}`}>
                                    <mod.Icon />
                                    <span>{mod.name}</span>
                                </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            ))}
                        </div>
                    </TabsContent>
                    ))}
                </SidebarMenu>
            </Tabs>
        </div>

      </SidebarContent>

      <SidebarFooter>
        <div className="md:hidden">
          <SidebarTrigger/>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
