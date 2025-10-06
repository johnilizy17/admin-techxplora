"use client";

import * as React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

// ✅ User Type Definition
interface User {
  id: number;
  name: string;
  email: string;
  role: "Student" | "Teacher" | "Admin" | "Admin Teacher";
  status: "Active" | "Inactive";
  joined: string;
}

// ✅ Mock Data (Students Only)
const students: User[] = [
  { id: 1, name: "John Doe", email: "john@student.edu", role: "Student", status: "Active", joined: "2024-05-12" },
  { id: 2, name: "Jane Smith", email: "jane@student.edu", role: "Student", status: "Inactive", joined: "2024-07-01" },
  { id: 3, name: "Michael Brown", email: "michael@student.edu", role: "Student", status: "Active", joined: "2024-06-20" },
  { id: 4, name: "Linda Johnson", email: "linda@student.edu", role: "Student", status: "Active", joined: "2024-03-15" },
];

// ✅ Single user row
function StudentRow({ student }: { student: User }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{student.name}</TableCell>
      <TableCell>{student.email}</TableCell>
      <TableCell>
        <Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge>
      </TableCell>
      <TableCell>{student.joined}</TableCell>
      <TableCell className="flex gap-2 justify-end">
        <Button size="icon" variant="ghost">
          <IconEye className="size-4" />
        </Button>
        <Button size="icon" variant="ghost">
          <IconEdit className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" className="text-red-500">
          <IconTrash className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// ✅ Main Component (Students Only)
export default function StudentManagement({title = "Student"}) {
  return (
    <div className="w-full flex flex-col gap-6 px-4 lg:px-6">
      <h2 className="text-xl font-semibold">{title} Management</h2>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b bg-muted/50">
          <h3 className="text-lg font-medium">{title}s</h3>
          <Button size="sm">Add {title}</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length ? (
              students.map((student) => <StudentRow key={student.id} student={student} />)
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
