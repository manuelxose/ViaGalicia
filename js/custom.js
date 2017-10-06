var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}
if ((is_chrome)&&(is_opera)) {is_chrome=false;}

//Polifills
if ( !HTMLFormElement.prototype.reportValidity ) {
    HTMLFormElement.prototype.reportValidity = function() {
		return  this.checkValidity();
    }
}
if ( !FormData.prototype.set ) {
    FormData.prototype.set = FormData.prototype.append;
}

function estaCompletoProyecto(){
		var url="index2.php?option=com_xestec&task=ccu_controler&act=proyectospresentados&rutina=esta-completo&no_html=1";
		$.ajax({
			type: "GET",
			dataType:'json',
			url: url,
		}).done(function( data ) {
			if( data.completo ){
				$('body').addClass('proyecto-completo');
				$('.ver-proyecto-completo').removeClass('hidden');
				$('.ver-proyecto-no-completo').addClass('hidden');
			}
			else
			{
				$('body').removeClass('proyecto-completo');
				$('.ver-proyecto-completo').addClass('hidden');
				$('.ver-proyecto-no-completo').removeClass('hidden');
			}
		});
}


function abrirIframe(clientX,clientY,url){
		document.getElementById('iframedialog').src=url;
		$('#ifdialog').css('top',clientY+'px').css('left',clientX+'px');
		setTimeout(function(){$('#ifdialog').addClass('visible');
		$(document.body).css('overflow','hidden');
		},500);
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

var viewPort = (
	function ()
	{
		var viewPorts = [ 'xs' , 'sm' , 'md' , 'lg' ];

		var viewPortSize = function ()
		{
			var body = $( 'body' );
			if ( body.hasClass( 'device-lg' ) )
			{
				return 'lg';
			}
			else if ( body.hasClass( 'device-md' ) )
			{
				return 'md';
			}
			else if ( body.hasClass( 'device-sm' ) )
			{
				return 'sm';
			}
			else if ( body.hasClass( 'device-xs' ) )
			{
				return 'xs';
			}
		}

		var is = function ( size )
		{
			if ( viewPorts.indexOf( size ) == -1 )
			{
				throw "no valid viewport name given";
			}
			return viewPortSize() == size;
		}

		var isEqualOrGreaterThan = function ( size )
		{
			if ( viewPorts.indexOf( size ) == -1 )
			{
				throw "no valid viewport name given";
			}
			return viewPorts.indexOf( viewPortSize() ) >= viewPorts.indexOf( size );
		}

		// Public API
		return {
			current : viewPortSize ,
			is : is ,
			isEqualOrGreaterThan : isEqualOrGreaterThan
		}

	}
)();


var equalizeHeights = function ()
{
	var viewPorts           = [ 'xs' , 'sm' , 'md' , 'lg' ];
	var classRegexp         = new RegExp( '^eh-(' + viewPorts.join( '|' ) + ')-(.+)$' , 'i' );
	var equalHeightGroups   = {};
	var equalHeightElements = $( '[ class ^= "eh-" ] , [ class *= " eh-" ]' );
	equalHeightElements.each(
		function ( index , element )
		{
			var viewPortList = {};
			element          = $( element ).extend(
				{
					classes : function ( regexp , capture )
					{
						return element.attr( 'class' ).split( ' ' ).filter(
							function ( it )
							{
								return (
									!regexp || regexp.test( it )
								);
							}
						).map(
							function ( it )
							{
								var groups = ( !regexp && [ ] ) || ( regexp.exec( it ) );
								return (
									(
										( capture )
										&& ( groups.length > capture )
									) ? groups[ capture ] : it
								);
							}
						);
					} ,
					exactHeight : function ( ) {
						var rectangle = (
							element[ 0 ].getBoundingClientRect
							&& element[ 0 ].getBoundingClientRect()
						) || { top : 0 , bottom : element.outerHeight() };
						return Math.round( (rectangle.bottom - rectangle.top) * 100 ) / 100;
					}
				}
			);
			var targets = element.classes( /^eh-target-(.+)$/i , 1 );
			var targetAttribute = ( ( targets.length > 0 ) ? targets[ 0 ] : 'margin-bottom' );
			if ( element.data( 'eh-initial-attr' ) != null )
			{
				element.css(
					targetAttribute ,
					element.data( 'eh-initial-attr' ).toString() + 'px' ,
					true
				);
			}
			element.classes( classRegexp ).forEach(
				function ( it )
				{
					viewPortList[ (
						classRegexp.exec( it )[ 1 ] || false
					) ] = it;
				}
			);
			for (
				var viewPortIndex = viewPorts.indexOf( viewPort.current() ) ;
				viewPortIndex >= 0 ;
				viewPortIndex--
			)
			{
				if ( viewPortList[ viewPorts[ viewPortIndex ] ] != null )
				{
					var group = classRegexp.exec( viewPortList[ viewPorts[ viewPortIndex ] ] )[ 2 ];
					(
						equalHeightGroups[ group ]
						&& equalHeightGroups[ group ].push( element )
					)
					|| (
						equalHeightGroups[ group ] = [ element ]
					);
					break;
				}
			}
		}
	);
	for ( var group in equalHeightGroups )
	{
		var elements  = equalHeightGroups[ group ];
		var maxHeight = 0;
		elements.forEach(
			function ( element )
			{
				var height = element.exactHeight();
				if ( height > maxHeight )
				{
					maxHeight = height;
				}
			}
		);
		elements.forEach(
			function ( element )
			{
				var targets = element.classes( /^eh-target-(.+)$/i , 1 );
				var targetAttribute = ( ( targets.length > 0 ) ? targets[ 0 ] : 'margin-bottom' );
				var initialAttr = (
					(
						(
							element.data( 'eh-initial-attr' ) != null
						)
						&& (
							element.data( 'eh-initial-attr' )
						)
					)
					|| (
						parseInt( element.css( targetAttribute ) )
					)
				);
				// Gestionar con margin-top y margin-bottom y con
				// classes de vertical-align-*
				// Los sufijos del viewport se gestionan de pequeño a mayor
				// Por ej: si tenemos md vale para md y lg (viewport >= md)
				// Entonces gestionando los viewports secuencialmente
				// De xs a lg tendríamos la gestión correcta
				element.data( 'eh-initial-attr' , initialAttr );
				element.css(
					targetAttribute ,
					(
						element.data( 'eh-initial-attr' )
						+ maxHeight
						- element.exactHeight()
					).toString() + 'px' ,
					true
				);
			}
		);
	}
};



jQuery(document).ready(function($) {
	
	estaCompletoProyecto();
	
	$('#select-idioma').on('change',cambiarIdioma);
	

	$('.scrollup').click(function(){
		$("html, body").animate({ scrollTop: 0 }, 1000);
		return false;
	});

	$('.accordion').on('show', function (e) {

		$(e.target).prev('.accordion-heading').find('.accordion-toggle').addClass('active');
		$(e.target).prev('.accordion-heading').find('.accordion-toggle i').removeClass('icon-plus');
		$(e.target).prev('.accordion-heading').find('.accordion-toggle i').addClass('icon-minus');
	});

	$('.accordion').on('hide', function (e) {
		$(this).find('.accordion-toggle').not($(e.target)).removeClass('active');
		$(this).find('.accordion-toggle i').not($(e.target)).removeClass('icon-minus');
		$(this).find('.accordion-toggle i').not($(e.target)).addClass('icon-plus');
	});

	$('.navigation').onePageNav({
		begin: function() {
			console.log('start');
		},
		end: function() {
			console.log('stop');
		},
		scrollOffset: 0
	});

	$('div.portfolio a').on('click tap',function(e){
		abrirIframe(e.clientX,e.clientY,e.currentTarget.href);
		return false;
	});	

	$('button.miproyecto').on('click tap',function(e){
		window.location.href='mi-proyecto.html';
		//abrirIframe(e.clientX,e.clientY,'mi-proyecto.html');
		return false;
	});

	$('#actualizar_datos').on('click',function(e){
		window.location.href='perfil-usuario.html';
		//abrirIframe(e.clientX,e.clientY,'perfil-usuario.html');
		return false;
	
	});
	$('#actualizar_datos_movil').on('click',function(e){
		window.location.href='perfil-usuario.html';
		//abrirIframe(e.clientX,e.clientY,'perfil-usuario.html');
		return false;
	
	});
	$('#iframeclose').on('click tap',function(){
		$(document.body).css('overflow','auto');
		$('#ifdialog').removeClass('visible');
		$('#iframedialog')[0].src="";
	});
// Localscrolling
	$('#menu-main, .brand').localScroll();

// $('#menu-main li a').click(function(){
// 	var links = $('#menu-main li a');
// 	links.removeClass('selected');
// 	$(this).addClass('selected');
// });

// comprobar si es un dispositivo movil (evento touch)

function isMobile() {
	try{
		document.createEvent("TouchEvent");
		return true;
	}
	catch(e){
		return false;
	}
}
/*
var iOS = false,
p = navigator.platform;

if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
iOS = true;
}
*/

if (isMobile() === false && winWidth() > 992) {

	$('.flyIn').on('inview', function (event, visible) {
		if (visible === true) {
			$(this).addClass('animated fadeInUp');
		}
	});

	$('.flyLeft').on('inview', function (event, visible) {
		if (visible === true) {
			$(this).addClass('animated fadeInLeftBig');
		}
	});

	$('.flyRight').on('inview', function (event, visible) {
		if (visible === true) {
			$(this).addClass('animated fadeInRightBig');
		}
	});

}

// add animation on hover
$(".service-box").hover(
	function () {
		$(this).find('img').addClass("animated pulse");
		$(this).find('h2').addClass("animated fadeInUp");
	},
	function () {
		$(this).find('img').removeClass("animated pulse");
		$(this).find('h2').removeClass("animated fadeInUp");
	}
);


// cache container
var $container = $('#portfolio-wrap');

if(is_safari){
	// initialize isotope
	$container.isotope({
		animationEngine : 'jquery',
		animationOptions: {
			duration: 200,
			queue: false
		},
		layoutMode: 'fitRows'
	});
} else {
	$container.isotope({
		animationEngine : 'best-available',
		animationOptions: {
			duration: 200,
			queue: false
		},
		layoutMode: 'fitRows'
	});

	$(window).resize(function() {
		$container.isotope('layout');
	});

	$(window).on('load',function(){$container.isotope('layout')});
}
// filter items when filter link is clicked
$('#filters a').click(function(){
	$('#filters a').removeClass('active');
	$(this).addClass('active');
	var selector = $(this).attr('data-filter');
	$container.isotope({ filter: selector });
	return false;
});

// flexslider main
$('#main-flexslider').flexslider({
	animation: "swing",
	direction: "vertical",
	slideshow: true,
	slideshowSpeed: 3500,
	animationDuration: 1000,
	directionNav: true,
	prevText: '<i class="icon-angle-up icon-2x"></i>',
	nextText: '<i class="icon-angle-down icon-2x active"></i>',
	controlNav: false,
	smootheHeight:true,
	useCSS: false
});
$('#las-cifras').hover(function(){$('span.number-count').countTo().removeClass('number-count');});

assign_bootstrap_mode();

$( window ).on(
	'load resize' , function ()
	{
		assign_bootstrap_mode();
		equalizeHeights();
	}
);

equalizeHeights();


/******* Modificaciones y adaptaciones *******/

// Ocultar menu al pulsar en seccion

$(".navbar-collapse").click(function(){
	$('.navbar-collapse').collapse('hide');
});


// Ventana modal de registro

$('#boton_registro').click(function() {
	$("#modalAcceso").modal('show');
	return false;
});

// ventana modal recuperar password

$("#boton_recuperar").click(function(){
	$("#modalRecuperar").modal("show");
	return false;
});

$('#boton_cambiar_passwd').click(function() {
	$("#modalCambiarpassw").modal('show');
	return false;
});





$('[data-toggle="popover"]').popover();

function assign_bootstrap_mode() {

	width = winWidth();

	var mode = '';
	if (width<768) {
		mode = "device-xs";
	}
	else if (width<992) {
		mode = "device-sm";
	}
	else if (width<1200) {
		mode = "device-md";
	}
	else if (width>1200) {
		mode = "device-lg";
	}
	$("body").removeClass("device-xs").removeClass("device-sm").removeClass("device-md").removeClass("device-lg").addClass(mode);
}

// cross browser window width
function winWidth() {

	var w = 0;

	// IE
	if (typeof( window.innerWidth ) != 'number') {

		if (!(document.documentElement.clientWidth === 0)) {

			// strict mode
			w = document.documentElement.clientWidth;
		} else {

			// quirks mode

			w = document.body.clientWidth;
		}
	} else {              // w3c
		w = window.innerWidth;
	}
	return w;
};

// boton avisame email

$("#email_form").on('submit', function(evento) {

	evento.preventDefault();

	var email_avisar = $("#email_avisar").val();

	$.get( "index2.php?option=com_xestec&task=ccu_controler&act=avisame&email="+ email_avisar +"&no_html=1", function( data ) {

		var errorEmail = data.error_Email;
		var nuevo = data.nuevo;

		if(data.nuevo){
			$("#modal_email_env_ok").modal('show');
		}
		else{
			$("#modal_email_env_err").modal('show');
			switch(errorEmail){
				case "EmailIncorrecto":
					$(".texto_h3").text("Email Incorrecto");
					$(".texto_p").text("La dirección de correo que has introducido es incorrecta.");
				break;
				case "EmailIP":
					$(".texto_h3").text("Limite alcanzado");
					$(".texto_p").text("Has llegado al límite de correos introducidos desde la misma IP.");
				break;
				case "EmailRepetido":
					$(".texto_h3").text("Email repetido");
					$(".texto_p").text("La dirección de correo que has introducido ya se encuentra en nuestra base de datos.");
				break;
				default:
					$(".texto_h3").text("Error en correo");
					$(".texto_p").text("No se ha podido guardar su email porque ha ocurrido un problema.");

			}
		}
	}, "json" );
	});

// Boton login seccion inscribirse
var fnloginsubmit = function(evento) {

	var url="index2.php?option=com_xestec&task=ccu_controler&act=Loginviagalicia&rutina=loginviagaliciaJSON&no_html=1";
		
	formulario = $("#login_form").serializeArray();

	if(login_form.reportValidity()){

		$.ajax({
			type: "POST",
			dataType:'json',
			url: url,
			data: formulario
			//		    success: function(){alert('Registro añadido');}
		}).done(function( data ) {

			if(!data.ok){

				$("#modal_email_env_err").modal('show');
				switch(data.error){
					case "Usuario invalido":
						$(".texto_h3").text("Email no registrado");
						$(".texto_p").text("No existe un usuario registrado asociado a ese email, revise su email.");
					break;
					case "Email invalido":
						$(".texto_h3").text("Email invalido");
						$(".texto_p").text("Email no validado, necesita ir a su buzón y responder al mensaje de validación.");
					break;
					case "Password invalida":
						$(".texto_h3").text("Password incorrecta");
						$(".texto_p").text("La password introducida no es correcta.");
					break;
					default:
						$(".texto_h3").text("Error de acceso");
						$(".texto_p").text("No se ha podido iniciar sesión porque ha ocurrido un problema.");
				}
			}
			else if(data.error == '' && data.ok){
				window.location.href=data.urlentrada;

			}


		}).fail(function() {
    		alert( "Error respuesta JSON." );
  		});	
	}
	return false;
}


$("#login-submit").on('click',fnloginsubmit);


// comprobar correo recuperar contraseña

$('#confirmEmail').on('blur change input',function(evento){
			
	var email_recup = $('#confirmEmail').val();
	var emailpattern=/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
	

	var url="index2.php?option=com_xestec&task=ccu_controler&act=Loginviagalicia&rutina=getTipoUserName&email=" + email_recup + "&no_html=1";

	if(emailpattern.test(email_recup)) $.ajax({
		type: "POST",
		dataType:'json',
		url: url,
		data: {email:evento.target.value}
	}).done(function( data ) {
		if(data && data.tipo=='fecha'){
			$('#checkusername').attr('type','date').attr('placeholder','*Fecha de nacimiento');
			$('#titulo_recup_usuario').text("Introduce tu fecha de nacimiento");
		}
		else{
			$('#checkusername').attr('type','text').attr('placeholder','*Usuario');
			$('#titulo_recup_usuario').text("Introduce tu Usuario");
		}

		if(data.registrado == 'si')
		{
			$('#campo_recup_pass').removeClass('hidden');
			comprobarInputs($('#confirmEmail'));
		}
		else
		{
			$('#campo_recup_pass').addClass('hidden');
			$('#confirmEmail').addClass('invalid').removeClass('valid');
			$('#checkusername').val("");
			comprobarFormulario(mosForm_recup,$("#boton_recuperar_password"), false);
		}

	});

	comprobarFormulario(mosForm_recup,$("#boton_recuperar_password"), true);

});

// boton recuperar contraseña 

$('#boton_recuperar_password').on('click',function(evento){

	var usuario = $('#checkusername').val();
	var campo_usuario = $('#checkusername')[0];

	if(campo_usuario.getAttribute('type') == "text")
		checkusername = usuario;
	else{
		fecha = usuario.split("-").reverse().join("");
		fecha = fecha.split("/").join("");		
		confirmEmail = $("#confirmEmail").val();

//Añado estas lineas
		var email=(((confirmEmail.split('@'))[0].split('.'))[0].split('_'))[0];
		if(email.length>16) email=email.substr(0,16);
		//Fin de lo añadido
		/*
		email = (confirmEmail.split("@"))[0];
		if(email.length>16) email=email.substr(0,16);
		*/
		
		checkusername = email + "@" + fecha;
	}
	
	if(mosForm_recup.reportValidity()){

		formulario=new FormData($("#mosForm_recup")[0]);
		formulario.set("checkusername",checkusername);
		//formulario.set("confirmEmail",confirmEmail);	
		$.ajax({
			type: "POST",
			url: "index2.php?option=com_xestec&task=ccu_controler&act=loginviagalicia&rutina=enviarNuevaPasswordJSON&no_html=1",
			data: formulario,
			dataType:'json',
			contentType: false,
			processData: false		
			//		    success: function(){alert('Registro añadido');}
		}).done(function( data ) {

			if(data.error){
				$(".titulo_password, #panel_recuperar_password").addClass("hidden");
				$("#panel_recuperada_error").removeClass("hidden");

				if(data.texto == 'usuario invalido' && $('#checkusername').attr('type') == 'text')
					$(".texto_recuperar_error").text("El nombre de usuario no es correcto.");
				
				if(data.texto == 'usuario invalido' && $('#checkusername').attr('type') == 'date')
					$(".texto_recuperar_error").text("La fecha de nacimiento es incorrecta.");
			}
			else if(data.texto == 'password enviada'){
					$("#panel_recuperar_password").addClass("hidden");
					$("#panel_password_recuperada").removeClass("hidden");
					$(".texto_recuperada").text("La nueva password ha sido enviada a tu correo.");
				}
		}).fail(function() {
    		alert( "Error de petición de password." );
  		});	

	}

});

// boton de error (volver) de modal de recuperar password

$('#boton_recuperar_error').on("click", function (evento) {

	$(".titulo_password, #panel_recuperar_password").removeClass("hidden");
	$("#panel_recuperada_error, #campo_recup_pass").addClass("hidden");
	$('#mosForm_recup :input').removeClass('valid');
	mosForm_recup.reset();
	comprobarFormulario(mosForm_recup, $("#boton_recuperar_password"), false);

});

// boton para registrar usuario

$('#boton_registrar_usuario').on("click tap", function (evento) {
	var email = $("#email_registro").val();
	var fecha_nacimiento = $("#fecha_nacimiento").val();
	fecha = fecha_nacimiento.split("-").reverse().join("");
	fecha = fecha.split("/").join("");
	var usuario=(((email.split('@'))[0].split('.'))[0].split('_'))[0];
	if(usuario.length>16) usuario=usuario.substr(0,16);
	var name = usuario;
	var usuario = usuario + "@" + fecha;
	if(mosForm.reportValidity()){
		formData=new FormData(mosForm);
		formData.set("name",name);
		formData.set("username",usuario);
		$.ajax({
			type: "POST",
			url: "index2.php?option=com_xestec&task=ccu_controler&act=loginviagalicia&rutina=registrarUsuarioJSON&no_html=1",
			data: formData,
			dataType:'json',
			processData: false,  // tell jQuery not to process the data
  			contentType: false   // tell jQuery not to set contentType			
			//		    success: function(){alert('Registro añadido');}
		}).done(function( data ) {
			if(data.error){
				$(".panel-heading, #panel_registro").addClass("hidden");
				$("#panel_registrado_error").removeClass("hidden");
				$(".texto_registrado_error").text(data.texto);
			}
			else{
				$("#panel_registro").addClass("hidden");
				$("#panel_registrado").removeClass("hidden");
				$(".texto_registrado").text(data.texto);
			}
		}).fail(function() {
    		alert( "Error de registro." );
  		});
		
	}

});

// boton de error(volver) de modal de registro de usuario

$('#boton_volver_error').on("click", function (evento) {

	$(".panel-heading, #panel_registro").removeClass("hidden");
	$("#panel_registrado_error").addClass("hidden");
	$('#mosForm :input').removeClass('valid');
	mosForm.reset();
	comprobarFormulario(mosForm, $("#boton_registrar_usuario"), false);

});

// Eventos de validacion de la modal de registro

$('#mosForm :input').on('blur change',function(){
	comprobarInputs($(this));

	if($('#password2_registro').val() != '')
		comprobarPasswords($("#password1_registro"), $("#password2_registro"));
	
	comprobarFormulario(mosForm,$("#boton_registrar_usuario"), false);
});

// Eventos de validacion de la modal de recuperar password

$("#checkusername").on('input',function(){
		comprobarInputs($(this));
		comprobarFormulario(mosForm_recup,$("#boton_recuperar_password"), true);
});


// Eventos de validacion de la seccion de inscripcion

$("#login_form input").on('blur change',function(){
	comprobarInputs($(this));
});

// Funciones de validacion

function comprobarInputs(input){

	if(input[0].checkValidity())
		$(input).addClass('valid').removeClass('invalid');
	else
		$(input).addClass('invalid').removeClass('valid');
}


function comprobarFormulario(formulario, boton, valor){

	if($("#check_terminos").is(":checked"))
		valor = true;

	if(formulario.checkValidity() && valor){
		boton.prop("disabled", false);
	}
   	else{
		boton.prop("disabled", true);
   	}
}

function comprobarPasswords(password1, password2){

	var passw1 = password1.val();
	var passw2 = password2.val();

		if(passw1 != "" && passw1 == passw2 && passw2 != ""){
			password1.addClass('valid').removeClass('invalid');
			password2.addClass('valid').removeClass('invalid');
			password1[0].setCustomValidity("");
			password2[0].setCustomValidity("");
		}
		else{
			password1.addClass('invalid').removeClass('valid');
			password2.addClass('invalid').removeClass('valid');
			password1[0].setCustomValidity("Las passwords no coinciden");
			password2[0].setCustomValidity("Las passwords no coinciden");
		}
}

// pagina perfil de usuario

	$('#boton_cambiar_passwd').click(function() {
		$("#modalCambiarpassw").modal('show');
		return false;
	});

	// boton para cambiar contraseña

	$('#boton_actualizar_passw').on('click',function(evento){

			formulario=new FormData($("#formulario_cambiar_clave")[0]);

			$.ajax({
				type: "POST",
				url: "index2.php?option=com_xestec&task=ccu_controler&act=loginviagalicia&rutina=cambiarclaveJSON&no_html=1",
				data: formulario,
				dataType:'json',
				contentType: false,
				processData: false		
				//		    success: function(){alert('Registro añadido');}
			}).done(function( data ) {

				if(data.error){
					$(".pass_error").removeClass("hidden");
					$(".pass_ok").addClass("hidden");
					$(".texto_pass_error").text(data.texto);
				}
				else{
					$(".pass_ok").removeClass("hidden");
					$(".pass_error").addClass("hidden");
					$(".texto_pass_ok").text(data.texto);
					$("#boton_actualizar_passw").addClass("hidden");
				}

			}).fail(function(data) {
	    		alert( "Error de petición JSON de password." );
	  		});	


	});

	comprobarAceptacionCompromisos();

	$(':radio').on('change', function(){
		comprobarAceptacionCompromisos();
	});

	function comprobarAceptacionCompromisos(){
		if($('#input_aceptacion_compromisos_aceleradora_si').is(":checked") && $('#input_aceptacion_cesion_imagenes_si').is(":checked") && $('#input_aceptacion_lopd_si').is(":checked") )
			$('.boton_guardar_datos input.btn.btn-success').prop('disabled', false);
		else
			$('.boton_guardar_datos input.btn.btn-success').prop('disabled', true);
	}


// Fin pagina perfil usuario




// cerrar document ready

});


/*jQuery(document).ready( */
/* Detección de explorer (Stylemedia) */
if(!!window.StyleMedia) $(function(){
	var imagenes=$('div.portfolio a img');
	$(window).on('load',function(){
		for(i=0; i<imagenes.length; i++){
			imagen=imagenes[i];
			calculado = parseInt(imagen.width * ( imagen.naturalHeight / imagen.naturalWidth));
			imagen.setAttribute('style','height:'+calculado+'px');
		}
	});
});



