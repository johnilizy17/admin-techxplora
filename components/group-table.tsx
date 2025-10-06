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
  IconUsersGroup,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";

// ✅ Group schema
export const groupSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdDate: z.string(),
  totalMembers: z.number(),
  creatorName: z.string(),
  creatorEmail: z.string(),
});

type Group = z.infer<typeof groupSchema>;

// ✅ Generate fake groups
const generateGroups = (count = 15): Group[] => {
  const names = [
    "Math Enthusiasts",
    "Science Club",
    "Art League",
    "History Circle",
    "Code Masters",
    "Language Learners",
    "Debate Society",
    "AI Researchers",
    "Music Makers",
    "Writers Hub",
  ];
  const creators = [
    { name: "Alice Johnson", email: "alice.johnson@gmail.com" },
    { name: "Mark Daniels", email: "mark.daniels@gmail.com" },
    { name: "Sophia Lee", email: "sophia.lee@gmail.com" },
    { name: "James Smith", email: "james.smith@gmail.com" },
  ];

  return Array.from({ length: count }).map((_, i) => {
    const creator = creators[Math.floor(Math.random() * creators.length)];
    return {
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      createdDate: new Date(2025, 9, Math.floor(Math.random() * 30) + 1)
        .toISOString()
        .split("T")[0],
      totalMembers: Math.floor(Math.random() * 60) + 5,
      creatorName: creator.name,
      creatorEmail: creator.email,
    };
  });
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

// ✅ Drawer to show group details
function GroupDrawer({ group }: { group: Group }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left font-medium">
          {group.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{group.name}</DrawerTitle>
          <DrawerDescription>Group Information</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 text-sm space-y-2">
          <p>
            <strong>Created Date:</strong> {group.createdDate}
          </p>
          <p>
            <strong>Total Members:</strong> {group.totalMembers}
          </p>
          <p>
            <strong>Creator:</strong> {group.creatorName}
          </p>
          <p>
            <strong>Email:</strong> {group.creatorEmail}
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

// ✅ Table columns
const columns: ColumnDef<Group>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "name",
    header: "Group Name",
    cell: ({ row }) => <GroupDrawer group={row.original} />,
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
  },
  {
    accessorKey: "totalMembers",
    header: "Total Members",
    cell: ({ row }) => (
      <div className="text-right font-semibold text-blue-600">
        {row.original.totalMembers}
      </div>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// ✅ Draggable row
function DraggableRow({ row }: { row: Row<Group> }) {
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

// ✅ Main group table
export function GroupTable() {
  const [data, setData] = React.useState(() => generateGroups());
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 8 });

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
    <div className="w-full flex flex-col gap-4 px-4 lg:px-6">
      <h2 className="text-lg font-semibold px-2 flex items-center gap-2">
        <IconUsersGroup className="size-5 text-blue-500" /> Groups Management
      </h2>

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
                    No groups found.
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
