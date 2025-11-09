'use client';

import { useMemo, useState } from 'react';
import StatusFilter from './StatusFilter';
import PriorityFilter from './PriorityFilter';
import SearchBox from './SearchBox';
import TicketList from './TicketList';
import MyQueueSummary from './MyQueueSummary';
import StatusMessage from './StatusMessage';

const STATUS_OPTIONS = ['All', 'Open', 'In Progress', 'On Hold', 'Resolved'];
const PRIORITY_OPTIONS = ['All', 'Low', 'Medium', 'High', 'Critical'];

export default function Board() {
  // lifted state
  const [tickets] = useState([]);          // API not wired yet
  const [loading] = useState(false);       // will be true during fetch later
  const [error] = useState('');
  const [filters, setFilters] = useState({ status: 'All', priority: 'All' });
  const [search, setSearch] = useState('');
  const [queue, setQueue] = useState({});

  // derived (for now just filters/search against empty list)
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

  // queue handlers
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
