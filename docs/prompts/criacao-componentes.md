Implemente as telas conforme as orientações abaixo, utilizando as informações já existentes no projeto:

- Aproveite os tipos definidos em `types` para mapear os dados exibidos nas telas.
- Utilize os endpoints disponíveis em `app/api`, pois todas as APIs já estão implementadas.
- Na tela de upload, inclua dois campos obrigatórios: um para o documento de identificação e outro para o documento complementar. Os tipos necessários para esses campos já estão implementados e devem ser reaproveitados.
- O projeto conta com uma implementação de `AppContext`, que deve ser utilizada para compartilhar informações entre todos os componentes.

Obs.: Extraia as informações dos wireframes que estão nos links enviados no prompt

---

### 1. Barra de Pesquisa e Listagem de Titulares
Interface com barra de pesquisa no topo e lista de titulares (funcionários) exibidos em linhas únicas. Cada card exibe nome e CPF, além de botão/link direto para o cadastro de dependentes, garantindo navegação mais intuitiva.

---

### 2. Tela de Cadastro de Dependentes (Step-by-Step)
Fluxo em etapas (step-by-step):

- **Passo 1:** Preenchimento dos dados pessoais do dependente.
- **Passo 2:** Upload dos documentos obrigatórios.
- **Passo 3:** Confirmação e envio para análise do agente especializado.
O wireframe apresenta barra de progresso/etapas visuais para facilitar o acompanhamento.

---

### 3. Comunicação do Resultado da Validação
Tela dedicada à comunicação do resultado da análise do dependente: mensagem clara de aprovação ou indicação de pendências, com destaque visual e botões para o usuário acompanhar o status ou corrigir dados, se necessário.

---