"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function ReportPage() {
  const { searchId } = useParams() as { searchId: string };
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.getReport(searchId);
      setReport(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [searchId]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await api.generateReport(searchId);
      await fetchReport();
    } catch (err: any) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="p-8 text-secondary-text">Loading report...</div>;

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col p-4 md:p-6 lg:px-8 max-w-4xl mx-auto gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <h1 className="text-xl font-semibold text-primary-text font-sans">Engineering Report</h1>
          <p className="text-[12px] font-mono text-secondary-text mt-1">Search ID: {searchId}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => window.history.back()}>Back to Search</Button>
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? 'Generating engineering report...' : 'Regenerate Report'}
          </Button>
        </div>
      </header>

      {error && <div className="p-4 text-status-fail-fg bg-status-fail-bg border border-status-fail-border rounded-[4px]">{error}</div>}

      {report ? (
        <article className="bg-surface border border-border-default p-6 rounded-[6px] prose max-w-none font-sans text-[14px]">
           {/* In a real scenario, this would render markdown or structured sections from the backend */}
           <pre className="font-mono text-[12px] text-primary-text whitespace-pre-wrap">{JSON.stringify(report, null, 2)}</pre>
        </article>
      ) : (
        !error && <div className="p-4 text-secondary-text">No report content available. Generate one above.</div>
      )}
    </div>
  );
}
