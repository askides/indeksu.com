import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card } from "~/features/Admin/UI/Card";
import { Table } from "~/features/Admin/UI/Table";

const columnFactory = createColumnHelper<{
  url: string;
  status: string;
}>();

const columns = [
  columnFactory.accessor("url", { header: "URL" }),
  columnFactory.accessor("status", { header: "Status" }),
];

const data: { url: string; status: string }[] = [
  {
    url: "https://google.com",
    status: "Active",
  },
  {
    url: "https://facebook.com",
    status: "Inactive",
  },
  {
    url: "https://twitter.com",
    status: "Inactive",
  },
];

export default function Page() {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
      </Card>
    </div>
  );
}
