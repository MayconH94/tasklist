# 🌿 TaskList

Gerenciador de tarefas simples e moderno, feito com **React**, **Vite** e **Tailwind CSS**. As tarefas ficam salvas no próprio navegador, sem precisar de login nem de servidor.

## ✨ Funcionalidades

- Adicionar, concluir e remover tarefas
- **Prioridade** por tarefa: baixa, média ou alta (com etiquetas coloridas)
- **Filtros**: todas, pendentes e concluídas
- **Data de entrega**, com destaque em vermelho para tarefas atrasadas
- Contador de tarefas concluídas
- **Persistência** com `localStorage`: as tarefas continuam ali ao atualizar a página
- Interface responsiva e limpa, com foco em espaço em branco e cantos arredondados

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| [React 19](https://react.dev) | Interface e estado dos componentes |
| [Vite](https://vite.dev) | Servidor de desenvolvimento e build |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilização |
| [Lucide React](https://lucide.dev) | Ícones |
| ESLint | Padronização e detecção de erros no código |

## 🚀 Como rodar o projeto

**Pré-requisito:** [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/tasklist.git

# 2. Entre na pasta
cd tasklist

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Testa localmente a versão de produção |
| `npm run lint` | Verifica o código com o ESLint |

## 📁 Estrutura do projeto

```
src/
├── components/
│   ├── Card.jsx          # Cartão reutilizável com título
│   ├── Navbar.jsx        # Barra superior
│   └── TaskList.jsx      # Formulário, filtros e lista de tarefas
├── hooks/
│   └── useLocalStorage.jsx   # Hook que guarda o estado no navegador
├── App.jsx
├── main.jsx
└── index.css             # Importa o Tailwind
```

## 🧠 O que este projeto pratica

- Componentes e props
- Estado com `useState` e efeitos com `useEffect`
- Hook customizado (`useLocalStorage`)
- Formulários controlados
- Renderização de listas com `key` e renderização condicional
- Dados derivados (lista filtrada calculada a partir do estado)
- Estilização com classes utilitárias do Tailwind

## 🗺️ Próximos passos

- [ ] Dividir `TaskList` em componentes menores (`TaskForm`, `TaskItem`)
- [ ] Editar tarefas existentes
- [ ] Modo escuro
- [ ] Ordenar por prioridade e por data
- [ ] Exportar e importar tarefas em JSON
- [ ] Transformar em PWA (instalável no celular)

## 📄 Licença

Projeto de estudo, de uso livre.
