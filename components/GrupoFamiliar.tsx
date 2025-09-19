import { Funcionario } from "@/types/funcionario";
import { useAppContext } from "./AppContext";
import { Dependentes } from "@/types/dependentes";

type Props = {
  funcionario: Funcionario | undefined;
};

export default function GrupoFamiliar() {
  const { state, setState } = useAppContext();

  function handlerDependentsSelected(dependente: any) {
    setState((prev) => ({
      ...prev,
      dependentes: {
        ...dependente,
      },
      addDependents: true,
    }));
  }
  return (
    <div className="p-4 text-gray-950">
      <h2 className="font-bold text-lg mb-2">Grupo familiar</h2>
      <div className="flex justify-between mb-2">
        <button
          className={`p-2 rounded font-semibold ${
            state?.funcionario
              ? "text-blue-700 hover:bg-sky-200"
              : "text-gray-400"
          } cursor-pointer`}
          onClick={() => setState((prev) => ({ ...prev, addDependents: true }))}
        >
          + DEPENDENTE
        </button>
        <button className="text-gray-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            TITULARIDADE
          </div>
        </button>
      </div>
      {state?.funcionario?.dependentes === undefined ? (
        <p>Nenhum funcionário selecionado</p>
      ) : state?.funcionario.dependentes.length === 0 ? (
        <div>Funcionário não possuem dependentes</div>
      ) : (
        <>
          {state?.funcionario?.dependentes.map(
            (
              dependente: Record<string, string | number | boolean | undefined>
            ) => (
              <div
                key={dependente?.id as number}
                onClick={() => handlerDependentsSelected(dependente)}
                className="bg-blue-50 p-3 rounded shadow hover:bg-blue-200 cursor-pointer"
              >
                <div className="font-semibold">{dependente?.nome_completo}</div>
                <div className="text-xs">
                  Grau de Parentesco: {dependente?.grau_parentesco}
                </div>
                <div className="text-xs">
                  Status: {dependente?.aprovado_ai ? 'Aprovado' : 'Reprovado'}
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
