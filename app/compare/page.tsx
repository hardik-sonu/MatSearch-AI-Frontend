"use client";

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function ComparePage() {
  const [materialIds, setMaterialIds] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    const ids = materialIds.split(',').map(id => id.trim()).filter(Boolean);
    
    if (ids.length < 2) {
      setError("Please provide at least 2 material IDs to compare.");
      return;
    }
    
    if (ids.length > 6) {
      setError("Maximum 6 materials can be compared at once.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.compareMaterials({ material_ids: ids });
      // The backend structure for compare may vary. Assuming an array of materials or a specific comparison object
      // For this implementation, we assume it returns an array of materials or comparison data.
      setResults(Array.isArray(res) ? res : res.materials || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comparison data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col p-4 md:p-6 lg:px-8 max-w-6xl mx-auto gap-6">
      <header className="border-b border-border-default pb-4">
        <h1 className="text-xl font-semibold text-primary-text font-sans">Compare Materials</h1>
        <p className="text-[13px] text-secondary-text mt-1">Enter Materials Project IDs to compare side-by-side.</p>
      </header>

      <form onSubmit={handleCompare} className="bg-surface p-4 border border-border-default rounded-[6px] flex flex-col gap-4">
        <label className="text-[11px] uppercase text-secondary-text font-medium tracking-wider">
          Material IDs (comma-separated)
        </label>
        <input 
          type="text" 
          value={materialIds}
          onChange={(e) => setMaterialIds(e.target.value)}
          placeholder="mp-149, mp-13, mp-560328"
          className="p-2 text-[13px] font-mono border border-border-contrast rounded-[4px] bg-canvas-base w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
        {error && <div className="text-status-fail-fg text-sm">{error}</div>}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare Materials'}
          </Button>
        </div>
      </form>

      {results && results.length > 0 && (
        <section className="bg-surface border border-border-default rounded-[6px] overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-canvas-base border-b border-border-contrast">
                <th className="py-2 px-3 text-[11px] font-medium uppercase text-secondary-text sticky left-0 bg-canvas-base border-r border-border-contrast">Property</th>
                {results.map((r, i) => (
                  <th key={i} className="py-2 px-3 text-[11px] font-medium uppercase text-secondary-text font-mono">
                    <a href={`/materials/${r.material_id}`} className="text-status-info-fg hover:underline">{r.material_id}</a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              <tr className="border-b border-border-default">
                <td className="py-2 px-3 font-medium text-secondary-text sticky left-0 bg-surface border-r border-border-contrast">Formula</td>
                {results.map((r, i) => <td key={i} className="py-2 px-3 font-mono text-primary-text">{r.formula || 'N/A'}</td>)}
              </tr>
              <tr className="border-b border-border-default">
                <td className="py-2 px-3 font-medium text-secondary-text sticky left-0 bg-surface border-r border-border-contrast">Density (g/cm³)</td>
                {results.map((r, i) => <td key={i} className="py-2 px-3 font-mono tabular-nums">{r.density?.toFixed(4) ?? 'N/A'}</td>)}
              </tr>
              <tr className="border-b border-border-default">
                <td className="py-2 px-3 font-medium text-secondary-text sticky left-0 bg-surface border-r border-border-contrast">Band Gap (eV)</td>
                {results.map((r, i) => <td key={i} className="py-2 px-3 font-mono tabular-nums">{r.band_gap?.toFixed(4) ?? 'N/A'}</td>)}
              </tr>
              <tr className="border-b border-border-default">
                <td className="py-2 px-3 font-medium text-secondary-text sticky left-0 bg-surface border-r border-border-contrast">Energy Above Hull</td>
                {results.map((r, i) => <td key={i} className="py-2 px-3 font-mono tabular-nums">{r.energy_above_hull?.toFixed(4) ?? 'N/A'}</td>)}
              </tr>
              <tr className="border-b border-border-default">
                <td className="py-2 px-3 font-medium text-secondary-text sticky left-0 bg-surface border-r border-border-contrast">Stability</td>
                {results.map((r, i) => (
                  <td key={i} className="py-2 px-3">
                    {r.is_stable === true ? <Badge type="PASS">STABLE</Badge> : r.is_stable === false ? <Badge type="WARN">UNSTABLE</Badge> : <Badge type="UNAVAILABLE">N/A</Badge>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-secondary-text sticky left-0 bg-surface border-r border-border-contrast">Crystal System</td>
                {results.map((r, i) => <td key={i} className="py-2 px-3 font-mono text-primary-text">{r.crystal_system || 'N/A'}</td>)}
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
