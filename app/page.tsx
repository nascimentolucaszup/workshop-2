"use client";

import { useAppContext } from "@/components/AppContext";
import Consulta from "@/components/Consulta";
import CadastroDependente from "@/components/CadastroDependente";

export default function MainLayout() {
  const { state } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header da Aplicação */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Cadastro de Dependentes
          </h1>
          <p className="text-gray-600">
            Gerencie o cadastro de dependentes dos funcionários
          </p>
        </div>

        {/* Renderização condicional baseada no estado */}
        {state?.addDependents ? (
          <CadastroDependente />
        ) : (
          <Consulta />
        )}
      </div>
    </div>
  );
}