'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { ApiModule } from '@/lib/apis';
import { Button } from "./ui/button";
import { Code, FileText, Settings, PlayCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
    createReservation, 
    getProducts, 
    sendTestNotification, 
    getSalesReport, 
    getApiStatus,
    getReservations,
    getShopifyProducts
} from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

type ApiModuleWithState = ApiModule & { active: boolean };

type ApiCardProps = {
  module: ApiModuleWithState;
  onToggle: (id: string) => void;
};

export default function ApiCard({ module, onToggle }: ApiCardProps) {
  const { id, name, description, Icon, active } = module;
  const { toast } = useToast();
  const { user } = useUser();

  const handleTest = async () => {
    if (!active) {
      toast({
        variant: "destructive",
        title: "API Inactive",
        description: `Please activate the ${name} to test it.`,
      });
      return;
    }

    if (!user && ['sales', 'reservations', 'notifications', 'reports', 'shopify'].includes(id)) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You must be logged in to test this API.",
        });
        return;
    }

    toast({ title: `Testing ${name}...` });

    let result: any;
    try {
        switch (id) {
            case 'sales':
                result = await getProducts();
                break;
            case 'reservations':
                 result = await getReservations();
                break;
             case 'google-maps':
                result = { success: true, message: "Use the 'Google Maps Tool' below to test Geocoding." };
                break;
            case 'shopify':
                result = await getShopifyProducts();
                break;
            case 'notifications':
                result = await sendTestNotification();
                break;
            case 'reports':
                result = await getSalesReport();
                break;
            case 'api-status':
                result = await getApiStatus();
                break;
            case 'authentication':
                result = { success: true, message: "Authentication is handled via the UI. Try logging in." };
                break;
            case 'voice-to-text':
                result = { success: true, message: "Use the 'Voice to Quote' tool below to test." };
                break;
            case 'documentation':
                result = { success: true, message: "Documentation endpoint is not yet implemented." };
                break;
            default:
                result = { success: false, message: "Test not implemented for this module." };
        }

        toast({
            title: `Test for ${name} Complete`,
            description: <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4"><code className="text-white">{JSON.stringify(result, null, 2)}</code></pre>,
        });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: `Test for ${name} Failed`,
            description: error.message || "An unknown error occurred.",
        });
    }
  };

  const handleSettings = () => {
      toast({
          title: "Configuration",
          description: `Settings for ${name} are not yet implemented.`
      });
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold font-headline">{name}</CardTitle>
               <p className={cn(
                 "text-sm font-medium",
                 active ? "text-primary" : "text-muted-foreground"
               )}>
                 {active ? "Active" : "Inactive"}
               </p>
            </div>
          </div>
          <Switch
            checked={active}
            onCheckedChange={() => onToggle(id)}
            aria-label={`Activate ${name}`}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleTest}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Test
        </Button>
        <div className="flex items-center justify-end space-x-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs"><FileText className="mr-2 h-4 w-4" />Docs</Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSettings}>
              <Settings className="h-4 w-4" />
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
