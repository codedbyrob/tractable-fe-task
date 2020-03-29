'use strict';

const COLOURS = ['#ff7e1c', '#ffce00', '#66c9ff', '#ff82c6'];
const MAX_X = 10;
const MAX_Y = 10;

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    this.clickable = true;
  }

  setColour(colour) {
    this.colour = colour;
  }

  setClickable(clickable) {
    this.clickable = clickable;
  }
}

class BlockGrid {
  constructor() {
    this.grid = [];
    this.blocksFlaggedForRemoval = [];

    for (let x = 0; x < MAX_X; x++) {
      const col = [];
      for (let y = 0; y < MAX_Y; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  redrawBlock(blockEl, block) {
    const { x, y, colour } = block;
    const id = `block_${x}x${y}`;

    blockEl.id = id;
    blockEl.className = 'block';
    blockEl.style.background = block.colour;
  }

  /**
   * Gets all neighbours of a block
   *
   * @param Block
   * @returns {Array<Block>}
   */
  getNeighbours(block) {
    if (this.isCornerBlock(block)) {
      return this.getNeighbourBlocksFromCorner(block);
    } else if (this.isEdgeBlock(block)) {
      return this.getNeighbourBlocksFromEdge(block);
    } else {
      return this.getNeighbourBlocksFromCenter(block);
    }
  }

  /**
   * Recursively gets blocks of the same colour as their neighbour,
   * ignoring blocks already checked
   *
   * @param Block
   */
  getSameColourNeighbours(block) {
    const neighbours = this.getNeighbours(block);

    const sameColourNeighbours = neighbours.filter(
      neighbour => neighbour.colour === block.colour
    );

    sameColourNeighbours.map(neighbour => {
      const alreadyFlagged = this.blocksFlaggedForRemoval.find(
        block => block.x === neighbour.x && block.y === neighbour.y
      );

      if (!alreadyFlagged) {
        this.blocksFlaggedForRemoval.push(neighbour);
        this.getSameColourNeighbours(neighbour);
      }
    });
  }

  /**
   *
   * @param Block
   * @returns {boolean} Whether the block is in a corner of the grid
   */
  isCornerBlock({ x, y }) {
    return (x === 0 || x === MAX_X - 1) && (y === 0 || y === MAX_Y - 1);
  }

  /**
   *
   * @param Block
   * @returns {boolean} Whether the block is on an edge of the grid
   */
  isEdgeBlock({ x, y }) {
    return x === 0 || x === MAX_X - 1 || y === 0 || y === MAX_Y - 1;
  }

  /**
   * Gets all neighbours of a block which is in a corner of the grid
   *
   * @param Block
   * @returns {Array<Block>}
   */
  getNeighbourBlocksFromCorner({ x, y }) {
    const BLOCK_IS_BOTTOM_LEFT = x === 0 && y === 0;
    const BLOCK_IS_TOP_LEFT = x === 0 && y === MAX_Y - 1;
    const BLOCK_IS_BOTTOM_RIGHT = x === MAX_X - 1 && y === 0;
    const BLOCK_IS_TOP_RIGHT = x === MAX_X - 1 && y === MAX_Y - 1;
    let neighbourBlocks = [];

    if (BLOCK_IS_BOTTOM_LEFT) {
      // Push top neighbour and right neighbour
      neighbourBlocks.push(this.grid[x][y + 1]);
      neighbourBlocks.push(this.grid[x + 1][y]);
    } else if (BLOCK_IS_TOP_LEFT) {
      // Push right neighbour and bottom neighbour
      neighbourBlocks.push(this.grid[x + 1][y]);
      neighbourBlocks.push(this.grid[x][y - 1]);
    } else if (BLOCK_IS_BOTTOM_RIGHT) {
      // Push left neighbour and top neighbour
      neighbourBlocks.push(this.grid[x - 1][y]);
      neighbourBlocks.push(this.grid[x][y + 1]);
    } else if (BLOCK_IS_TOP_RIGHT) {
      // Push bottom neighbour and left neighbour
      neighbourBlocks.push(this.grid[x][y - 1]);
      neighbourBlocks.push(this.grid[x - 1][y]);
    }

    return neighbourBlocks;
  }

  /**
   * Gets all neighbours of a block which is on an edge of the grid
   *
   * @param Block
   * @returns {Array<Block>}
   */
  getNeighbourBlocksFromEdge({ x, y }) {
    const IS_LEFT_EDGE = x === 0;
    const IS_RIGHT_EDGE = x === MAX_X - 1;
    const IS_BOTTOM_EDGE = y === 0;
    const IS_TOP_EDGE = y === MAX_X - 1;
    let neighbourBlocks = [];

    if (IS_LEFT_EDGE) {
      // Push top, right & bottom neighbour
      neighbourBlocks.push(this.grid[x][y + 1]);
      neighbourBlocks.push(this.grid[x + 1][y]);
      neighbourBlocks.push(this.grid[x][y - 1]);
    } else if (IS_RIGHT_EDGE) {
      // Push top, bottom & left neighbour
      neighbourBlocks.push(this.grid[x][y + 1]);
      neighbourBlocks.push(this.grid[x][y - 1]);
      neighbourBlocks.push(this.grid[x - 1][y]);
    } else if (IS_BOTTOM_EDGE) {
      // Push top, right & left neighbour
      neighbourBlocks.push(this.grid[x][y + 1]);
      neighbourBlocks.push(this.grid[x + 1][y]);
      neighbourBlocks.push(this.grid[x - 1][y]);
    } else if (IS_TOP_EDGE) {
      // Push right, bottom & left neighbour
      neighbourBlocks.push(this.grid[x + 1][y]);
      neighbourBlocks.push(this.grid[x][y - 1]);
      neighbourBlocks.push(this.grid[x - 1][y]);
    }

    return neighbourBlocks;
  }

  /**
   * Gets all neighbours of a block which is anywhere in the middle
   * of the grid (e.g. not in a corner or on an edge)
   *
   * @param Block
   * @returns {Array<Block>}
   */
  getNeighbourBlocksFromCenter({ x, y }) {
    const BLOCK_ABOVE = this.grid[x][y + 1];
    const BLOCK_RIGHT = this.grid[x + 1][y];
    const BLOCK_BELOW = this.grid[x][y - 1];
    const BLOCK_LEFT = this.grid[x - 1][y];

    return [BLOCK_ABOVE, BLOCK_RIGHT, BLOCK_BELOW, BLOCK_LEFT];
  }

  /**
   * Triggers the removal of blocks and redrawing of the grid
   * if the appropriate conditions are met
   *
   * @param Block
   */
  blockClicked(block) {
    this.blocksFlaggedForRemoval = [];
    this.getSameColourNeighbours(block);

    this.blocksFlaggedForRemoval.map(block => this.clearBlock(block));

    this.reorderColumn();
    this.render();
  }

  clearBlock(block) {
    block.setColour('white');
    block.setClickable(false);
  }

  /**
   * Shifts the removed blocks to the top of their respesctive columns
   */
  reorderColumn() {
    // Get an array of unique column numbers affected
    const affectedColumns = [
      ...new Set(this.blocksFlaggedForRemoval.map(block => block.x))
    ];

    let reorderedColumn;

    affectedColumns.forEach(column => {
      // Split the column into 2 arrays; remaining blocks and removed blocks
      const [remainingBlocks, removedBlocks] = this.grid[column].reduce(
        (result, block) => {
          result[block.clickable ? 0 : 1].push(block);
          return result;
        },
        [[], []]
      );

      // Move remaining blocks to start of array
      reorderedColumn = [...remainingBlocks, ...removedBlocks];

      // Set the y coordinate for each block, accounting for new order
      reorderedColumn.map((block, i) => (block.y = i));

      // Replace old column with new
      this.grid[column] = reorderedColumn;
    });
  }

  render(grid = document.querySelector('#gridEl')) {
    const restartButton = document.getElementById('js-restart-game');
    let el = grid.cloneNode(false);
    grid.parentNode.replaceChild(el, grid);
    for (let x = 0; x < MAX_X; x++) {
      const id = 'col_' + x;
      const colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y--) {
        const block = this.grid[x][y];
        const blockEl = document.createElement('div');

        if (block.clickable) {
          blockEl.addEventListener('click', () => this.blockClicked(block));
        }

        colEl.appendChild(blockEl);
        this.redrawBlock(blockEl, block);
      }
    }

    restartButton.addEventListener('click', () => {
      this.constructor();
      this.render();
    });

    return this;
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
