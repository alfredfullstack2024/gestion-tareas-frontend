import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDraggable } from "@dnd-kit/core";
import api from "../services/api";

export default function TaskCard({ task, projectId }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data) => api.put(`/tasks/${task.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      setEditing(false);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => api.delete(`/tasks/${task.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  // Estilo de arrastre con z-index alto para que no pase por debajo de otros elementos
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: transform ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all ${
        transform ? "shadow-xl rotate-2" : "hover:shadow-md"
      } flex flex-col gap-2 group`}
    >
      {/* ÁREA DE ARRASTRE Y CONTENIDO */}
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing flex flex-col gap-1"
      >
        {!editing && (
          <>
            <h4 className="font-bold text-gray-800 text-[15px] leading-tight">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {task.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* PRIORIDAD Y ACCIONES COMPACTAS */}
      {!editing && (
        <div className="flex items-center justify-between mt-2">
          {/* Badge de prioridad más pequeño */}
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              task.priority === "high"
                ? "bg-red-50 text-red-500"
                : task.priority === "medium"
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-green-50 text-green-600"
            }`}
          >
            {task.priority}
          </span>

          {/* Botones de acción discretos (se ven mejor al pasar el mouse) */}
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="text-gray-400 hover:text-blue-500 text-[11px] flex items-center gap-1"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("¿Eliminar tarea?")) deleteTaskMutation.mutate();
              }}
              className="text-gray-400 hover:text-red-500 text-[11px]"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {/* FORMULARIO DE EDICIÓN */}
      {editing && (
        <div className="flex flex-col gap-2 pt-1">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border-b focus:border-blue-500 outline-none text-sm font-semibold py-1"
            placeholder="Título"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded p-2 text-xs h-16 resize-none focus:ring-1 focus:ring-blue-400 outline-none"
            placeholder="Descripción"
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="border rounded text-xs p-1 bg-gray-50"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => updateTaskMutation.mutate(form)}
              className="flex-1 bg-blue-600 text-white text-[10px] py-1.5 rounded-lg font-bold"
            >
              GUARDAR
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 bg-gray-100 text-gray-600 text-[10px] py-1.5 rounded-lg font-bold"
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
