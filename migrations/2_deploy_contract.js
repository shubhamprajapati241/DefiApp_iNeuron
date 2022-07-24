const TokenFarm =  artifacts.require("TokenFarm");
const DappToken =  artifacts.require("DappToken");
const DaiToken =  artifacts.require("DaiToken");

module.exports = async function (deployer, network, accounts) {

    // deploy the DAI token
    await deployer.deploy(DaiToken);
    const daiToken = await DaiToken.deployed();

    // deploy the DAPP token
    await deployer.deploy(DappToken);
    const dappToken = await DappToken.deployed();

    await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
    const tokenFarm = await TokenFarm.deployed();

    await dappToken.transfer(tokenFarm.address, '200000');

    await daiToken.transfer(accounts[1], '100000');
}   