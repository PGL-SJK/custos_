// Configurações da API Google Sheets via Apps Script
const CONFIG = {
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbz8NHKaFUSbTHEBdyDBqptNu883h74NNHSeF14Qtwir0wjzRHC__Id88OYNBvqrwodZ9A/exec'
};

// Estado da aplicação
let appData = {
    registros: [],
    categorias: [],
    filteredData: [],
    isLoading: false
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de Gestão de Embarques Marítimos iniciado');
    initializeApp();
    setupEventListeners();
});

// Inicializar aplicação
async function initializeApp() {
    try {
        setLoadingState(true);
        await importFromSheets();
        updateStats();
        updateLastSync();
    } catch (error) {
        console.error('Erro na inicialização:', error);
        showErrorMessage('Erro ao inicializar o sistema: ' + error.message);
    } finally {
        setLoadingState(false);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botões principais
    document.getElementById('btn-novo-embarque').addEventListener('click', openNewEmbarqueModal);
    document.getElementById('btn-importar').addEventListener('click', importFromSheets);
    document.getElementById('btn-exportar-excel').addEventListener('click', exportToExcel);
    document.getElementById('btn-exportar-csv').addEventListener('click', exportToCSV);

    // Modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-form').addEventListener('click', closeModal);
    document.getElementById('form-novo-embarque').addEventListener('submit', handleNewEmbarque);

    // Pesquisa e filtros
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('filter-category').addEventListener('change', handleFilter);
    document.getElementById('filter-status').addEventListener('change', handleFilter);

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal-novo-embarque');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Importar dados do Google Sheets via Apps Script
async function importFromSheets() {
    try {
        setLoadingState(true);
        showStatusMessage('Importando dados do Google Sheets...', 'info');

        const response = await fetch(CONFIG.WEB_APP_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.values || data.values.length === 0) {
            throw new Error('Nenhum dado encontrado na planilha');
        }

        processSheetData(data.values);
        renderTable();
        updateStats();
        updateLastSync();

        showStatusMessage('Dados importados com sucesso!', 'success');

    } catch (error) {
        console.error('Erro ao importar dados:', error);
        loadSampleData();
        showStatusMessage('Usando dados de exemplo (erro na conexão com Google Sheets)', 'warning');
    } finally {
        setLoadingState(false);
    }
}

// Manipular novo embarque
async function handleNewEmbarque(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const novoRegistro = {
        action: 'add',
        categoria: formData.get('categoria'),
        servico: formData.get('servico'),
        valor: parseFloat(formData.get('valor')) || 0,
        detalhes: formData.get('detalhes'),
        observacoes: formData.get('observacoes'),
        status: 'ativo'
    };

    try {
        const response = await fetch(CONFIG.WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(novoRegistro),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            showStatusMessage('Embarque adicionado com sucesso!', 'success');
            await importFromSheets();
            closeModal();
        } else {
            throw new Error(result.message || 'Erro ao salvar dados');
        }
    } catch (error) {
        console.error('Erro ao salvar novo embarque:', error);
        showStatusMessage('Erro ao salvar no Google Sheets', 'error');
    }
}
