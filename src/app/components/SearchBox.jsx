'use client';

export default function SearchBox({ value, onChange }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-300 mb-1">Search</span>
      <input
        type="text"
        placeholder="Search title or description"
        className="w-full rounded-md border border-gray-700 bg-gray-900 p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
