// O URL do seu Google Apps Script Web App
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyhSuzRUYVI7LBLNWK05wtoG62-QLW-qm_kj_4tckORBz9Sd4dEafh3TMeCU-zxmRjJzA/exec';

// Fallback para dados de exemplo se o Google Sheets não estiver disponível
const exampleData = [
  ['Documentação', 'Bill of Lading', 150.00, 'Emissão do documento', ''],
  ['Transporte', 'Frete Marítimo', 1250.75, 'Frete de Lisboa para Santos', 'Cotação via email'],
  ['Seguro', 'Seguro de Carga', 250.50, 'Cobertura completa contra perdas', 'Valor baseado em 0.5% do valor da carga'],
  ['Desembaraço', 'Taxa de Porto', 85.00, 'Taxa portuária de entrada', 'Revisar valor em caso de atraso'],
  ['Transporte', 'Coleta Terrestre', 90.00, 'Transporte do fornecedor ao porto', 'Serviço incluído na cotação inicial'],
  ['Armazenagem', 'Taxa de Terminal', 45.00, 'Custo de armazenagem no terminal', 'Período de 5 dias'],
  ['Documentação', 'Certificado de Origem', 65.00, 'Certificado exigido pela alfândega', 'Processado junto à câmara de comércio'],
  ['Transporte', 'Entrega Final', 110.00, 'Entrega do porto ao destino final', 'Agendada para 2 dias após a chegada'],
  ['Desembaraço', 'Serviços Aduaneiros', 280.00, 'Serviços de despachante aduaneiro', 'Inclui impostos e taxas'],
  ['Seguro', 'Taxa de Inspeção', 30.00, 'Inspeção obrigatória de carga', 'Cobrado pela autoridade portuária']
];

let allData = [];
let categories = new Set();

document.addEventListener('DOMContentLoaded', () => {
    // Carrega os dados na inicialização
    fetchData();

    // Event listeners para os botões e filtros
    document.getElementById('btn-novo-embarque').addEventListener('click', openModal);
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-form').addEventListener('click', closeModal);
    document.getElementById('form-novo-embarque').addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-importar').addEventListener('click', () => {
        fetchData(true);
    });
    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('filter-category').addEventListener('change', applyFilters);
    document.getElementById('filter-status').addEventListener('change', applyFilters);
    document.getElementById('btn-exportar-excel').addEventListener('click', exportToExcel);
    document.getElementById('btn-exportar-csv').addEventListener('click', exportToCsv);
});

async function fetchData(forceFetch = false) {
    showLoading();
    try {
        const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL);
        const data = await response.json();

        if (data.success && data.values.length > 1) {
            // Pular a primeira linha (cabeçalho)
            allData = data.values.slice(1).map(row => {
                // Padroniza as linhas para ter 6 colunas, preenchendo com '' se necessário
                const paddedRow = row.concat(Array(6 - row.length).fill(''));
                return {
                    id: Math.random().toString(36).substr(2, 9), // ID para edição/exclusão
                    categoria: paddedRow[0],
                    servico: paddedRow[1],
                    valor: parseFloat(paddedRow[2]) || 0,
                    detalhes: paddedRow[3],
                    observacoes: paddedRow[4],
                    status: paddedRow[5] || 'ativo'
                };
            });
            document.getElementById('last-sync').textContent = `Última sync: ${new Date().toLocaleTimeString()}`;
            document.querySelector('.status-item.status-connected').classList.add('status-connected');
        } else {
            console.error('Erro ao carregar dados do Google Sheets. Usando dados de exemplo.');
            allData = exampleData.map(row => ({
                id: Math.random().toString(36).substr(2, 9),
                categoria: row[0],
                servico: row[1],
                valor: row[2],
                detalhes: row[3],
                observacoes: row[4],
                status: 'ativo'
            }));
            document.querySelector('.status-item.status-connected').classList.remove('status-connected');
            document.getElementById('last-sync').textContent = 'Última sync: Falhou';
        }
    } catch (error) {
        console.error('Falha na conexão com o Google Sheets. Usando dados de exemplo.', error);
        allData = exampleData.map(row => ({
            id: Math.random().toString(36).substr(2, 9),
            categoria: row[0],
            servico: row[1],
            valor: row[2],
            detalhes: row[3],
            observacoes: row[4],
            status: 'ativo'
        }));
        document.querySelector('.status-item.status-connected').classList.remove('status-connected');
        document.getElementById('last-sync').textContent = 'Última sync: Falhou';
    } finally {
        updateStatsAndTable();
    }
}

function updateStatsAndTable() {
    updateStats();
    populateTable(allData);
    populateCategoryFilter();
}

