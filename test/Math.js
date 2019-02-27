let etherSuply = 0.5;
let tokenSuply = 1; // 1.414213562373095048;
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
function buyCalc(amount) {
    return tokenSuply * ((1 + amount / etherSuply) ** (0.5) - 1)
}

function sell(tokenAmount) {
    let ethersToReturn = sellCalc(tokenAmount);
    tokenSuply -= tokenAmount;
    etherSuply -= ethersToReturn;
    console.log(ethersToReturn / 10);
    returnedEthers += ethersToReturn / 10;
}

// SaleReturn = ReserveTokenBalance * (1 - (1 - ContinuousTokensReceived / ContinuousTokenSupply) ^ (1 / (ReserveRatio)))
function sellCalc(tokenAmount) {
    return (etherSuply * (1 - (1 - tokenAmount / tokenSuply) ** (1 / (rate / MAXRATE))));
}


// console.log("buy 1 * 100");
// console.log(buyCalc(1));

console.log("buy 10 * 1");
for (let i = 0; i < 5; i++) {
    buy(1);
}

// console.log("etherSuply", etherSuply);
// console.log("tokenSuply", tokenSuply);
// //
// console.log("sell 1 * 100");
// // sell(495);
//
// console.log("buy 100 * 1");
// for (let i = 0; i < 495; i++) {
//     sell(1);
// }
// console.log("tokenSuply", tokenSuply);
// console.log("etherSuply", etherSuply);
// console.log("returnedEthers", returnedEthers);

// 2.0710678118654755
// 2.071067811865475244