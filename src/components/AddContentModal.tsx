"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Sparkles, Send, Loader2, Save } from "lucide-react";

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
import type { Post } from "@/types";

const contentSchema = z.object({
  idea: z.string(),
  finalContent: z.string().min(1, "Final content cannot be empty."),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface AddContentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  postToEdit?: Post | null;
}

export function AddContentModal({ isOpen, setIsOpen, postToEdit }: AddContentModalProps) {
  const { toast } = useToast();
  const { addPost, updatePost, userProfile } = useAppContext();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [platformSuggestion, setPlatformSuggestion] = React.useState<{ platform: string; reasoning: string } | null>(null);

  const isEditing = !!postToEdit;

  const { control, handleSubmit, setValue, watch, reset } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      idea: "",
      finalContent: "",
    },
  });

  React.useEffect(() => {
    if (postToEdit) {
      setValue("finalContent", postToEdit.content);
      if (postToEdit.platform) {
        setPlatformSuggestion({ platform: postToEdit.platform, reasoning: "Existing platform" });
      }
    } else {
      reset({ idea: "", finalContent: "" });
      setPlatformSuggestion(null);
    }
  }, [postToEdit, setValue, reset]);


  const finalContentValue = watch("finalContent");

  const handleGenerateContent = async () => {
    const idea = watch("idea");
    const currentContent = watch("finalContent");
    const request = idea || currentContent;

    if (!request) {
      toast({ title: "Error", description: "Please enter an idea or some content to refine.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateContentWithPersona({
        contentRequest: request,
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
    if (isEditing && postToEdit) {
      updatePost({
        ...postToEdit,
        content: data.finalContent,
        platform: platformSuggestion?.platform,
      });
      toast({ title: "Success", description: "Content post updated!" });
    } else {
      addPost({
        content: data.finalContent,
        platform: platformSuggestion?.platform,
        date: new Date().toISOString().split("T")[0],
      });
      toast({ title: "Success", description: "Content post created!" });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{isEditing ? "Edit Content" : "Add New Content"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Refine your existing post." : "Craft your next post. Use our AI to refine your message and find the best platform."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!isEditing && (
              <Controller
                name="idea"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Start with your content idea or a rough draft..." rows={4} />
                )}
              />
            )}
            <Button type="button" onClick={handleGenerateContent} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {isEditing ? "Refine with my Tone" : "Generate with my Tone"}
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
              {isEditing ? <Save className="mr-2" /> : <Send className="mr-2" />}
              {isEditing ? "Save Changes" : "Add to Calendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
