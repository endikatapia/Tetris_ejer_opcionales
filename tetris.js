// ************************************
// *     EJERCICIO 1                   *
// ************************************

// ============== Point =======================

function Point (x, y) {
	this.x = x;
	this.y = y;
}

// ============== Rectangle ====================
function Rectangle() {}

//recibe los 2 puntos del bloque como parametro
Rectangle.prototype.init = function(p1,p2) {
	this.px = p1.x;
	this.py = p1.y;
	this.width = p2.x - p1.x;
	this.height = p2.y - p1.y;
	this.lineWidth= 1;
	this.color = 'black';
}

Rectangle.prototype.draw = function() {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que
	// en este ejemplo la variable ctx es global y que guarda el contexto (context)
	// para pintar en el canvas.

	//comenzar camino
	ctx.beginPath();

	//nos movemos al punto P1(esquina superior derecha), donde se empieza a pintar el rectangulo
	ctx.moveTo(this.px,this.py);

	//nos colocamos en el punto P1(p1.x,p1.y) y dibujamos un rectangulo con la anchura this.width y
	//la altura this.heigth.
	ctx.lineTo(this.px+this.width,this.py);
	ctx.lineTo(this.px+this.width,this.py+this.height);
	ctx.lineTo(this.px,this.py+this.height);

	//cerrar camino
	ctx.closePath();

	//la anchura de la linea=this.lineWidth
	ctx.lineWidth = this.lineWidth;

	//rellenar el rectangulo del color this.color
	ctx.fillStyle = this.color;
	ctx.fill();

	//para que al mover la pieza se mantenga el contorno
	ctx.strokeStyle = 'black';

	//finalizamos con stroke haciendo el contorno del rectangulo
	ctx.stroke();


}



// Pintar un bloque en 'canvas_sigpieza' --> OPCIONAL 2
Rectangle.prototype.draw_next = function() {
	ctx_sigpieza.beginPath();
	ctx_sigpieza.moveTo(this.px,this.py);
	ctx_sigpieza.lineTo(this.px+this.width,this.py);
	ctx_sigpieza.lineTo(this.px+this.width,this.py+this.height);
	ctx_sigpieza.lineTo(this.px,this.py+this.height);
	ctx_sigpieza.closePath();
	ctx_sigpieza.lineWidth = this.lineWidth;
	ctx_sigpieza.fillStyle = this.color;
	ctx_sigpieza.fill();
	ctx_sigpieza.strokeStyle = 'black';
	ctx_sigpieza.stroke();
}



Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

//** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.move = function(x,y){
	this.px += x;
	this.py += y;
	this.draw();
}

//** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.erase = function(){
	ctx.beginPath();
	ctx.lineWidth = this.lineWidth+2;
	ctx.strokeStyle = Tetris.BOARD_COLOR;
	ctx.rect(this.px, this.py, this.width, this.height);
	ctx.stroke();
	ctx.fillStyle = Tetris.BOARD_COLOR;
	ctx.fill()

}


// ============== Block ===============================

function Block (pos, color) {


	// TU CÓDIGO AQUÍ: este es el constructor de la clase Block. Recibe dos parámetros, pos y color.
	// Pos = posición de la celda, por ejemplo, (9,19).
	// color = color que hay que emplear para pintar el bloque.
	// Internamente este método crea dos puntos (empleando las coordenadas del pixel)
	// y llama al método init de la clase Rectangle, pasándole como parámetro,
	// estos dos puntos.
	// Sería interesante que emplearas las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH,
	// para establecer la anchura del bloque y la anchura de la línea.

	//coordenadas (x,y) de la celda. Por ejemplo (1,1)
	this.x = pos.x;
	this.y = pos.y;

	//Se crean internamente 2 puntos empleando las coordenadas del pixel
	//Imaginemos que tenemos la coordenadas pos.x=1, pos.y=1.
	//ese punto1 se convertira en (1*30,1*30)=(30,30) y el rectangulo se empezara a pintar en ese punto.
	//para completar el bloque cuadrado necesitamos que acabe en (60,60). Para ello le sumamos 30 pixeles
	//tanto en altura como en anchura y asi queda (60,60).

	var nuevaposx = pos.x*Block.BLOCK_SIZE;
	var nuevaposy = pos.y*Block.BLOCK_SIZE;

	var punto1 = new Point(nuevaposx,nuevaposy);
	var punto2 = new Point(punto1.x + Block.BLOCK_SIZE, punto1.y + Block.BLOCK_SIZE);

	//se le llama al metodo init de la clase Rectangle y le pasamos los 2 puntos definidos anteriormente
	//el (30,30) y el (60,60).
	this.init(punto1,punto2);
	this.setFill(color);
	this.setLineWidth(Block.OUTLINE_WIDTH);


}

