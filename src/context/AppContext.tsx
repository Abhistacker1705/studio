"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Post, UserProfile } from "@/types";

interface AppContextType {
  userProfile: UserProfile;
  posts: Post[];
  setUserProfile: (profile: UserProfile) => void;
  addPost: (post: Omit<Post, 'id'> & { id?: string }) => void;
  updatePostDate: (postId: string, newDate: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialPosts: Post[] = [
    { id: '1', content: 'My first post about Next.js! Excited to share my journey.', date: new Date().toISOString().split('T')[0], platform: 'Blog' },
    { id: '2', content: 'Quick thoughts on the future of AI in content creation. #AI #Content', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], platform: 'Twitter' },
];


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({ details: "" });
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("contentFlow-userProfile");
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
      const storedPosts = localStorage.getItem("contentFlow-posts");
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        setPosts(initialPosts);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setPosts(initialPosts);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("contentFlow-userProfile", JSON.stringify(userProfile));
      localStorage.setItem("contentFlow-posts", JSON.stringify(posts));
    }
  }, [userProfile, posts, isMounted]);

  const addPost = (post: Omit<Post, 'id'> & { id?: string }) => {
    const newPost = { ...post, id: post.id || Date.now().toString() };
    setPosts(prevPosts => [...prevPosts, newPost]);
  };

  const updatePostDate = (postId: string, newDate: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, date: newDate } : post
      )
    );
  };

  const handleSetUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };
  
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <AppContext.Provider
      value={{ userProfile, posts, setUserProfile: handleSetUserProfile, addPost, updatePostDate }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
