'use client';

export default function MyQueueSummary({ tickets, queued, onRemove, onClear }) {
  const queuedIds = Object.keys(queued || {});
  const items = (tickets || []).filter(t => queued[t.id]);

  return (
    <div className="mt-6 rounded-lg border border-gray-700 bg-gray-950 p-4">
      <h2 className="text-lg font-semibold">My Queue</h2>
      <p className="text-sm text-gray-300">
        {queuedIds.length === 0 ? 'No tickets in your queue.' : `${queuedIds.length} selected.`}
      </p>

      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map(t => (
            <li key={t.id} className="flex items-center justify-between rounded-md bg-gray-900 p-2">
              <span className="text-sm">{t.title}</span>
              <button
                className="rounded-md border border-gray-600 px-2 py-1 text-xs"
                onClick={() => onRemove(t.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        <button
          className="rounded-md bg-gray-700 px-3 py-2 text-sm disabled:opacity-50"
          onClick={onClear}
          disabled={items.length === 0}
        >
          Clear Queue
        </button>
      </div>
    </div>
  );
}
