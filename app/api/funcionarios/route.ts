import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nome = searchParams.get('nome');
  const cpf = searchParams.get('cpf');

  const where: any = {};
  if (nome) {
    where.nome = { contains: nome, mode: 'insensitive' };
  }
  if (cpf) {
    where.cpf = { contains: cpf, mode: 'insensitive' };
  }

  const funcionarios = await prisma.funcionario.findMany({
    where: Object.keys(where).length ? where : undefined,
    include: { dependentes: true }
  });

  return NextResponse.json(funcionarios);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const funcionario = await prisma.funcionario.create({ data });
  return NextResponse.json(funcionario, { status: 201 });
}