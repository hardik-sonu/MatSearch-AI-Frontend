"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.createSearch({ query });
      router.push(`/search/${response.search_id}`);
    } catch (err: any) {
      setError(err.message || 'MatSearch AI backend is currently unavailable. Please retry the search.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-2 text-primary-text font-sans tracking-tight">MatSearch AI</h1>
          <p className="text-secondary-text font-sans">Autonomous Materials Discovery & Engineering</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-4 bg-surface p-6 border border-border-default rounded-[6px] shadow-sm">
          <div className="flex flex-col gap-2">
            <label htmlFor="search-input" className="text-[11px] font-medium uppercase tracking-wider text-secondary-text">
              Material Requirement
            </label>
            <textarea
              id="search-input"
              className="w-full min-h-[120px] p-3 text-[13px] font-sans border border-border-contrast rounded-[4px] bg-canvas-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none placeholder:text-tertiary-text"
              placeholder="Describe the material you need...&#10;&#10;Example: Find stable lightweight semiconductor materials with density below 5 g/cm3 and band gap between 1 and 2 eV."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="text-status-fail-fg bg-status-fail-bg border border-status-fail-border p-3 text-sm rounded-[4px]">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? 'Creating research task...' : 'Search Materials'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
