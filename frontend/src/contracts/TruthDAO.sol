// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TruthDAO {
  uint256 public proposalCount;
  mapping(address => uint256) public balances;
  address[] public recipients;
  mapping(address => uint256) public giftProposals;

  function proposeGift(address recipient, uint256 amount) external {
    require(balances[msg.sender] >= 10_000_000 * 1e18, "Insufficient TRUTH");
    proposalCount++;
    if (giftProposals[recipient] == 0) {
      recipients.push(recipient);
    }
    giftProposals[recipient] += amount;
    emit ProposalCreated(proposalCount, recipient, amount, quadraticWeight(msg.sender));
  }

  function executeGift(address recipient) external {
    require(giftProposals[recipient] > 0, "No gift proposed");
    uint256 amount = giftProposals[recipient];
    giftProposals[recipient] = 0;
    (bool sent, ) = recipient.call{value: amount}("");
    require(sent, "Gift transfer failed");
    emit GiftExecuted(recipient, amount);
  }

  function quadraticWeight(address voter) internal view returns (uint256) {
    return sqrt(balances[voter]) + (block.timestamp - 3 * 365 * 24 * 3600 > 0 ? 5 : 0);
  }

  function sqrt(uint256 x) internal pure returns (uint256) {
    uint256 z = (x + 1) / 2;
    uint256 y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
    return y;
  }

  event ProposalCreated(uint256 proposalId, address recipient, uint256 amount, uint256 weight);
  event GiftExecuted(address recipient, uint256 amount);
}
