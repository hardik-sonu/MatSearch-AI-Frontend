"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Material } from '@/types/api';
import { Badge } from '@/components/ui/Badge';

export default function MaterialDetailsPage() {
  const { materialId } = useParams() as { materialId: string };
  const [data, setData] = useState<Material | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await api.getMaterial(materialId);
        setData(res);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load material details.');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [materialId]);

  if (loading) return <div className="p-8 text-secondary-text">Loading material {materialId}...</div>;
  if (error) return <div className="p-8 text-status-fail-fg">{error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col p-4 md:p-6 lg:px-8 max-w-5xl mx-auto gap-6">
      <header className="flex flex-col gap-2 border-b border-border-default pb-4">
        <h1 className="text-2xl font-semibold text-primary-text font-sans flex items-center gap-3">
          {data.formula || 'Unknown Formula'}
          {data.is_stable === true && <Badge type="PASS">STABLE</Badge>}
          {data.is_stable === false && <Badge type="WARN">UNSTABLE</Badge>}
        </h1>
        <p className="text-[13px] font-mono text-secondary-text">{data.material_id}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-surface border border-border-default rounded-[6px] flex flex-col overflow-hidden">
          <div className="bg-canvas-secondary border-b border-border-contrast px-4 py-2">
            <h2 className="text-[11px] uppercase text-secondary-text font-medium tracking-wider">Properties</h2>
          </div>
          <div className="flex flex-col divide-y divide-border-default">
            <div className="flex justify-between px-4 py-3">
              <span className="text-[11px] uppercase font-medium text-secondary-text">Density</span>
              <span className="font-mono text-[13px] text-primary-text">{data.density !== undefined ? `${data.density.toFixed(4)} g/cm³` : 'N/A'}</span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-[11px] uppercase font-medium text-secondary-text">Band Gap</span>
              <span className="font-mono text-[13px] text-primary-text">{data.band_gap !== undefined ? `${data.band_gap.toFixed(4)} eV` : 'N/A'}</span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-[11px] uppercase font-medium text-secondary-text">Energy Above Hull</span>
              <span className="font-mono text-[13px] text-primary-text">{data.energy_above_hull !== undefined ? `${data.energy_above_hull.toFixed(4)} eV/atom` : 'N/A'}</span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-[11px] uppercase font-medium text-secondary-text">Volume</span>
              <span className="font-mono text-[13px] text-primary-text">{data.volume !== undefined ? `${data.volume.toFixed(4)} Å³` : 'N/A'}</span>
            </div>
          </div>
        </section>

        <section className="bg-surface border border-border-default rounded-[6px] flex flex-col overflow-hidden">
          <div className="bg-canvas-secondary border-b border-border-contrast px-4 py-2">
            <h2 className="text-[11px] uppercase text-secondary-text font-medium tracking-wider">Crystallography</h2>
          </div>
          <div className="flex flex-col divide-y divide-border-default">
            <div className="flex justify-between px-4 py-3">
              <span className="text-[11px] uppercase font-medium text-secondary-text">Crystal System</span>
              <span className="font-mono text-[13px] text-primary-text">{data.crystal_system || 'N/A'}</span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-[11px] uppercase font-medium text-secondary-text">Space Group</span>
              <span className="font-mono text-[13px] text-primary-text">{data.space_group || 'N/A'}</span>
            </div>
          </div>
          <div className="p-4 mt-auto">
             <div className="w-full aspect-video bg-canvas-base border border-border-contrast rounded-[4px] flex items-center justify-center">
                <span className="text-secondary-text text-[13px] font-sans">Crystal structure visualization unavailable for this material.</span>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
