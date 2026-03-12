export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10">
      <div className="surface-panel animate-pulse p-10">
        <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-14 w-full max-w-2xl rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

