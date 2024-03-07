import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { IconBrandGithub, IconChecks } from "@tabler/icons-react";
import { createPageSeo } from "~/features/Shared/Utils/createPageSeo";

export const meta: MetaFunction = () => {
  const createdMeta = createPageSeo({
    title: `Indeksu - Team Up With Search Engines! Index Faster, Rank Higher.`,
    description: `Indeksu is a tool to help you index your websites faster. Built in public and proudly open source.`,
    canonical: `/`,
  });

  return createdMeta;
};

export default function Page() {
  return (
    <>
      <main className="px-5 max-w-5xl mx-auto py-24 font-jakarta">
        <section>
          <h1 className="text-center text-4xl font-bold leading-tight tracking-tight sm:text-6xl sm:leading-[1.35]">
            Team Up With Search Engines! Index Faster, Rank Higher.
          </h1>
          <p className="mt-6 text-center text-xl max-w-xl mx-auto font-medium leading-relaxed">
            <div>Indeksu is a tool to help you index your websites faster.</div>
            <div>Built in public and proudly open source.</div>
          </p>
          <div className="flex gap-5 justify-center mt-10">
            <Link
              to="/auth/signup"
              className="rounded-full bg-black text-white px-7 py-4 font-semibold uppercase"
            >
              Start For Free
            </Link>
            <a
              href="https://github.com/askides/indeksu.com"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full bg-gray-100 text-black px-7 py-4 font-semibold uppercase inline-flex gap-2"
            >
              <IconBrandGithub size={24} className="shrink-0" />
              <span>Give Us A Star</span>
            </a>
          </div>
          <div className="flex items-center justify-center flex-wrap gap-8 mt-16">
            <div className="flex items-center gap-3">
              <div className="bg-sky-200 flex rounded-full items-center justify-center p-2">
                <IconChecks size={20} className="shrink-0 text-sky-700" />
              </div>
              <span>Coming Soon</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-sky-200 flex rounded-full items-center justify-center p-2">
                <IconChecks size={20} className="shrink-0 text-sky-700" />
              </div>
              <span>Coming Soon</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-sky-200 flex rounded-full items-center justify-center p-2">
                <IconChecks size={20} className="shrink-0 text-sky-700" />
              </div>
              <span>Coming Soon</span>
            </div>
          </div>
        </section>

        <section className="my-24">
          <div className="bg-sky-100 aspect-[4/3] rounded-lg"></div>
        </section>
      </main>
    </>
  );
}
