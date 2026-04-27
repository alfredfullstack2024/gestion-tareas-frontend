import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export default function CreateTask({ projectId }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      api.post("/tasks", {
        ...data,
        project_id: projectId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
      setForm({
        title: "",
        description: "",
        priority: "medium",
      });
    },
  });

  return (
    <div className="bg-white p-3 rounded-lg shadow mb-3">
      <div className="flex gap-2">
        <input
          placeholder="Nueva tarea"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-1 rounded w-full text-sm"
        />

        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="border p-1 rounded text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          onClick={() => mutation.mutate(form)}
          className="bg-green-500 text-white px-3 rounded text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
}
