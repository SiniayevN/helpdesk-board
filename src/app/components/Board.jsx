'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import StatusFilter from './StatusFilter';
import PriorityFilter from './PriorityFilter';
import SearchBox from './SearchBox';
import TicketList from './TicketList';
import MyQueueSummary from './MyQueueSummary';
import StatusMessage from './StatusMessage';

const STATUS_OPTIONS = ['All', 'Open', 'In Progress', 'On Hold', 'Resolved'];
const PRIORITY_OPTIONS = ['All', 'Low', 'Medium', 'High', 'Critical'];

export default function Board() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: 'All', priority: 'All' });
  const [search, setSearch] = useState('');
  const [queue, setQueue] = useState({});
  const liveTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/tickets', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setTickets(data);
      } catch (e) {
        if (!cancelled) setError('Unable to load tickets.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function scheduleNext() {
      const ms = 6000 + Math.floor(Math.random() * 4000);
      liveTimer.current = setTimeout(() => {
        setTickets(prev => {
          if (prev.length === 0) return prev;
          const idx = Math.floor(Math.random() * prev.length);
          const t = prev[idx];
          const next = { ...t };
          const nowIso = new Date().toISOString();
          if (Math.random() < 0.5) {
            const transitions = {
              Open: ['In Progress', 'On Hold'],
              'In Progress': ['Resolved', 'On Hold'],
              'On Hold': ['Open', 'In Progress'],
              Resolved: ['Resolved']
            };
            const choices = transitions[t.status] || ['Open'];
            next.status = choices[Math.floor(Math.random() * choices.length)];
          } else {
            const order = ['Low', 'Medium', 'High', 'Critical'];
            const pos = order.indexOf(t.priority);
            const delta = Math.random() < 0.5 ? -1 : 1;
            const clamped = Math.max(0, Math.min(order.length - 1, pos + delta));
            next.priority = order[clamped];
          }
          next.updatedAt = nowIso;
          const copy = [...prev];
          copy[idx] = next;
          return copy;
        });
        scheduleNext();
      }, ms);
    }
    scheduleNext();
    return () => clearTimeout(liveTimer.current);
  }, []);

  const visibleTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter(t => {
      const statusOk = filters.status === 'All' || t.status === filters.status;
      const priorityOk = filters.priority === 'All' || t.priority === filters.priority;
      const searchOk =
        q === '' ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return statusOk && priorityOk && searchOk;
    });
  }, [tickets, filters, search]);

  function handleAddToQueue(id) {
    setQueue(prev => (prev[id] ? prev : { ...prev, [id]: true }));
  }
  function handleRemoveFromQueue(id) {
    setQueue(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }
  function handleClearQueue() { setQueue({}); }

  const messageKind =
    loading ? 'loading' :
    error ? 'error' :
    visibleTickets.length === 0 ? 'empty' : null;

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <StatusFilter
          value={filters.status}
          onChange={(v) => setFilters(f => ({ ...f, status: v }))}
          options={STATUS_OPTIONS}
        />
        <PriorityFilter
          value={filters.priority}
          onChange={(v) => setFilters(f => ({ ...f, priority: v }))}
          options={PRIORITY_OPTIONS}
        />
        <SearchBox value={search} onChange={setSearch} />
      </div>

      {messageKind && <StatusMessage kind={messageKind} message={error} />}

      {!messageKind && (
        <TicketList
          tickets={visibleTickets}
          onAddToQueue={handleAddToQueue}
          queued={queue}
        />
      )}

      <MyQueueSummary
        tickets={tickets}
        queued={queue}
        onRemove={handleRemoveFromQueue}
        onClear={handleClearQueue}
      />
    </section>
  );
}
