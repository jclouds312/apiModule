'use client';

import type { ApiModule } from '@/lib/apis';
import { Switch } from "@/components/ui/switch";
import { Button } from "./ui/button";
import { PlayCircle, Settings, FileText } from "lucide-react";
import Link from 'next/link';
import { 
    getReservations,
    getProducts, 
    sendTestNotification, 
    getSalesReport, 
    getApiStatus,
    getShopifyProducts,
    geocodeAddress
} from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";
import { askGemini } from '@/ai/flows/ask-gemini-flow';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ApiModuleWithState = ApiModule & { active: boolean };

type ApiCardProps = {
  module: ApiModuleWithState;
  onToggle: (id: string) => void;
};

const categoryStyles: Record<string, string> = {
    'Commerce': 'text-green-500 bg-green-500/10',
    'Reservations': 'text-blue-500 bg-blue-500/10',
    'Location': 'text-cyan-500 bg-cyan-500/10',
    'AI': 'text-purple-500 bg-purple-500/10',
    'Voice': 'text-pink-500 bg-pink-500/10',
    'System': 'text-slate-500 bg-slate-500/10'
};


export default function ApiCard({ module, onToggle }: ApiCardProps) {
  const { id, name, description, Icon, active, category } = module;
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

    const authRequiredApis = ['sales', 'reservations', 'notifications', 'reports', 'shopify', 'gemini-ai'];
    if (!user && authRequiredApis.includes(id)) {
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
                result = await geocodeAddress('1600 Amphitheatre Parkway, Mountain View, CA');
                break;
            case 'shopify':
                result = await getShopifyProducts();
                break;
            case 'gemini-ai':
                result = await askGemini({ question: "What is the capital of France?" });
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
                result = { success: true, message: "Use the 'Voice to Quote' tool to test this feature." };
                break;
            case 'retell-ai':
                result = { success: true, message: "Retell AI is configured via webhooks. Check server logs for webhook events." };
                break;
            case 'documentation':
                 result = { success: true, message: "Use the 'Docs' button to see the OpenAPI documentation." };
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
  
  const categoryStyle = categoryStyles[category] || categoryStyles['System'];

  return (
    <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative flex flex-col justify-between p-5 bg-card/80 dark:bg-card/60 rounded-xl shadow-md border border-border/20 backdrop-blur-sm"
    >
      <div>
        <div className="flex items-start justify-between">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg mb-4", categoryStyle)}>
              <Icon className="h-7 w-7" />
            </div>
            <Switch
              checked={active}
              onCheckedChange={() => onToggle(id)}
              aria-label={`Activate ${name}`}
              className="data-[state=checked]:bg-primary"
            />
        </div>
        <h3 className="text-lg font-bold font-headline text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">{description}</p>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1">
        <Button variant="ghost" size="sm" onClick={handleTest} className="text-muted-foreground hover:text-foreground">
            <PlayCircle className="mr-2 h-4 w-4" />
            Test
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link href="/docs"><FileText className="mr-2 h-4 w-4" />Docs</Link>
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={handleSettings}>
            <Settings className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
