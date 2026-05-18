/**
 * Footer — minimal app footer with brand and copyright.
 */

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
        <span className="font-bold text-blue-600">menumaker</span> © {new Date().getFullYear()} — Доставка еды
      </div>
    </footer>
  );
}
