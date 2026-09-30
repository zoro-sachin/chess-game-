import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';

const PIECES = {
	w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
	b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};
const PROMOTION_PIECES = ['q', 'r', 'b', 'n'];
const START_TIME = 10 * 60;

const chess = new Chess();
const boardElement = document.querySelector('#chessboard');
const moveListElement = document.querySelector('#move-list');
const movesEmptyElement = document.querySelector('#moves-empty');
const promotionOverlay = document.querySelector('#promotion-overlay');
const promotionOptions = document.querySelector('#promotion-options');
const statusElement = document.querySelector('#game-status');
const whiteClock = document.querySelector('#white-clock');
const blackClock = document.querySelector('#black-clock');
const whitePlayer = document.querySelector('#white-player');
const blackPlayer = document.querySelector('#black-player');
const undoButton = document.querySelector('#undo-button');
const moveCountElement = document.querySelector('#move-count');
const movesTotalElement = document.querySelector('#moves-total');

let selectedSquare = null;
let legalMoves = [];
let flipped = false;
let clockStarted = false;
let clockInterval = null;
let clocks = { w: START_TIME, b: START_TIME };
let pendingPromotion = null;

function getSquareOrder() {
	const files = flipped ? 'hgfedcba' : 'abcdefgh';
	const ranks = flipped ? '12345678' : '87654321';
	return [...ranks].flatMap((rank) => [...files].map((file) => `${file}${rank}`));
}

function renderCoordinates() {
	const ranks = flipped ? '12345678' : '87654321';
	const files = flipped ? 'hgfedcba' : 'abcdefgh';
	document.querySelector('#rank-labels').textContent = [...ranks].join('');
	document.querySelector('#file-labels').textContent = [...files].join('');
}

