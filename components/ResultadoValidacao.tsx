"use client";

import { Validation } from "@/types/validation";
import { useAppContext } from "./AppContext";

interface ResultadoValidacaoProps {
  validation: Validation | null;
  onNovaConsulta: () => void;
  onCorrigirDados: () => void;
}

export default function ResultadoValidacao({ 
  validation, 
  onNovaConsulta, 
  onCorrigirDados 
}: ResultadoValidacaoProps) {
  const { state } = useAppContext();

  if (!validation) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Validação de Cadastro de Dependente
        </h2>
        <p className="text-gray-600">
          Resultado da análise dos documentos enviados
        </p>
      </div>

      {/* Status da Validação */}
      <div className={`rounded-lg border-2 p-6 ${
        validation.validacao 
          ? 'border-green-200 bg-green-50' 
          : 'border-yellow-200 bg-yellow-50'
      }`}>
        <div className="flex items-center mb-4">
          {validation.validacao ? (
            <>
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-green-800">
                  Dependente aprovado
                </h3>
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-yellow-800">
                  Análise necessária
                </h3>
              </div>
            </>
          )}
        </div>
        
        <p className={`text-sm ${
          validation.validacao ? 'text-green-700' : 'text-yellow-700'
        }`}>
          {validation.resultado_validacao}
        </p>
      </div>

      {/* Informações do Processo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-gray-900 mb-3">Informações do Processo</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Titular</h5>
            <p className="text-sm text-gray-900">{validation.dados_titular.nome}</p>
            <p className="text-sm text-gray-600">CPF: {validation.dados_titular.cpf}</p>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Dependente</h5>
            <p className="text-sm text-gray-900">{validation.dados_dependente.nome}</p>
            <p className="text-sm text-gray-600">CPF: {validation.dados_dependente.cpf}</p>
            <p className="text-sm text-gray-600">
              Parentesco: {validation.dados_dependente.tipo_parentesco}
            </p>
          </div>
        </div>
      </div>

      {/* Documentos Enviados */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Documentos Enviados</h4>
        <div className="space-y-2">
          {validation.documentos_enviados.map((doc, index) => (
            <div key={index} className="flex items-center text-sm">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {doc.tipo_documento.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist de Validação */}
      {validation.self_reflection && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Checklist de Validação</h4>
          <div className="space-y-2">
            {validation.self_reflection.checklist.map((item, index) => (
              <div key={index} className="flex items-start text-sm">
                <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-800">{item}</span>
              </div>
            ))}
          </div>
          {validation.self_reflection.action && (
            <div className="mt-3 p-3 bg-blue-100 rounded">
              <p className="text-sm text-blue-800 font-medium">
                Ação: {validation.self_reflection.action}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onNovaConsulta}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Nova Consulta
        </button>
        
        {!validation.validacao && (
          <button
            onClick={onCorrigirDados}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Corrigir Dados
          </button>
        )}
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-600">
            {validation.validacao ? (
              <p>
                O dependente foi aprovado automaticamente e já pode utilizar os benefícios da empresa. 
                Em caso de dúvidas, entre em contato com o RH.
              </p>
            ) : (
              <p>
                Os documentos serão analisados manualmente pela equipe do RH. 
                Você receberá uma notificação quando a análise for concluída.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}