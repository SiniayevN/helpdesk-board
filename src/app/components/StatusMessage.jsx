'use client';

export default function StatusMessage({ kind, message }) {
  const text =
    kind === 'loading' ? 'Loading…' :
    kind === 'error' ? (message || 'Unable to load tickets.') :
    'No tickets match your filters.';
  return (
    <div className="rounded-md border border-gray-700 bg-gray-900 p-4 text-sm text-gray-200">
      {text}
    </div>
  );
}