//una casilla es un cuadrado de 30 pixels de ancho. Cada bloque ocupa una única casilla
Block.BLOCK_SIZE = 30;
//anchura de la linea que rodea al bloque
Block.OUTLINE_WIDTH = 2;


// TU CÓDIGO: emplea el patrón de herencia (Block es un Rectangle)
//Block hereda de la clase Rectangle
Block.prototype = new Rectangle();
//el constructor de bloque es bloque
Block.prototype.constructor = Block;


/** Método introducido en el EJERCICIO 4 */
Block.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;

	Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
}

/**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Block.prototype.can_move = function(board, dx, dy) {
	// TU CÓDIGO AQUÍ: toma como parámetro un increment (dx,dy)
	// e indica si es posible mover el bloque actual si
	// incrementáramos su posición en ese valor

	var incrementoPosx = dx + this.x;
	var incrementoPosy = dy + this.y;

	//console.log("Incremento de X: " + incrementoPosx);
	//console.log("Incremento de Y: "+ incrementoPosy)

	var puedeMoverseElBloque = board.can_move(incrementoPosx,incrementoPosy);
	//console.log("Puede moverse: " + puedeMoverseElBloque);
	return puedeMoverseElBloque;

}

// ************************************
// *      EJERCICIO 2                  *
// ************************************

function Shape() {}


Shape.prototype.init = function(coords, color) {

	// TU CÓDIGO AQUÍ: método de inicialización de una Pieza del tablero
	// Toma como parámetros: coords, un array de posiciones de los bloques
	// que forman la Pieza y color, un string que indica el color de los bloques
	// Post-condición: para cada coordenada, crea un bloque de ese color y lo guarda en un bloque-array

	this.bloquesArray = [];
	coords.forEach(coordenada => this.bloquesArray.push(new Block(coordenada,color)));


	//console.log(this.bloquesArray);

	/*8 Atributo introducido en el EJERCICIO 8*/
	this.rotation_dir = 1;

};

Shape.prototype.draw = function() {

	// TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
	// que forman la Pieza
	this.bloquesArray.forEach( bloque => bloque.draw());

};


//PINTAR LA SHAPE PARA LA SIGUIENTE PIEZA --> OPCIONAL 2
Shape.prototype.draw_next = function() {

	this.bloquesArray.forEach( bloque => bloque.draw_next());

};



/**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Shape.prototype.can_move = function(board, dx, dy) {

// TU CÓDIGO AQUÍ: comprobar límites para cada bloque de la pieza


	for (bloque of this.bloquesArray) {
		var bloquePuedeMoverse = bloque.can_move(board, dx, dy)
		//si uno de los bloques no puede moverse la pieza tampoco --> return false
		if (!bloquePuedeMoverse) return false;
	}
	return true;
};





/* Método introducido en el EJERCICIO 8 */

