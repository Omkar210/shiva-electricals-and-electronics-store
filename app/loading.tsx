export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          role="status"
          aria-label="Loading"
        />
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
