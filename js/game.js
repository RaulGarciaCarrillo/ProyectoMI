var scene;
var camera;
var renderer;

// Ambiente
var sky;
var ambientLight;
var directionalLight;

// Objetos 
var zombies = [];
var humanos = [];
var jefesZombie = []; 
var vidaJefe = [];
var balas = [];
var bombas = [];
var objects = [];

// Jugador
var posXJugador = 1;
var posYJugador = 0;
var posZJugador = 15;
var fired = false;
var vida = 100;
var id = 0;
var score = 0;
var auxScore = 0;
var jugador;
var recargando = false;
var lanzandoTNT = false;
var numBalas = 20;
var cantidadBombas = 3;
var gameover = false;
var pausa = false;
var anguloBomba = 20;

// Bases objetos
var zombie;
var bala;
var jefeZombie;
var humano;
var bomba;

// Modales
var dialog, dialog2, form;

// Stats
var stats;
var clock;

// Configuracion particulas
var movementSpeed = 1;
var totalObjects = 800;
var objectSize = 0.04;
var sizeRandomness = 1;
var colors = [0x660000];
var dirs = [];
var parts = [];

var spotLight;

$(document).ready(function() {

	clock = new THREE.Clock();
	stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );

	var audio = new Audio('audio/ambiente.mp3');
	audio.play();

	$(".numBombas").empty();
	$(".numBombas").append("x " + cantidadBombas);

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '1850974661823696',
			xfbml      : true,
			version    : 'v2.8'
		});
	};

	// Inicializacion de plugin Facebook
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.8";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// Configuracion modales
	$(function () {
		dialog = $( "#dialog-form" ).dialog({
		      autoOpen: false,
		      height: 400,
		      width: 350,
		      modal: true,
		      buttons: {
		        COMPARTIR: function() {
		          var name = $("#name").val();
		          localStorage.usuario = name;
		          $.ajax({
	      				type: "POST",
						url: "http://deadhunting.x10.mx/InsertScore.php?nombre="+name+"&score="+score
	    			}).done(function(data) {
	      				console.log(data);
	    			});
	    			dialog.dialog( "close" );
	    			FB.ui({
			        method: 'share',
			        picture:'http://miadventure.x10.mx/portadaMI2.png',
			        href:'http://miadventure.x10.mx/',
			        caption: 'Dead Hunting',
			        quote: "My Score: " + score,
			        hashtag: "#MiAdventure"
			      }, function(response){});
			      dialog.dialog( "close" );		
		        },
		        CONTINUAR: function() {
		          var name = $("#name").val();
		          localStorage.usuario = name;
		          $.ajax({
	      				type: "POST",
						url: "http://deadhunting.x10.mx/InsertScore.php?nombre="+name+"&score="+score
	    			}).done(function(data) {
	      				console.log(data);
	    			});
	    			dialog.dialog( "close" );
		        }
		      },
		      close: function() {
		      }
		});

		dialog2 = $( "#dialog-form2" ).dialog({
			autoOpen: false,
			height: 400,
			width: 350,
			modal: true,
			buttons: {
			COMPARTIR: function() {
			  var name = $("#name").val();
			  localStorage.usuario = name;
			  $.ajax({
						type: "POST",
					url: "http://deadhunting.x10.mx/InsertScore.php?nombre="+name+"&score="+score
				}).done(function(data) {
						console.log(data);
				});
				dialog.dialog( "close" );
				FB.ui({
			    method: 'share',
			    picture:'http://miadventure.x10.mx/portadaMI2.png',
			    href:'http://miadventure.x10.mx/',
			    caption: 'Dead Hunting',
			    quote: "My Score: " + score,
			    hashtag: "#MiAdventure"
			  }, function(response){});
			  dialog2.dialog( "close" );		
			},
			CONTINUAR: function() {
			  var name = $("#name").val();
			  localStorage.usuario = name;
			  $.ajax({
						type: "POST",
					url: "http://deadhunting.x10.mx/InsertScore.php?nombre="+name+"&score="+score
				}).done(function(data) {
						console.log(data);
				});
				dialog2.dialog( "close" );
			}
			},
			close: function() {
			}
		});
	});
 
	var visibleSize = {
		width: window.innerWidth,
		height: window.innerHeight
	};
	scene = new THREE.Scene();
	

	spotLight = new THREE.SpotLight( 0xffffff, 1 );
	var lightHelper;
	spotLight.position.set( 0, 5, 0 );
	spotLight.castShadow = true;
	spotLight.angle = 0.4;
	spotLight.penumbra = 1;
	spotLight.decay = 2;
	spotLight.distance = 2000;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 200;
	spotLight.intensity = 1;

	lightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( spotLight );



	// Camara
	camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 100000);
	camera.position.z = 17;
	camera.position.y = 3;
	camera.rotation.x = de2ra(-35);

	// Renderer
	renderer = new THREE.WebGLRenderer({ precision: "mediump" });
	renderer.setClearColor(new THREE.Color(0,0,0));
	renderer.setSize(visibleSize.width, visibleSize.height);
	renderer.setPixelRatio(visibleSize.width / visibleSize.height);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowCameraNear = 3;
	renderer.shadowCameraFar = camera.far;
	renderer.shadowCameraFov = 50;
	renderer.shadowMapBias = 0.0039;
	renderer.shadowMapDarkness =1;
	renderer.shadowMapWidth = 1024;
	renderer.shadowMapHeight = 1024;	

	// Luces
	initLights();		
	
	// Skydome
	var skyGeo = new THREE.SphereGeometry(100, 25, 25); 
	var texture = THREE.ImageUtils.loadTexture( "assets/textures/skydome.jpg" );
	var material2 = new THREE.MeshPhongMaterial({ 
		map: texture
	});
	sky = new THREE.Mesh(skyGeo, material2);
	sky.material.side = THREE.BackSide;
	scene.add(sky);
	
	// Piso		
	var geometry = new THREE.PlaneGeometry( 500, 500, 1, 1);
	var grassTexture = THREE.ImageUtils.loadTexture( "assets/textures/grass.jpg" );
	grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 
	grassTexture.repeat.set( 100, 100 );
	var grassMaterial = new THREE.MeshPhongMaterial({ 
		map: grassTexture,
		side: THREE.DoubleSide
	});

	var plane = new THREE.Mesh( geometry, grassMaterial);
	plane.rotation.x = de2ra(90);
	plane.receiveShadow = true;
	scene.add( plane );
	
	// Objetos
	var material = new THREE.MeshLambertMaterial ({
		color: new THREE.Color(0.4, 0, 0)
	});

	///// USEN ESTO PARA CARGAR UN NUEVO MODELO

	/*loadOBJWithMTL("assets/models/zombie/", "jetski.obj", "jetski.mtl", (object) => {
		object.position.z = 5;
		//object.scale.set(0.01,0.01,0.01);

		objects.push(object);

		scene.add(object);
	});*/
	/////////////////////////

	function loadOBJWithMTL(path, objFile, mtlFile, onLoadCallback) {
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath(path);
		mtlLoader.load(mtlFile, (materials) => {
			
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath(path);
			objLoader.load(objFile, (object) => {
				onLoadCallback(object);
			});
			
		});
	}

	loadObjBases("assets/models/zombie/zombie.obj","assets/models/zombie/draugr.jpg","zombie");
	loadObjBases("assets/models/Monster/Monster.obj","assets/models/Monster/Monster.jpg","jefeZombie");
	loadObjBases("assets/models/Human/Human.obj","assets/models/Human/Human.jpg","humano");
	loadObjBases("assets/models/bullet/bullet.obj","assets/models/bullet/bullet.png","bala");
	loadObjBases("assets/models/Bomb/Bomb.obj","assets/models/Bomb/Bomb.png","bomba");
	addModel("assets/models/soldier/soldier.obj","assets/models/soldier/SWATGuy_Bottom_Diffuse.png","jugador");
	addModel("assets/models/escenario/escenario.obj","assets/models/escenario/escenario.png","escenario");
	scene.add(ambientLight);
	scene.add(directionalLight);

	// Agregamos el canvas
	$("#scene-section").append(renderer.domElement);	

	render();	

 	$("body").on("keypress", function (e) { 		
 		if(!gameover){
 			//Tecla "b"
	    	if (e.keyCode==98){
	    		if (cantidadBombas > 0 && lanzandoTNT == false){    			
	    			lanzandoTNT = true;
	    			spawnBomba();    			
	    			anguloBomba = 20;
	    			cantidadBombas -= 1;
	    			$(".numBombas").empty();
					$(".numBombas").append("x " + cantidadBombas);
	    		}
	    	}
	    	//Tecla "p"
	    	if (e.keyCode==112){
				gameover = true;
				$(".juego").css("display","none");
				$(".pausa").css("display","block");

			}
			//Tecla "q"
			if (e.keyCode==113){
				$(".juego").css("display","flex");
				$(".pausa").css("display","none");
				gameover = false;
			}
		}
	});

	setTimeout(spawnZombie, 2500);
	setTimeout(spawnJefeZombie, 10000);
	setTimeout(spawnHumano, 12000);


	// Evento de clic disparo
	$('body').mousedown(function(event) {
		if(!gameover){
			switch (event.which) {
		    case 1:
		        //alert('Left Mouse button pressed.');
				spawnBullet();
		        break;
		    case 3:
		        //alert('Right Mouse button pressed.');
		        break;
			}
		}
	});
	
}); // Fin del document ready

