'use client';

import TicketCard from './TicketCard';

export default function TicketList({ tickets, onAddToQueue, queued }) {
  if (!tickets || tickets.length === 0) {
    return <p className="text-sm text-gray-400">No tickets to display.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tickets.map(t => (
        <TicketCard
          key={t.id}
          ticket={t}
          isQueued={!!queued[t.id]}
          onAddToQueue={() => onAddToQueue(t.id)}
        />
      ))}
    </div>
  );
}
