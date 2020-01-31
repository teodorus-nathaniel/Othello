import OthelloPin from './modules/othello-pin.js';

const rows = document.getElementsByClassName('row-tiles');
const othelloBoard = document.getElementById('othello-board');
const othelloTiles = Array.from(rows).map((row) => Array.from(row.children));
let isWhiteTurn = true;
let blackCount = 2;
let whiteCount = 2;

const blackCountLabel = document.getElementById('black-count');
const whiteCountLabel = document.getElementById('white-count');

async function updateCountLabel (label, count){
	await label.classList.add('update-effect');
	setTimeout(() => {
		label.textContent = count;
	}, 500);
	setTimeout(() => {
		label.classList.remove('update-effect');
	}, 1000);
}

function initGame (){
	blackCount = 2;
	whiteCount = 2;
	isWhiteTurn = true;
	updateCountLabel(blackCountLabel, blackCount);
	updateCountLabel(whiteCountLabel, whiteCount);

	document.getElementById('win-overlay').classList.add('hide');
	document.body.classList.add('is-white');

	othelloTiles.forEach((row, i) => {
		row.forEach((tile, j) => {
			tile.dataset.y = i;
			tile.dataset.x = j;
			tile.innerHTML = '';
		});
	});

	othelloTiles[3][3].innerHTML = OthelloPin('white');
	othelloTiles[4][4].innerHTML = OthelloPin('white');
	othelloTiles[3][4].innerHTML = OthelloPin('black');
	othelloTiles[4][3].innerHTML = OthelloPin('black');
}

function checkNeighbors (tiles, turn, now, move, turnTiles = []){
	const { x, y } = now;
	const checkX = +x + move.x;
	const checkY = +y + move.y;

	if (checkX < 0 || checkY < 0 || checkX > 7 || checkY > 7) return [];

	const checkTile = othelloTiles[checkY][checkX];
	if (!checkTile.innerHTML) return [];
	if (checkTile.children[0].matches(`.${turn}`) && turnTiles.length !== 0) return turnTiles;
	if (checkTile.children[0].matches(`.${turn}`) && turnTiles.length === 0) return [];

	return checkNeighbors(tiles, turn, { x: checkX, y: checkY }, move, [ ...turnTiles, checkTile ]);
}

function getWhosTurn (isWhiteTurn){
	return isWhiteTurn ? 'white' : 'black';
}

function updateLabel (blackCount, whiteCount){
	updateCountLabel(blackCountLabel, blackCount);
	updateCountLabel(whiteCountLabel, whiteCount);
}

initGame();

function showWinOverlay (){
	document.getElementById('win-overlay').classList.remove('hide');
	document.getElementById('player-win').textContent =
		whiteCount === blackCount ? 'No One' : whiteCount > blackCount ? 'White' : 'Black';
	document.getElementById('white-count-win').textContent = whiteCount;
	document.getElementById('black-count-win').textContent = blackCount;
}

function changeTurn (){
	isWhiteTurn = !isWhiteTurn;
	document.body.classList.toggle('is-white');

	updateLabel(blackCount, whiteCount);

	if (whiteCount + blackCount >= 64) {
		document.body.classList.remove('is-white');
		if (whiteCount === blackCount) document.body.classList.add('is-tie');
		else if (whiteCount > blackCount) document.body.classList.add('is-white');
		showWinOverlay();
	}
}

othelloBoard.addEventListener('click', (e) => {
	const closest = e.target.closest('.tile');
	const posData = closest.dataset;
	const turnColor = getWhosTurn(isWhiteTurn);

	if (closest.children.length !== 0) return;

	let turned = checkNeighbors(othelloTiles, turnColor, posData, { x: 1, y: 1 });
	turned = [ ...turned, ...checkNeighbors(othelloTiles, turnColor, posData, { x: -1, y: -1 }) ];
	turned = [ ...turned, ...checkNeighbors(othelloTiles, turnColor, posData, { x: -1, y: 0 }) ];
	turned = [ ...turned, ...checkNeighbors(othelloTiles, turnColor, posData, { x: 0, y: -1 }) ];
	turned = [ ...turned, ...checkNeighbors(othelloTiles, turnColor, posData, { x: 1, y: 0 }) ];
	turned = [ ...turned, ...checkNeighbors(othelloTiles, turnColor, posData, { x: 0, y: 1 }) ];
	turned = [ ...turned, ...checkNeighbors(othelloTiles, turnColor, posData, { x: -1, y: 1 }) ];
	turned = [ ...turned, ...checkNeighbors(othelloTiles, turnColor, posData, { x: 1, y: -1 }) ];

	if (turned.length === 0) return;

	turned.forEach((tile) => {
		tile.children[0].classList.remove('black');
		tile.children[0].classList.remove('white');
		tile.children[0].classList.add(turnColor);
	});

	if (isWhiteTurn) {
		blackCount -= turned.length;
		whiteCount += turned.length + 1;
	} else {
		whiteCount -= turned.length;
		blackCount += turned.length + 1;
	}
	closest.innerHTML = OthelloPin(getWhosTurn(isWhiteTurn));

	changeTurn();
});

document.getElementById('restart-btn').addEventListener('click', initGame);
