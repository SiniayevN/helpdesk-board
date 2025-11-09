'use client';

import { useEffect, useMemo, useState } from 'react';
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
