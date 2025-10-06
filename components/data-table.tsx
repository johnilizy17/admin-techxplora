"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

// ✅ Mock data
const users: User[] = [
  { id: 1, name: "John Doe", email: "john@student.edu", role: "Student", status: "Active", joined: "2024-05-12" },
  { id: 2, name: "Jane Smith", email: "jane@student.edu", role: "Student", status: "Inactive", joined: "2024-07-01" },
  { id: 3, name: "Mr. Adams", email: "adams@school.edu", role: "Teacher", status: "Active", joined: "2024-01-22" },
  { id: 4, name: "Mrs. Brown", email: "brown@school.edu", role: "Teacher", status: "Active", joined: "2024-03-18" },
  { id: 5, name: "Admin One", email: "admin@system.com", role: "Admin", status: "Active", joined: "2023-11-10" },
  { id: 6, name: "Admin Teacher", email: "super@school.edu", role: "Admin Teacher", status: "Active", joined: "2024-02-09" },
  { id: 7, name: "Inactive Admin", email: "inactive@system.com", role: "Admin", status: "Inactive", joined: "2023-12-01" },
];

// ✅ Filter users by role
const getUsersByRole = (role: User["role"]) => users.filter((u) => u.role === role);

// ✅ Single user row
function UserRow({ user }: { user: User }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
      </TableCell>
      <TableCell>{user.joined}</TableCell>
      <TableCell className="flex gap-2">
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

// ✅ Main Component
export default function UserManagementTabs() {
  return (
    <div className="w-full flex flex-col gap-6  px-4 lg:px-6">
      <h2 className="text-xl font-semibold">User Management</h2>

      <Tabs defaultValue="student" className="w-full">
        {/* Tab List */}
        <TabsList className="flex flex-wrap justify-start">
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="teacher">Teachers</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="adminTeacher">Admin Teachers</TabsTrigger>
        </TabsList>

        {/* Students */}
        <TabsContent value="student">
          <UserTable title="Students" data={getUsersByRole("Student")} />
        </TabsContent>

        {/* Teachers */}
        <TabsContent value="teacher">
          <UserTable title="Teachers" data={getUsersByRole("Teacher")} />
        </TabsContent>

        {/* Admins */}
        <TabsContent value="admin">
          <UserTable title="Admins" data={getUsersByRole("Admin")} />
        </TabsContent>

        {/* Admin Teachers */}
        <TabsContent value="adminTeacher">
          <UserTable title="Admin Teachers" data={getUsersByRole("Admin Teacher")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ✅ Reusable Table
function UserTable({ title, data }: { title: string; data: User[] }) {
  return (
    <div className="mt-4 border rounded-lg">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-muted/50">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button size="sm">Add {title.slice(0, -1)}</Button>
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
          {data.length ? (
            data.map((user) => <UserRow key={user.id} user={user} />)
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No {title.toLowerCase()} found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
