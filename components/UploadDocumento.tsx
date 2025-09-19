"use client";

import { useRef, useState } from "react";
import { useAppContext } from "./AppContext";

type UploadState = "idle" | "requesting" | "uploading" | "done" | "error";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const MAX_SIZE_MB = 10;

export default function UploadDocumento() {
  const filePersonalDocumentRef = useRef<HTMLInputElement>(null);
  const fileComplementaryDocumentRef = useRef<HTMLInputElement>(null);
  
  const { state, setState } = useAppContext();
  const [errors, setErrors] = useState<{personal?: string, complementary?: string}>({});
  const [uploadStates, setUploadStates] = useState<{personal: UploadState, complementary: UploadState}>({
    personal: "idle",
    complementary: "idle"
  });
  const [successMessages, setSuccessMessages] = useState<{personal?: string, complementary?: string}>({});

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, type: 'personal' | 'complementary') {
    setErrors(prev => ({ ...prev, [type]: undefined }));
    setSuccessMessages(prev => ({ ...prev, [type]: undefined }));

    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, [type]: "Apenas arquivos PDF, PNG ou JPEG são permitidos." }));
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: `O arquivo deve ter no máximo ${MAX_SIZE_MB}MB.` }));
      return;
    }

    await handleUploadFiles(file, type);
  }

  async function handleUploadFiles(file: File, type: 'personal' | 'complementary') {
    try {
      setUploadStates(prev => ({ ...prev, [type]: "requesting" }));

      // 1. Solicita dados para upload pré-assinado via API interna
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: JSON.stringify({ action: "upload", fileName: file.name }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Erro ao solicitar upload pré-assinado");

      const { url, id, form } = await res.json();

      setState((prev) => ({
        ...prev,
        uploadIds: [...(prev?.uploadIds ?? []), id],
      }));

      // 2. Faz upload real para S3
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      setUploadStates(prev => ({ ...prev, [type]: "uploading" }));

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (uploadRes.status !== 204) throw new Error("Erro ao fazer upload do arquivo");

      setUploadStates(prev => ({ ...prev, [type]: "done" }));
      setSuccessMessages(prev => ({ ...prev, [type]: "Upload realizado com sucesso!" }));
    } catch (error) {
      setUploadStates(prev => ({ ...prev, [type]: "error" }));
      setErrors(prev => ({ ...prev, [type]: "Erro ao fazer upload. Tente novamente." }));
    }
  }

  const getUploadIcon = (state: UploadState) => {
    if (state === "uploading") {
      return (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      );
    }
    
    if (state === "done") {
      return (
        <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-12 w-12 text-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload de Documentos</h3>
        <p className="text-sm text-gray-600">
          Envie os dois documentos obrigatórios do dependente. Formatos aceitos: PDF, PNG ou JPEG (máximo {MAX_SIZE_MB}MB cada).
        </p>
      </div>

      {/* Documento de Identificação */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          1. Documento de Identificação *
          <span className="text-xs text-gray-500 block">RG ou Certidão de Nascimento</span>
        </label>
        
        <div className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg transition-colors ${
          uploadStates.personal === "done" 
            ? "border-green-300 bg-green-50" 
            : errors.personal 
            ? "border-red-300 bg-red-50" 
            : "border-gray-300 hover:border-blue-400"
        }`}>
          <label htmlFor="uploadPersonalDocument" className="cursor-pointer flex flex-col items-center">
            {getUploadIcon(uploadStates.personal)}
            
            <span className={`mt-2 text-sm font-medium ${
              uploadStates.personal === "done" ? "text-green-700" : "text-blue-700"
            }`}>
              {uploadStates.personal === "uploading" 
                ? "Enviando..." 
                : uploadStates.personal === "done" 
                ? "Documento enviado!" 
                : "Clique para enviar o documento de identificação"
              }
            </span>
            
            <input
              id="uploadPersonalDocument"
              ref={filePersonalDocumentRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'personal')}
            />
          </label>
        </div>

        {filePersonalDocumentRef.current?.files?.[0]?.name && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">{filePersonalDocumentRef.current.files[0].name}</span>
          </div>
        )}

        {errors.personal && (
          <p className="text-sm text-red-600">{errors.personal}</p>
        )}
        
        {successMessages.personal && (
          <p className="text-sm text-green-600">{successMessages.personal}</p>
        )}
      </div>

      {/* Documento Complementar */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          2. Documento Complementar *
          <span className="text-xs text-gray-500 block">
            {state?.dependentes?.tipo_parentesco === 'enteado' && "Documento de adoção"}
            {(state?.dependentes?.tipo_parentesco === 'tutelado' || state?.dependentes?.tipo_parentesco === 'curatelado') && "Documento de tutela/curatela"}
            {(!state?.dependentes?.tipo_parentesco || state?.dependentes?.tipo_parentesco === 'filho') && "Documento adicional (se necessário)"}
          </span>
        </label>
        
        <div className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg transition-colors ${
          uploadStates.complementary === "done" 
            ? "border-green-300 bg-green-50" 
            : errors.complementary 
            ? "border-red-300 bg-red-50" 
            : "border-gray-300 hover:border-blue-400"
        }`}>
          <label htmlFor="uploadComplementaryDocument" className="cursor-pointer flex flex-col items-center">
            {getUploadIcon(uploadStates.complementary)}
            
            <span className={`mt-2 text-sm font-medium ${
              uploadStates.complementary === "done" ? "text-green-700" : "text-blue-700"
            }`}>
              {uploadStates.complementary === "uploading" 
                ? "Enviando..." 
                : uploadStates.complementary === "done" 
                ? "Documento enviado!" 
                : "Clique para enviar o documento complementar"
              }
            </span>
            
            <input
              id="uploadComplementaryDocument"
              ref={fileComplementaryDocumentRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'complementary')}
            />
          </label>
        </div>

        {fileComplementaryDocumentRef.current?.files?.[0]?.name && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">{fileComplementaryDocumentRef.current.files[0].name}</span>
          </div>
        )}

        {errors.complementary && (
          <p className="text-sm text-red-600">{errors.complementary}</p>
        )}
        
        {successMessages.complementary && (
          <p className="text-sm text-green-600">{successMessages.complementary}</p>
        )}
      </div>

      {/* Resumo dos uploads */}
      {(uploadStates.personal === "done") && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-blue-800">
              {uploadStates.personal === "done" 
                ? "Todos os documentos foram enviados com sucesso!"
                : "Continue com o envio dos documentos obrigatórios."
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}