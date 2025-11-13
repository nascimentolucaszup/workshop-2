import { getAccessToken } from "@/util/get-token";
import { validationPrompt } from "@/util/validation-prompt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const access_token = await getAccessToken();
  if (!access_token) {
    return NextResponse.json({ error: 'Erro ao autenticar' }, { status: 401 });
  }

  const { funcionario, dependente, uploadIds } = body;
  delete funcionario?.dependentes;
  console.log({ prompt: validationPrompt(funcionario, dependente) })
const agentRes = await fetch(
  `https://genai-inference-app.stackspot.com/v1/agent/01K3VQ24KHRKHK8C6ETBTV0ZM4/chat`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      user_prompt: validationPrompt(funcionario, dependente),
      upload_ids: uploadIds,
      streaming: false,
      stackspot_knowledge: false,
      return_ks_in_response: true,
    }),
  }
);

if (!agentRes.ok) {
  let errorBody;
  try {
    // Tenta ler como JSON, se falhar, lê como texto
    errorBody = await agentRes.json();
  } catch {
    errorBody = await agentRes.text();
  }
  console.error('API Error:', {
    status: agentRes.status,
    statusText: agentRes.statusText,
    body: errorBody,
  });
  return NextResponse.json({ error: errorBody }, { status: agentRes.status });
}
  const { message } = await agentRes.json();
  return NextResponse.json(JSON.parse(message));
}

