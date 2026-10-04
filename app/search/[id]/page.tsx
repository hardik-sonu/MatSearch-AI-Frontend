"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { SearchDetails } from '@/types/api';
import { AgentTimeline } from '@/components/search/AgentTimeline';
import { Badge } from '@/components/ui/Badge';

export default function SearchDashboard() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<SearchDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await api.getSearch(id);
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load search details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-8 text-secondary-text">Loading search details...</div>;
  if (error) return <div className="p-8 text-status-fail-fg">{error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col p-4 md:p-6 lg:px-8 gap-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <h1 className="text-xl font-semibold text-primary-text font-sans">Search Dashboard</h1>
          <p className="text-[12px] font-mono text-secondary-text mt-1">ID: {data.search_id}</p>
        </div>
        <Badge type={
          data.status === 'completed' ? 'PASS' : 
          data.status === 'failed' ? 'FAILED' : 'INFO'
        }>{data.status.toUpperCase()}</Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-surface border border-border-default p-4 rounded-[6px]">
            <h2 className="text-[11px] uppercase text-secondary-text font-medium tracking-wider mb-2">Original Requirement</h2>
            <p className="text-[14px] font-sans text-primary-text bg-canvas-secondary p-3 rounded-[4px] border border-border-contrast">
              {data.query}
            </p>
          </section>

          {data.status === 'failed' && (
            <div className="bg-status-fail-bg border border-status-fail-border p-4 rounded-[6px]">
              <h2 className="text-[13px] font-semibold text-status-fail-fg mb-1">Search Failed</h2>
              <p className="text-[13px] text-primary-text font-sans">
                The MatSearch AI backend was unable to complete this research task. This typically happens if the constraints were structurally impossible or if a downstream API (like Materials Project or Gemini) failed to respond.
              </p>
            </div>
          )}

          {data.requirements && data.requirements.length > 0 && (
            <section className="bg-surface border border-border-default p-4 rounded-[6px]">
              <h2 className="text-[11px] uppercase text-secondary-text font-medium tracking-wider mb-4">Requirement Interpretation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.requirements.map((req, i) => (
                  <div key={i} className="flex flex-col border border-border-contrast p-3 rounded-[4px] bg-canvas-base">
                    <span className="text-[11px] uppercase font-medium text-secondary-text mb-1">{req.property}</span>
                    <span className="font-mono text-[13px] text-primary-text">{req.condition}</span>
                    {req.is_ambiguous && (
                      <span className="mt-2"><Badge type="WARN">AMBIGUOUS</Badge></span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.candidates && data.candidates.length > 0 && (
            <section className="bg-surface border border-border-default p-4 rounded-[6px] overflow-hidden">
              <h2 className="text-[11px] uppercase text-secondary-text font-medium tracking-wider mb-4">Candidate Materials ({data.candidates.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-canvas-base border-b border-border-contrast">
                      <th className="py-2 px-3 text-[11px] font-medium uppercase text-secondary-text">Material</th>
                      <th className="py-2 px-3 text-[11px] font-medium uppercase text-secondary-text">Formula</th>
                      <th className="py-2 px-3 text-[11px] font-medium uppercase text-secondary-text tabular-nums">Density</th>
                      <th className="py-2 px-3 text-[11px] font-medium uppercase text-secondary-text tabular-nums">Band Gap</th>
                      <th className="py-2 px-3 text-[11px] font-medium uppercase text-secondary-text">Stability</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    {data.candidates.map((c, i) => (
                      <tr key={i} className="border-b border-border-default hover:bg-canvas-base transition-colors">
                        <td className="py-2 px-3 font-mono text-primary-text"><a href={`/materials/${c.material_id}`} className="text-status-info-fg hover:underline">{c.material_id}</a></td>
                        <td className="py-2 px-3 font-mono text-primary-text">{c.material.formula || 'N/A'}</td>
                        <td className="py-2 px-3 font-mono tabular-nums">{c.material.density?.toFixed(4) ?? 'N/A'}</td>
                        <td className="py-2 px-3 font-mono tabular-nums">{c.material.band_gap?.toFixed(4) ?? 'N/A'}</td>
                        <td className="py-2 px-3">
                          {c.material.is_stable === true ? <Badge type="PASS">STABLE</Badge> : c.material.is_stable === false ? <Badge type="WARN">UNSTABLE</Badge> : <Badge type="UNAVAILABLE">N/A</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <AgentTimeline searchId={id} initialStatus={data.status} onComplete={fetchDetails} />
          
          {data.status === 'completed' && data.critic_status && (
            <section className="bg-surface border border-border-default p-4 rounded-[6px]">
              <h2 className="text-[11px] uppercase text-secondary-text font-medium tracking-wider mb-2">Validation Status</h2>
              <Badge type={data.critic_status.includes('AMBIGU') ? 'WARN' : data.critic_status === 'PASS' ? 'PASS' : 'FAILED'}>
                {data.critic_status.replace(/_/g, ' ')}
              </Badge>
            </section>
          )}

          {data.report_available && (
            <section className="bg-surface border border-border-default p-4 rounded-[6px]">
              <h2 className="text-[11px] uppercase text-secondary-text font-medium tracking-wider mb-2">Report</h2>
              <a href={`/reports/${id}`} className="text-status-info-fg text-sm hover:underline">View Engineering Report</a>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