Shape.prototype.can_rotate = function(board) {

//  TU CÓDIGO AQUÍ: calcula la fórmula de rotación para cada uno de los bloques de
// la pieza. Si alguno de los bloques no se pudiera mover a la nueva posición,
// devolver false. En caso contrario, true.


	var dir = this.rotation_dir;
	for (bloque of this.bloquesArray) {
		// formula que permite rotar una casilla alrededor de otra un ángulo de 90 grados
		//x = center.x -dir*center.y + dir*block.y
		var rotacionx = this.center_block.x - dir * this.center_block.y + dir * bloque.y;
		//y = center.y + dir*center.x -dir*block.x
		var rotaciony = this.center_block.y + dir * this.center_block.x - dir * bloque.x;
		//Si alguno de los bloques no se pudiera mover a la nueva posición devolver false
		if (!board.can_move(rotacionx, rotaciony)) return false;
	}
	return true;




	}
	;

	/* Método introducido en el EJERCICIO 8 */

	Shape.prototype.rotate = function () {

// TU CÓDIGO AQUÍ: básicamente tienes que aplicar la fórmula de rotación
// (que se muestra en el enunciado de la práctica) a todos los bloques de la pieza


		//borramos los bloques
		for (bloque of this.bloquesArray) {
			bloque.erase();
		}

		var direccion = this.rotation_dir;

		for (bloque of this.bloquesArray) {
			//calcular la formula para cada bloque
			var ejex = this.center_block.x - direccion*this.center_block.y + direccion*bloque.y;
			var ejey = this.center_block.y + direccion*this.center_block.x - direccion*bloque.x;
			//mover el bloque en la direccion (rotarx, rotary)
			var rotarx = ejex - bloque.x;
			var rotary = ejey - bloque.y;
			//console.log("Rotarx: " + rotarx + " Rotary: " + rotary);
			bloque.move(rotarx, rotary);
		}


		/* Deja este código al final. Por defecto las piezas deben oscilar en su
           movimiento, aunque no siempre es así (de ahí que haya que comprobarlo) */
		if (this.shift_rotation_dir)
			this.rotation_dir *= -1
	};


	/* Método introducido en el EJERCICIO 4 */
	Shape.prototype.move = function (dx, dy) {

		for (block of this.bloquesArray) {
			block.erase();
		}

		for (block of this.bloquesArray) {
			block.move(dx, dy);
		}
	};


// ============= I_Shape ================================
	function I_Shape(center) {
		var coords = [new Point(center.x - 2, center.y),
			new Point(center.x - 1, center.y),
			new Point(center.x, center.y),
			new Point(center.x + 1, center.y)];

		Shape.prototype.init.call(this, coords, "blue");

		/* Atributo introducido en el ejercicio 8*/

		this.shift_rotation_dir = true;
		this.center_block = this.bloquesArray[2];

	}

// TU CÓDIGO AQUÍ: La clase I_Shape hereda de la clase Shape
	I_Shape.prototype = new Shape();
	I_Shape.prototype.constructor = I_Shape;


// =============== J_Shape =============================
	function J_Shape(center) {

		// TU CÓDIGO AQUÍ: Para programar J_Shape toma como ejemplo el código de la clase I_Shape
		var coords = [new Point(center.x - 1, center.y),
			new Point(center.x, center.y),
			new Point(center.x + 1, center.y),
			new Point(center.x + 1, center.y + 1)];

		Shape.prototype.init.call(this, coords, "orange");


		/* atributo introducido en el EJERCICIO 8 */
		//rota siempre en sentido horario
		this.shift_rotation_dir = false;
		this.center_block = this.bloquesArray[1];

	}

// TU CÓDIGO AQUÍ: La clase J_Shape hereda de la clase Shape
	J_Shape.prototype = new Shape();
	J_Shape.prototype.constructor = J_Shape;

// ============ L Shape ===========================
	function L_Shape(center) {

		// TU CÓDIGO AQUÍ: Para programar L_Shape toma como ejemplo el código de la clase I_Shape
		var coords = [new Point(center.x - 1, center.y),
			new Point(center.x, center.y),
			new Point(center.x + 1, center.y),
			new Point(center.x - 1, center.y + 1)];

		Shape.prototype.init.call(this, coords, "cyan");


		/* atributo introducido en el EJERCICIO 8 */
		//rota siempre en sentido horario
		this.shift_rotation_dir = false;
		this.center_block = this.bloquesArray[1];

	}

// TU CÓDIGO AQUÍ: La clase L_Shape hereda de la clase Shape
	L_Shape.prototype = new Shape();
	L_Shape.prototype.constructor = L_Shape;


// ============ O Shape ===========================
	function O_Shape(center) {

		// TU CÓDIGO AQUÍ: Para programar O_Shape toma como ejemplo el código de la clase I_Shape
		var coords = [new Point(center.x, center.y),
			new Point(center.x - 1, center.y),
			new Point(center.x - 1, center.y + 1),
			new Point(center.x, center.y + 1)];

		Shape.prototype.init.call(this, coords, "red");


		/* atributo introducido en el EJERCICIO 8 */

		this.center_block = this.bloquesArray[0];

	}

// TU CÓDIGO AQUÍ: La clase O_Shape hereda de la clase Shape
	O_Shape.prototype = new Shape();
	O_Shape.prototype.constructor = O_Shape;


	/* Código introducido en el EJERCICIO 8*/
// O_Shape la pieza no rota. Sobreescribiremos el método can_rotate que ha heredado de la clase Shape

	O_Shape.prototype.can_rotate = function (board) {
		return false;
	};


