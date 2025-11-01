import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { ApiModule } from '@/lib/apis';
import { Button } from "./ui/button";
import { Code, FileText, Settings, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createReservation } from "@/lib/actions";
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

  const handleCreateReservation = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You need to be logged in to create a reservation.",
        });
        return;
    }
    const result = await createReservation({
        servicio: "Test Service",
        fecha: new Date().toISOString().split('T')[0],
        hora: "10:00",
        usuario: user.uid,
    });
    if (result.success) {
        toast({
            title: "Reservation Created!",
            description: "A test reservation has been successfully created.",
        });
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Could not create reservation.",
        });
    }
  }

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
      <CardFooter className="bg-muted/50 p-4">
        <div className="flex w-full items-center justify-between">
           <div>
            {id === 'reservations' && active && (
              <Button variant="outline" size="sm" onClick={handleCreateReservation}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Test Create
              </Button>
            )}
           </div>
          <div className="flex items-center justify-end space-x-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="#"><FileText className="mr-2 h-4 w-4" />Docs</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="#"><Code className="mr-2 h-4 w-4" />Test</Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="h-9 w-9">
              <Link href="#"><Settings className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
