# 🌿 ZenTask

Diário, tarefas e Pomodoro em um só app, feito com **React**, **Vite** e **Tailwind CSS**. Roda no navegador ou como **app desktop (Electron)**. Os dados ficam salvos no próprio computador (`localStorage`), sem login e sem servidor.

## ✨ Funcionalidades

**Foco em tarefas**
- Tarefas organizadas **por dia**: cada tarefa aparece só no dia da sua data. Use as setas, o botão "Hoje" ou o calendário para navegar; ao virar a meia-noite o app passa sozinho para o novo dia
- Tarefas atrasadas e ainda pendentes aparecem em **Hoje**, em vermelho
- Prioridade, categoria (Trabalho, Estudo, Pessoal, Saúde), edição com duplo clique e filtros por status e categoria
- **Pomodoro** (foco, pausa e pausa longa) com alarme; cada foco concluído credita um 🍅 à tarefa escolhida

**Diário**
- Afirmações, notas e humor do dia
- Botão **Gerar fechamento do dia**: monta um rascunho com o que foi concluído e o que ficou pendente

**Estatísticas**
- Sequência de dias escrevendo, tarefas concluídas e atrasadas, pomodoros feitos
- **Humor da semana** interativo (clique no dia para escolher o emoji)
- Tarefas por categoria, cada uma com a sua cor

