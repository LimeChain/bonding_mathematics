let etherSuply = 0.5;
let tokenSuply = 1;
let rate = 500000;
const MAXRATE = 1000000;

let returnedEthers = 0;

function buy(etherAmount) {
    let tokensToMint = buyCalc(etherAmount);
    etherSuply += etherAmount;
    tokenSuply += tokensToMint;
    console.log(tokensToMint);
}

// PurchaseReturn = ContinuousTokenSupply * ((1 + ReserveTokensReceived / ReserveTokenBalance) ^ (ReserveRatio) - 1)
buyCalc = function buyCalc(amount) {
    return tokenSuply * ((1 + amount / etherSuply) ** (0.5) - 1)
};

// SaleReturn = ReserveTokenBalance * (1 - (1 - ContinuousTokensReceived / ContinuousTokenSupply) ^ (1 / (ReserveRatio)))
sellCalc = function sellCalc(tokenAmount) {
    return (etherSuply * (1 - (1 - tokenAmount / tokenSuply) ** (1 / (rate / MAXRATE))));
};

module.exports = {
    buyCalc,
    sellCalc
};
