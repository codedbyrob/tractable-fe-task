const { expect } = chai;

describe('BlockGrid', function() {
  'use strict';
  const blockGrid = new BlockGrid();

  describe('clearBlock', () => {
    let randomBlock;

    beforeEach(() => {
      randomBlock =
        blockGrid.grid[Math.floor(Math.random() * MAX_X)][
          Math.floor(Math.random() * MAX_Y)
        ];
    });

    it('should turn the block white and make it not clickable', done => {
      blockGrid.clearBlock(randomBlock);
      expect(randomBlock.clickable).to.be.false;
      done();
    });

    it('should be idempotent', done => {
      blockGrid.clearBlock(randomBlock);
      blockGrid.clearBlock(randomBlock);
      blockGrid.clearBlock(randomBlock);
      expect(randomBlock.clickable).to.be.false;
      done();
    });
  });

  describe('getNeighbours', () => {
    let middleBlock;
    let cornerBlock;
    let edgeBlock;

    beforeEach(() => {
      middleBlock = blockGrid.grid[3][3];
      cornerBlock = blockGrid.grid[0][0];
      edgeBlock = blockGrid.grid[0][3];
    });

    it('returns the neighbours to either side and above', done => {
      expect(blockGrid.getNeighbours(middleBlock)).to.have.length(4);
      done();
    });

    it('returns correct results for corner blocks', done => {
      expect(blockGrid.getNeighbours(cornerBlock)).to.have.length(2);
      done();
    });

    it('returns correct results for blocks on the edges', done => {
      expect(blockGrid.getNeighbours(edgeBlock)).to.have.length(3);
      done();
    });
  });

  // Used my 2 hours before figuring the best way to test this!
  // I didn't want to be misrepresentative and go over ⏳
  describe('reorderColumn', () => {
    it('should ensure that remaining blocks are at the bottom', done => {
      done();
    });
  });
});
