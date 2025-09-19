export const validationPrompt = (dadosTitular: any, dadosDependente: any) => `
Verifique as informações do novo dependente que estão sendo cadastradas pelo titular (funcionário) no sistema.

<dados_titular>
${JSON.stringify(dadosTitular)}
</dados_titular>

<dados_dependente>
${JSON.stringify(dadosDependente)}
</dados_dependente>
`;