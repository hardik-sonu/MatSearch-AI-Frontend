"use client";

import React from 'react';

export default function SavedMaterialsPage() {
  return (
    <div className="min-h-screen bg-canvas-base flex flex-col p-4 md:p-6 lg:px-8 max-w-4xl mx-auto gap-6">
      <header className="border-b border-border-default pb-4">
        <h1 className="text-xl font-semibold text-primary-text font-sans">Saved Materials</h1>
        <p className="text-[13px] text-secondary-text mt-1">Materials bookmarked locally on your device.</p>
      </header>
      
      <div className="bg-surface border border-border-default rounded-[6px] p-8 text-center text-secondary-text">
        <p className="text-[13px]">You have no saved materials.</p>
      </div>
    </div>
  );
}
