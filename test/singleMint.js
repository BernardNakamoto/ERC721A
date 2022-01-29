const { expect } = require('chai');
const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const RECEIVER_MAGIC_VALUE = '0x150b7a02';
const GAS_MAGIC_VALUE = 20000;

describe('ERC721A', function () {
  beforeEach(async function () {
    this.ERC721A = await ethers.getContractFactory('ERC721AMock');
    this.ERC721Receiver = await ethers.getContractFactory('ERC721ReceiverMock');
    this.erc721a = await this.ERC721A.deploy('Azuki', 'AZUKI');
    await this.erc721a.deployed();
  });

  context('mint', async function () {
    beforeEach(async function () {
      const [owner, addr1, addr2] = await ethers.getSigners();
      this.owner = owner;
      this.addr1 = addr1;
      this.addr2 = addr2;
      this.receiver = await this.ERC721Receiver.deploy(RECEIVER_MAGIC_VALUE);
    });

    describe('safeMint', function () {
      it('successfully mints a single token', async function () {
        const mintTx = await this.erc721a['safeMint(address,uint256)'](this.receiver.address, 1);
        await expect(mintTx).to.emit(this.erc721a, 'Transfer').withArgs(ZERO_ADDRESS, this.receiver.address, 1);
        await expect(mintTx)
          .to.emit(this.receiver, 'Received')
          .withArgs(this.owner.address, ZERO_ADDRESS, 1, '0x', GAS_MAGIC_VALUE);

        console.log(await this.erc721a.ownerOf(1));
        console.log(this.receiver.address);

        expect(await this.erc721a.ownerOf(1)).to.equal(this.receiver.address);
        // expect(await this.erc721a.ownerOf(0)).to.be.revertedWith(
        //   'VM Exception while processing transaction: reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)'
        // );
      });
    });
  });
});
