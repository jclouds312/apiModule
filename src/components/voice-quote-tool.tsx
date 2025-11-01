'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, StopCircle, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { voiceCommandToQuote } from '@/ai/flows/voice-command-to-quote';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function VoiceQuoteTool() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [quote, setQuote] = useState<Record<string, any> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = useCallback(async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You need to be logged in to generate a quote.',
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null);
      setTranscription('');
      setQuote(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: 'destructive',
        title: 'Microphone Error',
        description: 'Could not access the microphone. Please check permissions.',
      });
    }
  }, [user, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const processAudio = useCallback(async () => {
    if (!audioBlob || !user) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        toast({
          title: 'Processing Voice Command...',
          description: 'The AI is analyzing your audio. This may take a moment.',
        });

        const result = await voiceCommandToQuote({
          audioDataUri: base64Audio,
          userId: user.uid,
        });

        setTranscription(result.transcription);
        setQuote(result.quote);
        toast({
          title: 'Quote Generated!',
          description: `Quote ID: ${result.quoteId} has been saved.`,
        });
      };
    } catch (error: any) {
      console.error('Error processing voice command:', error);
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: error.message || 'Could not process the voice command.',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [audioBlob, user, toast]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline mb-4">
        Voice to Quote
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Quote with your Voice</CardTitle>
          <CardDescription>
            Press record, describe the service you need (e.g., "I need a website for my business with a gallery and contact form"), and we'll generate a quote for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
               <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`transition-all duration-300 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-primary'}`}
              >
                {isRecording ? (
                  <>
                    <StopCircle className="mr-2 h-5 w-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Start Recording
                  </>
                )}
              </Button>
               {audioBlob && !isProcessing && (
                <Button size="lg" onClick={processAudio}>
                  <Send className="mr-2 h-5 w-5" />
                  Process Audio
                </Button>
              )}
              {isProcessing && (
                <Button size="lg" disabled>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                </Button>
              )}
            </div>

            {audioBlob && (
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-sm" />
            )}
          </div>
          
          {(transcription || quote) && (
            <div className="mt-6 space-y-4 rounded-lg border bg-muted/50 p-4">
               {transcription && (
                <div>
                  <h3 className="font-semibold text-foreground">Transcription:</h3>
                  <p className="text-muted-foreground italic">"{transcription}"</p>
                </div>
              )}
              {quote && Object.keys(quote).length > 0 && (
                 <div>
                    <h3 className="font-semibold text-foreground">Generated Quote Details:</h3>
                    <pre className="mt-2 w-full rounded-md bg-background p-3 font-code text-sm">
                        <code>{JSON.stringify(quote, null, 2)}</code>
                    </pre>
                 </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
