import { Site } from "@prisma/client";
import { LoaderFunctionArgs, SerializeFrom, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { db } from "~/database/client";
import { Alert } from "~/features/Admin/UI/Alert";
import { Button } from "~/features/Admin/UI/Button";
import { Card } from "~/features/Admin/UI/Card";
import { Table } from "~/features/Admin/UI/Table";
import { authenticator } from "~/features/Shared/Services/auth.server";

const columnFactory = createColumnHelper<SerializeFrom<Site>>();

const columns = [
  columnFactory.accessor("resource", {
    header: "URL",
    cell: (row) => row.getValue(),
  }),
  columnFactory.accessor("status", {
    header: "Status",
    cell: (row) => (row.getValue() === 0 ? "Inactive" : "Active"),
  }),
  columnFactory.display({
    header: "Actions",
    cell: (cell) => (
      <Link
        className="text-sky-500 hover:underline"
        to={`/sites/${cell.row.original.id}`}
      >
        View Site
      </Link>
    ),
  }),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  const data = await db.site.findMany({
    where: {
      user_id: session.id,
    },
  });

  return json({ sites: data });
}

export default function Page() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { sites } = useLoaderData<typeof loader>();

  const table = useReactTable({
    data: sites,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onRefresh = async () => {
    setIsRefreshing(true);

    const res = await fetch("/api/sites", {
      method: "POST",
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <Card>
        <Card.Header>
          <Card.Title>Sites List</Card.Title>
          <Card.Subtitle>
            Display the list of all the sites imported from Google Search
            Console.
          </Card.Subtitle>
        </Card.Header>

        <Card.Body className="space-y-5 px-0 py-2">
          <Alert kind="info" className="mx-5">
            Currently only the 'Domain Resources' are supported.
          </Alert>

          <Table>
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((cell) => (
                    <Table.Cell as="th" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.header,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="h-10">
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell
                      key={cell.id}
                      className="first-of-type:font-mono"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="border-t border-slate-100">
          <Button type="button" onClick={onRefresh} loading={isRefreshing}>
            Refresh Sites
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
