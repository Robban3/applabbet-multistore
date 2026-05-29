export type ClassicValueProp = {
  title: string;
  text: string;
};

export type ClassicValuePropsProps = {
  title: string;
  items: ClassicValueProp[];
};

export function ClassicValueProps({ title, items }: ClassicValuePropsProps) {
  return (
    <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-5">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6a44]">
          Varför välja oss
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#17120d] sm:text-4xl lg:text-[46px]">
          {title}
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-[22px] border border-black/10 bg-white p-8 shadow-[0_10px_35px_rgba(31,24,18,0.08)]"
          >
            <h3 className="text-xl font-semibold text-[#17120d]">{item.title}</h3>
            <p className="mt-3 leading-7 text-[#5f554a]">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
