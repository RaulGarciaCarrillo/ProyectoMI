function render() {
	var delta = clock.getDelta();

	// Calculo de FPS
	stats.begin();
	requestAnimationFrame(render);

	// Actualizacion del numero de balas
	$(".numBalas").empty();
	$(".numBalas").html("x " + numBalas + "/ <span>∞<span>");

	if(!gameover) {	

		spotLight.intensity = Math.random();

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
					// Animacion del score
					$(".numScore").text(score);
					$( ".numScore" ).animate({
					    fontSize: 40
					}, 25, function() {
						$( ".numScore" ).animate({
							fontSize: 30
						}, 25, function() {
							// Animacion completada
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

						// Animacion del score
						$(".numScore").text(score);
						$( ".numScore" ).animate({
						    fontSize: 40
						}, 25, function() {
							$( ".numScore" ).animate({
								fontSize: 30
							}, 25, function() {
								// Animacion completada
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
				if(vida > 500){
					vida = 500;
				}
				$(".vida").css("width", vida);
				scene.remove(scene.getObjectByName(humanos[i].name));
				delete humanos[i];
				limpiarArreglos();
			}
		}

		// Deteccion de vida (evento game over)
		if((vidaSize - 1) <= 0) {
			$("#scoreModal").append("Score: " + score);
			if(localStorage.usuario === undefined || localStorage.usuario == ""){
				dialog2.dialog( "open" );
			} else{
				$("#playerName").append(localStorage.usuario);
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
				bombas[i].position.z = posZJugador - 5 + Math.cos(de2ra(anguloBomba))*5;
				bombas[i].position.y = Math.sin(de2ra(anguloBomba))*5;
				bombas[i].rotation.x += 0.1;
			}		
		}		

		// Animacion de skydome
		sky.rotation.y += 0.0005;

		document.addEventListener('keydown',onDocumentKeyDown,false);

		// Listener mouse clic
		function onDocumentKeyDown(event){
			if(!fired) {
				fired = true;
				event = event || window.event;
				var keycode = event.keyCode;
				switch(keycode){
					case 37 : // Flecha izquierda
						jugador.position.x -= 1;
						posXJugador = jugador.position.x;
					break;
					case 39 : // Flecha derecha
						jugador.position.x += 1;
						posXJugador = jugador.position.x;
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
	  	
	  	// Animacion de particulas
	    var pCount = parts.length;
	    while(pCount--) {
	    	parts[pCount].update();
	    }

	    // Animacion de disparo
		if(jugador !== undefined){
			jugador.position.z = 15;
		}

	} // Fin de if (gameover)

	renderer.render(scene, camera);
	stats.end();
} // Fin de funcion render