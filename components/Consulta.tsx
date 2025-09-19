"use client";

import { Funcionario } from "@/types/funcionario";
import { useState } from "react";
import useSWR from "swr";
import { useAppContext } from "./AppContext";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Consulta() {
  const { setState } = useAppContext();
  const [cpf, setCpf] = useState<string>("");
  const [nome, setNome] = useState<string>("");

  // Busca por CPF ou nome
  const searchQuery = cpf || nome;
  const { data, error, isLoading } = useSWR(
    searchQuery ? `/api/funcionarios/?${cpf ? `cpf=${cpf}` : `nome=${nome}`}` : null,
    fetcher
  );

  const handleSelectFuncionario = (funcionario: Funcionario) => {
    setState((prev) => ({ 
      ...prev, 
      funcionario,
      addDependents: false // Reset cadastro de dependente ao selecionar novo funcionário
    }));
  };

  const handleAddDependente = (funcionario: Funcionario) => {
    setState((prev) => ({ 
      ...prev, 
      funcionario,
      addDependents: true,
      dependentes: {} // Reset dados do dependente
    }));
  };

  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded">Erro ao carregar dados</div>;

  return (
    <div className="p-4 text-gray-950 min-h-screen bg-white">
      <h2 className="font-bold text-lg mb-4 text-gray-800">Buscar Titulares</h2>
      
      {/* Barra de Pesquisa Aprimorada */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Pesquisar por CPF..."
            value={cpf}
            onChange={(e) => {
              setCpf(e.target.value);
              if (e.target.value) setNome(""); // Limpa nome se digitando CPF
            }}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Pesquisar por nome..."
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (e.target.value) setCpf(""); // Limpa CPF se digitando nome
            }}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando...</span>
        </div>
      )}

      {/* Lista de Funcionários */}
      {data?.length > 0 ? (
        <div className="space-y-3">
          {data.map((funcionario: Funcionario) => (
            <div
              key={funcionario.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSelectFuncionario(funcionario)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{funcionario.nome}</h3>
                  <p className="text-sm text-gray-600 mt-1">CPF: {funcionario.cpf}</p>
                  <p className="text-sm text-gray-600">Empresa: {funcionario.empresa}</p>
                  <p className="text-sm text-gray-600">Atribuição: {funcionario.atribuicao}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      funcionario.situacao_cadastro === 'Ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {funcionario.situacao_cadastro}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddDependente(funcionario);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors ml-4"
                >
                  Cadastrar Dependentes
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
          <p>Nenhum funcionário encontrado com os critérios de busca</p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>Digite um CPF ou nome para buscar funcionários</p>
        </div>
      )}
    </div>
  );
}