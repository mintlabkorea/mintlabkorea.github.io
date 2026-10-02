"use client";

import { useRef, useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

export default function PublicationTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <>
      <div className="lg:sticky lg:top-16 z-30 -mx-5 px-5 sm:-mx-6 sm:px-6 pt-2 pb-3 sm:py-4 mb-4 sm:mb-6 flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between bg-white/95 backdrop-blur-sm">
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900">Publications</h1>
        <div role="tablist" aria-label="Publication categories" className="grid grid-cols-2 items-stretch gap-x-3 border-b border-neutral-200 text-[0.8125rem] sm:text-sm text-neutral-500 lg:flex lg:gap-x-5">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => { buttons.current[index] = element; }}
              type="button"
              role="tab"
              id={`publication-tab-${tab.id}`}
              aria-controls={`publication-panel-${tab.id}`}
              aria-selected={active === tab.id}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
                else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = tabs.length - 1;
                else return;
                event.preventDefault();
                setActive(tabs[next].id);
                buttons.current[next]?.focus();
              }}
              className={`cursor-pointer min-h-11 min-w-0 -mb-px border-b-2 px-1 py-2 font-medium leading-snug text-center lg:text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d6e3a] ${active === tab.id ? "border-[#2d6e3a] text-[#2d6e3a]" : "border-transparent hover:border-neutral-300 hover:text-neutral-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`publication-panel-${tab.id}`}
          aria-labelledby={`publication-tab-${tab.id}`}
          hidden={active !== tab.id}
          tabIndex={0}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2d6e3a]"
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
