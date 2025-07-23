"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function ContentCalendar() {
  const { posts, updatePostDate } = useAppContext();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [draggedPostId, setDraggedPostId] = React.useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startingDayIndex = getDay(monthStart);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, postId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPostId(postId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: Date) => {
    e.preventDefault();
    if (draggedPostId) {
      updatePostDate(draggedPostId, format(day, "yyyy-MM-dd"));
      setDraggedPostId(null);
    }
  };

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => isSameDay(new Date(post.date), day));
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="w-full h-full shadow-lg border-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="font-headline text-3xl">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-muted-foreground">
          {weekdays.map((day) => (
            <div key={day} className="py-2 font-headline">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 gap-1">
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div key={`empty-${index}`} className="border rounded-md bg-muted/40 aspect-square"></div>
          ))}
          {daysInMonth.map((day) => {
            const postsForDay = getPostsForDay(day);
            return (
              <div
                key={day.toString()}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
                className={cn(
                  "border rounded-md p-2 flex flex-col gap-2 min-h-[120px] transition-colors duration-300",
                  isSameMonth(day, new Date()) ? "bg-card" : "bg-muted/40",
                  isSameDay(day, new Date()) && "border-primary border-2"
                )}
              >
                <div className="font-bold text-sm text-right">{format(day, "d")}</div>
                <div className="flex-1 space-y-1 overflow-y-auto">
                  {postsForDay.map((post) => (
                    <Popover key={post.id}>
                      <PopoverTrigger asChild>
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, post.id)}
                          className="bg-secondary/50 p-2 rounded-md text-xs cursor-grab active:cursor-grabbing flex items-start gap-1"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1">
                            {post.platform && <Badge variant="outline" className="mb-1">{post.platform}</Badge>}
                            <p className="line-clamp-3">{post.content}</p>
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-card">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none font-headline">
                              {post.platform ? `${post.platform} Post` : "Content Post"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Scheduled for {format(new Date(post.date), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <div className="text-sm">
                            {post.content}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