function spawnBullet() {
	if(numBalas > 0){
		addModelByBase("bala");
		numBalas--;
		var audio = new Audio('audio/9mm.mp3');
		audio.play();
		jugador.position.z += 0.1;
	} else {
		if(!recargando){
			recargar();
		}
	}
}

function recargar(){
	recargando = true;
	var audio = new Audio('audio/reload.mp3');
	audio.play();	
	setTimeout(function(){ 
		numBalas = 20; 		
		recargando = false;
	}, 1500);
}


function spawnBomba() {
	if(!gameover){
		addModelByBase("bomba");
	}
}

function spawnZombie() {	
	if(!gameover){
		addModelByBase("zombie");
		setTimeout(spawnZombie, 2000);
	}
}

function spawnJefeZombie() {
	if(!gameover){
		addModelByBase("jefeZombie");
		setTimeout(spawnJefeZombie, 10000);
	}
}

function spawnHumano() {	
	if(!gameover){
		addModelByBase("humano");
		setTimeout(spawnHumano, 7000);
	}
}

// Convertierte de grados a radianes
function de2ra(degree) { 
	return degree*(Math.PI/180); 
}

function addModel(objPath, texturePath, name){
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		//console.log( item, loaded, total );
	};

	var texture = new THREE.Texture();
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			//console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	var loader = new THREE.ImageLoader( manager );
	loader.load( texturePath, function ( image ) {
		texture.image = image;
		texture.needsUpdate = true;
	});

	var loader = new THREE.OBJLoader( manager );
	loader.load( objPath, function ( object ) {

		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = texture;
			}
		});	

		
		object.name = name;		
			object.scale.set(0.2,0.2,0.2);
			object.position.z = posZJugador;
			object.position.x = -2.5;
			object.position.y = -0.05;

		if(name == "jugador") {
			object.scale.set(0.01,0.01,0.01);
			object.rotation.y = de2ra(180);
			object.position.x = posXJugador;
			object.position.y = posYJugador;
			object.position.z = posZJugador;
			jugador = object.clone();
			scene.add(jugador);
			return;
		}

		scene.add(object);	
		
	}, onProgress, onError );
}

