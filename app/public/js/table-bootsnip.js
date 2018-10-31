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
            //$(this).parent('td').addClass('fica_verde');
            $("#idlinha").val($(this).val());
            $("#idStatuscheckbox").val("true");
            $( "#formconvidados" ).submit();
        }
        else 
        {
            $(this).prop("checked", false);
            //$(this).parent('td').removeClass('fica_verde');
            $("#idlinha").val($(this).val());
            $("#idStatuscheckbox").val("false");
            $( "#formconvidados" ).submit();
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
    });

    $("#tables").change(function(){ 
        var tbn = $('#tables').find(":selected").text();
        $("#idtable").prop("value",tbn);
    });
});

//<input type="hidden" name="statuscheckbox" id="statuscheckbox">
//<input type="hidden" name="idtable" id="idtable">
//<input type="hidden" name="idevento" id="idevento">
//<input type="hidden" name="idlinha" id="idlinha">