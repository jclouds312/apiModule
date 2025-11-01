'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { askGemini } from '@/ai/flows/ask-gemini-flow';

export default function AiPlayground() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a question or prompt.',
      });
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      toast({
        title: 'Asking Gemini...',
        description: 'The AI is thinking. Please wait.',
      });
      const response = await askGemini({ question: prompt });
      setResult(response);
      toast({
        title: 'Gemini has Responded!',
      });
    } catch (error: any) {
      console.error('Error calling Gemini:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to get a response from the AI.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Playground</CardTitle>
          <CardDescription>
            Ask a question or give a prompt to the Gemini AI model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., 'What are the best practices for REST API design?'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Ask Gemini
            </Button>
          </form>

          {result && (
            <div className="mt-6 space-y-2 rounded-lg border bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">AI Response:</h3>
              <p className="text-sm text-foreground whitespace-pre-wrap font-code">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
