"use client";

import React, { useEffect, useState } from 'react';
import { SearchEventStream } from '@/lib/sse';
import { Badge } from '@/components/ui/Badge';

interface AgentTimelineProps {
  searchId: string;
  initialStatus: string;
  onComplete?: () => void;
}

export function AgentTimeline({ searchId, initialStatus, onComplete }: AgentTimelineProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (initialStatus === 'completed' || initialStatus === 'failed') {
      return; // No need to connect SSE
    }

    const stream = new SearchEventStream(
      searchId,
      (data) => {
        if (data.event) {
          setEvents(prev => [...prev, data.event]);
        }
        if (data.status) {
          setStatus(data.status);
          if (data.status === 'completed' || data.status === 'failed') {
            if (onComplete) onComplete();
          }
        }
      },
      (error) => {
        // Suppress noisy generic [object Event] errors which happen during standard reconnection cycles
      }
    );

    stream.connect();

    return () => stream.disconnect();
  }, [searchId, initialStatus, onComplete]);

  return (
    <div className="bg-surface border border-border-default rounded-[6px] p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-border-contrast pb-2">
        <h3 className="text-[11px] uppercase text-secondary-text font-medium tracking-wider">Agent Timeline</h3>
        <Badge type={status === 'completed' ? 'PASS' : status === 'failed' ? 'FAILED' : 'INFO'}>
          {status.toUpperCase()}
        </Badge>
      </div>

      <div className="flex flex-col gap-3">
        {events.length === 0 && status !== 'completed' && (
          <div className="text-[13px] text-tertiary-text font-sans">Awaiting agent events...</div>
        )}
        
        {events.map((evt, i) => (
          <div key={i} className="flex flex-row items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-sm bg-status-info-fg shrink-0" />
            <div className="flex flex-col">
              <span className="text-[13px] text-primary-text font-medium">
                {evt.type || 'Workflow Event'}
              </span>
              {evt.message && (
                <span className="text-[12px] text-secondary-text mt-1">{evt.message}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
