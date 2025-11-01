'use client';

import { useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { geocodeAddress } from '@/lib/actions';

export default function GoogleMapsTool() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast({
        variant: 'destructive',
        title: 'Address is empty',
        description: 'Please enter an address to geocode.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Call the server action directly
      const response = await geocodeAddress(address);
      if (response.status === 'OK') {
        setResult(response.results[0]);
        toast({
          title: 'Geocoding Successful!',
          description: `Found location for: ${response.results[0].formatted_address}`,
        });
      } else {
        throw new Error(response.error_message || `Geocoding failed with status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error geocoding address:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to geocode the address.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline mb-4">
        Google Maps Tool
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Geocoding</CardTitle>
          <CardDescription>
            Convert a physical address into geographic coordinates (latitude and longitude).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
                <Input
                placeholder="e.g., '1600 Amphitheatre Parkway, Mountain View, CA'"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading} className="min-w-fit">
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <MapPin className="h-4 w-4" />
                )}
                <span className="hidden sm:inline ml-2">Geocode</span>
                </Button>
            </div>
          </form>

          {result && (
            <div className="mt-6 space-y-2 rounded-lg border bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">Geocoding Result:</h3>
              <div className="text-sm text-foreground">
                <p><strong>Formatted Address:</strong> {result.formatted_address}</p>
                <p><strong>Latitude:</strong> {result.geometry.location.lat}</p>
                <p><strong>Longitude:</strong> {result.geometry.location.lng}</p>
                <p><strong>Place ID:</strong> {result.place_id}</p>
              </div>
              <pre className="mt-2 w-full rounded-md bg-background p-3 font-code text-xs">
                <code>{JSON.stringify(result.geometry.location, null, 2)}</code>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
