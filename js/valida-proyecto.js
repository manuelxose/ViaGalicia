function mostrarModalGrabado(){
	// Ventana modal de mensaje de proyecto guardado

	$("#modal_mostrar_proyecto_guardado").modal('show');

}

function cambiarIdioma(e){
	//parametrosweb es una clase global de xestec
	el=e.target;
	idioma=el.options[el.selectedIndex].value;
	$.get('index2.php?no_html=1&option=com_xestec&task=ccu_controler&act=idioma&rutina=set-idioma&idioma='+idioma,
	function(datosJson){
			location.reload();
		},'json');
}

function proyectoGuardadoyCompleto(){
		$('input.xestec-save').attr('type','button').on('click',function(){
			if($('form.fxestec').valid()) 
				$('form.fxestec')[0].submit();
			else
				alert('Hay errores, revise el formulario, se marcan en rojo');
		});

		var url="index2.php?option=com_xestec&task=ccu_controler&act=proyectospresentados&rutina=esta-completo&no_html=1";
		$.ajax({
			type: "GET",
			dataType:'json',
			url: url,
		}).done(function( data ) {
			$('input.xestec-save').val(data.mensaje);
			if( data.completo ){
				$('.imprimir').removeClass('hidden');
				//No lo quito la clase hidden, no la incluye por defecto y no hay razón para quitarsela.
				//$('.borrar').removeClass('hidden');
			} 
			else{
				$('form.fxestec').valid();
				$('.imprimir').addClass('hidden');
				$('.borrar').addClass('hidden');
			} 
		});
}

function comprobarRadioSociedad(){

	if($("#input_sociedad_constituida_si").is(":checked"))
		$(".campo_fecha_constitucion").removeClass("hidden");
	else
		$(".campo_fecha_constitucion").addClass("hidden");
}

jQuery(document).ready(function($) {



$('form.fxestec').validate(
{
	debug: true,
	rules:{
		fecha_constitucion_sociedad:{
			required:true
		},
		localizacion_academia:{
			required:true
		},
		telefono:{
			required:true
		},
		emailcontacto:{
			required:true,
			email:true
		},
		sistemaproductivo:{
			required:true
		},
		tecnologiaaplicada:{
			required:true
		},
		nombreproyecto:{
			required:true,
			maxlength: 40
		},
		tuidea:{
			required:true,
			maxlength: 140
		},
		problema_cliente:{
			required:true,
			maxlength: 900
		},
		alternativas_actuales:{
			required:true,
			maxlength: 900
		},
		solucion_problema:{
			required:true,
			maxlength: 900
		},
		cliente_potencial:{
			required:true,
			maxlength: 900
		},
		propuesta_valor:{
			required:true,
			maxlength: 900
		},
		competidor:{
			required:true,
			maxlength: 900
		},
		modelonegocio:{
			required:true,
			maxlength: 900
		},
		producto:{
			required:true,
			maxlength: 900
		}
	}
});


proyectoGuardadoyCompleto();

comprobarRadioSociedad();

$('#select-idioma').on('change',cambiarIdioma);



$(':radio').on('change', function(){
	comprobarRadioSociedad();
});

$('input[type="submit"]').on('click',function(){
	if($('form.fxestec').valid()) $('form.fxestec')[0].submit();
})


});
/* fin de jquery ready*/


function limpiarformularioproyecto(formulario){
	if(confirm('¿Desea borrar todo el contenido del formulario?')){	
		formulario.localizacion_academia.value='';
		formulario.sociedad_constituida.value='';
		formulario.fecha_constitucion_sociedad.value='';		
		formulario.sistemaproductivo.value='';
		formulario.tecnologiaaplicada.value='';
		formulario.telefono.value='';
		formulario.emailcontacto.value='';
		formulario.web.value='';
		formulario.url_linkedin.value='';
		formulario.url_twitter.value='';
		formulario.url_facebook.value='';
		formulario.url_googleplus.value='';	
		formulario.alternativas_actuales.value='';		
		formulario.alternativas_actuales.value='';		
		formulario.alternativas_actuales.value='';		
		formulario.nombreproyecto.value='';
		formulario.tuidea.value='';
		formulario.problema_cliente.value='';
		formulario.solucion_problema.value='';
		formulario.cliente_potencial.value='';
		formulario.propuesta_valor.value='';
		formulario.alternativas_actuales.value='';
		formulario.competidor.value='';
		formulario.modelonegocio.value='';
		formulario.producto.value='';
		formulario._keyancla.value='#subsubmit'; 
		formulario._keycokey.value='bot_xestec_parcial';
		formulario.submit();
	}
}

