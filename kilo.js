var db;
var jQT = $.jQTouch({
    icon: 'kilo.png'
});
// ao ler o documento o form vai executar uma ação ao ser enviado
// criação de variável para banco de dados
$(document).ready(function(){
    //chamada da função de inclusão do alimento
    $('#createEntry form').submit(createEntry);
    $('#settings form').submit(saveSettings);
    //loadSettings();
    //atualizar os valores sempre que entrar ou sair das configurações
    $('#settings').bind('pageAnimationStart', loadSettings);
    //salvar configurações de data
    //clicável e touch para webview e smarts
    $('#dates li a').bind('click touchend', function(){
    //pegar o id de cada data e exibir as datas anteriores
    var dayOffset = this.id;
    //aqui criamos um novo objeto para armazenar a data atual e em seguida formatá-la
    var date = new Date();
        date.setDate(date.getDate() - dayOffset);
        sessionStorage.currentDate =    (date.getDate() + 1) + '/' +
                                        (date.getMonth() + 1) + '/' +
                                        date.getFullYear();
        refreshEntries();
    });
    var shortName   = 'Kilo';
    var version     = '0.1';
    var displayName = 'Kilo';
    var maxSize     = 65536;
    db = openDatabase(shortName, version, displayName, maxSize);
    db.transaction(
            function(transaction) {
                transaction.executeSql(
                    'CREATE TABLE IF NOT EXISTS entries(id integer primary key autoincrement, date, food, calories)'
                );
            }
        );
});
// função para salvar configurações
function saveSettings() {
    localStorage.age = $('#age').val();
    localStorage.budget = $('#budget').val();
    localStorage.weight = $('#weight').val();
    jQT.goBack();
    return false;
}

// função para carregar configurações
function loadSettings() {
    //configurar as variaveis locais com valores em branco se elas não estiverem definidas
    if (!localStorage.age) {
        localStorage.age = "";
    }
    if (!localStorage.budget) {
        localStorage.budget = "";
    }
    if (!localStorage.weight) {
        localStorage.weight = "";
    }
    $('#age').val(localStorage.age);
    $('#budget').val(localStorage.budget);
    $('#weight').val(localStorage.weight);
}

// atualizar datas
function refreshEntries() {
    var currentDate = sessionStorage.currentDate;
    $('#date h1').text(currentDate);
    $('#date ul li:gt(0)').remove();
    db.transaction(
        function(transaction) {
            transaction.executeSql(
            'SELECT * FROM entries WHERE date = ? ORDER BY food;',
            [currentDate],
                function (transaction, result) {
                    for (var i=0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            var newEntryRow = $('#entryTemplate').clone();
                            newEntryRow.removeAttr('id');
                            newEntryRow.removeAttr('style');
                            newEntryRow.data('entryId', row.id);
                            newEntryRow.appendTo('#date ul');
                            newEntryRow.find('.label').text(row.food);
                            newEntryRow.find('.calories').text(row.calories);
                            newEntryRow.find('.delete').click(function(){
                                var clickedEntry = $(this).parent();
                                var clickedEntryId = clickedEntry.data('entryId');
                                deleteEntryById(clickedEntryId);
                                clickedEntry.slideUp();
                            });
                        }
                    },
                errorHandler
            );
        }
    );
}

//função para criar nova entrada
function createEntry() {
    var date = sessionStorage.currentDate;
    var calories = $('#calories').val();
    var food = $('#food').val();
    db.transaction(
        function(transaction) {
            transaction.executeSql(
                'INSERT INTO entries (date, calories, food) VALUES (?, ?, ?);',
                [date, calories, food],
                    function(){
                        refreshEntries();
                        jQT.goBack();
                    },
                errorHandler
            );
        }
    );
    return false;
}

//função para caso ocorra um erro e o valor não seja inserido
function errorHandler(transaction, error) {
    alert('Oops. Ocorreu um probleminha '+error.message+' (Código do erro '+error.code+')');
    return true;
}

//ainda é possível retornar o erro e registrar ele no banco para futuras verificações de log
/*
function errorHandler(transaction, error) {
    alert('Oops. Ocorreu um probleminha '+error.message+' (Código do erro '+error.code+')');
        transaction.executeSql('INSERT INTO errors (code, message) VALUES (?, ?);',
                                [error.code, error.message]);
    return false;
}
        transactionErrorHandler,
        transactionSuccessHandler
*/

//função para deletar elementos

function deleteEntryById(id) {
    db.transaction(
        function(transaction) {
            transaction.executeSql('DELETE FROM entries WHERE id=?;',
            [id], null, errorHandler);
        }
    );
}
