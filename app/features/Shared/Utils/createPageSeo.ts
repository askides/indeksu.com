import type { MetaDescriptor } from "@remix-run/node";
import { defu } from "defu";

interface Overrides {
  title: string;
  description: string;
  canonical: string;
}

export function createPageSeo(overrides: Overrides): MetaDescriptor[] {
  const siteUrl = new URL("http://indeksu.com/");
  const canonical = new URL(overrides.canonical, siteUrl).toString();

  const defaults = defu(overrides, {
    openGraph: {
      title: overrides.title,
      description: overrides.description,
      url: new URL(overrides.canonical, siteUrl).toString(),
      siteName: "Indeksu",
      image: {
        url: new URL("/assets/og/image.jpg", siteUrl).toString(),
        width: 1200,
        height: 630,
        alt: "Indeksu",
      },
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: overrides.title,
      description: overrides.description,
      image: new URL("/assets/og/image.jpg", siteUrl).toString(),
    },
  });

  return [
    { title: defaults.title },
    { name: "description", content: defaults.description },
    { property: "og:title", content: defaults.openGraph.title },
    { property: "og:description", content: defaults.openGraph.description },
    { property: "og:image", content: defaults.openGraph.image.url },
    { property: "og:url", content: defaults.openGraph.url },
    { property: "og:type", content: defaults.openGraph.type },
    { property: "twitter:card", content: defaults.twitter.card },
    { property: "twitter:title", content: defaults.twitter.title },
    { property: "twitter:description", content: defaults.twitter.description },
    { property: "twitter:image", content: defaults.twitter.image },
    { tagName: "link", rel: "canonical", href: canonical },
  ];
}
