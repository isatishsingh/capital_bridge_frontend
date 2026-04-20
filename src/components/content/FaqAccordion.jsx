import { useState } from 'react';

export const FaqAccordion = ({ items }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const open = index === active;

        return (
          <div key={item.question} className="surface overflow-hidden">
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setActive(open ? -1 : index)}
            >
              <span className="text-base font-semibold text-ink">{item.question}</span>
              <span className="text-xl font-light text-accent">{open ? '−' : '+'}</span>
            </button>
            {open ? <div className="border-t border-slate-100 px-6 py-5 text-sm leading-7 text-slate-600">{item.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
};
