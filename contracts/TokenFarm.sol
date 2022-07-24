// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 < 0.9.0;

import "./DappToken.sol";
import "./DaiToken.sol";


// 1 Stakes Token (Deposit)
// 2 Unstake Token (WithDraw)
// 3 Issuring Token

contract TokenFarm { 
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }   

    // 1 Stakes Token (Deposit)
    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom((msg.sender), address(this), _amount);

        // updating the stacking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only if they  haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // updating the staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }


    // 3 Issuring Token
    function issueToken() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");
        
        // Issue tokens to all stakers
        for(uint i=0; i< stakers.length; i++) {
            address receipient =  stakers[i];
            uint balance = stakingBalance[receipient];
            if(balance > 0) {
                dappToken.transfer(receipient, balance);
            }
        }
    }

    // 2 Unstaking Token (WithDraw)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];
        // Require amount greater than 0
        require(balance > 0, "Staking balance cannot be 0");

        // Transfer mock dai tokens to this concept for staking
        daiToken.transfer(msg.sender, balance);

        // Reseting the stakingBalance
        stakingBalance[msg.sender] = 0;

        // updating the staking status
        isStaking[msg.sender] = false;

    }


}