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

  context('with minted tokens', async function () {
    beforeEach(async function () {
      const [owner, addr1, addr2, addr3] = await ethers.getSigners();
      this.owner = owner;
      this.addr1 = addr1;
      this.addr2 = addr2;
      this.addr3 = addr3;
      await this.erc721a['safeMint(address,uint256)'](addr1.address, 1);
      await this.erc721a['safeMint(address,uint256)'](addr2.address, 4);
      await this.erc721a['safeMint(address,uint256)'](addr3.address, 5);
    });

    describe('approve', async function () {
      const tokenId = 1;

      it('sets approval for the target address', async function () {
        await this.erc721a.connect(this.addr1).approve(this.addr2.address, tokenId);
        console.log('APPROVED!!!');
        const approval = await this.erc721a.getApproved(tokenId);
        expect(approval).to.equal(this.addr2.address);
      });
    });
  });
});