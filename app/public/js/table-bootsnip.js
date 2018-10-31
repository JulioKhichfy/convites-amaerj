$(document).ready(function(){

    var selecionaveis = [];
    
    $("#mytable #checkall").click(function () {
        if ($("#mytable #checkall").is(':checked')) {
            $("#mytable input[type=checkbox]").each(function () {
                $(this).prop("checked", true);
                $(this).parent('td').addClass('fica_verde');
                
            });

        } else {
            $("#mytable input[type=checkbox]").each(function () {
                $(this).prop("checked", false);
                $(this).parent('td').removeClass('fica_verde');
            });
        }
    });

    $("[data-toggle=tooltip]").tooltip();


    $("#mytable_body .checkthis").click(function () {

        if ($(this).is(':checked')) 
        {
            $(this).prop("checked", true);
            $(this).parent('td').addClass('fica_verde');
            $("#idlinha").val($(this).val());
            
            $( "#formconvidados" ).submit();
            //incluir-convidado
            /*$.ajax({
                url: '/incluir-convidado', 
                type: 'POST', 
                contentType: 'application/json', 
                data: JSON.stringify({"idConvidado": $(this).val(), "idTable" : $("#idtable").val(), "idEvento" : $("#idEvento").val() })}
            )*/
        }
        else 
        {
            $(this).prop("checked", false);
            $(this).parent('td').removeClass('fica_verde');
            $("#idlinha").val($(this).val());
            /*$.ajax({
                url: '/excluir-convidado', 
                type: 'POST', 
                contentType: 'application/json', 
                data: JSON.stringify({"idConvidado": $(this).val(), "idTable" : $("#idtable").val(), "idEvento" : $("#idEvento").val() })}
            )*/
            
        }
    });


    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#mytable_body tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $('#meusEventos').change(function(){ 
        var value = $(this).val();
        $("#idEvento").prop("value",value);
    });

    $('#tables').change(function(){ 
        var value = $(this).val();
        $("#idtable").prop("value",value);
    });
});