function renderBoard(animateSquare = null) {
	const currentBoard = chess.board();
	const squareOrder = getSquareOrder();
	const lastMove = chess.history({ verbose: true }).at(-1);
	const checkedKing = chess.isCheck()
		? currentBoard.flat().find((piece) => piece?.type === 'k' && piece.color === chess.turn())
		: null;
	const checkedSquare = checkedKing?.square;
	const fragment = document.createDocumentFragment();

	for (const squareName of squareOrder) {
		const fileIndex = squareName.charCodeAt(0) - 97;
		const rankIndex = 8 - Number(squareName[1]);
		const piece = currentBoard[rankIndex][fileIndex];
		const square = document.createElement('button');
		const isLight = (fileIndex + Number(squareName[1])) % 2 === 0;
		square.type = 'button';
		square.className = `square ${isLight ? 'light' : 'dark'}`;
		square.dataset.square = squareName;
		square.setAttribute('role', 'gridcell');
		const pieceName = piece ? ({ k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' })[piece.type] : '';
		square.setAttribute('aria-label', `${squareName}${piece ? `, ${piece.color === 'w' ? 'white' : 'black'} ${pieceName}` : ''}`);

		if (lastMove && [lastMove.from, lastMove.to].includes(squareName)) square.classList.add('last-move');
		if (squareName === selectedSquare) square.classList.add('selected');
		if (squareName === checkedSquare) square.classList.add('in-check');
		if (squareName === animateSquare) square.classList.add('just-moved');

		const targetMove = legalMoves.find((move) => move.to === squareName);
		if (targetMove) square.classList.add('legal', ...(targetMove.captured ? ['capture'] : []));

		if (piece) {
			const pieceElement = document.createElement('span');
			pieceElement.className = `piece ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`;
			pieceElement.setAttribute('aria-hidden', 'true');
			pieceElement.textContent = PIECES[piece.color][piece.type];
			square.append(pieceElement);
		}

		const file = squareName[0];
		const rank = squareName[1];
		if ((!flipped && file === 'a') || (flipped && file === 'h')) {
			const rankLabel = document.createElement('span');
			rankLabel.className = 'square-coordinate';
			rankLabel.textContent = rank;
			square.append(rankLabel);
		}
		fragment.append(square);
	}

	boardElement.replaceChildren(fragment);
	renderCoordinates();
}

function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function renderClocks() {
	whiteClock.textContent = formatTime(clocks.w);
	blackClock.textContent = formatTime(clocks.b);
	whitePlayer.classList.toggle('active', chess.turn() === 'w' && !chess.isGameOver());
	blackPlayer.classList.toggle('active', chess.turn() === 'b' && !chess.isGameOver());
	whitePlayer.classList.toggle('low-time', clocks.w <= 30);
	blackPlayer.classList.toggle('low-time', clocks.b <= 30);
}

function renderMoves() {
	const history = chess.history();
	const rows = [];
	for (let index = 0; index < history.length; index += 2) {
		const row = document.createElement('li');
		row.className = 'move-row';
		const number = document.createElement('span');
		number.className = 'move-number';
		number.textContent = `${String(Math.floor(index / 2) + 1).padStart(2, '0')}.`;
		const whiteMove = document.createElement('span');
		whiteMove.className = `move-cell${index === history.length - 1 ? ' current' : ''}`;
		whiteMove.textContent = history[index];
		const blackMove = document.createElement('span');
		blackMove.className = `move-cell${index + 1 === history.length - 1 ? ' current' : ''}`;
		blackMove.textContent = history[index + 1] || '';
		row.append(number, whiteMove, blackMove);
		rows.push(row);
	}
	moveListElement.replaceChildren(...rows);
	movesEmptyElement.hidden = history.length > 0;
	movesTotalElement.textContent = String(history.length).padStart(2, '0');
	moveCountElement.textContent = `MOVE ${String(Math.floor(history.length / 2) + 1).padStart(2, '0')}`;
	moveListElement.scrollTop = moveListElement.scrollHeight;
	undoButton.disabled = history.length === 0 || chess.isGameOver();
}

function renderStatus() {
	if (clocks.w <= 0 || clocks.b <= 0) {
		statusElement.textContent = `${clocks.w <= 0 ? 'Black' : 'White'} wins on time`;
	} else if (chess.isCheckmate()) {
		statusElement.textContent = `Checkmate. ${chess.turn() === 'w' ? 'Black' : 'White'} wins`;
	} else if (chess.isStalemate()) {
		statusElement.textContent = 'Draw by stalemate';
	} else if (chess.isThreefoldRepetition()) {
		statusElement.textContent = 'Draw by repetition';
	} else if (chess.isDraw()) {
		statusElement.textContent = 'Game drawn';
	} else if (chess.isCheck()) {
		statusElement.textContent = `${chess.turn() === 'w' ? 'White' : 'Black'} is in check`;
	} else {
		statusElement.textContent = `${chess.turn() === 'w' ? 'White' : 'Black'} to move`;
	}
}

function render() {
	renderBoard();
	renderClocks();
	renderMoves();
	renderStatus();
}

function openPromotion(from, to, color) {
	pendingPromotion = { from, to };
	promotionOptions.replaceChildren();
	for (const type of PROMOTION_PIECES) {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'promotion-choice';
		button.setAttribute('aria-label', `Promote to ${({ q: 'queen', r: 'rook', b: 'bishop', n: 'knight' })[type]}`);
		button.textContent = PIECES[color][type];
		button.addEventListener('click', () => completeMove(from, to, type));
		promotionOptions.append(button);
	}
	promotionOverlay.hidden = false;
	promotionOptions.querySelector('button')?.focus();
}

function completeMove(from, to, promotion = 'q') {
	const move = chess.move({ from, to, promotion });
	if (!move) return;
	pendingPromotion = null;
	promotionOverlay.hidden = true;
	selectedSquare = null;
	legalMoves = [];
	startClock();
	render();
	renderBoard(move.to);
	if (chess.isGameOver()) stopClock();
}

function startClock() {
	if (clockStarted) return;
	clockStarted = true;
	clockInterval = window.setInterval(() => {
		if (chess.isGameOver()) {
			stopClock();
			return;
		}
		const currentColor = chess.turn();
		clocks[currentColor] = Math.max(0, clocks[currentColor] - 1);
		renderClocks();
		renderStatus();
		if (clocks[currentColor] === 0) {
			stopClock();
			renderMoves();
			renderStatus();
		}
	}, 1000);
}

function stopClock() {
	if (clockInterval !== null) window.clearInterval(clockInterval);
	clockInterval = null;
}

function handleSquareClick(event) {
	const square = event.target.closest('[data-square]');
	if (!square || chess.isGameOver() || clocks.w <= 0 || clocks.b <= 0 || pendingPromotion) return;
	const squareName = square.dataset.square;

	if (selectedSquare) {
		const chosenMove = legalMoves.find((move) => move.to === squareName);
		if (chosenMove) {
			if (chosenMove.promotion) openPromotion(chosenMove.from, chosenMove.to, chess.turn());
			else completeMove(chosenMove.from, chosenMove.to);
			return;
		}
	}

	const piece = chess.get(squareName);
	if (piece && piece.color === chess.turn()) {
		selectedSquare = squareName;
		legalMoves = chess.moves({ square: squareName, verbose: true });
	} else {
		selectedSquare = null;
		legalMoves = [];
	}
	renderBoard();
}

boardElement.addEventListener('click', handleSquareClick);
boardElement.addEventListener('keydown', (event) => {
	if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
	const squares = [...boardElement.querySelectorAll('[data-square]')];
	const currentIndex = squares.indexOf(document.activeElement);
	if (currentIndex < 0) return;
	event.preventDefault();
	const offsets = { ArrowUp: -8, ArrowDown: 8, ArrowLeft: -1, ArrowRight: 1 };
	const nextIndex = Math.max(0, Math.min(63, currentIndex + offsets[event.key]));
	squares[nextIndex]?.focus();
});

undoButton.addEventListener('click', () => {
	stopClock();
	clockStarted = false;
	if (chess.undo()) {
		selectedSquare = null;
		legalMoves = [];
		render();
	}
});

document.querySelector('#flip-button').addEventListener('click', () => {
	flipped = !flipped;
	renderBoard();
});

document.querySelector('#reset-button').addEventListener('click', () => {
	stopClock();
	chess.reset();
	clocks = { w: START_TIME, b: START_TIME };
	clockStarted = false;
	selectedSquare = null;
	legalMoves = [];
	pendingPromotion = null;
	promotionOverlay.hidden = true;
	render();
});

document.querySelector('.help-button').addEventListener('click', () => {
	statusElement.textContent = 'Select a piece, then choose a highlighted square';
	window.setTimeout(renderStatus, 2800);
});

promotionOverlay.addEventListener('click', (event) => {
	if (event.target === promotionOverlay && pendingPromotion) {
		promotionOverlay.hidden = true;
		pendingPromotion = null;
		selectedSquare = null;
		legalMoves = [];
		renderBoard();
	}
});

render();
