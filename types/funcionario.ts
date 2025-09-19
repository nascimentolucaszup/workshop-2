import { DependenteFilho, Funcionario as Funci } from '@prisma/client'

export type Funcionario = Funci & { dependentes: DependenteFilho[] }