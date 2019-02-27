const SQRT = require('./../contracts/Math/SQRT.json');
const ContinuousOrganisation = require('../build/ContinuousOrganisation');
const etherlime = require('etherlime');

const deployer = new etherlime.EtherlimeGanacheDeployer();
const owner = accounts[0].signer;

let sqrtContractAddress;
let contOrgInstance;

const ONE_ETH = '1000000000000000000';
const HUNDRET_ETH = '100000000000000000000';
const TOKENS_TO_SELL = "13177446878699999999";

async function deployTokensSQRT() {
    let tx = await owner.sendTransaction({
        data: SQRT.bytecode
    });

    sqrtContractAddress = (await owner.provider.getTransactionReceipt(tx.hash)).contractAddress;
}
async function deployVyperContract() {
    contOrgInstance = await deployer.deploy(ContinuousOrganisation, {}, sqrtContractAddress);
}

it.only('should ', async () => {
    await deployTokensSQRT();
    await deployVyperContract();

    await contOrgInstance.purchaseTokens({
        value: ethers.utils.bigNumberify(HUNDRET_ETH)
    });

    let totalSypply = await contOrgInstance.returnTokenSupply();
    console.log("totalSypply:", totalSypply.toString());

    let etherSypply = await contOrgInstance.returnEtherBalance();
    console.log("etherSypply:", etherSypply.toString());

    let boughtTokens = await contOrgInstance.returnTokenBought();
    console.log("boughtTokens", boughtTokens.toString());

    await contOrgInstance.sellTokens(TOKENS_TO_SELL);

    let ethersToReturn = await contOrgInstance.getEthersToReturn();
    console.log("ethersToReturn", ethersToReturn.toString());

});