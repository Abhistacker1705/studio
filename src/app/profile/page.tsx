"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types";

export default function ProfilePage() {
  const { userProfile, setUserProfile } = useAppContext();
  const { toast } = useToast();

  const { control, handleSubmit, reset } = useForm<UserProfile>({
    defaultValues: userProfile,
  });

  React.useEffect(() => {
    reset(userProfile);
  }, [userProfile, reset]);

  const onSubmit = (data: UserProfile) => {
    setUserProfile(data);
    toast({
      title: "Profile Saved!",
      description: "Your details have been updated and will be used for future content generation.",
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background font-body">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center border-b bg-card px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold font-headline">My Profile & Knowledge Base</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Card className="max-w-2xl mx-auto shadow-lg border-none">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Personal Brand</CardTitle>
              <CardDescription>
                Add your resume, bio, key achievements, and any other details here. The AI will use this information to match your unique tone and style.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Controller
                  name="details"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={15}
                      placeholder="Paste your resume, bio, or just write about yourself..."
                      className="bg-background"
                    />
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
