var scene;
var camera;
var renderer;

var sky;
var ambientLight;
var directionalLight;

var zombies = [];
var balas = [];
var posXJugador = 1;
var posYJugador = 0;
var posZJugador = 15;
var fired = false;
var vida = 100;
var id = 0;
var score = 0;
var jugador;
var zombie;
var bala;

$(document).ready(function() {

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


	loadOBJWithMTL("assets/models/zombie", "zombie.obj", "jetski.mtl", (object) => {
		object.position.z = -10;
		object.rotation.x = THREE.Math.degToRad(-90);

		objects.push(object);

		scene.add(object);
	});

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


	loadObjBases("assets/models/zombie/zombie.obj","assets/textures/grass.jpg","zombie");
	loadObjBases("assets/models/zombie/zombie.obj","assets/textures/grass.jpg","bala");

	addModel("assets/models/soldier/soldier.obj","assets/textures/grass.jpg","jugador");
	scene.add(ambientLight);
	scene.add(directionalLight);

	//agregamos el canvas
	$("#scene-section").append(renderer.domElement);		
	
	render();
	
	setInterval(spawnZombie, 2000);
	
	$('body').mousedown(function(event) {
	switch (event.which) {
    case 1:
        //alert('Left Mouse button pressed.');
		spawnBullet();
        break;
    case 3:
        //alert('Right Mouse button pressed.');
        break;
}
});
	
});

function spawnBullet() {
	addModelByBase("bala");
}

function spawnZombie() {	
	addModelByBase("zombie");
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
		zombieSpawned.position.z = -5;
		id++;
		zombieSpawned.name = id;
		zombies.push(zombieSpawned);		
		scene.add(zombieSpawned);
	}

	if(name == "bala") {
		var balaSpawned = bala.clone();		
		balaSpawned.position.x = posXJugador;
		balaSpawned.position.y = posYJugador;
		balaSpawned.position.z = posZJugador;
		id++;
		balaSpawned.name = id;
		balas.push(balaSpawned);		
		scene.add(balaSpawned);
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
			object.scale.set(0.01,0.01,0.01);
			zombie = object.clone();	
		}

		if(name == "bala"){
			object.scale.set(0.01,0.01,0.01);
			bala = object.clone();
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
}

function render() {
	requestAnimationFrame(render);
	
	
	
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

	zombies = zombies.filter(function( element ) {
	   return element !== undefined;
	});
	
	balas = balas.filter(function( element ) {
	   return element !== undefined;
	});
	
	// Movimiento de zombies
	for (var i = 0; i < zombies.length; i++){
		if(zombies[i].position.z < posZJugador - 1){
			zombies[i].position.z += 0.1;
		}
		
		if(zombies[i].position.z + 1 >= posZJugador){
			var vidaSize = $(".vida").css("width");
			vidaSize = vidaSize.replace(/\D/g,'');
			$(".vida").css("width", vidaSize - 1);
		}		
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

	renderer.render(scene, camera);
}

function removeEntity(object) {
	var selectedObject = scene.getObjectByName(object.name);
	scene.remove( selectedObject );
	animate();
}	

