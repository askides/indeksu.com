import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/database/client";
import { Button } from "~/features/Admin/UI/Button";
import { Card } from "~/features/Admin/UI/Card";
import { Table } from "~/features/Admin/UI/Table";
import { authenticator } from "~/features/Shared/Services/auth.server";
import { Google } from "~/features/Shared/Services/google.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  const site = await db.site.findFirstOrThrow({
    where: { id: params.id, user_id: session.id },
  });

  const client = await new Google().asUser(session.id);
  const sitemaps = await client.fetchSitemaps(site.id);

  const pages = await db.url.findMany({
    where: { site_id: site.id, notified_at: { not: null } },
    orderBy: { notified_at: "desc" },
  });

  return json({ site, sitemaps, pages });
}

export default function Page() {
  const { site, sitemaps, pages } = useLoaderData<typeof loader>();

  const onToggleIndex = async () => {
    const response = await fetch(`/api/sites/${site.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: site.status === 0 ? 1 : 0 }),
    });

    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 space-y-5">
      <Card>
        <Card.Header>
          <Card.Title>{site.resource}</Card.Title>
          <Card.Subtitle>
            Visualize the details of the site and its sitemaps.
          </Card.Subtitle>
        </Card.Header>
        <Card.Body className="space-y-5 pt-0">
          <Button
            tint={site.status ? "red" : "emerald"}
            size="sm"
            onClick={onToggleIndex}
          >
            {site.status === 0 ? "Enable Indexing" : "Disable Indexing"}
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Sitemap List</Card.Title>
          <Card.Subtitle>
            All the sitemaps registered for this site.
          </Card.Subtitle>
        </Card.Header>

        <Card.Body className="space-y-5 px-0 py-2">
          <Table>
            <thead>
              <tr>
                <Table.Cell as="th">URL</Table.Cell>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sitemaps.map((el) => (
                <tr className="h-10">
                  <Table.Cell className="first-of-type:font-mono">
                    {el.path}
                  </Table.Cell>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Indexed URLs</Card.Title>
          <Card.Subtitle>
            All the sitemaps registered for this site.
          </Card.Subtitle>
        </Card.Header>

        <Card.Body className="space-y-5 px-0 py-2">
          <Table>
            <thead>
              <tr>
                <Table.Cell as="th">URL</Table.Cell>
                <Table.Cell as="th" className="text-right">
                  Last Index Request
                </Table.Cell>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((el) => (
                <tr className="h-10">
                  <Table.Cell className="font-mono">{el.url}</Table.Cell>
                  <Table.Cell className="font-mono text-right">
                    {new Date(el.notified_at!).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Table.Cell>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
