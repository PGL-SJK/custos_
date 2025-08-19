// Google Apps Script para resolver CORS
// Cole este código em https://script.google.com

function doGet(e) {
  try {
    const spreadsheetId = '1RqlrhHCepgBKUgQT-7b3R1S8FTao5PYBlcyT0zIHgrA';
    const range = e.parameter.range || 'Dados!A:Z';

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName('Dados') || spreadsheet.getActiveSheet();
    const values = sheet.getDataRange().getValues();

    const result = {
      success: true,
      values: values,
      range: range,
      totalRows: values.length
    };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    const errorResult = {
      success: false,
      error: error.toString(),
      message: 'Erro ao acessar a planilha'
    };

    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheetId = '1RqlrhHCepgBKUgQT-7b3R1S8FTao5PYBlcyT0zIHgrA';

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName('Dados') || spreadsheet.getActiveSheet();

    if (data.action === 'add') {
      const newRow = [
        data.categoria,
        data.servico,
        data.valor,
        data.detalhes,
        data.observacoes,
        data.status || 'ativo'
      ];
      sheet.appendRow(newRow);
    }

    const result = {
      success: true,
      message: 'Dados salvos com sucesso',
      timestamp: new Date().toISOString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    const errorResult = {
      success: false,
      error: error.toString(),
      message: 'Erro ao salvar dados'
    };

    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função para configurar permissões
function onInstall() {
  ScriptApp.newTrigger('doGet')
    .timeBased()
    .everyMinutes(1)
    .create();
}