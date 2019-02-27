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

    // for (let i = 0; i < 100; i++) {
    //     await contOrgInstance.purchaseTokens({
    //         value: ethers.utils.bigNumberify(ONE_ETH)
    //     });
    //
    // }

    // await contOrgInstance.purchaseTokens({
    //     value: ethers.utils.bigNumberify(HUNDRET_ETH)
    // });


    let totalSypply = await contOrgInstance.returnTokenSupply();
    console.log("totalSypply:", totalSypply.toString());

    let etherSypply = await contOrgInstance.returnEtherBalance();
    console.log("etherSypply:", etherSypply.toString());

    let boughtTokens = await contOrgInstance.returnTokenBought();
    console.log("boughtTokens", boughtTokens.toString());

    await contOrgInstance.sellTokens(TOKENS_TO_SELL);

    let ethersToReturn = await contOrgInstance.getEthersToReturn();
    console.log(ethersToReturn.toString());

    //
    // let totalSypply = await contOrgInstance.returnTokenSupply();
    // console.log(totalSypply.toString());
    //
    // let boughtTokens = await contOrgInstance.returnTokenBought();
    // console.log(boughtTokens.toString());

    // for (let i = 0; i < 5; i++) {
    //     await contOrgInstance.purchaseTokens({
    //         value: ethers.utils.bigNumberify(ONE_ETH)
    //     });
    //
    //     // let totalSypply = await contOrgInstance.returnTokenSupply();
    //     // console.log(totalSypply.toString());
    //
    //     let boughtTokens = await contOrgInstance.returnTokenBought();
    //     console.log(boughtTokens.toString());
    // }
});




// purchase tokens
// tokenSupply * (sqrt(1 + (etherAmount/etherSupply)) - 1)

// sqrtCalculation: uint256 = self.sqrt(1 + (etherAmount/etherSupply))
// return tokenSupply * (sqrtCalculation - 1)

// sell tokens
// etherSuply * (1 - (1 - tokenAmount / tokenSuply) ^2)

// let a = (1 - tokenAmount / tokenSuply) ^2;
// let b = 1 - a;
// let c = etherSuply * b;