export default function InformacoesContato() {
  // Exemplo simples, ajuste os campos conforme necessário
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-600 mb-1">E-mail</label>
        <input className="w-full border rounded px-2 py-1" placeholder="email@exemplo.com" />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Telefone</label>
        <input className="w-full border rounded px-2 py-1" placeholder="(99) 99999-9999" />
      </div>
    </div>
  );
}