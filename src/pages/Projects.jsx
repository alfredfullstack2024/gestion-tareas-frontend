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
      <h2 className="text-xl font-semibold mb-4">Proyectos</h2>

      {/* 🔥 Crear Proyecto */}
      <CreateProject />

      {/* 🔥 Lista de proyectos */}
      <div className="flex flex-col gap-2 mt-4">
        {data.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProject(p.id)}
            className={`flex justify-between items-center px-4 py-2 rounded-lg border cursor-pointer transition
              ${
                selectedProject === p.id
                  ? "bg-blue-50 border-blue-400"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
          >
            <span className="text-sm font-medium">{p.name}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("¿Eliminar proyecto?")) {
                  deleteMutation.mutate(p.id);
                }
              }}
              className="text-red-500 text-xs hover:underline"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 Kanban */}
      {selectedProject && (
        <div className="mt-8">
          <Tasks projectId={selectedProject} />
        </div>
      )}
    </div>
  );
}
