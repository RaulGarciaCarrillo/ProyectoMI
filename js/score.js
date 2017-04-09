$(document).ready(function() {
	$.ajax({
		type: "POST",
		url: "http://proyectoaigc.netai.net/score.php",
		success: function(data){
			for (var i = 0; i < data.length; i++){
				$(".listaScore").append("<tr><td>"+data[i].nombre+"</td><td>"+data[i].score+"</td></tr>");
			}
		},
		dataType: "json"
	});
})