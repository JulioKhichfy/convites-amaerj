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


    $("#mytable_body input[type=checkbox]").click(function () {

        
        if ($(this).is(':checked')) 
        {
            $(this).prop("checked", true);
            $(this).parent('td').addClass('fica_verde');
            //$("#idlinha").val($(this).val());
            $("#idStatuscheckbox").val("true");
            //$( "#formconvidados" ).submit();
        }
        else 
        {
            $(this).prop("checked", false);
            $(this).parent('td').removeClass('fica_verde');
            //$("#idlinha").val($(this).val());
            $("#idStatuscheckbox").val("false");
            //$( "#formconvidados" ).submit();
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
        $("#idevento").prop("value",value);
        $("#submitselecionaveis").prop("disabled", false);
        //alert( $("#idtable").val());
        $.post( "/convidados2evento", { tbn: $("#idtable").val() , evento: value },
            function(data,status)
            {
                var convidados;
                console.log("data>>> ", data);
                if(data instanceof Array)
                {
                    $("#mytable input[type=checkbox]").each(function () {
                            $(this).prop("checked", false);
                            $(this).parent('td').removeClass('fica_verde');
                            $(this).prop("checked", false);
                            $(this).prop("disabled", false);
                    });
                    if(data.length > 0)
                    {
                        for(var i=0 ; i<data.length ; i++)
                        {
                            var td_id = "#idtd"+data[i].idselecionado;
                            $(td_id).addClass('fica_verde');
                            $(td_id).find( "input" ).prop("checked", true);
                            $(td_id).find( "input" ).prop("disabled", true);
                        }
                    }
                    else
                    {   
                        $("#mytable input[type=checkbox]").each(function () {
                            $(this).prop("checked", false);
                            $(this).parent('td').removeClass('fica_verde');
                            $(this).prop("checked", false);
                            $(this).prop("disabled", false);
                        });
                    }
                }
                else
                {
                    alert("NAO sou um array");
                    $("#mytable input[type=checkbox]").each(function () {
                        $(this).prop("checked", false);
                        $(this).parent('td').removeClass('fica_verde');
                        $(this).prop("checked", false);
                        $(this).prop("disabled", false);
                    });    
                }
            });
    });

    $("#tables").change(function(){ 
        var tbn = $('#tables').find(":selected").text();
        $("#idtable").prop("value",tbn);
        $("#formlistagem").submit();
    });
});

function esconderConvidado(event,idselecionado,idevento,tbn){
   var id=event.id;
     $.get( '/eventos/removerdalista', { id_pessoa: idselecionado , id_evento: idevento, tbn:tbn }, 
        function(data,status){
            if(status=='success'){
                $("#"+id).addClass('esconder');
            }
            else{
                alert("Erro ao excluir convidado.");
            }
    });
}

function esconderPessoa(event,idselecionado,tbn){
   var id=event.id;
     $.get( '/remover', { id: idselecionado , tablename:tbn }, 
        function(data,status){
            if(status=='success'){
                $("#"+id).addClass('esconder');
            }
            else{
                alert("Erro ao excluir pessoa.");
            }
    });
}

