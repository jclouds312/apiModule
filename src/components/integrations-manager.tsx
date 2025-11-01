'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { getIntegrations, updateIntegration } from '@/lib/actions';
import { Switch } from './ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Integration {
  id: string;
  name: string;
  key: string;
  active: boolean;
}

export default function IntegrationsManager() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchIntegrations() {
      setLoading(true);
      const data = await getIntegrations();
      setIntegrations(data);
      setLoading(false);
    }
    fetchIntegrations();
  }, []);

  const handleToggle = async (integration: Integration) => {
    // Optimistic update
    setIntegrations(prev => 
      prev.map(i => i.id === integration.id ? { ...i, active: !i.active } : i)
    );

    const result = await updateIntegration(integration.id, { active: !integration.active });

    if (result.success) {
      toast({
        title: 'Integration Updated',
        description: `${integration.name} has been ${!integration.active ? 'activated' : 'deactivated'}.`,
      });
    } else {
      // Revert on failure
      setIntegrations(prev => 
        prev.map(i => i.id === integration.id ? { ...i, active: integration.active } : i)
      );
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
         <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline mb-4">
            API Integrations
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Manage API Keys</CardTitle>
            <CardDescription>
              View and manage status for your external API integrations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline mb-4">
        API Integrations
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Manage API Keys</CardTitle>
          <CardDescription>
            View and manage status for your external API integrations. This data is stored securely in Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {integrations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead className="text-right">Toggle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrations.map((integration) => (
                  <TableRow key={integration.id}>
                    <TableCell className="font-medium">{integration.name}</TableCell>
                    <TableCell>
                      <Badge variant={integration.active ? 'default' : 'outline'}>
                        {integration.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Input
                                type="password"
                                defaultValue={integration.key}
                                className="font-code text-xs"
                                placeholder="No key set"
                                readOnly
                            />
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={integration.active}
                        onCheckedChange={() => handleToggle(integration)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground p-8">
                No integrations found. You can add them to your 'integrations' collection in Firestore.
                For example, add a document with ID 'google-maps' and fields 'name', 'active', and 'key'.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
