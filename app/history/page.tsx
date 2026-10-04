"use client";

import React from 'react';

export default function HistoryPage() {
  // As per instructions, if there's no backend history endpoint on the OpenAPI spec, we use local storage or just a placeholder for local client-side history.
  // The OpenAPI spec fetched earlier did not show a GET /api/history endpoint.
  // We'll implement a basic layout indicating this is local history.

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col p-4 md:p-6 lg:px-8 max-w-4xl mx-auto gap-6">
      <header className="border-b border-border-default pb-4">
        <h1 className="text-xl font-semibold text-primary-text font-sans">Search History</h1>
        <p className="text-[13px] text-secondary-text mt-1">Locally saved history of recent searches.</p>
      </header>
      
      <div className="bg-surface border border-border-default rounded-[6px] p-8 text-center text-secondary-text flex flex-col items-center justify-center">
        <p className="text-[13px]">Local search history is currently empty.</p>
        <p className="text-[11px] mt-2 max-w-sm">
          (Note: MatSearch AI does not currently expose a backend search history endpoint. Searches are persisted via their unique Search ID.)
        </p>
      </div>
    </div>
  );
}