**Extras**
- **Temas:** Claro, Escuro, Musgo, Halloween, Natal e Translúcido
- **Rascunho rápido:** gaveta lateral (`Ctrl+J`) para colar textos e links temporários, salva sozinha
- **Mini Ilha** (só no app desktop): janela compacta, sempre no topo, com o tempo do Pomodoro, a tarefa em foco e a caixa para concluí-la. Aparece e some com `Alt+Espaço` e expande ao passar o mouse

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| [React 19](https://react.dev) | Interface e estado dos componentes |
| [Vite](https://vite.dev) | Servidor de desenvolvimento e build |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilização e temas (variáveis CSS) |
| [Electron](https://www.electronjs.org) | App desktop e Mini Ilha |
| [Lucide React](https://lucide.dev) | Ícones |
| [Fraunces](https://fontsource.org/fonts/fraunces) | Fonte dos títulos, instalada no projeto (funciona offline) |
| ESLint | Padronização e detecção de erros no código |

## 🚀 Como rodar o projeto

**Pré-requisito:** [Node.js](https://nodejs.org) 22.12 ou mais novo.

```bash
# 1. Clone o repositório
git clone https://github.com/MayconH94/tasklist.git

# 2. Entre na pasta do projeto (a que tem o package.json)
cd tasklist/tasklist

# 3. Instale as dependências
npm install

# 4. Inicie no navegador...
npm run dev            # http://localhost:5180

# ...ou como app desktop
npm run electron:dev
```

> Rode sempre os comandos `npm` dentro de `tasklist/tasklist`. A porta `5180` é fixa: se estiver ocupada, o Vite avisa em vez de trocar de porta. Feche o outro `npm run dev` antes de usar `npm run electron:dev`.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (navegador) |
| `npm run electron:dev` | Inicia o Vite e abre o app desktop |
| `npm run electron:start` | Gera o build e abre o app desktop com ele |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Testa localmente a versão de produção |
| `npm run lint` | Verifica o código com o ESLint |

## 📁 Estrutura do projeto

```
electron/
├── main.cjs              # Janelas, atalho global (Alt+Espaço) e Mini Ilha
└── preload.cjs           # Ponte segura entre a página e o Electron
src/
├── components/
│   ├── Titlebar.jsx      # Barra do topo (data, rascunho, estatísticas)
│   ├── Sidebar.jsx       # Menu lateral e escolha do dia
│   ├── DayNav.jsx        # Setas de dia anterior / próximo / hoje
│   ├── TaskList.jsx      # Lista do dia, filtros e Pomodoro
│   ├── TaskForm.jsx      # Formulário de nova tarefa
│   ├── TaskItem.jsx      # Uma tarefa (concluir, editar, remover)
│   ├── Pomodoro.jsx      # Cronômetro com anel de progresso
│   ├── Journal.jsx       # Notas, humor e fechamento do dia
│   ├── Affirmations.jsx  # Afirmações
│   ├── Overview.jsx      # Estatísticas
│   ├── MoodDay.jsx       # Seletor de humor de um dia da semana
│   ├── ThemePicker.jsx   # Escolha de tema
│   ├── Scratchpad.jsx    # Rascunho rápido (gaveta lateral)
│   ├── MiniIsland.jsx    # Janela compacta (abre em /#mini)
│   ├── Select.jsx        # Campo de seleção com visual único
│   └── Card.jsx          # Cartão reutilizável com título
├── context/              # DataContext e DataProvider (tarefas, diário)
├── hooks/                # useLocalStorage, usePomodoro, useToday
├── lib/                  # Regras puras: datas, pomodoro, temas, estatísticas...
├── App.jsx
├── main.jsx
└── index.css             # Tailwind + variáveis de cada tema
```

## 🔧 Como foi feito (resumo das atualizações)

1. **Visual e temas.** Cores viram variáveis CSS (`--app`, `--surface`, `--accent`...) em `index.css`. Cada tema é um bloco `[data-theme="..."]` e o Tailwind lê essas variáveis (`bg-surface`, `text-ink`). Criar um tema novo é adicionar um bloco de cores e uma linha em `lib/themes.js`. A fonte dos títulos vem do pacote `@fontsource-variable/fraunces`, então não depende da internet.
2. **Pomodoro.** A regra fica em funções puras (`lib/pomodoro.js`, um reducer) que guardam o **horário em que a fase termina**, em vez de contar segundos. Assim o relógio continua certo mesmo se o navegador atrasar o timer. O componente só desenha o estado (anel de progresso).
3. **Tarefas por dia.** `TaskList` filtra pela data de cada tarefa; sem data, vale para hoje. O hook `useToday` atualiza o "hoje" na meia-noite. Ao concluir uma tarefa, o app guarda `doneAt`, para uma atrasada concluída hoje continuar visível só hoje.
4. **Mini Ilha.** É uma segunda janela do Electron (sem moldura, transparente, sempre no topo) que carrega o mesmo app em `/#mini`. As duas janelas conversam pelo `localStorage`: o `useLocalStorage` escuta o evento `storage` e o Pomodoro publica seu estado na chave `pomodoro`. O atalho global é registrado em `electron/main.cjs`; se o Windows reservar `Alt+Espaço`, o app usa `Ctrl+Alt+Espaço`. A janela principal precisa estar aberta, porque é ela que roda o Pomodoro.
5. **Rascunho, humor e fechamento.** `Scratchpad` salva o texto na chave `scratchpad` e detecta links. `MoodDay` grava o humor no mesmo lugar que o Diário usa. O fechamento do dia (`buildClosing`, em `Journal.jsx`) monta o texto a partir das tarefas do dia.

## 🧠 O que este projeto pratica

- Componentes e props
- Estado com `useState`, `useReducer` e efeitos com `useEffect`
- Hooks customizados (`useLocalStorage`, `useToday`, `usePomodoro`)
- Context API para compartilhar os dados entre telas
- Temas com variáveis CSS e Tailwind
- Container queries do Tailwind (layout que responde à largura do bloco)
- Comunicação entre janelas do Electron (IPC, atalho global e evento `storage`)

## 🗺️ Próximos passos

- [ ] Salvar os dados em um arquivo JSON, em vez de `localStorage`
- [ ] Gerar o instalador do app desktop
- [ ] Controlar o Pomodoro pela Mini Ilha (iniciar e pausar)
- [ ] Ordenar tarefas por prioridade e por data
- [ ] Exportar e importar tarefas em JSON

## 📄 Licença

Projeto de estudo, de uso livre.
