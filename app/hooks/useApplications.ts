"use client";

import { useState, useEffect } from "react";
import { JobApplication, ApplicationStatus } from "../types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const STORAGE_KEY = "job-applications";

export function useApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApplications(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load applications from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever applications change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
      } catch (e) {
        console.error("Failed to save applications to localStorage", e);
      }
    }
  }, [applications, isLoaded]);

  const addApplication = (
    data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">,
  ): JobApplication => {
    const now = new Date().toISOString();
    const newApp: JobApplication = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApplication = (
    id: string,
    data: Partial<Omit<JobApplication, "id" | "createdAt">>,
  ): void => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, ...data, updatedAt: new Date().toISOString() } : app,
      ),
    );
  };

  const deleteApplication = (id: string): void => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const getByStatus = (status: ApplicationStatus): JobApplication[] => {
    return applications.filter((app) => app.status === status);
  };

  const countByStatus = (status: ApplicationStatus): number => {
    return applications.filter((app) => app.status === status).length;
  };

  return {
    applications,
    isLoaded,
    addApplication,
    updateApplication,
    deleteApplication,
    getByStatus,
    countByStatus,
  };
}
