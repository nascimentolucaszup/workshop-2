"use client";

import { useState } from "react";
import { useAppContext } from "./AppContext";
import DadosPessoais from "./DadosPessoais";
import UploadDocumento from "./UploadDocumento";
import ResultadoValidacao from "./ResultadoValidacao";
import { Validation } from "@/types/validation";
import { Dependentes } from "@/types/dependentes";

const tabs = [
  { label: "Dados Pessoais", component: <DadosPessoais /> },
  { label: "Documentos", component: <UploadDocumento /> },
];

export default function CadastroDependente() {
  const { state, setState } = useAppContext();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [msgOK, setMsgOK] = useState("");
  const [validation, setValidation] = useState<Validation | null>(null);
  const [showResult, setShowResult] = useState(false);

  async function handlerAddDependents() {
    const dependents = state?.dependentes;
    dependents["funcionario_id"] = state?.funcionario.id;
    
    setIsLoading(true);
    
    try {
      // 1. Cadastrar dependente
      const res = await fetch("/api/dependentes", {
        method: "POST",
        body: JSON.stringify({ ...dependents }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Erro ao cadastrar um novo dependente.");
      }

      const dependent: Dependentes = await res.json();

      // 2. Validar com IA
      const resAgent = await fetch("/api/validations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funcionario: state?.funcionario,
          dependente: state?.dependentes,
          uploadIds: state?.uploadIds,
        }),
      });

      if (!resAgent.ok) {
        throw new Error("Erro ao validar dependente.");
      }

      const resValidation = await resAgent.json();
      console.log({ resValidation })
      setValidation(resValidation);

      // 3. Atualizar dependente com resultado da validação
      const updatedDependent = await fetch(`/api/dependentes/${dependent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log_analise_ai: resValidation,
          aprovado_ai: resValidation?.validacao,
        }),
      });

      if (!updatedDependent.ok) {
        throw new Error("Erro ao atualizar dependente.");
      }

      setMsgOK("Novo dependente cadastrado com sucesso.");
      setShowResult(true);
      
    } catch (error) {
      setMsgOK(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }

  const handleNovaConsulta = () => {
    // Reset do estado para nova consulta
    setState((prev) => ({
      ...prev,
      addDependents: false,
      funcionario: null,
      dependentes: {},
      uploadIds: [],
    }));
    setValidation(null);
    setShowResult(false);
    setStep(0);
    setMsgOK("");
  };

  const handleCorrigirDados = () => {
    // Volta para o primeiro step para correção
    setShowResult(false);
    setStep(0);
    setValidation(null);
  };

  const canProceedToNext = () => {
    if (step === 0) {
      // Validar se dados pessoais obrigatórios estão preenchidos
      return state?.dependentes?.nome_completo && 
             state?.dependentes?.cpf && 
             state?.dependentes?.data_nascimento &&
             state?.dependentes?.grau_parentesco;
    }
    if (step === 1) {
      // Validar se documentos foram enviados
      return state?.uploadIds && state.uploadIds.length >= 1;
    }
    return true;
  };

  // Se está mostrando resultado, renderizar apenas o componente de resultado
  if (showResult && validation) {
    return (
      <ResultadoValidacao
        validation={validation}
        onNovaConsulta={handleNovaConsulta}
        onCorrigirDados={handleCorrigirDados}
      />
    );
  }

  return (
    <>
      {state?.addDependents ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cadastro de Dependente
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Titular: {state?.funcionario?.nome} - CPF: {state?.funcionario?.cpf}
                  </p>
                </div>
                <button
                  onClick={() => setState((prev) => ({ ...prev, addDependents: false }))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                {tabs.map((tab, idx) => (
                  <div key={tab.label} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step >= idx 
                        ? 'border-blue-600 bg-blue-600 text-white' 
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      {step > idx ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{idx + 1}</span>
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      step >= idx ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {tab.label}
                    </span>
                    {idx < tabs.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${
                        step > idx ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {tabs[step].component}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
              <div>
                {step > 0 ? (
                  <button
                    type="button"
                    className="text-gray-600 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    ← Voltar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-gray-600 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => setState((prev) => ({ ...prev, addDependents: false }))}
                  >
                    ← Cancelar
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Indicador de progresso dos dados */}
                <div className="text-sm text-gray-500">
                  {step === 0 && !canProceedToNext() && "Preencha todos os campos obrigatórios"}
                  {step === 1 && !canProceedToNext() && "Envie os documentos obrigatórios"}
                  {canProceedToNext() && step < tabs.length - 1 && "Pronto para continuar"}
                </div>

                {step < tabs.length - 1 ? (
                  <button
                    type="button"
                    disabled={!canProceedToNext()}
                    className={`font-semibold px-6 py-2 rounded transition-colors ${
                      canProceedToNext()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Próximo →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canProceedToNext() || isLoading}
                    className={`flex items-center gap-2 font-semibold px-6 py-2 rounded transition-colors ${
                      canProceedToNext() && !isLoading
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={handlerAddDependents}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Finalizar Cadastro
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Mensagem de erro */}
            {msgOK && !showResult && (
              <div className={`mx-6 mb-6 p-4 rounded-lg ${
                msgOK.includes('Erro') 
                  ? 'bg-red-50 border border-red-200 text-red-800' 
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}>
                {msgOK}
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}