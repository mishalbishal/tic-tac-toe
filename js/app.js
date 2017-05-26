function Main() {
	var app = new App("stage");
	app.initialize();
}

function App(stageId) {
	var app = this;
	app.elem = document.getElementById(stageId);
	var stageCreated = false;
	app.currentSymbol = 'O';
	app.isGameOver = false;

	app.nextSymbol = function() {
		app.currentSymbol = app.currentSymbol == 'X' ? 'O' : 'X';
	};

	app.initialize = function() {
		// Prepare relevant data structures
		app.model = [
			[ '', '', '' ],
			[ '', '', '' ],
			[ '', '', '' ]
		];

		// Prepare the stage
		app.render();
	};

	// Render only needs to be called once. Afterwards, all re-rendering will be handled
	// by the click event handlers.
	// Introduces following globals:
	// app.messageElem
	app.render = function() {
		if(!stageCreated) {
			app.messageElem = document.createElement("div");
			app.elem.appendChild(app.messageElem);

			for (var i = 0; i < app.model.length; i++) {
				var line = document.createElement("p");
				line.className = "tttapp-line";

				for (var j = 0; j < app.model[i].length; j++) {
					var newElem = document.createElement("div");
					// Formula for ID attempts to make each div unique,
					// maybe not the best way to go about this.
					newElem.id = "tttapp-" + stageId + "-" + i + "x" + j;
					newElem.className = "tttapp-cell";
					newElem.textContent = app.model[i][i];

					newElem.dataset.iValue = i;
					newElem.dataset.jValue = j;

					newElem.addEventListener("click", app.onClickHandler);
					line.appendChild(newElem);
				}
				app.elem.appendChild(line);
			}
			stageCreated = true;
		}
	};

	app.isWinner = function(symbol) {
		// Check all rows
		for(var i = 0; i < app.model.length; i++) {
			if( app.model[i].every(function(element) {
				return element == symbol;
			}) ) {
				return true;
			}
		}

		// Check all columns (note assumes i/j lengths are same)
		for(var j = 0; j < app.model.length; j++) {
			var allSame = true;
			for(var i = 0; i < app.model.length; i++) {
				if( app.model[i][j] != symbol ) {
					allSame = false;
				}
			}

			if( allSame ) {
				return true;
			}
		}

		// Check diagonals
		var diagonalWin1 = true;
		var diagonalWin2 = true;

		for (var i = 0; i < app.model.length; i++) {
			if( app.model[i][i] != symbol ) {
				diagonalWin1 = false;
				break;
			}
		}

		// Check the other diagonal
		for (var i = 0; i < app.model.length; i++) {
			if( app.model[i][app.model.length - i - 1] != symbol ) {
				diagonalWin2 = false;
				break;
			}
		};

		return diagonalWin1 || diagonalWin2;
	};

	app.isDraw = function() {
		for (var i = 0; i < app.model.length; i++) {
			for (var j = 0; j < app.model[i].length; j++) {
				if( app.model[i][j] == '' ) {
					return false;
				}
			}
		}
		return true;
	}

	app.congrats = function(symbol) {
		app.showMessage("Congrats, the player for \"" + symbol + "\" has won!");
	};

	app.showMessage = function(message) {
		if( app.messageElem ) {
			app.messageElem.textContent = message;
		}
		else {
			alert(message);
		}
	};

	app.drawMessage = function() {
		app.showMessage("Stalemate!");
	};

	app.onClickHandler = function(event) {
		var i = this.dataset.iValue;
		var j = this.dataset.jValue;

		// Don't respond to clicks for cells that are already
		// populated.
		// Or if the game is finished.
		if( app.isGameOver || app.model[i][j] != '' ) {
			return;
		}
		app.model[i][j] = app.currentSymbol;
		this.textContent = app.currentSymbol;

		if( app.isWinner(app.currentSymbol) ) {
			app.congrats(app.currentSymbol);
			app.isGameOver = true;
		}
		else if( app.isDraw() ) {
			app.drawMessage();
			app.isGameOver = true;
		}
		else {
			app.nextSymbol();
		}
	};
}