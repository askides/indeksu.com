import { Credentials } from "google-auth-library";
import { google } from "googleapis";
import { db } from "~/database/client";

export class Google {
  client(credentials?: Credentials) {
    const _client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    if (credentials) {
      _client.setCredentials(credentials);
    }

    return _client;
  }

  async redirect() {
    const redirectUrl = this.client().generateAuthUrl({
      includeGrantedScopes: true,
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/indexing",
        "https://www.googleapis.com/auth/webmasters.readonly",
      ],
    });

    return redirectUrl;
  }

  async createCredentials(uid: string) {
    const credentials = await db.oAuthToken.findUniqueOrThrow({
      where: {
        user_id: uid,
      },
    });

    // Check if is expired from SQLite
    if (credentials.expires_at.getTime() < Date.now()) {
      console.info("The access token is expired...");

      // Refresh the credentials
      const res = await this.client({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        scope: credentials.scopes,
      }).refreshAccessToken();

      // Update the credentials in the SQLite
      await db.oAuthToken.update({
        where: {
          user_id: uid,
        },
        data: {
          access_token: res.credentials.access_token!,
          expires_at: new Date(res.credentials.expiry_date!),
        },
      });

      return res.credentials;
    }

    console.log("The access token is not expired...");

    return {
      access_token: credentials.access_token,
      scope: credentials.scopes,
    };
  }

  async fetchUserSites(uid: string) {
    const credentials = await this.createCredentials(uid);

    const client = google.webmasters({
      version: "v3",
      auth: this.client(credentials),
    });

    const res = await client.sites.list({});

    if (!res.data.siteEntry) {
      return [];
    }

    return res.data.siteEntry
      .map((site) => site.siteUrl)
      .filter(Boolean) as string[];
  }

  async fetchSiteSitemaps(uid: string, sid: string) {
    const credentials = await this.createCredentials(uid);

    const client = google.webmasters({
      version: "v3",
      auth: this.client(credentials),
    });

    const site = await db.site.findFirstOrThrow({
      where: {
        id: sid,
      },
    });

    const res = await client.sitemaps.list({
      siteUrl: site.resource,
    });

    return res.data?.sitemap ?? [];
  }

  async indexUrl(uid: string, url: string) {
    const credentials = await this.createCredentials(uid);

    const client = google.indexing({
      version: "v3",
      auth: this.client(credentials),
    });

    const res = await client.urlNotifications.publish({
      requestBody: {
        url,
        type: "URL_UPDATED",
      },
    });

    return res.data;
  }

  async fetchSitemapLines(uid: string, sid: string, sitemap: string) {
    const credentials = await this.createCredentials(uid);

    const client = google.webmasters({
      version: "v3",
      auth: this.client(credentials),
    });

    const site = await db.site.findFirstOrThrow({
      where: {
        id: sid,
      },
    });

    const res = await client.sitemaps.get({
      siteUrl: site.resource,
      feedpath: sitemap,
    });

    return res;
  }
}
