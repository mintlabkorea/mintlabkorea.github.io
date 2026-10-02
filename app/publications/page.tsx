import type { Metadata } from "next";
import { publications, type Publication } from "@/data/publications";
import PublicationTabs from "@/components/publications/PublicationTabs";

export const metadata: Metadata = {
  title: "Publications",
  description: "Publications from the MINT Lab.",
};

function PublicationEntry({ pub }: { pub: (typeof publications)[0] }) {
  const resources = [
    ...(pub.status === "preprint" && pub.links.paper
      ? [{ label: "arXiv", url: pub.links.paper }]
      : []),
    { label: "Code", url: pub.links.code },
    { label: "Video", url: pub.links.video },
    { label: "Project", url: pub.links.project },
    ...(pub.links.media ?? []),
  ].filter((resource) => resource.url);

  return (
    <article className="py-3">
      <h3 className="text-[0.9375rem] sm:text-base font-semibold text-neutral-900 leading-snug">
        {pub.links.paper ? (
          <a
            href={pub.links.paper}
            className="hover:text-[#2d6e3a] hover:underline underline-offset-2 transition-colors"
          >
            {pub.title}
          </a>
        ) : (
          pub.title
        )}
      </h3>
      <p className="mt-1 text-[0.8125rem] sm:text-sm text-neutral-600 leading-relaxed">{pub.authors}</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.8125rem] sm:text-sm leading-relaxed">
        <p>
          <span className="font-medium text-[#2d6e3a]">{pub.venue}</span>
          {pub.underReview && pub.status === "preprint" && (
            <span className="text-neutral-500"> · Under review</span>
          )}
          <span className="text-neutral-500"> · {pub.year}</span>
          {pub.note && (
            <span className="text-neutral-500 italic"> · {pub.note}</span>
          )}
        </p>
        {resources.length > 0 && (
          <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 md:w-auto">
            {resources.map((resource) => (
              <a
                key={`${resource.label}-${resource.url}`}
                href={resource.url}
                className="inline-flex min-h-7 items-center text-[0.8125rem] sm:text-xs text-neutral-600 underline underline-offset-4 hover:text-[#2d6e3a] transition-colors"
              >
                {resource.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function PublicationList({ entries }: { entries: Publication[] }) {
  const pending = [
    ...entries.filter((pub) => pub.status === "preprint"),
    ...entries.filter((pub) => pub.status === "submitted"),
  ];
  const published = entries.filter(
    (pub) => pub.status !== "preprint" && pub.status !== "submitted"
  );
  const years = [...new Set(published.map((pub) => pub.year))].sort((a, b) => b - a);
  const sections = [
    ...(pending.length ? [{ label: "Preprints & Under Review", entries: pending }] : []),
    ...years.map((year) => ({
      label: String(year),
      entries: published.filter((pub) => pub.year === year),
    })),
  ];

  if (!entries.length) {
    return <p className="py-6 text-sm text-neutral-500">No publications listed in this category yet.</p>;
  }

  return sections.map((section) => {
    // Keep undated entries in their curated positions while ordering dated papers.
    const dated = section.entries.filter((pub) => pub.date).sort(
      (a, b) => b.date!.localeCompare(a.date!)
    );
    let datedIndex = 0;
    const sorted = section.entries.map((pub) => pub.date ? dated[datedIndex++] : pub);
    // Keep public preprints together above submitted-only manuscripts.
    sorted.sort((a, b) => Number(a.status === "submitted") - Number(b.status === "submitted"));

    return (
      <section key={section.label} className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#2d6e3a] mb-1 pb-2 border-b border-neutral-100">
          {section.label}
        </h2>
        <div className="divide-y divide-neutral-100">
          {sorted.map((pub) => <PublicationEntry key={pub.id} pub={pub} />)}
        </div>
      </section>
    );
  });
}

export default function PublicationsPage() {
  const isOther = (pub: Publication) =>
    pub.group ? pub.group === "other" : pub.type === "workshop" || pub.type === "other";

  return (
    <div className="pt-24 pb-8 px-5 sm:px-6">
      <div className="max-w-[60rem] mx-auto">
        <PublicationTabs tabs={[
          {
            id: "main",
            label: "Journals & Major Conferences",
            content: <PublicationList entries={publications.filter((pub) => !isOther(pub))} />,
          },
          {
            id: "other",
            label: "Other Publications",
            content: <PublicationList entries={publications.filter(isOther)} />,
          },
        ]} />
      </div>
    </div>
  );
}
