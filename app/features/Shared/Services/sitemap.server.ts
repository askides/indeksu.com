import Sitemapper from "sitemapper";

export async function fetchSiteUrls(sitemap: string) {
  const client = new Sitemapper({
    url: sitemap,
    timeout: 15000, // 15 seconds
  });

  const { sites } = await client.fetch();

  return sites;
}