// ============ S Shape ===========================
	function S_Shape(center) {

		// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
		var coords = [new Point(center.x, center.y),
			new Point(center.x - 1, center.y + 1),
			new Point(center.x, center.y + 1),
			new Point(center.x + 1, center.y)];

		Shape.prototype.init.call(this, coords, "green");


		/* atributo introducido en el EJERCICIO 8 */

		this.shift_rotation_dir = true;
		this.center_block = this.bloquesArray[0];


	}

// TU CÓDIGO AQUÍ: La clase S_Shape hereda de la clase Shape
	S_Shape.prototype = new Shape();
	S_Shape.prototype.constructor = S_Shape;

// ============ T Shape ===========================
	function T_Shape(center) {

		// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
		var coords = [new Point(center.x - 1, center.y),
			new Point(center.x, center.y),
			new Point(center.x, center.y + 1),
			new Point(center.x + 1, center.y)];

		Shape.prototype.init.call(this, coords, "yellow");


		/* atributo introducido en el EJERCICIO 8 */
		//rota siempre en sentido horario
		this.shift_rotation_dir = false;
		this.center_block = this.bloquesArray[1];


	}

// TU CÓDIGO AQUÍ: La clase T_Shape hereda de la clase Shape
	T_Shape.prototype = new Shape();
	T_Shape.prototype.constructor = T_Shape;


// ============ Z Shape ===========================
	function Z_Shape(center) {

		// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
		var coords = [new Point(center.x - 1, center.y),
			new Point(center.x, center.y),
			new Point(center.x, center.y + 1),
			new Point(center.x + 1, center.y + 1)];

		Shape.prototype.init.call(this, coords, "magenta");


		/* atributo introducido en el EJERCICIO 8 */

		this.shift_rotation_dir = true;
		this.center_block = this.bloquesArray[1];
	}

// TU CÓDIGO AQUÍ: La clase Z_Shape hereda de la clase Shape
	Z_Shape.prototype = new Shape();
	Z_Shape.prototype.constructor = Z_Shape;


// ************************************
// *     EJERCICIO 3               *
// ************************************

// ====================== BOARD ================

	function Board(width, height) {
		this.width = width;
		this.height = height;
		this.grid = {}; /* 6. Estructura de datos introducida en el EJERCICIO 6 */
	}


// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false

	Board.prototype.draw_shape = function (shape) {
		if (shape.can_move(this, 0, 0)) {
			shape.draw();
			return true;
		}
		return false;
	}

	/*****************************
	 *     EJERCICIO 6          *
	 *****************************/

	Board.prototype.add_shape = function (shape) {

		// TU CÓDIGO AQUÍ: meter todos los bloques de la pieza que hemos recibido por parámetro en la estructura de datos grid

		var bloques = shape.bloquesArray;
		for (bloque of bloques) {

			//dict[new_key] = new_value
			var keyString = bloque.x + "," + bloque.y;

			this.grid[keyString] = bloque;
			//this.grid[(bloque.x,bloque.y)] = bloque;

			console.log("GRID (x,y): " + bloque.x + "," + bloque.y);


		}


	}

// ****************************
// *     EJERCICIO 5          *
// ****************************

	Board.prototype.can_move = function (x, y) {

		// TU CÓDIGO AQUÍ:
		// hasta ahora, este método siempre devolvía el valor true. Ahora,
		// comprueba si la posición que se le pasa como párametro está dentro de los
		// límites del tablero y en función de ello, devuelve true o false.

		//anchura y altura del tablero
		var anchura = this.width;
		var altura = this.height;
		//console.log("Anchura y Altura del Board: " +anchura + "," + altura);
		console.log("(x,y): " + x + "," + y);



		if ((x < 0 || x >= anchura) || (y < 0 || y >= altura)) return false;


		/* EJERCICIO 7 */
		// TU CÓDIGO AQUÍ: código para detectar colisiones. Si la posición x,y está en el diccionario grid, devolver false y true en cualquier otro caso.
		var posxyString = x + "," + y;
		if (posxyString in this.grid) return false;


		return true;
	};






