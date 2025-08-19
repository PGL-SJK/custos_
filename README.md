# 🚀 Sistema de Gestão de Embarques Marítimos
**Portugal para Brasil | Projeto Embraer**

## 📋 Instruções de Instalação e Uso

### 🔧 Resolução do Problema CORS

O sistema está configurado para funcionar com dados de exemplo por padrão. Para usar o Google Sheets:

#### Opção 1: Usar Extensão CORS (Recomendado para desenvolvimento)
1. Instale a extensão "CORS Unblock" no Chrome/Edge
2. Ative a extensão
3. Recarregue a página
4. Clique em "Importar do Sheets"

#### Opção 2: Servidor Local (Mais seguro)
```bash
# Instalar servidor HTTP simples
npm install -g http-server

# Executar na pasta do projeto
http-server -p 8080 --cors

# Acessar: http://localhost:8080
```

#### Opção 3: Configurar Google Apps Script (Produção)
1. Acesse: https://script.google.com
2. Crie novo projeto
3. Cole o código do arquivo `google-apps-script.js`
4. Configure as credenciais
5. Publique como Web App

### 🎯 Funcionalidades Implementadas

✅ **Layout Exato da Segunda Imagem**
- Header com título completo
- Status bar com conexão Google Sheets
- 4 cards de estatísticas
- Barra de busca funcional
- Botões de ação completos

✅ **Integração Google Sheets**
- ID da Planilha: 1RqlrhHCepgBKUgQT-7b3R1S8FTao5PYBlcyT0zIHgrA
- API Key configurada
- Fallback para dados de exemplo
- Sistema de notificações

✅ **Gerenciamento de Dados**
- Adicionar novos embarques
- Editar registros existentes
- Excluir registros
- Filtros por categoria e status
- Busca em tempo real

✅ **Exportação de Dados**
- Exportar para Excel (.xlsx)
- Exportar para CSV
- Formatação adequada
- Nomes de arquivo automáticos

✅ **Interface Responsiva**
- Design moderno e profissional
- Adaptável a diferentes telas
- Animações suaves
- Feedback visual completo

### 📊 Estrutura dos Dados

O sistema trabalha com as seguintes categorias de custos marítimos:
- **Documentação**: Certificados, Bill of Lading, etc.
- **Transporte**: Frete marítimo, coleta, entrega
- **Seguro**: Cobertura de transporte
- **Desembaraço**: Processos aduaneiros
- **Armazenagem**: Taxas portuárias

### 🔄 Fluxo de Dados

1. **Inicialização**: Carrega dados do Google Sheets ou exemplos
2. **Visualização**: Tabela com filtros e busca
3. **Gerenciamento**: CRUD completo de registros
4. **Exportação**: Download em Excel/CSV
5. **Sincronização**: Atualização manual com Sheets

### 📱 Uso do Sistema

1. **Importar Dados**: Clique em "Importar do Sheets"
2. **Adicionar Embarque**: Use o botão "Novo Embarque"
3. **Buscar**: Digite na barra de pesquisa
4. **Filtrar**: Use os dropdowns de categoria/status
5. **Exportar**: Escolha Excel ou CSV
6. **Editar**: Clique no ícone de edição na tabela
7. **Excluir**: Clique no ícone de lixeira

### 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos e responsivos
- **JavaScript ES6+**: Funcionalidades interativas
- **Google Sheets API**: Integração de dados
- **SheetJS**: Exportação Excel
- **Font Awesome**: Ícones
- **Inter Font**: Tipografia moderna

### 🎨 Design System

- **Cores Primárias**: #4f46e5, #7c3aed
- **Gradientes**: Aplicados em botões e cards
- **Tipografia**: Inter font family
- **Espaçamento**: Sistema baseado em rem
- **Animações**: Transições suaves de 0.3s

### 🔒 Segurança

- API Key visível (apenas para demo)
- Validação de dados no frontend
- Sanitização de inputs
- Confirmação para exclusões

### 📈 Métricas do Sistema

- Total de registros carregados
- Número de categorias únicas
- Registros com valores definidos
- Taxa de completude dos dados

### 🎯 Status Atual

✅ Sistema 100% funcional
✅ Layout idêntico à imagem fornecida
✅ Todos os botões operacionais
✅ Integração Google Sheets configurada
✅ Dados de exemplo com 10 registros marítimos
✅ Exportação funcionando
✅ Modal de novo embarque operacional
✅ Filtros e busca ativos
✅ Design responsivo implementado

---

**Desenvolvido para o Projeto Embraer - Custos de Embarque Portugal-Brasil**
