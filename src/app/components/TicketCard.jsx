'use client';

export default function TicketCard({ ticket, onAddToQueue, isQueued }) {
  const { title, priority, status, assignee, updatedAt } = ticket;
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 shadow">
      <div className="text-sm text-gray-400">
        Priority: <span className="font-medium text-gray-200">{priority}</span>
      </div>
      <div className="text-sm text-gray-400">
        Status: <span className="font-medium text-gray-200">{status}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <div className="mt-2 text-sm text-gray-300">
        <div>Assignee: {assignee}</div>
        <div>Updated: {new Date(updatedAt).toLocaleString()}</div>
      </div>
      <button
        className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium disabled:opacity-50"
        onClick={onAddToQueue}
        disabled={isQueued}
      >
        {isQueued ? 'Already in My Queue' : 'Add to My Queue'}
      </button>
      {isQueued && <p className="mt-2 text-xs text-gray-400">This ticket is already in your queue.</p>}
    </div>
  );
}
