// hooks/useBackendHealth.ts
// Polls /health every 10s and returns connection status
import { useState, useEffect } from 'react';

type HealthStatus = 'checking' | 'online' | 'offline';

export function useBackendHealth(intervalMs = 10_000): HealthStatus {
  const [status, setStatus] = useState<HealthStatus>('checking');

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch('/health', { signal: AbortSignal.timeout(3000) });
        if (!cancelled) setStatus(res.ok ? 'online' : 'offline');
      } catch {
        if (!cancelled) setStatus('offline');
      }
    };

    check(); // immediate first check
    const timer = setInterval(check, intervalMs);
    return () => { cancelled = true; clearInterval(timer); };
  }, [intervalMs]);

  return status;
}
