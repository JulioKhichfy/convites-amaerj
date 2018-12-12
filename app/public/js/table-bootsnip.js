$(document).ready(function(){

    var selecionaveis = [];
    
    
    $("#mytable #checkall").click(function () 
    {
        if ($("#mytable #checkall").is(':checked')) 
        {
            if( $("#idevento").val() != "" )
            {
                $("#mytable input[type=checkbox]").each(function () {
                    $(this).prop("checked", true);
                    $(this).parent('td').addClass('fica_verde');
                });

                $("#convidadoSolitario").val("");
                $("#idStatuscheckbox").val("true");
                $.post( '/convidados', $('form#formconvidados').serialize(), function(data) {
                   
                    alert(data);
                });
            }
            else
            {
                // modal de alerta para escolher um evento
                $('#modalEscolhaUmEvento').modal('show');
            }


        } else {
                $("#mytable input[type=checkbox]").each(function () {
                    $(this).prop("checked", false);
                    $(this).parent('td').removeClass('fica_verde');
                });

                if( $("#idevento").val() != "" )
                {
                    $("#convidadoSolitario").val("");
                    $("#idStatuscheckbox").val("false");
                    $.post( '/convidados', $('form#formconvidados').serialize(), function(data) {
                        
                        alert(data);
                    });
                   
                }
                 else
                {
                    // modal de alerta para escolher um evento
                    $('#modalEscolhaUmEvento').modal('show');
                    $(this).parent('td').removeClass('fica_verde');
                    $(this).prop("checked", false);
                }

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
            
            if( $("#idevento").val() != "" )
            {
                $("#convidadoSolitario").val($(this).val());
                //$("#formconvidados").submit();
                  $.post( '/convidados', $('form#formconvidados').serialize(), function(data) {
                    alert(data);
                  });
            }
            else
            {
                // modal de alerta para escolher um evento
                $('#modalEscolhaUmEvento').modal('show');
                $(this).parent('td').removeClass('fica_verde');
                $(this).prop("checked", false);
            }
        }
        else 
        {
            $(this).prop("checked", false);
            $(this).parent('td').removeClass('fica_verde');
            //$("#idlinha").val($(this).val());
            $("#idStatuscheckbox").val("false");
            if($("#idevento").val() != "" ){
                //$("#idevento").prop("value",id_evento);
                $("#convidadoSolitario").val($(this).val());
                //$("#formconvidados").submit();
                $.post( '/convidados', $('form#formconvidados').serialize(), function(data) {
                    alert(data);
                    });
            }
            else
            {
                alert("Escolha um EVENTO primeiramente");
            }
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
                            //$(td_id).find( "input" ).prop("disabled", true);
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

    $('#printConvidados').on('click',function(){
        printConvidados();
    })
     $('#gerarEtiquetas').on('click',function(){
        printEtiquetas();
    })

     $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
    })
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

function salvarObservacaoEvento(event){
    var id=event.id;
    var obs = $("#"+id).val();
     $.post( '/eventos/detalhes/salvar-observacao', { observacao: obs , idevento:id }, 
        function(data,status){
            if(status=='success'){
                alert(data);
            }
            else{
                alert(data);
            }
    });
}

function printConvidados()
{
   var divToPrint=document.getElementById("mytable");
   $(".print-conv").css( "display", "none" );    
   newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML);
   newWin.print();
   newWin.close();
   $(".print-conv").css( "display", "inline"); 
}

function printEtiquetas()
{
   
   var divToPrint=document.getElementById("printEtiquetasId");
   $("#printEtiquetasId").css( "display", "inline");
   newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML);
   newWin.print();
   newWin.close();
   $("#printEtiquetasId").css( "display", "none");
}