function addModelByBase(name) {
	if(name == "zombie") {
		var zombieSpawned = zombie.clone();
		var xPosSpawn = Math.floor(Math.random()*3) + 1; // this will get a number between 1 and 99;		
		xPosSpawn *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases		
		zombieSpawned.position.x = xPosSpawn;
		zombieSpawned.position.y = 0;
		zombieSpawned.position.z = -5;
		id++;
		zombieSpawned.name = id;
		zombies.push(zombieSpawned);		
		scene.add(zombieSpawned);
	}

	if(name == "bala") {
		var balaSpawned = bala.clone();		
		balaSpawned.position.x = posXJugador;
		balaSpawned.position.y = posYJugador+1;
		balaSpawned.position.z = posZJugador;
		id++;
		balaSpawned.name = id;
		balas.push(balaSpawned);		
		scene.add(balaSpawned);
	}

	if(name == "bomba") {
		var bombaSpawned = bomba.clone();		
		bombaSpawned.position.x = posXJugador;
		bombaSpawned.position.y = posYJugador;
		bombaSpawned.position.z = posZJugador;
		id++;
		bombaSpawned.name = id;
		bombas.push(bombaSpawned);		
		scene.add(bombaSpawned);
	}

	if (name == "jefeZombie"){

		var jefeZombieSpawned = jefeZombie.clone();
		var xPosSpawn = Math.floor(Math.random()*3) + 1; // this will get a number between 1 and 99;		
		xPosSpawn *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases	
		jefeZombieSpawned.position.x = xPosSpawn;
		jefeZombieSpawned.position.y = 0;
		jefeZombieSpawned.position.z = -5;
		id++;
		jefeZombieSpawned.name = id;
		vidaJefe.push(3);
		jefesZombie.push(jefeZombieSpawned);		
		scene.add(jefeZombieSpawned);
		var audio = new Audio('audio/jefeSpawn.mp3');
		audio.play();
	}

	if (name == "humano"){
		var humanoSpawned = humano.clone();
		var xPosSpawn = Math.floor(Math.random()*3) + 1; // this will get a number between 1 and 99;		
		xPosSpawn *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases	
		humanoSpawned.position.x = xPosSpawn;
		humanoSpawned.position.y = 0;
		humanoSpawned.position.z = -5;
		id++;
		humanoSpawned.name = id;
		humanos.push(humanoSpawned);		
		scene.add(humanoSpawned);
		var audio = new Audio('audio/help.mp3');
		audio.play();

	}
}

