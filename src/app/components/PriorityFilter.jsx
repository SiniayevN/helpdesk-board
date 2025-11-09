'use client';

export default function PriorityFilter({ value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-300 mb-1">Priority</span>
      <select
        className="w-full rounded-md border border-gray-700 bg-gray-900 p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