//-----------------EJERCICIO 8 -----------------//

	Board.prototype.is_row_complete = function (y) {
		// TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
		// es completa o no (se busca en el grid).

		//le llega como parametro la fila --> mirar para todas las columnas de la fila
		//si esta completa
		var estaCompleta=true;
		for (var columna=0; columna<this.width; columna++) {
			var casilla = columna + "," + y;
			//var estaengrid = casilla in this.grid;
			//console.log("La columna " + columna + " de la fila " + y + " esta en el GRID?: " + estaengrid );
			//si alguna casilla esta sin ocupar --> la fila no esta completa (false)
			if (!(casilla in this.grid)) estaCompleta=false;
		}
		return estaCompleta;



	};



	Board.prototype.delete_row = function (y) {
		// TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los bloques de la fila
		for (var columna=0; columna<this.width; columna++){
			var casilla = columna + "," + y;

			//borrar los bloques de pantalla
			var bloque = this.grid[casilla];
			bloque.erase();

			//borrar los bloques del grid
			//console.log("Esta el bloque: " + casilla + " (ANTES de DELETE) -->" + this.grid.hasOwnProperty(casilla)); // true
			delete this.grid[casilla];
			//console.log("Esta el bloque: " + casilla + " (DESPUES de DELETE) -->" + this.grid.hasOwnProperty(casilla)); // false

		}



	};



	Board.prototype.move_down_rows = function (y_start) {
		/// TU CÓDIGO AQUÍ:
		//  empezando en la fila y_start y hasta la fila 0
		for (var y=y_start; y>=0; y--){
		//    para todas las casillas de esa fila
			for (var columna=0; columna < this.width; columna++){
				var casilla = columna + "," + y;
		//       si la casilla está en el grid  (hay bloque en esa casilla)
				if( casilla in this.grid){
					//guardamos el bloque para mirar si los de arriba pueden seguir bajando
					var bloque = this.grid[casilla];

		//          borrar el bloque del grid
					delete this.grid[casilla];
		//          mientras se pueda mover el bloque hacia abajo
		//              mover el bloque hacia abajo

					while (bloque.can_move(this,0,1)){
						//lo borramos de la posicion en la que esta
						bloque.erase();
						//y lo movemos hacia abajo (0,1)
						bloque.move(0,1);
					}
					//meter el bloque en la nueva posición del grid
					var casillaNueva = bloque.x + "," + bloque.y;
					//console.log("casilla nueva despues de bajar (o no): " + casillaNueva);

					this.grid[casillaNueva] = bloque;

				}
			}
		}




	};



	Board.prototype.remove_complete_rows = function () {
		// TU CÓDIGO AQUÍ:
		// Para toda fila y del tablero

		//contar las filas para mirar la puntuacion
		var contadorFilasCompletas= 0;

		for (var y=0; y<=this.height; y++){
			//   si la fila y está completa
			console.log("Esta la fila " + y +" completa?: " + this.is_row_complete(y));
			if (this.is_row_complete(y)){
				contadorFilasCompletas++;

				loadAudio("line.wav").then( audio => {
					 audio.play();
				});

				//      borrar fila y
				this.delete_row(y);
				//      mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )
				this.move_down_rows(y-1);
			}
		}
		//OPCIONAL 1 --> PUNTOS Y NIVELES
		//si hay 1 fila completa 40 puntos
		if(contadorFilasCompletas==1){
			this.puntuacion += 40; }
		//si hay 2 filas completas 120 puntos
		else if(contadorFilasCompletas==2){
			this.puntuacion += 120; }
		//si hay 3 filas completas 300 puntos
		else if(contadorFilasCompletas==3){
			this.puntuacion += 300; }
		//si hay 4 o mas filas completas 1200 puntos -> TETRIS
		else if(contadorFilasCompletas>=4){
			this.puntuacion += 1200;
		}

		//cuando la puntuacion supere un umbral de puntos el nivel se incrementa
		//en total hay 5 niveles. Cada vez que se incremente el nivel habrá mayor dificultad.
		if(this.puntuacion>=120){
			this.nivel=2;
		}
		if (this.puntuacion>=240){
			this.nivel=3;
		}
		if (this.puntuacion>=480){
			this.nivel=4;
		}
		if (this.puntuacion>=1200){
			this.nivel=5;
		}

		//Dibujar la puntuación en pantalla
		var scoreCanvas= document.getElementById('puntuacion');
		scoreCanvas.innerHTML = "PUNTUACIÓN: " + this.puntuacion;
		console.log("Puntuacion: " + this.puntuacion);

		//Dibujar el nivel en pantalla
		var nivelCanvas= document.getElementById('nivel');
		nivelCanvas.innerHTML = "NIVEL: " + this.nivel;
		console.log("Nivel: " + this.nivel);


	};




	//PINTAR LA SIGUIENTE PIEZA EN EL CANVAS --> OPCIONAL 2
	Board.prototype.draw_next_shape = function(shape){

		//colocarla centrada debajo del label sigpiezalabel
		canvas_sigpieza.style.position = 'absolute';
		canvas_sigpieza.style.left = "350px";
		canvas_sigpieza.style.top = "100px";

		// Borra la pieza anterior del canvas
		ctx_sigpieza.clearRect(0, 0, canvas_sigpieza.width, canvas_sigpieza.height);

		// Pinta la nueva pieza en el canvas
		shape.draw_next();
	}







