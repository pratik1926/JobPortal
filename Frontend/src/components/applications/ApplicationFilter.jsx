export default function ApplicationFilter({
  value,
  onChange,
}) {

  return (
    <input
      type="text"
      placeholder="Filter by job title..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-80 px-4 py-3 mb-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}