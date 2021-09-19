import { Client, Room } from 'colyseus';
import { GameState } from '../src/state/gameState';
import { Board } from '../src/state/board';
import { queryByRowAndColumn } from '../src/state/mutations';
import { Tetrolyso } from '../src/state/Tetrolyso';
import { Position } from '../src/state/Position';
import { DOWN, LEFT, RIGHT } from '../src/messages/movement';
import { NOT_READY, READY } from '../src/messages/readystate';

const queryBoardElement = () => <HTMLDivElement>document.querySelector('#board');
const queryPreviewElement = () => <HTMLDivElement>document.querySelector('#preview');
const queryLevelElement = () => <HTMLDivElement>document.querySelector('#level');
const queryScoreElement = () => <HTMLDivElement>document.querySelector('#score');
const queryReadyModal = () => <HTMLDivElement>document.querySelector('#ready-modal');
const queryReadyButton = () => <HTMLDivElement>document.querySelector('#ready');
const queryNotReadyButton = () => <HTMLDivElement>document.querySelector('#not-ready');

const clearBoard = () => {
  const boardElement = queryBoardElement();
  removeChildren(boardElement);
};
const clearPreview = () => {
  const previewElement = queryPreviewElement();
  removeChildren(previewElement);
};

const removeChildren = (parentElement: HTMLElement): void => {
  while (parentElement.childNodes.length) {
    parentElement.removeChild(parentElement.lastChild);
  }
};

const drawPreview = (preview: Tetrolyso): void => {
  const previewElement = queryPreviewElement();
  previewElement.style.gridTemplateColumns = `repeat(5, 20px)`;
  previewElement.style.gridTemplateRows = `repeat(5, 20px)`;
  previewElement.style.height = 'fit-content';
  previewElement.style.width = 'fit-content';

  const blockPosition = queryByRowAndColumn(preview);

  for (let row = 0; row < 5; ++row) {
    for (let col = 0; col < 5; ++col) {
      const cellDiv = document.createElement('div');
      cellDiv.id = `preview-r${row}-c${col}`;
      previewElement.append(cellDiv);
    }
  }

  for (let row = 0; row < preview.rows; ++row) {
    for (let col = 0; col < preview.cols; ++col) {
      if (blockPosition(row, col) !== 0) {
        const boardSquare = <HTMLDivElement>(
          document.querySelector(`#preview-r${row + 1}-c${col + 1}`)
        );
        boardSquare.style.background = `#${preview.color.toString(16)}`;
        boardSquare.style.border = `1px solid black`;
      }
    }
  }
};

const drawLevel = (level: number) => {
  const levelElement = queryLevelElement();
  levelElement.textContent = `${level}`;
};
const drawScore = (score: number) => {
  const scoreElement = queryScoreElement();
  scoreElement.textContent = `${score}`;
};

const renderGame = (state: GameState) => {
  clearBoard();
  clearPreview();
  drawBoard(state.board);
  drawPreview(state.nextBlock);
  drawTetrolyso(state.currentBlock, state.currentPosition);
  drawScore(state.totalPoints);
  drawLevel(state.level);
};

document.addEventListener('DOMContentLoaded', async () => {
  const client = new Client(process.env.TETROLYSEUS_SERVER || 'ws://localhost:3000');

  const room: Room<GameState> = await client.joinOrCreate<GameState>('tetrolyseus');

  const handleInput = (ev: KeyboardEvent) => {
    if (ev.code === 'Space') {
      room.send('rotate', {});
    } else if (ev.code === 'ArrowLeft') {
      room.send('move', LEFT);
    } else if (ev.code === 'ArrowRight') {
      room.send('move', RIGHT);
    } else if (ev.code === 'ArrowDown') {
      room.send('move', DOWN);
    }
  };

  const readyModal = queryReadyModal();
  const readyButton = queryReadyButton();
  const notReadyButton = queryNotReadyButton();

  readyButton.addEventListener('click', () => room.send('ready', READY));
  notReadyButton.addEventListener('click', () => room.send('ready', NOT_READY));

  room.onStateChange((newState: GameState) => {
    if (newState.running) {
      if (!(typeof document.onkeydown === 'function')) {
        document.addEventListener('keydown', handleInput);
      }
      readyModal.style.display = 'none';
      renderGame(newState);
    } else {
      document.removeEventListener('keydown', handleInput);
    }
  });
});

const drawTetrolyso = (currentBlock: Tetrolyso, currentPosition: Position) => {
  const blockPosition = queryByRowAndColumn(currentBlock);

  for (let row = currentPosition.row; row < currentPosition.row + currentBlock.rows; ++row) {
    for (let col = currentPosition.col; col < currentPosition.col + currentBlock.cols; ++col) {
      if (blockPosition(row - currentPosition.row, col - currentPosition.col) !== 0) {
        const boardSquare = <HTMLDivElement>document.querySelector(`#cell-r${row}-c${col}`);
        boardSquare.style.background = `#${currentBlock.color.toString(16)}`;
        boardSquare.style.border = `1px solid black`;
      }
    }
  }
};

const drawBoard = (board: Board): void => {
  const boardElement = queryBoardElement();
  const elementRect = boardElement.getBoundingClientRect();
  const blockHeight = Math.floor((elementRect.height - 32) / board.rows);
  boardElement.style.gridTemplateColumns = `repeat(${board.cols}, ${blockHeight}px)`;
  boardElement.style.gridTemplateRows = `repeat(${board.rows}, ${blockHeight}px)`;
  boardElement.style.height = 'fit-content';
  boardElement.style.width = 'fit-content';

  const boardPosition = queryByRowAndColumn(board);

  for (let row = 0; row < board.rows; ++row) {
    for (let col = 0; col < board.cols; ++col) {
      const cellDiv = document.createElement('div');
      cellDiv.id = `cell-r${row}-c${col}`;
      cellDiv.style.background = `#${boardPosition(row, col).toString(16)}`;
      boardElement.append(cellDiv);
    }
  }
};
