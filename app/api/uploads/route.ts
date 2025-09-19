import { getAccessToken } from "@/util/get-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const access_token = await getAccessToken();
  if (!access_token) {
    return NextResponse.json({ error: 'Erro ao autenticar' }, { status: 401 });
  }

  const { fileName } = body;
  const uploadRes = await fetch(
    `https://data-integration-api.stackspot.com/v2/file-upload/form`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        file_name: fileName,
        target_type: 'CONTEXT',
        expiration: 60,
      }),
    }
  );
  if (!uploadRes.ok) {
    return NextResponse.json({ error: 'Erro ao solicitar upload' }, { status: 400 });
  }
  const data = await uploadRes.json();
  return NextResponse.json(data);
}