$(document).ready(function(){
    
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

    $("#mytable_body").click(function () {
        
        if($(this).prop("checked", true)){
            $(this).parent('td').removeClass('fica_verde');
            alert("sai verde");
        }
        else{
            $(this).parent('td').addClass('fica_verde');
            alert("pinta verde");
        }
            
    });

    

    $("[data-toggle=tooltip]").tooltip();

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
});
