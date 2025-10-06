"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { z } from "zod";
import {
  IconGripVertical,
  IconDotsVertical,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

// ✅ Quiz schema
export const quizSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  totalAttempts: z.number(),
  avgScore: z.number(),
  createdBy: z.object({
    name: z.string(),
    email: z.string(),
  }),
});

type Quiz = z.infer<typeof quizSchema>;

// ✅ Fake data generator
const generateQuizzes = (count = 25): Quiz[] => {
  const names = [
    "Math Fundamentals",
    "English Grammar Test",
    "Science Challenge",
    "History Quiz",
    "Programming Basics",
    "Geography Trivia",
    "Physics Concepts",
    "Biology Lab Quiz",
    "Current Affairs",
    "AI & ML Knowledge",
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: names[Math.floor(Math.random() * names.length)],
    createdAt: new Date(2025, 9, Math.floor(Math.random() * 25) + 1)
      .toISOString()
      .split("T")[0],
    totalAttempts: Math.floor(Math.random() * 200),
    avgScore: Number((Math.random() * 100).toFixed(1)),
    createdBy: {
      name: ["John Doe", "Mary Smith", "James Parker", "Sarah Lee"][
        Math.floor(Math.random() * 4)
      ],
      email: [
        "john@school.com",
        "mary@school.com",
        "james@school.com",
        "sarah@school.com",
      ][Math.floor(Math.random() * 4)],
    },
  }));
};

// ✅ Drawer component
function QuizDrawer({ quiz }: { quiz: Quiz }) {
  return (
    <dialog id={`quiz-${quiz.id}`} className="modal">
      <form method="dialog" className="modal-box max-w-md">
        <h3 className="font-bold text-lg mb-2">{quiz.name}</h3>
        <p className="text-sm text-gray-600 mb-4">Quiz Details</p>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Created At:</strong> {quiz.createdAt}
          </p>
          <p>
            <strong>Total Attempts:</strong> {quiz.totalAttempts}
          </p>
          <p>
            <strong>Average Score:</strong> {quiz.avgScore}%
          </p>
          <p>
            <strong>Created By:</strong> {quiz.createdBy.name}
          </p>
          <p>
            <strong>Email:</strong> {quiz.createdBy.email}
          </p>
        </div>

        <div className="modal-action mt-4">
          <button className="btn btn-outline">Close</button>
        </div>
      </form>
    </dialog>
  );
}

// ✅ Draggable handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <button
      {...attributes}
      {...listeners}
      className="cursor-grab text-gray-400 hover:text-gray-600"
    >
      <IconGripVertical size={16} />
    </button>
  );
}

// ✅ Draggable row
function DraggableRow({
  quiz,
  onClick,
}: {
  quiz: Quiz;
  onClick: (quiz: Quiz) => void;
}) {
  const { setNodeRef, transform, transition } = useSortable({
    id: quiz.id,
  });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="hover:bg-gray-50 cursor-pointer"
    //   onClick={() => onClick(quiz)}
    >
      <td className="p-3">
        <DragHandle id={quiz.id} />
      </td>
      <td className="p-3 font-medium">{quiz.name}</td>
      <td className="p-3">{quiz.createdAt}</td>
      <td className="p-3">{quiz.totalAttempts}</td>
      <td className="p-3">{quiz.avgScore}%</td>
      </tr>
  );
}

// ✅ Main component
export default function QuizTable() {
  const [data, setData] = React.useState<Quiz[]>(() => generateQuizzes());
  const [search, setSearch] = React.useState("");
  const [filterDate, setFilterDate] = React.useState("");

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const filteredData = data.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterDate || q.createdAt === filterDate)
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData.map((d) => d.id),
    [filteredData]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleRowClick = (quiz: Quiz) => {
    const modal = document.getElementById(
      `quiz-${quiz.id}`
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Quiz List</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-200 rounded-xl">
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Quiz Name</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Total Attempts</th>
                <th className="p-3 text-left">Avg. Score</th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {filteredData.map((quiz) => (
                  <React.Fragment key={quiz.id}>
                    <DraggableRow quiz={quiz} onClick={handleRowClick} />
                    <QuizDrawer quiz={quiz} />
                  </React.Fragment>
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>

      {/* Pagination Placeholder (optional) */}
      <div className="flex justify-end mt-4">
        <button className="p-2 border rounded-md mr-2">
          <IconChevronLeft />
        </button>
        <button className="p-2 border rounded-md">
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}