function loadObjBases(objPath, texturePath, name) {
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		//console.log( item, loaded, total );
	};

	var texture = new THREE.Texture();
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			//console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	var loader = new THREE.ImageLoader( manager );
	loader.load( texturePath, function ( image ) {
		texture.image = image;
		texture.needsUpdate = true;
	} );

	var loader = new THREE.OBJLoader( manager );
	loader.load( objPath, function ( object ) {

		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = texture;
			}
		});

		if(name == "zombie"){
			object.scale.set(0.012,0.012,0.012);
			zombie = object.clone();	
		}

		if(name == "bala"){
			object.scale.set(0.01,0.01,0.01);
			bala = object.clone();
		}

		if(name == "bomba"){
			object.scale.set(0.6,0.6, 0.6);
			bomba = object.clone();
		}

		if(name == "jefeZombie"){
			object.scale.set(0.003,0.003,0.003);
			jefeZombie = object.clone();
		}

		if(name == "humano"){
			humano = object.clone();
		}
		
	}, onProgress, onError );
}

function initLights(){
	ambientLight = new THREE.AmbientLight(
		new THREE.Color(1, 1, 1),
		1.0
	);
	
	directionalLight = new THREE.DirectionalLight(
		new THREE.Color(1, 1, 1),
		0.4
	);

	var d = 15;
    directionalLight.castShadow = true;
    directionalLight.shadowCameraVisible = true;
    directionalLight.position.set(10, 10, -10);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.shadowCameraNear = 2;
	directionalLight.shadowCameraFar = 5;
	directionalLight.shadowCameraLeft = -d;
	directionalLight.shadowCameraRight = d;
	directionalLight.shadowCameraTop = d;
	directionalLight.shadowCameraBottom = -d;
    directionalLight.shadowCameraFar = 1000;
    directionalLight.shadowDarkness = 0.5;		
}

function limpiarArreglos() {
	zombies = zombies.filter(function( element ) {
	   return element !== undefined;
	});
	
	balas = balas.filter(function( element ) {
	   return element !== undefined;
	});

	bombas = bombas.filter(function( element ) {
	   return element !== undefined;
	});

	jefesZombie = jefesZombie.filter(function( element ) {
	   return element !== undefined;
	});

	vidaJefe = vidaJefe.filter(function( element ) {
	   return element !== undefined;
	});

	humanos = humanos.filter(function( element ) {
	   return element !== undefined;
	});
}

function resume() {
	$(".juego").css("display","flex");
	$(".pausa").css("display","none");
	gameover = false;			
}

// Generar explosion
function ExplodeAnimation(x,y,z) {
	var geometry = new THREE.Geometry();

	for (i = 0; i < totalObjects; i ++) { 
		var vertex = new THREE.Vector3();
		vertex.x = x;
		vertex.y = y;
		vertex.z = z;

		geometry.vertices.push( vertex );
		dirs.push({
			x:(Math.random() * movementSpeed)-(movementSpeed/2),
			y:(Math.random() * movementSpeed)-(movementSpeed/2),
			z:(Math.random() * movementSpeed)-(movementSpeed/2)
			});
		}

		var material = new THREE.ParticleBasicMaterial({ 
			size: objectSize,  
			color: colors[0] 
		});

		var particles = new THREE.ParticleSystem( geometry, material );

		this.object = particles;
		this.status = true;  
		this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
		this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
		this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);

		scene.add( this.object  ); 

		this.update = function(){
		if (this.status == true){
			var pCount = totalObjects;
			while(pCount--) {
				var particle =  this.object.geometry.vertices[pCount]
				particle.y += dirs[pCount].y;
				particle.x += dirs[pCount].x;
				particle.z += dirs[pCount].z;
			}
			this.object.geometry.verticesNeedUpdate = true;
		}
	}  
}