export interface DadosTitular {
  nome: string;
  cpf: string;
}

export interface DadosDependente {
  nome: string;
  cpf: string;
  tipo_parentesco: string;
}

export interface DocumentoEnviado {
  tipo_documento: string;
  arquivo_id: string;
}

export interface SelfReflection {
  checklist: string[];
  action: string;
}

export interface Validation {
  dados_titular: DadosTitular;
  dados_dependente: DadosDependente;
  documentos_enviados: DocumentoEnviado[];
  resultado_validacao: string;
  validacao: boolean;
  self_reflection: SelfReflection;
}
