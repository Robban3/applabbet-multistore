import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Admin</h1>
        <nav className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Produkter
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Orders
          </Link>
          <Link
            href="/admin/pages"
            className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Sidor (CMS)
          </Link>
          <Link
            href="/admin/pages/custom"
            className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Nya sidor
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Företag & betalningar
          </Link>
          <Link
            href="/admin/logistics"
            className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Logistik & lager
          </Link>
        </nav>
      </header>
      {children}
    </main>
  );
}