function updateStats() {
    document.getElementById('total-records').textContent = allData.length;
    
    categories = new Set(allData.map(item => item.categoria));
    document.getElementById('total-categories').textContent = categories.size;

    const recordsWithValue = allData.filter(item => item.valor > 0).length;
    document.getElementById('records-with-values').textContent = recordsWithValue;

    const completionRate = allData.length > 0 ? ((recordsWithValue / allData.length) * 100).toFixed(0) : 0;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
}

function populateCategoryFilter() {
    const filterSelect = document.getElementById('filter-category');
    filterSelect.innerHTML = '<option value="">Todas as Categorias</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });
}

function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="loading-cell">Nenhum registro encontrado.</td></tr>`;
        return;
    }
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.categoria}</td>
            <td>${item.servico}</td>
            <td>€ ${item.valor ? item.valor.toFixed(2).replace('.', ',') : '0,00'}</td>
            <td>${item.detalhes}</td>
            <td>${item.observacoes}</td>
            <td>
                <button class="action-btn edit" data-id="${item.id}" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-id="${item.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    // Adiciona event listeners para os botões da tabela
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', handleEdit);
    });
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const statusFilter = document.getElementById('filter-status').value;

    const filteredData = allData.filter(item => {
        const matchesSearch = Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm)
        );
        const matchesCategory = categoryFilter === '' || item.categoria === categoryFilter;
        const matchesStatus = statusFilter === '' || item.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    populateTable(filteredData);
}

function showLoading() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="6" class="loading-cell">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Carregando dados...</span>
                </div>
            </td>
        </tr>`;
}

// Modal functions
function openModal() {
    const modal = document.getElementById('modal-novo-embarque');
    modal.style.display = 'block';
    // Popula o select de categorias
    const categoriaSelect = document.getElementById('categoria');
    categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoriaSelect.appendChild(option);
    });
}

function closeModal() {
    const modal = document.getElementById('modal-novo-embarque');
    modal.style.display = 'none';
    document.getElementById('form-novo-embarque').reset();
}

// Form submit
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const newRecord = {
        action: 'add',
        categoria: formData.get('categoria'),
        servico: formData.get('servico'),
        valor: parseFloat(formData.get('valor')) || 0,
        detalhes: formData.get('detalhes'),
        observacoes: formData.get('observacoes')
    };

    try {
        const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Necessário para alguns navegadores
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecord)
        });
        // Se a resposta for 'ok', significa que o Google Apps Script recebeu a requisição.
        // O body da resposta pode ser vazio ou um erro CORS, então não precisamos checar o JSON.
        // A lógica do Apps Script já adiciona a linha.
        console.log('Dados enviados com sucesso para o Google Sheets.');
        // Recarregar os dados da planilha para atualizar a tabela
        await fetchData(true);
        closeModal();
    } catch (error) {
        console.error('Erro ao enviar dados para o Google Sheets.', error);
        alert('Erro ao salvar os dados. A conexão com o Google Sheets falhou. Verifique a configuração do seu Web App.');
        closeModal();
    }
}

// Export functions
function exportToExcel() {
    const dataToExport = allData.map(item => [
        item.categoria,
        item.servico,
        item.valor,
        item.detalhes,
        item.observacoes
    ]);
    const ws = XLSX.utils.aoa_to_sheet([['Categoria', 'Serviço', 'Valor Principal', 'Detalhes', 'Observações'], ...dataToExport]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados de Embarque');
    XLSX.writeFile(wb, 'dados_embarques.xlsx');
}

function exportToCsv() {
    const dataToExport = allData.map(item => [
        item.categoria,
        item.servico,
        item.valor,
        item.detalhes,
        item.observacoes
    ]);
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
        "Categoria,Serviço,Valor Principal,Detalhes,Observações\n" + 
        dataToExport.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dados_embarques.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Handler de edição e exclusão (apenas frontend)
function handleEdit(event) {
    const id = event.currentTarget.dataset.id;
    const itemToEdit = allData.find(item => item.id === id);
    if (!itemToEdit) return;

    // TODO: Implementar a lógica de preencher o modal com os dados do item
    // e enviar a requisição de atualização para o Google Apps Script.
    // O Apps Script precisa de uma função para atualizar linhas, além de 'add'.
    alert(`Funcionalidade de Editar item com ID: ${id} não implementada no back-end. Preencha o modal com os dados de: ${itemToEdit.servico}`);
}

function handleDelete(event) {
    const id = event.currentTarget.dataset.id;
    if (confirm("Tem certeza que deseja excluir este registro?")) {
        // TODO: Implementar a lógica de exclusão no Google Apps Script.
        // O Apps Script precisa de uma função para deletar linhas, que identifique
        // a linha correta a ser deletada.
        alert(`Funcionalidade de Excluir item com ID: ${id} não implementada no back-end. Apenas a remoção visual foi feita.`);
        
        // Remove visualmente da tabela
        allData = allData.filter(item => item.id !== id);
        updateStatsAndTable();
    }
}