// ==================== Tetris ==========================

	function Tetris() {
		this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
	}

	Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
	Tetris.DIRECTION = {'Left': [-1, 0], 'Right': [1, 0], 'Down': [0, 1]};
	Tetris.BOARD_WIDTH = 10;
	Tetris.BOARD_HEIGHT = 20;
	Tetris.BOARD_COLOR = 'white';
	Tetris.PAUSA = false;
	Tetris.SONANDO =false;
	Tetris.MUSICA = new Audio("tetris_song.mp3");

	Tetris.prototype.create_new_shape = function () {


		// TU CÓDIGO AQUÍ:
		// Elegir un nombre de pieza al azar del array Tetris.SHAPES

		//coger un elemento randomizadamente de un array -->
		//https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
		//const randomElement = array[Math.floor(Math.random() * array.length)];
		const pieza_random = Tetris.SHAPES[Math.floor(Math.random() * Tetris.SHAPES.length)];
		console.log(pieza_random);


		//para hacer las pruebas unitarias coger S_shape
		//const s_shape= Tetris.SHAPES[4];
		//console.log(s_shape);

		//console.log(pieza_random);

		// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)


		//se coge la pieza. Por ejemplo Z_Shape y se crea una pieza de su tipo
		//new Z_Shape --> le pasamos como centro --> (x = centro del tablero, y = 0)
		//En ese punto sera donde se cree el centro y el resto de la pieza
		var anchura_x = Tetris.BOARD_WIDTH / 2;
		var altura_y = 0;
		//console.log(anchura_x);

		var pieza_nueva = new pieza_random(new Point(anchura_x, altura_y));
		//var pieza_nueva = new s_shape(new Point(anchura_x,altura_y));

		// Devolver la referencia de esa pieza nueva
		return pieza_nueva;


	}



	//Cargar el audio del tetris
	function loadAudio(url){
		//se devuelve mediante una promesa
		return new Promise(resolve => {
			//const audio = new Audio();
			const audio = new Audio();
			audio.addEventListener('canplay', () => {
				resolve(audio);
			});
			//se le indica el source donde se encuantra el audio
			audio.src = url;
		});
	}

	//cuando el usuario pulse sobre el botón 'Play Audio' la música empezara
	//a sonar en bucle y el botón se desabilitará.
	function playAudio() {
		var botonAudio = document.getElementById("playaudio");
		Tetris.MUSICA.play();
		//para que vaya en loop la musica
		Tetris.MUSICA.loop=true;
		botonAudio.disabled = true;
		Tetris.SONANDO =true;

	}



	Tetris.prototype.init = function () {

		/**************
		 EJERCICIO 4
		 ***************/


		//inicializar puntuacion
		this.board.puntuacion=0;
		var scoreCanvas= document.getElementById('puntuacion');
		scoreCanvas.innerHTML = "PUNTUACIÓN: " + this.board.puntuacion;

		//inicializar nivel
		this.board.nivel = 1;
		var nivelCanvas= document.getElementById('nivel');
		nivelCanvas.innerHTML = "NIVEL: " + this.board.nivel;


		// gestor de teclado
		document.addEventListener('keydown', this.key_pressed.bind(this), false);

		// Obtener una nueva pieza al azar y asignarla como pieza actual
		this.current_shape = this.create_new_shape();

		// TU CÓDIGO AQUÍ:
		// Pintar la pieza actual en el tablero
		// Aclaración: (Board tiene un método para pintar)
		this.board.draw_shape(this.current_shape);


		//Obtener lo que será la siguiente pieza al azar
		this.next_shape = this.create_new_shape();


		// Pintar la siguiente pieza en el canvas 'canvas_sigpieza'
		this.board.draw_next_shape(this.next_shape);


		//play audio
		var botonAudio = document.getElementById("playaudio");
		botonAudio.onclick = playAudio;


		//para que comience la animación de la pieza una vez que se dibuje en pantalla.
		this.animate_shape(this);

	}







	Tetris.prototype.key_pressed = function (e) {

		//imprimir en la consola la tecla que pulse
		//console.log(e);

		//para impedir que haga la accion
		//e.preventDefault();

		var key = e.keyCode ? e.keyCode : e.which;

		//console.log("KEY: " + key);

		//ARROWLEFT --> ASCII : 37
		//ARROWUP --> ASCII : 38
		//ARROWRIGHT --> ASCII : 39
		//ARROWDOWN --> ASCII : 40

		// TU CÓDIGO AQUÍ:
		// en la variable key se guardará el código ASCII de la tecla que
		// ha pulsado el usuario. ¿Cuál es el código key que corresponde
		// a mover la pieza hacia la izquierda, la derecha, abajo o a rotarla?
		if (key == 37) {
			e.preventDefault();
			console.log("Ha pulsado ARROWLEFT");
			this.do_move("Left");
		} else if (key == 39) {
			e.preventDefault();
			console.log("Ha pulsado ARROWRIGHT");
			this.do_move("Right");
		} else if (key == 40) {
			e.preventDefault();
			console.log("Ha pulsado ARROWDOWN");
			this.do_move("Down");
		}
		//cuando se pulse el espacio --> ASCII:32 la pieza baja inmediatamente
		else if (key == 32) {
			e.preventDefault();
			console.log("Ha pulsado ESPACIO");
			var abajox = Tetris.DIRECTION['Down'][0];
			var abajoy = Tetris.DIRECTION['Down'][1];


			//si el Tetris no esta pausado
			if (!Tetris.PAUSA) {
				loadAudio("falling.mp3").then( audio => {
					audio.play();
				});
				//mientras la pieza se pueda mover para abajo --> moverla para abajo
				//en la direccion Down teniendo en cuenta si desde (abajox,abajoy) puede moverse
				while (this.current_shape.can_move(this.board, abajox, abajoy)) {
					this.do_move("Down");
				}
				//el ultimo movimiento para que salga la pieza nueva arriba
				this.do_move("Down");
			}
		}


		/* Introduce el código para realizar la rotación en el EJERCICIO 8. Es decir, al pulsar la flecha arriba, rotar la pieza actual */
		else if (key == 38) {
			e.preventDefault();
			if (!Tetris.PAUSA) {
				loadAudio("rotate.mp3").then(audio => {
					audio.play();
				});
			}
			console.log("Ha pulsado ARROWUP");
			//rotar la pieza
			this.do_rotate();
		}
		//si el jugador pulsa p o P --> Pausa
		else if (key == 80) {
			e.preventDefault();
			console.log("Ha pulsado PAUSA");

			//pausar el juego
			this.do_pausa();
		}




	}


	//Cuando se pulse PAUSA el juego se pausará o se reanudará depende cual era su
	//estado anterior. También se pausará la música en el caso de que estuviera sonando
	Tetris.prototype.do_pausa = function() {
		Tetris.PAUSA=!Tetris.PAUSA;
		console.log("Pausado (true o false): " + Tetris.PAUSA);
		var pausadoTexto = document.getElementById('pausa');
		if (Tetris.PAUSA) {
			pausadoTexto.innerHTML = "PAUSA";
			Tetris.MUSICA.pause();
		}
		else{
			pausadoTexto.innerHTML = "";
			if (Tetris.SONANDO) Tetris.MUSICA.play();

		}


	}





	Tetris.prototype.do_move = function (direction) {

		// TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
		// derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
		// a esa tecla. Recuerda que el array Tetris.DIRECTION guarda los desplazamientos
		// en cada dirección, por tanto, si accedes a Tetris.DIRECTION[direction],
		// obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual
		// se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza.
		var dx = Tetris.DIRECTION[direction][0];
		var dy = Tetris.DIRECTION[direction][1];
		if (this.current_shape.can_move(this.board, dx, dy)) {
			console.log("------------------");
			//si le llega Left se movera [-1,0]
			//si le llega Right se movera [1,0]
			//si le llega Down se movera [0,1]

			//si no esta pausado mover la pieza en la posición que le llega
			if (!Tetris.PAUSA)  this.current_shape.move(dx, dy);
		}



		/* Código que se pide en el EJERCICIO 6 */
		// else if(direction=='Down')
		// TU CÓDIGO AQUÍ: añade la pieza actual al grid. Crea una nueva pieza y dibújala en el tablero.
		else if (direction == 'Down') {
			this.board.add_shape(this.current_shape);
			//this.current_shape = ponerle la de previsualizacion (this.next_shape)
			this.current_shape = this.next_shape;
			this.board.draw_shape(this.current_shape);
			//crear la siguiente pieza al azar y dibujarla en el canvas_sigpieza
			this.next_shape = this.create_new_shape();
			this.board.draw_next_shape(this.next_shape);

			//comprobar si hay alguna fila completa y si la hay borrarla
			this.board.remove_complete_rows();


			//si no se puede mover ninguna otra pieza llamar al metodo GameOver
			if (!this.current_shape.can_move(this.board, 0, 0)){

				this.gameOver();
			}



		}



	}


	//Game over --> se pausa el juego y suena la musica de Gameover2.mp3
	Tetris.prototype.gameOver = function () {
		Tetris.MUSICA.pause();
		loadAudio("gameover2.mp3").then( audio => {
			audio.play();
			console.log("Game Over --> No se puede mover ninguna pieza");
			alert("GAME OVER");
		});

	}


	/***** EJERCICIO 8 ******/
	Tetris.prototype.do_rotate = function () {

		// TU CÓDIGO AQUÍ: si la pieza actual se puede rotar, rótala. Recueda que Shape.can_rotate y Shape.rotate ya están programadas.
		if (this.current_shape.can_rotate(this.board)) {
			console.log("------------------");
			//mientras no este en PAUSA se puede rotar
			if (!Tetris.PAUSA) this.current_shape.rotate();
		}


	}

	Tetris.prototype.animate_shape = function(tetris) {
		//setInterval(function(){ this.do_move("Down"); }, 1000);
		//Cuando el nivel es 1 se mueve abajo cada 1 segundo (si no esta en PAUSA)
		if (this.board.nivel==1){
			console.log("LAS PIEZAS BAJAN A VELOCIDAD DE 1 SEGUNDO DE INTERVALO");
			setTimeout(this.animate_shape.bind(this),1000);
			//si no esta pausado que haga el movimiento
			if (!Tetris.PAUSA) this.do_move("Down");
			//setInterval(function(){tetris.do_move("Down")},1000);
		}
		else if (this.board.nivel==2){ //Cuando el nivel es 2 se mueve abajo cada 0.8 segundos
			console.log("LAS PIEZAS BAJAN A VELOCIDAD DE 0.8 SEGUNDO DE INTERVALO");
			setTimeout(this.animate_shape.bind(this),800);
			//si no esta pausado que haga el movimiento
			if (!Tetris.PAUSA) this.do_move("Down");
			//setInterval(function(){tetris.do_move("Down")},800);
		}
		else if (this.board.nivel==3){ //Cuando el nivel es 3 se mueve abajo cada 0.6 segundos
			console.log("LAS PIEZAS BAJAN A VELOCIDAD DE 0.6 SEGUNDO DE INTERVALO");
			setTimeout(this.animate_shape.bind(this),600);
			//si no esta pausado que haga el movimiento
			if (!Tetris.PAUSA) this.do_move("Down");
		}
		else if (this.board.nivel==4){ //Cuando el nivel es 4 se mueve abajo cada 0.4 segundos
			console.log("LAS PIEZAS BAJAN A VELOCIDAD DE 0.4 SEGUNDO DE INTERVALO");
			setTimeout(this.animate_shape.bind(this),400);
			//si no esta pausado que haga el movimiento
			if (!Tetris.PAUSA) this.do_move("Down");
		}
		else if (this.board.nivel==5){ //Cuando el nivel es 5 se mueve abajo cada 0.2 segundos
			console.log("LAS PIEZAS BAJAN A VELOCIDAD DE 0.2 SEGUNDO DE INTERVALO");
			setTimeout(this.animate_shape.bind(this),200);
			//si no esta pausado que haga el movimiento
			if (!Tetris.PAUSA) this.do_move("Down");
		}
		//console.log("Ha pasado 1 segundo")
		//this.do_move("Down");
	}












