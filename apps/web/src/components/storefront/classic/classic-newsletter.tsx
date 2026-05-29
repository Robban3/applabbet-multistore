export type ClassicNewsletterProps = {
  title: string;
  description: string;
};

export function ClassicNewsletter({
  title,
  description,
}: ClassicNewsletterProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-5">
      <div className="overflow-hidden rounded-[22px] border border-black/10 bg-[#17120d] px-8 py-12 text-white shadow-[0_16px_60px_rgba(31,24,18,0.18)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9b08d]">
            Nyhetsbrev
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">
            {title}
          </h2>
          <p className="mt-4 text-white/70">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Din e-postadress"
              className="h-14 flex-1 rounded-full border border-white/10 bg-white px-6 text-black outline-none"
            />
            <button
              type="button"
              className="h-14 rounded-full bg-[#c9a16b] px-8 font-semibold text-black"
            >
              Prenumerera
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
