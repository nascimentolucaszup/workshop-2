import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  const id = Number(params.id);
  const { log_analise_ai, aprovado_ai } = await req.json();

  try {
    const updated = await prisma.dependenteFilho.update({
      where: { id },
      data: {
        log_analise_ai,
        aprovado_ai,
      },
      select: { id: true, log_analise_ai: true, aprovado_ai: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 400 });
  }
}