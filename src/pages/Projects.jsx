import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import Tasks from "./Tasks";
import CreateProject from "../components/CreateProject";

const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data;
};

const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedProject(null);
    },
  });

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) return <p className="text-center mt-10">Cargando...</p>;
  if (error)
    return <p className="text-center mt-10">Error cargando proyectos</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Proyectos</h2>

      {/* 🔥 Crear Proyecto */}
      <CreateProject />

      {/* 🔥 Lista de proyectos */}
      <div className="flex flex-col gap-2 mt-4">
        {data.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProject(p.id)}
            className={`flex justify-between items-center px-4 py-3 rounded-xl border cursor-pointer transition-all shadow-sm
              ${
                selectedProject === p.id
                  ? "bg-blue-50 border-blue-400 ring-1 ring-blue-400"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
          >
            <span className="text-sm font-semibold text-gray-700">{p.name}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("¿Eliminar proyecto?")) {
                  deleteMutation.mutate(p.id);
                }
              }}
              className="p-1 hover:bg-red-50 rounded-full transition-colors"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 Sección de Tareas con Nota de Ayuda */}
      {selectedProject && (
        <div className="mt-10 animate-in fade-in duration-500">
          
          {/* 👇 NOTA DE UX: Justo antes del Kanban 👇 */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <p className="text-sm font-bold text-amber-800 uppercase tracking-tight">
                Nota:
              </p>
            </div>
            <p className="text-sm text-amber-700 mt-1 ml-7">
              Para cambiar el estado de una tarea, simplemente <span className="font-bold underline">arrástrela</span> a la columna que crea indicada. Los cambios se guardarán automáticamente.
            </p>
          </div>

          <Tasks projectId={selectedProject} />
        </div>
      )}
    </div>
  );
}
