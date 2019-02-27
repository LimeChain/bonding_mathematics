const SQRT = require('./../contracts/Math/SQRT.json');
const BondingMathematics = require('../build/BondingMathematics');
const etherlime = require('etherlime');
const math = require('./mathematics.js');

const deployer = new etherlime.EtherlimeGanacheDeployer();
const owner = accounts[0].signer;

let sqrtContractAddress;
let bondingMathematicsInstance;

const ONE_ETH = '1000000000000000000';
const FIVE_HUNDRET_ETH = '5000000000000000000000';

async function deployTokensSQRT() {
    let tx = await owner.sendTransaction({
        data: SQRT.bytecode
    });

    sqrtContractAddress = (await owner.provider.getTransactionReceipt(tx.hash)).contractAddress;
}
async function deployVyperContract() {
    bondingMathematicsInstance = await deployer.deploy(BondingMathematics, {}, sqrtContractAddress);
}

describe('Testing Bonding Mathematics', () => {

    beforeEach(async () => {
        await deployTokensSQRT();
        await deployVyperContract();
    });

    describe('Testing deployed contracts', () => {
        it('should deploy SQRT.vy correctly', function () {
            assert.isAddress(sqrtContractAddress);
        });

        it('should deploy BondingMathematics correctly', function () {
            assert.isAddress(bondingMathematicsInstance.contractAddress);
        });
    });

    describe('Testing buying tokens', () => {

        it('should buy exact amount tokens for one ether', async () => {
            await bondingMathematicsInstance.purchaseTokens({
                value: ethers.utils.bigNumberify(ONE_ETH)
            });

            let boughtTokens = await bondingMathematicsInstance.returnTokenBought();
            let expectedTokens = math.buyCalc(1);

            console.log(`${boughtTokens} should be ~ eq to ${expectedTokens}`)
        });

        it('should buy exact amount tokens for ten thousand ethers', async () => {
            await bondingMathematicsInstance.purchaseTokens({
                value: ethers.utils.bigNumberify(FIVE_HUNDRET_ETH)
            });

            let boughtTokens = await bondingMathematicsInstance.returnTokenBought();
            let expectedTokens = math.buyCalc(10000);

            console.log(`${boughtTokens} should be ~ eq to ${expectedTokens}`)
        });

        it('buying tokens for 10 ethers, ether by ether should be eq to buying for 10 ether at once', async () => {
            for (let i = 0; i < 10; i++) {
                await bondingMathematicsInstance.purchaseTokens({
                    value: ethers.utils.bigNumberify(ONE_ETH)
                });
            }

            let boughtTokens = await bondingMathematicsInstance.returnTokenBought();
            let expectedTokens = math.buyCalc(10);

            console.log(`${boughtTokens} should be ~ eq to ${expectedTokens}`)
        });
    });

    describe('Testing selling tokens', () => {

        it('should sell tokens bought for one eth and receive ~ 1 eth', async () => {
            await bondingMathematicsInstance.purchaseTokens({
                value: ethers.utils.bigNumberify(ONE_ETH)
            });

            let boughtTokens = await bondingMathematicsInstance.returnTokenBought();

            await bondingMathematicsInstance.sellTokens(boughtTokens);

            let ethersToReturn = await bondingMathematicsInstance.getEthersToReturn();

            console.log(`${ethersToReturn.toString()} should be ~ eq to ${ONE_ETH}`)
        });

        it('should sell tokens bought for ten thousand eth and receive ~ 10 000 eth', async () => {
            await bondingMathematicsInstance.purchaseTokens({
                value: ethers.utils.bigNumberify(FIVE_HUNDRET_ETH)
            });

            let boughtTokens = await bondingMathematicsInstance.returnTokenBought();

            await bondingMathematicsInstance.sellTokens(boughtTokens);

            let ethersToReturn = await bondingMathematicsInstance.getEthersToReturn();

            console.log(`${ethersToReturn.toString()} should be ~ eq to ${FIVE_HUNDRET_ETH}`)
        });
    });
});

