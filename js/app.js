/**
Założenia gry:
--------------
1. Plansza gry ma rozmiary 10x10 pól,
2. Furry porusza się w jednym z czterech kierunków: góra, dół, lewo, prawo,
3. Gdy Furry uderzy w ścianę, następuje koniec gry,
4. Na planszy obecna jest moneta. Gdy Furry ją zbierze, umieszczana jest 
   kolejna, na losowym polu.
**/

$(document).ready(function() {

	var currentX = Math.floor(Math.random() * 10), //starting point x
		currentY = Math.floor(Math.random() * 10), //starting point y
		coinX = Math.floor(Math.random() * 10),
		coinY = Math.floor(Math.random() * 10),
		interval,
		board = $('div.board'),
		area = board.find('div'),
		again = $('#again'),
		pointsCounter = -1,
		speed = 150,
		points = ('#points'),
		evilX = Math.floor(Math.random() * 10),
		evilY = Math.floor(Math.random() * 10);

	//funkcja przelicza koordynaty x i y na pozycję diva w liście
	function coordinates(x, y) {
		return area.eq(x+(y*10));
	}

	//tworzy user w starting poincie
	coordinates(currentX, currentY).addClass('user');
	coin();
	evil();
	$(points).text(pointsCounter);

	// funkcja do poruszania się z parametrem kierunku pobieranym z wciśniętego klawiasza
	function go(dir){
		window.clearInterval(interval);
		interval = setInterval(function(){
			coordinates(currentX, currentY).toggleClass('user');
			switch(dir) {
				case 'left':
					currentX --;
					break;
				case 'up':
					currentY --;
					break;
				case 'right':
					currentX ++;
					break;
				case 'down':
					currentY ++;
					break;
			}
			coordinates(currentX, currentY).toggleClass('user');
			$(board).trigger('check');
		}, speed);
	}
	//event po każdym ruchu sprawdza ...  
	$(board).bind('check', function(){ 
		//czy trzeba ustawić nową monetę
		if (currentX === coinX && currentY === coinY) {
			coin();
			$(points).text(pointsCounter);
			//czy zwiększyć prędkość
			if (pointsCounter % 10 === 0) {
				speed -= 15;
			}
		}
		//czy user właśnie nie umarł
		if (currentX === -1) {
			coordinates(currentX, currentY).toggleClass('user');
			coordinates(0, currentY).toggleClass('user');
			die();
		} else if (currentY === -1) {
			coordinates(currentX, currentY).toggleClass('user');
			coordinates(currentX, 0).toggleClass('user');
			die();
		} else if (currentX === 10) {
			coordinates(currentX, currentY).toggleClass('user');
			coordinates(9, currentY).toggleClass('user');
			die();
		} else if (currentY === 10) {
			coordinates(currentX, currentY).toggleClass('user');
			coordinates(currentX, 9).toggleClass('user');
			die();
		} else if (currentY === evilY && currentX === evilX) {
			die();
		}
		console.log(speed);
		//console.log(currentX+", "+currentY);
	});

	function die() {
		area.fadeOut(500);
		$('#info').fadeOut(500);
		window.clearInterval(interval);
		again.find('#result').text("you've chased "+pointsCounter+" gold coins!")
		again.fadeIn(500);
	}

	again.on('click', function(){
		location.reload();
	});

	function coin() {
		var divInside = $('<div class="coin"></div>');

		coordinates(coinX,coinY).empty();
		coinX = Math.floor(Math.random() * 10);
		coinY = Math.floor(Math.random() * 10);
		coordinates(coinX,coinY).append(divInside);
		if (evilX === coinX && evilY === coinY) {
			coin();
		}
		pointsCounter ++;
	}

	var evilInterval = setInterval(function(){
		evil();
	}, 4000);

	function evil() {
			var divInside = $('<div class="tomato"></div>');

			coordinates(evilX,evilY).empty();
			evilX = Math.floor(Math.random() * 10);
			evilY = Math.floor(Math.random() * 10);
			coordinates(evilX,evilY).append(divInside);
			if (evilX === coinX && evilY === coinY) {
				evil();
			}
	}

	//event na wciśnięcie strzałki na klawiaturze
	$(document).keydown(function(e){
		switch(e.which) {
			case 37: go('left');
				break;
			case 38: go('up');
				break;
			case 39: go('right');
				break;
			case 40: go('down');
				break;
		}

	})


 
});
