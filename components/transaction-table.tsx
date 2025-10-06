"use client";

import * as React from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import {
  IconGripVertical,
  IconDotsVertical,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconLoader,
  IconArrowDown,
  IconArrowUp,
  IconRepeat,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";


// ✅ Transaction schema
export const transactionSchema = z.object({
  id: z.number(),
  date: z.string(),
  description: z.string(),
  type: z.enum(["Deposit", "Transfer", "Withdraw"]),
  amount: z.number(),
  status: z.enum(["Completed", "Pending", "Failed"]),
});

type Transaction = z.infer<typeof transactionSchema>;

// ✅ Fake transaction generator
const generateTransactions = (count = 20): Transaction[] => {
  const statuses = ["Completed", "Pending", "Failed"] as const;
  const types = ["Deposit", "Transfer", "Withdraw"] as const;
  const descriptions = [
    "Wallet Funding",
    "Bank Transfer",
    "ATM Withdrawal",
    "Internal Transfer",
    "Crypto Deposit",
    "Savings Withdrawal",
    "Peer Transfer",
    "Top-Up",
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    date: new Date(2025, 9, Math.floor(Math.random() * 30) + 1)
      .toISOString()
      .split("T")[0],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    type: types[Math.floor(Math.random() * types.length)],
    amount: Number((Math.random() * 2000 + 50).toFixed(2)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

// ✅ Drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="size-4" />
    </Button>
  );
}

// ✅ Columns
const columns: ColumnDef<Transaction>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <TransactionDrawer item={row.original} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const t = row.original.type;
      const icon =
        t === "Deposit" ? (
          <IconArrowDown className="size-3 text-green-500" />
        ) : t === "Withdraw" ? (
          <IconArrowUp className="size-3 text-red-500" />
        ) : (
          <IconRepeat className="size-3 text-blue-500" />
        );
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium"
        >
          {icon}
          {t}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount ($)",
    cell: ({ row }) => (
      <div
        className={`text-right font-medium ${
          row.original.type === "Deposit"
            ? "text-green-600"
            : row.original.type === "Withdraw"
            ? "text-red-600"
            : "text-blue-600"
        }`}
      >
        {row.original.type === "Deposit"
          ? "+"
          : row.original.type === "Withdraw"
          ? "-"
          : "≈"}
        {row.original.amount.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 text-xs">
        {row.original.status === "Completed" ? (
          <IconCircleCheckFilled className="text-green-500 size-3" />
        ) : row.original.status === "Pending" ? (
          <IconLoader className="animate-spin size-3 text-yellow-500" />
        ) : (
          <span className="text-red-500">✕</span>
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// ✅ Draggable row
function DraggableRow({ row }: { row: Row<Transaction> }) {
  const { transform, transition, setNodeRef } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="relative data-[dragging=true]:opacity-70"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// ✅ Drawer to show transaction details
function TransactionDrawer({ item }: { item: Transaction }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left font-medium">
          {item.description}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item.description}</DrawerTitle>
          <DrawerDescription>Transaction Details</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 text-sm space-y-2">
          <p>
            <strong>Date:</strong> {item.date}
          </p>
          <p>
            <strong>Type:</strong> {item.type}
          </p>
          <p>
            <strong>Amount:</strong> ${item.amount.toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {item.status}
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// ✅ Main table component
export function TransactionHistoryTable() {
  const [data, setData] = React.useState(() => generateTransactions());
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data.map((d) => d.id), [data]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="w-full flex flex-col gap-4  px-4 lg:px-6">
      <h2 className="text-lg font-semibold px-2">Transaction History</h2>

      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center h-24">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-2">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
