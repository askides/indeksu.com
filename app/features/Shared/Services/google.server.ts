import { Credentials } from "google-auth-library";
import { google } from "googleapis";
import { db } from "~/database/client";

export class Google {
  private readonly _client: typeof google.auth.OAuth2.prototype;

  constructor() {
    this._client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );
  }

  withCredentials(credentials: Credentials) {
    this._client.setCredentials(credentials);
    return this;
  }

  async asUser(uid: string) {
    const credentials = await this.credentials(uid);

    this._client.setCredentials({
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      scope: credentials.scope,
    });

    return this;
  }

  async credentials(uid: string) {
    const credentials = await db.oAuthToken.findUniqueOrThrow({
      where: {
        user_id: uid,
      },
    });

    // Check if is expired from SQLite
    if (credentials.expires_at.getTime() < Date.now()) {
      // Refresh the credentials
      this._client.setCredentials({
        refresh_token: credentials.refresh_token,
      });

      const res = await this._client.refreshAccessToken();

      // Update the credentials in the SQLite
      const updated = await db.oAuthToken.update({
        where: {
          user_id: uid,
        },
        data: {
          access_token: res.credentials.access_token!,
          expires_at: new Date(res.credentials.expiry_date!),
        },
      });

      return {
        access_token: updated.access_token,
        refresh_token: updated.refresh_token,
        scope: updated.scopes,
      };
    }

    return {
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      scope: credentials.scopes,
    };
  }

  static async tokens(code: string) {
    return new this()._client.getToken(code);
  }

  static async redirect() {
    const redirectUrl = new this()._client.generateAuthUrl({
      includeGrantedScopes: true,
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/indexing",
        "https://www.googleapis.com/auth/webmasters.readonly",
      ],
    });

    return redirectUrl;
  }

  async fetchSites() {
    const client = google.webmasters({
      version: "v3",
      auth: this._client,
    });

    const res = await client.sites.list({});

    if (!res.data.siteEntry) {
      return [];
    }

    return res.data.siteEntry
      .map((site) => site.siteUrl)
      .filter(Boolean) as string[];
  }

  async fetchSitemaps(sid: string) {
    const site = await db.site.findFirstOrThrow({
      where: {
        id: sid,
      },
    });

    const client = google.webmasters({
      version: "v3",
      auth: this._client,
    });

    const res = await client.sitemaps.list({
      siteUrl: site.resource,
    });

    return res.data.sitemap ?? [];
  }

  async index(url: string) {
    const client = google.indexing({
      version: "v3",
      auth: this._client,
    });

    const res = await client.urlNotifications.publish({
      requestBody: {
        url,
        type: "URL_UPDATED",
      },
    });

    return res.data;
  }
}
