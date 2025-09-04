"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ICON_SIZE } from "@/lib/utils";
import PaginationControl from "@/components/common/table/pagination-control";
import { PagingInfo } from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { LILLY_URL } from "@/lib/lilly-utils/lilly-utils";

type LColumnDef<T> = ColumnDef<T>;

type TableProps<T> = {
  columns: LColumnDef<T>[];
  data: T[];
  pagingInfo: PagingInfo;
  onRowClick?: (id: string) => void;
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  pagingInfo,
}: TableProps<T>) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  function handleRowClick(id: string): void {
    if (!id || !onRowClick) return;
    onRowClick(id);
  }

  function updateUrlState(filters: Record<string, string | null>) {

    const _stringParams = LILLY_URL.updateUrlState(filters);

    if(!_stringParams) return;

    router.replace(_stringParams);
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table className="rounded-md overflow-hidden">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="cursor-pointer">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleRowClick(row.original.id)}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagingInfo && (
        <div className="flex items-center justify-end space-x-2 py-3 px-2 bg-muted/10">
          <Pagination>
            <PaginationContent className="flex items-center justify-between w-full">
              <div className="text-muted-foreground flex-1 text-xs">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="flex items-center gap-2">
                <PaginationControl
                  onClick={async () => {
                    const prev = pagingInfo.currentPage - 1;
                    updateUrlState({
                      page: `${prev}`,
                    });
                  }}
                  disabled={!pagingInfo.hasPrevPage}
                >
                  <ChevronLeft className={`${ICON_SIZE.medium}`} />
                </PaginationControl>
                <Select></Select>
                <PaginationControl
                  onClick={async () => {
                    const next = pagingInfo.currentPage + 1;
                    updateUrlState({
                      page: `${next}`,
                    });
                  }}
                  disabled={!pagingInfo.hasNextPage}
                >
                  <ChevronRight className={`${ICON_SIZE.medium}`} />
                </PaginationControl>
              </div>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
