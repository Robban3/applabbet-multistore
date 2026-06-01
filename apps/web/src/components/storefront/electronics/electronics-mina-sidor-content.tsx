/**
 * Innehålls-wrapper för /mina-sidor/* när electronics-temat är aktivt.
 * Layouten (header + ElectronicsAccountTabs) sitter i mina-sidor/layout.tsx —
 * här ska det INTE finnas AccountSidebar eller boxad StorefrontHeader.
 */
export function ElectronicsMinaSidorContent({
  title,
  subtitle,
  headerExtra,
  children,
}: {
  title: string;
  subtitle?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#F4F7FC] px-6 py-10 lg:px-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <div data-mina-sidor-page-head className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#0A2540] lg:text-[28px]">{title}</h1>
            {subtitle ? <p className="mt-1 text-[14px] text-[#0A2540]/65">{subtitle}</p> : null}
          </div>
          {headerExtra}
        </div>
        {children}
      </div>
    </section>
  );
}
