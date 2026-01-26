import React from "react";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../constants/global-variable";


const cargos = ["Estagiário", "Desenvolvedor", "Gerente", "RH", "Vendas"];

const CardsMediaSalarial = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["media-salarial"],
        queryFn: async () => {
            const results = await Promise.all(
                cargos.map(async (cargo) => {
                    const res = await fetch(`${baseUrl}/media/${encodeURIComponent(cargo)}`);

                    const data = await res.json();
                    return { cargo, media: data.media };
                })
            );
            return results;
        }
    });

    if (isLoading) {
        return <p className="text-gray-400">Carregando médias salariais...</p>;
    }

    return (
        <div className="card-container">
            {data.map((item) => (
                <div
                    key={item.cargo}
                    className="card"
                >
                    <h3>
                        {item.cargo}
                    </h3>

                    <p>
                        R$ {item.media ? Number(item.media).toFixed(2) : "0.00"}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CardsMediaSalarial;
