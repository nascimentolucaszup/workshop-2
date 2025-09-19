"use client";

import { useAppContext } from "./AppContext";

export default function DadosPessoais() {
  const { state, setState } = useAppContext();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;

    if (type === "checkbox") {
      fieldValue = (e.target as HTMLInputElement).checked;
    }

    setState((prev) => ({
      ...prev,
      dependentes: {
        ...prev.dependentes,
        [name]: fieldValue,
      },
    }));
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded shadow text-gray-950">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais do Dependente</h3>
        <p className="text-sm text-gray-600 mb-6">
          Preencha todas as informações obrigatórias do dependente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPF *
          </label>
          <input
            name="cpf"
            value={state?.dependentes?.cpf ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Nascimento *
          </label>
          <input
            name="data_nascimento"
            value={state?.dependentes?.data_nascimento ?? ""}
            onChange={handleChange}
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome Completo *
        </label>
        <input
          name="nome_completo"
          value={state?.dependentes?.nome_completo ?? ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite o nome completo do dependente"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Parentesco *
        </label>
        <select
          name="grau_parentesco"
          value={state?.dependentes?.grau_parentesco ?? ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Selecione o tipo de parentesco</option>
          <option value="filho">Filho</option>
          <option value="enteado">Enteado</option>
          <option value="tutelado">Tutelado</option>
          <option value="curatelado">Curatelado</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="nome_mae_nao_consta"
            name="nome_mae_nao_consta"
            checked={state?.dependentes?.nome_mae_nao_consta ?? false}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="nome_mae_nao_consta" className="text-sm text-gray-700">
            Nome da mãe não consta no registro civil
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo da Mãe
          </label>
          <input
            name="nome_mae"
            disabled={!!state?.dependentes?.nome_mae_nao_consta}
            value={state?.dependentes?.nome_mae ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="Digite o nome completo da mãe"
          />
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="possui_dados_sociais"
            name="possui_dados_sociais"
            checked={state?.dependentes?.possui_dados_sociais ?? false}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="possui_dados_sociais" className="text-sm text-gray-700">
            Possui dados sociais?
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Sexo</label>
            <select
              name="sexo"
              value={state?.dependentes?.sexo ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecione</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Estado Civil
            </label>
            <select
              name="estado_civil"
              value={state?.dependentes?.estado_civil ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecione</option>
              <option value="Solteiro">Solteiro</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viúvo">Viúvo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Nacionalidade
            </label>
            <select
              name="nacionalidade"
              value={state?.dependentes?.nacionalidade ?? ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Selecione</option>
              <option value="Brasileira">Brasileira</option>
              <option value="Estrangeira">Estrangeira</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="invalido"
              checked={state?.dependentes?.invalido ?? false}
              onChange={handleChange}
              className="accent-blue-700"
            />
            <label className="text-sm">É inválido(a)?</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="adotivo"
              checked={state?.dependentes?.adotivo ?? false}
              onChange={handleChange}
              className="accent-blue-700"
            />
            <label className="text-sm">Filho adotivo?</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="universitario"
              checked={state?.dependentes?.universitario ?? false}
              onChange={handleChange}
              className="accent-blue-700"
            />
            <label className="text-sm">Filho é universitário?</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="carteira_trabalho"
              checked={state?.dependentes?.carteira_trabalho ?? false}
              onChange={handleChange}
              className="accent-blue-700"
            />
            <label className="text-sm">Possui carteira de trabalho?</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="fora_politica"
              checked={state?.dependentes?.fora_politica ?? false}
              onChange={handleChange}
              className="accent-blue-700"
            />
            <label className="text-sm">Fora da política</label>
          </div>
        </div>
      </div>

      {/* Informações sobre documentos necessários baseado no tipo de parentesco */}
      {state?.dependentes?.grau_parentesco && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Documentos necessários:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Documento de identificação (RG ou Certidão de Nascimento)</li>
            {state.dependentes.grau_parentesco === 'enteado' && (
              <li>• Documento que comprove a adoção</li>
            )}
            {(state.dependentes.grau_parentesco === 'tutelado' || state.dependentes.grau_parentesco === 'curatelado') && (
              <li>• Documento que comprove a tutela ou curatela</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}