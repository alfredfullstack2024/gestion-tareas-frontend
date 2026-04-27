import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export default function CreateProject() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post("/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setForm({ name: "", description: "" });
    },
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      <h3 className="font-semibold mb-2">Crear Proyecto</h3>

      <div className="flex gap-2">
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={() => mutation.mutate(form)}
          className="bg-blue-500 text-white px-4 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}
