"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Sparkles, Send, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { generateContentWithPersona } from "@/ai/flows/generate-content-with-persona";
import { suggestContentPlatform } from "@/ai/flows/suggest-content-platform";
import { Badge } from "./ui/badge";

const contentSchema = z.object({
  idea: z.string().min(10, "Please enter a content idea of at least 10 characters."),
  finalContent: z.string(),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface AddContentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  postToEdit?: any; // Simplified for now
}

export function AddContentModal({ isOpen, setIsOpen, postToEdit }: AddContentModalProps) {
  const { toast } = useToast();
  const { addPost, userProfile } = useAppContext();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [platformSuggestion, setPlatformSuggestion] = React.useState<{ platform: string; reasoning: string } | null>(null);

  const { control, handleSubmit, setValue, watch } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      idea: "",
      finalContent: "",
    },
  });

  const finalContentValue = watch("finalContent");

  const handleGenerateContent = async () => {
    const idea = watch("idea");
    if (!idea) {
      toast({ title: "Error", description: "Please enter a content idea first.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateContentWithPersona({
        contentRequest: idea,
        userDetails: userProfile.details,
      });
      setValue("finalContent", result.generatedContent);
      setPlatformSuggestion(null);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({ title: "Error", description: "Failed to generate content.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestPlatform = async () => {
    const content = watch("finalContent");
    if (!content) {
      toast({ title: "Error", description: "Please generate or write content first.", variant: "destructive" });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestContentPlatform({
        content: content,
        userProfile: userProfile.details,
      });
      setPlatformSuggestion({ platform: result.platformSuggestion, reasoning: result.reasoning });
    } catch (error) {
      console.error("Error suggesting platform:", error);
      toast({ title: "Error", description: "Failed to suggest a platform.", variant: "destructive" });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = (data: ContentFormData) => {
    addPost({
      id: Date.now().toString(),
      content: data.finalContent,
      platform: platformSuggestion?.platform,
      date: new Date().toISOString().split("T")[0],
    });
    toast({ title: "Success", description: "Content post created!" });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Add New Content</DialogTitle>
            <DialogDescription>
              Craft your next post. Use our AI to refine your message and find the best platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Controller
              name="idea"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Start with your content idea or a rough draft..." rows={4} />
              )}
            />
            <Button type="button" onClick={handleGenerateContent} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate with my Tone
            </Button>
            <Controller
              name="finalContent"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Generated or final content will appear here..." rows={8} className="mt-4" />
              )}
            />
            {finalContentValue && (
              <div className="space-y-2">
                <Button type="button" variant="outline" onClick={handleSuggestPlatform} disabled={isSuggesting}>
                  {isSuggesting ? <Loader2 className="animate-spin" /> : <Bot />}
                  Suggest Platform
                </Button>
                {platformSuggestion && (
                  <div className="p-3 rounded-md bg-muted/50 border">
                    <div className="text-sm font-semibold">
                      Suggested Platform: <Badge variant="secondary">{platformSuggestion.platform}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{platformSuggestion.reasoning}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Send className="mr-2" />
              Add to Calendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
