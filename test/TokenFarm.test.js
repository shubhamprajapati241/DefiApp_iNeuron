const { address } = require("@truffle/contract/lib/contract/properties");
const { assert } = require("chai");
const { default: web3 } = require("web3");

const TokenFarm =  artifacts.require("TokenFarm");
const DappToken =  artifacts.require("DappToken");
const DaiToken =  artifacts.require("DaiToken");


contract("TokenFarm", ([owner, investor]) => {

    let daiToken, dappToken, tokenFarm

    before(async() => {
        let daiToken = await DaiToken.new()
        let dappToken = await DappToken.new()
        let tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // Transfer app Dapp tokens to Farm ( 1 million)
        await dappToken.transfer(tokenFarm.address, "200000");

        // Send Token to Investor
        await daiToken.transfer(investor, '100', {from : owner});
    });
    
    describe('Mock DAI Token Deployment', async() => {
        it("Mock DAI Token Deployment", async() => {
            const daiToken = await DaiToken.deployed();
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token')
        })
    });
    

    describe('Dapp Token Deployment', async() => {
        it("Dapp Token Deployment", async() => {
            const dappToken = await DappToken.deployed();
            const name = await dappToken.name();
            assert.equal(name, 'Dapp Token')
        })
    });


    describe('Token form Deloyment', async() => {
        it("Token form Deloyment", async() => {
            const tokenFarm = await TokenFarm.deployed();
            const name = await tokenFarm.name();
            assert.equal(name, 'Dapp Token Farm')
        })
    });


    describe('Contract has tokens', async() => {
        it("Contract has tokens", async() => {
            const dappToken = await DappToken.deployed();
            const tokenFarm = await TokenFarm.deployed();
            const balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), '200000');
        })
    });

    describe('rewareds investors for staking mDai Tokens', async() => {
        it('rewareds investors for staking mDai Tokens', async() => {
            let result
            const daiToken = await DaiToken.deployed();
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), '100000', 'investor Mock DAI wallet balance correct before staking');

            // stack Mock DAI token
            const tokenFarm = await TokenFarm.deployed();
            await daiToken.approve(tokenFarm.address, '10000', {from : investor});
            await tokenFarm.stakeTokens('10000', {from : investor});


            // checking staking result 

            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), '0', 'investor Mock DAI wallet balance correct after staking');

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), '100000', 'Token Farm Mock DAI balance correct after staking');

            result = await tokenFarm.stakeTokens(investor);
            assert.equal(result.toString(), '100000', 'investor staking balance correct after staking');

            result = await tokenFarm.isStaking(investor);
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking');
        })
    });


    // // Issue Tokens
    // describe('Issue Tokens', async() => {
    //     // Issue Tokens
    //     const tokenFarm = await TokenFarm.deployed();
    //     const dappToken = await DappToken.deployed();
    //     await tokenFarm.issueToken({from : owner});

    //     // check balances after issurance
    //     result = await dappToken.balanceOf(investor);
    //     assert.equal(result.toString(), '1000', 'investor DApp token wallet balance correct after issuarance');

    //     // Ensure that only owner can issue tokens
    //     await tokenFarm.issueToken({from : investor}).should.be.rejected;
    // });


    // Unstaking tokens

    // describe('Unstaking Tokens', async() => {
    //         // Issue Tokens
    //         const tokenFarm = await TokenFarm.deployed();
    //         const daiToken = await DaiToken.deployed();

    //         await tokenFarm.unstakeTokens({from : investor});
    
    //         // check balances after issurance
    //         result = await daiToken.balanceOf(investor);
    //         assert.equal(result.toString(), '1000', 'investor mock DAI wallet balance correct after staking');

    //         result = await daiToken.balanceOf(tokenFarm.address);
    //         assert.equal(result.toString(), '0', 'Token form mock DAI balance correct after staking');

    //         result = await tokenFarm.stakingBalance(investor);
    //         assert.equal(result.toString(), '0', 'investor staking balance correct after staking');

    //         result = await tokenFarm.isStaking(investor);
    //         assert.equal(result.toString(), 'false', 'investor staking status correct after staking');

    //     });
})