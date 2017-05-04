var scene;
var camera;
var renderer;

var sky;
var ambientLight;
var directionalLight;

var zombies = [];
var humanos = [];
var jefesZombie = []; 
var vidaJefe = [];
var balas = [];
var bombas = [];
var posXJugador = 1;
var posYJugador = 0;
var posZJugador = 15;
var fired = false;
var vida = 100;
var id = 0;
var score = 0;
var auxScore = 0;
var jugador
var zombie;
var bala;
var jefeZombie;
var humano;
var bomba;
var cantidadBombas = 3;
var objects = [];
var gameover = false;
var pausa = false;
var anguloBomba = 20;
var dialog, dialog2, form;
var numBalas = 20;
var recargando = false;
var lanzandoTNT = false;


//////////////settings/////////
var movementSpeed = 1;
var totalObjects = 800;
var objectSize = 0.04;
var sizeRandomness = 1;
var colors = [0x660000];
/////////////////////////////////
var dirs = [];
var parts = [];

function resume() {
	$(".juego").css("display","flex");
	$(".pausa").css("display","none");
	gameover = false;			
}

function ExplodeAnimation(x,y,z)
{
  var geometry = new THREE.Geometry();
  
  for (i = 0; i < totalObjects; i ++) 
  { 
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

$(document).ready(function() {

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

	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.8";
		fjs.parentNode.insertBefore(js, fjs);
	}
	(document, 'script', 'facebook-jssdk')

	);


	$("#scoreModal").append("Score: " + score);

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
	
	// Camara
	camera = new THREE.PerspectiveCamera(75, visibleSize.width / visibleSize.height, 0.1, 100000);
	camera.position.z = 17;
	camera.position.y = 5;
	camera.rotation.x = de2ra(-35);


	renderer = new THREE.WebGLRenderer({ 
		precision: "mediump" 
	});

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
	var grassMaterial = new THREE.MeshLambertMaterial({ 
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
	scene.add(ambientLight);
	scene.add(directionalLight);

	//agregamos el canvas
	$("#scene-section").append(renderer.domElement);	

	render();	

 	$("body").on("keypress", function (e) {
 		//$(".numScore").text(e.keyCode);
 		//Tecla "b"
 		if(!gameover){
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
	    		//window.location="pause.html";
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
	
});

//Spawn Models
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
	if(!gameover)
	addModelByBase("bomba");
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

function de2ra(degree)   { 
	return degree*(Math.PI/180); 
}

function addModel(objPath, texturePath, name){
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	var texture = new THREE.Texture();
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	var loader = new THREE.ImageLoader( manager );
	loader.load( texturePath, function ( image ) {

		texture.image = image;
		texture.needsUpdate = true;

	} );

	// model

	var loader = new THREE.OBJLoader( manager );
	loader.load( objPath, function ( object ) {

		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = texture;
			}
		});	

		object.scale.set(0.01,0.01,0.01);
		object.name = name;		

		if(name == "jugador") {
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
		console.log( item, loaded, total );
	};

	var texture = new THREE.Texture();
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
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
			//object.scale.set(0.018,0.018,0.018);
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

function render() {

	requestAnimationFrame(render);

	$(".numBalas").empty();
	$(".numBalas").html("x " + numBalas + "/ <span>∞<span>");

	if(!gameover) {
		

		//Aumento de número de bombas
		if (auxScore>=150){
			cantidadBombas+=1;
			auxScore=0;
			$(".numBombas").empty();
			$(".numBombas").append("x " + cantidadBombas);
		}
		
		// Deteccion de colision bala-zombie
		for (var i = 0; i < zombies.length; i++){
			for (var j = 0; j < balas.length; j++){
				if(zombies[i].position.x == balas[j].position.x && zombies[i].position.z >= balas[j].position.z){
					scene.remove(scene.getObjectByName(zombies[i].name));
					scene.remove(scene.getObjectByName(balas[j].name));
					delete zombies[i];
					delete balas[j];
					limpiarArreglos();
					score+=10;
					auxScore+=10;

					var audio = new Audio('audio/impacto.mp3');
					audio.play();

					$(".numScore").text(score);
					$( ".numScore" ).animate({
					    fontSize: 40
					  }, 25, function() {
						    $( ".numScore" ).animate({
						    fontSize: 30
						  }, 25, function() {
						    // Animation complete.
						  });
					  });
				}	
			}	
		}

		// Deteccion de colision bala-jefeZombie
		for (var i = 0; i < jefesZombie.length; i++){
			for (var j = 0; j < balas.length; j++){
				if(jefesZombie[i].position.x == balas[j].position.x && jefesZombie[i].position.z >= balas[j].position.z){
					 vidaJefe[i] -=1;
					if (vidaJefe[i]==0){
						scene.remove(scene.getObjectByName(jefesZombie[i].name));
						scene.remove(scene.getObjectByName(balas[j].name));
						delete jefesZombie[i];
						delete balas[j];
						delete vidaJefe[j];
						limpiarArreglos();

						var audio = new Audio('audio/impacto.mp3');
						audio.play();

						score+=30;
						auxScore+=30;
						$(".numScore").text(score);
						$( ".numScore" ).animate({
						    fontSize: 40
						  }, 25, function() {
							    $( ".numScore" ).animate({
							    fontSize: 30
							  }, 25, function() {
							    // Animation complete.
							  });
						  });
					} else {
						scene.remove(scene.getObjectByName(balas[j].name));
						delete balas[j];
						limpiarArreglos();
					}
				}	
			}	
		}

		// Deteccion de colision bala-humano
		for (var i = 0; i < humanos.length; i++){
			for (var j = 0; j < balas.length; j++){
				if(humanos[i].position.x == balas[j].position.x && humanos[i].position.z >= balas[j].position.z){
					scene.remove(scene.getObjectByName(humanos[i].name));
					scene.remove(scene.getObjectByName(balas[j].name));
					delete humanos[i];
					delete balas[j];

					var audio = new Audio('audio/humano.mp3');
					audio.play();

					limpiarArreglos();
					var vidaSize = $(".vida").css("width");
					vidaSize = vidaSize.replace('px','');
					$(".vida").css("width", vidaSize - 25);
				}	
			}	
		}

		// Deteccion de colision bomba-zombie
		for (var i = 0; i < zombies.length; i++){
			for (var j = 0; j < bombas.length; j++){
				
				var distancia = Math.sqrt(Math.pow((bombas[j].position.x - zombies[i].position.x), 2) + Math.pow((bombas[j].position.y - zombies[i].position.y), 2) + Math.pow((bombas[j].position.z - zombies[i].position.z), 2)); 

				if(bombas[j].position.y <= 1 
					&& distancia <= 6
					&& anguloBomba > 160){
					scene.remove(scene.getObjectByName(zombies[i].name));
					scene.remove(scene.getObjectByName(bombas[j].name));


					var audio = new Audio('audio/impacto.mp3');
					audio.play();

					delete zombies[i];
					limpiarArreglos();
				}	
			}	
			delete bombas[j];
			limpiarArreglos();
		}	

		// Deteccion de colision bomba-jefeZombie
		for (var i = 0; i < jefesZombie.length; i++){
			for (var j = 0; j < bombas.length; j++){
					
				var distancia = Math.sqrt(Math.pow((bombas[j].position.x - jefesZombie[i].position.x), 2) + Math.pow((bombas[j].position.y - jefesZombie[i].position.y), 2) + Math.pow((bombas[j].position.z - jefesZombie[i].position.z), 2)); 

				if(bombas[j].position.y <= 1 
					&& distancia <= 6
					 && anguloBomba > 160){
					scene.remove(scene.getObjectByName(jefesZombie[i].name));
					scene.remove(scene.getObjectByName(bombas[j].name));
					delete jefesZombie[i];
					delete vidaJefe[j];

					var audio = new Audio('audio/impacto.mp3');
					audio.play();

					limpiarArreglos();
				}	
			}
			delete bombas[j];	
			limpiarArreglos();
		}

		// Movimiento de zombies
		for (var i = 0; i < zombies.length; i++){
			if(zombies[i].position.z < posZJugador - 1){
				zombies[i].position.z += 0.1;
			}
			
			if(zombies[i].position.z + 1 >= posZJugador){
				var vidaSize = $(".vida").css("width");
				vidaSize = vidaSize.replace('px','');
				vidaSize = Number(vidaSize) -1;
				$(".vida").css("width", vidaSize);			
			}
		}

		// Movimiento de jefesZombie
		for (var i = 0; i < jefesZombie.length; i++){
			if(jefesZombie[i].position.z < posZJugador - 1){
				jefesZombie[i].position.z += 0.05;
			}
			
			if(jefesZombie[i].position.z + 1 >= posZJugador){
				var vidaSize = $(".vida").css("width");
				vidaSize = vidaSize.replace('px','');
				$(".vida").css("width", vidaSize - 2);
			}
		}	

		// Movimiento de humanos
		for (var i = 0; i < humanos.length; i++){
			if(humanos[i].position.z < posZJugador - 1){
				humanos[i].position.z += 0.05;
			}
			
			if(humanos[i].position.z + 1 >= posZJugador){
				var vidaSize = $(".vida").css("width");
				vidaSize = vidaSize.replace('px','');
				var vida = Number(vidaSize) + 20;
				$(".vida").css("width", vida);
				scene.remove(scene.getObjectByName(humanos[i].name));
				delete humanos[i];
				limpiarArreglos();
			}
		}

		// Deteccion de vida
		if((vidaSize - 1) <= 0) {
			if(localStorage.usuario === undefined || localStorage.usuario == ""){
				dialog2.dialog( "open" );
			} else{
				dialog.dialog( "open" );
			}
			gameover = true;		
		}

		// Impulso de la bala
		for (var i = 0; i < balas.length; i++){
			if(balas[i].position.z < -5){
				scene.remove(scene.getObjectByName(balas[i].name));
				delete balas[i];
				limpiarArreglos();
			}else{
				balas[i].position.z -= 2;
			}		
		}	

		// Impulso de la bomba
		for (var i = 0; i < bombas.length; i++){
			if(bombas[i].position.y < 0){
				scene.remove(scene.getObjectByName(bombas[i].name));
				var audio = new Audio('audio/LAW.mp3');
				lanzandoTNT = false;
				audio.play();
				parts.push(new ExplodeAnimation(bombas[i].position.x, bombas[i].position.y, bombas[i].position.z));
				delete bombas[i];
				limpiarArreglos();
			}else{

				anguloBomba+=3;
				console.log(anguloBomba);
				bombas[i].position.z = posZJugador - 5 + Math.cos(de2ra(anguloBomba))*5;
				bombas[i].position.y = Math.sin(de2ra(anguloBomba))*5;
				bombas[i].rotation.x += 0.1;
			}		
		}		

		sky.rotation.y += 0.0005;

		document.addEventListener('keydown',onDocumentKeyDown,false);

		function onDocumentKeyDown(event){
			if(!fired) {
				fired = true;
				var delta = 0.005;
				event = event || window.event;
				var keycode = event.keyCode;
				switch(keycode){
					case 37 : //left arrow
						jugador.position.x -= 1;
						posXJugador = jugador.position.x;
						//camera.position.x = camera.position.x - delta;
					break;
					case 39 : // right arrow
						jugador.position.x += 1;
						posXJugador = jugador.position.x;

						//camera.position.x = camera.position.x + delta;
					break;
				}		
			
				if(posXJugador > 3){
					posXJugador = 3;
					jugador.position.x = 3;

				}
				
				if(posXJugador < -3){
					posXJugador = -3;
					jugador.position.x = -3;
				}
				
				document.addEventListener('keyup',onDocumentKeyUp,false);
			}
		}

		function onDocumentKeyUp(event){
			document.removeEventListener('keydown',onDocumentKeyDown,false);
			fired = false;
		}
	  
	    var pCount = parts.length;
	    while(pCount--) {
	    	parts[pCount].update();
	    }

		if(jugador !== undefined){
			jugador.position.z = 15;
		}

	}

	renderer.render(scene, camera);
}

function removeEntity(object) {
	var selectedObject = scene.getObjectByName(object.name);
	scene.remove( selectedObject );
	animate();
}	







 
