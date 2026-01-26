import React, { useState } from "react";
import SelectCargo from "./SelectCargo";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../../constants/global-variable";
import { queryClient } from "../../utils/queryClient";
import toast from "react-hot-toast";

const ReajusteSalarial = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [cargo, setCargo] = useState("");
    const [percentual, setPercentual] = useState("");

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`${baseUrl}/reajuste`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cargo, percentual })
            });


            const data = await response.json();
            if (!response.ok) throw new Error(data.erro);
            return data;
        },
        onSuccess: () => {
            toast.success("Salários reajustados com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
            queryClient.invalidateQueries({ queryKey: ["media-salarial"] });
            setOpen(false);
            setCargo("");
            setPercentual("");
        },
        onError: (err) => toast.error(err.message)
    });

    const trigger = React.Children.map(children, (child) =>
        React.cloneElement(child, { onClick: () => setOpen(true) })
    );

    return (
        <>
            {trigger}

            {open && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-gray-900 border border-gray-800 p-6">

                        <h2 className="text-xl font-semibold text-white mb-4">
                            Reajuste Salarial
                        </h2>

                        <div className="space-y-4">
                            <SelectCargo
                                value={cargo}
                                onChange={setCargo}
                            />


                            <input
                                type="number"
                                placeholder="Percentual (%)"
                                value={percentual}
                                onChange={(e) => setPercentual(e.target.value)}
                                className="w-full rounded bg-gray-800 border border-gray-700 p-2 text-white"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setOpen(false)}
                                className="btn btn-cancel"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (!cargo || !percentual) {
                                        toast.error("Selecione o cargo e informe o percentual");
                                        return;
                                    }
                                    mutation.mutate();
                                }}
                                className="btn btn-save"
                            >
                                Aplicar
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default ReajusteSalarial;
