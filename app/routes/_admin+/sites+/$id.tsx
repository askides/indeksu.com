import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/database/client";
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

  const sitemaps = await new Google().fetchSiteSitemaps(session.id, site.id);

  return json({ site, sitemaps });
}

export default function Page() {
  const { site, sitemaps } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-slate-50 p-5 space-y-5">
      <Card>
        <Card.Header>
          <Card.Title>{site.resource}</Card.Title>
          <Card.Subtitle>
            Visualize the details of the site and its sitemaps.
          </Card.Subtitle>
        </Card.Header>
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
    </div>
  );
}
