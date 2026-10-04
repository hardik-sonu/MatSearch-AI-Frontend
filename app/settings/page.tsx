"use client";

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-canvas-base flex flex-col p-4 md:p-6 lg:px-8 max-w-4xl mx-auto gap-6">
      <header className="border-b border-border-default pb-4">
        <h1 className="text-xl font-semibold text-primary-text font-sans">Settings</h1>
        <p className="text-[13px] text-secondary-text mt-1">Configure local interface preferences.</p>
      </header>
      
      <section className="bg-surface border border-border-default rounded-[6px] p-6 flex flex-col gap-4">
        <h2 className="text-[14px] font-medium text-primary-text">Appearance</h2>
        <div className="flex items-center gap-4 text-[13px] text-secondary-text">
          <label className="flex items-center gap-2">
            <input type="radio" name="theme" defaultChecked /> Light (Scientific Default)
          </label>
        </div>
      </section>
      
      <section className="bg-surface border border-border-default rounded-[6px] p-6 flex flex-col gap-4">
        <h2 className="text-[14px] font-medium text-primary-text">Local Storage</h2>
        <p className="text-[13px] text-secondary-text">Clear locally saved searches and materials.</p>
        <div>
          <button className="bg-canvas-secondary border border-border-contrast text-secondary-text text-[13px] py-1 px-3 rounded-[4px] hover:bg-border-default transition-colors">
            Clear Local Data
          </button>
        </div>
      </section>
    </div>
  );
}
