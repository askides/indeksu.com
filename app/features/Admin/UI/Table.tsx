import React from "react";
import { tv } from "tailwind-variants";

const tableStyles = tv({
  base: "min-w-full divide-y divide-slate-100",
});

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

function Table({ className, ...others }: TableProps) {
  return <table className={tableStyles({ class: className })} {...others} />;
}

const tableCellStyles = tv({
  base: "px-5 py-3 text-start text-sm tracking-tight text-slate-900",
});

export interface TableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  as?: "th" | "td";
}

function TableCell({
  as: Component = "td",
  className,
  ...others
}: TableCellProps) {
  return (
    <Component className={tableCellStyles({ class: className })} {...others} />
  );
}

const Composed = Object.assign(Table, {
  Cell: TableCell,
});

export { Composed as Table };
