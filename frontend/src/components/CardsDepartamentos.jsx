import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { baseUrl } from "../../constants/global-variable.js";
import { queryClient } from "../../utils/queryClient.js";

const CardsDepartamentos = () => {
    // Busca departamentos
    const { data: departamentos = [], isLoading } = useQuery({
        queryKey: ["departamentos"],
        queryFn: async () => {
        const res = await fetch(`${baseUrl}/departamentos`);
        if (!res.ok) throw new Error("Erro ao buscar departamentos");
        return res.json();
        },
    });

    // Busca médias salariais
    const { data: medias = [] } = useQuery({
        queryKey: ["media-salarial-departamentos"],
        queryFn: async () => {
        if (!departamentos.length) return [];
        const results = await Promise.all(
            departamentos.map(async (dpt) => {
            const res = await fetch(`${baseUrl}/media/${dpt.id}`);
            const data = await res.json();
            return { id: dpt.id, media: data.media ?? 0 };
            })
        );
        return results;
        },
        enabled: !!departamentos.length,
    });

    // Deleta departamento
    const deleteMutation = useMutation({
      mutationFn: async (id) => {
        const res = await fetch(`${baseUrl}/departamentos/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.erro || "Erro ao deletar departamento");
        return data;
      },
      onSuccess: () => {
        toast.success("Departamento deletado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["departamentos"] });
        queryClient.invalidateQueries({
          queryKey: ["media-salarial-departamentos"],
        });
      },
      onError: (err) => {
        console.error("Erro ao deletar:", err.message);
        toast.error(err.message);
      },
    });

    if (isLoading) return <p className="text-gray-400">Carregando departamentos...</p>;
    if (!departamentos.length) return <h1 className="text-gray-400">Nenhum departamento encontrado.</h1>;

    return (
        <div className="card-container">
        {departamentos.map((dpt) => {
            const mediaObj = medias.find((m) => m.id === dpt.id);
            const media = mediaObj ? Number(mediaObj.media).toFixed(2) : "0.00";

            return (
            <div key={dpt.id} className="card relative">
                <h3 className="text-lg font-semibold">{dpt.nome}</h3>
                <p className="text-sm text-gray-300">R$ {media}</p>

                <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Deletar departamento"
                onClick={() => deleteMutation.mutate(dpt.id)}
                >
                <Trash2 size={15} />
                </button>
            </div>
            );
        })}
        </div>
    );
};

export default CardsDepartamentos;
