var jQT = $.jQTouch({
    icon: 'kilo.png'
});
// ao ler o documento o form vai executar uma ação ao ser enviado
$(document).ready(function(){
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
        sessionStorage.currentDate =    date.getDate() + '/' +
                                        (date.getMonth() + 1) + '/' +
                                        date.getFullYear();
        refreshEntries();
    });
});
// atualizar datas
function refreshEntries() {
    var currentDate = sessionStorage.currentDate;
    $('#date h1').text(currentDate);
}

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
