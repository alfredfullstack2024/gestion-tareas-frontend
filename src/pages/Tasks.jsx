import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import api from "../services/api";
import TaskCard from "./TaskCard";
import CreateTask from "../components/CreateTask";

const getTasks = async (projectId) => {
  const { data } = await api.get(`/tasks/${projectId}`);
  return data;
};

export default function Tasks({ projectId }) {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
  });

  const [overrides, setOverrides] = useState({});

  if (isLoading) return <p className="text-center py-10">Cargando tareas...</p>;

  const currentTasks = data.map((t) => overrides[t.id] || t);

  const columns = {
    backlog: currentTasks.filter((t) => t.status === "backlog"),
    in_progress: currentTasks.filter((t) => t.status === "in_progress"),
    done: currentTasks.filter((t) => t.status === "done"),
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id;
    const original = data.find((t) => t.id === active.id);

    setOverrides((prev) => ({
      ...prev,
      [active.id]: { ...original, status: newStatus },
    }));

    try {
      await api.patch(`/tasks/${active.id}`, { status: newStatus });
      queryClient.invalidateQueries(["tasks", projectId]);
    } catch {
      queryClient.invalidateQueries(["tasks", projectId]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column
          title="Backlog"
          tasks={columns.backlog}
          id="backlog"
          projectId={projectId}
        />

        <Column
          title="En progreso"
          tasks={columns.in_progress}
          id="in_progress"
          projectId={projectId}
        />

        <Column
          title="Hecho"
          tasks={columns.done}
          id="done"
          projectId={projectId}
        />
      </div>
    </DndContext>
  );
}

function Column({ title, tasks, id, projectId }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 p-4 rounded-2xl border border-gray-200 min-h-[400px] flex flex-col gap-4"
    >
      <h3 className="font-bold text-gray-600 uppercase text-xs tracking-wider px-2">
        {title}
      </h3>

      {/* 🔥 Crear tarea */}
      <CreateTask projectId={projectId} />

      {/* 🔥 Lista */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} projectId={projectId} />
        ))}
      </div>
    </div>
  );
}
