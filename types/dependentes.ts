import { DependenteFilho, Funcionario } from "@prisma/client";

export type Dependentes = DependenteFilho & { funcionario?: Funcionario }