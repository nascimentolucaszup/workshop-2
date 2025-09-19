import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const funcionario = await prisma.funcionario.findUnique({
    where: { id: Number(params.id) },
    include: { dependentes: true }
  });
  if (!funcionario) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(funcionario);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const funcionario = await prisma.funcionario.update({
    where: { id: Number(params.id) },
    data
  });
  return NextResponse.json(funcionario);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.funcionario.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}