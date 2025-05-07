// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HeirNodeRegistry is Ownable {
  struct Heir {
    address heirAddress;
    uint256 truthAllocation;
    uint256 vestingStart;
    uint256 vestingDuration;
    bool active;
  }

  mapping(address => Heir) public heirs;
  address[] public heirList;
  address public truthDAO;

  constructor(address _truthDAO) Ownable(msg.sender) {
    truthDAO = _truthDAO;
  }

  // Registers a new heir (e.g., JahMeliyah DeGraff, Clarke) with TRUTH allocation
  function registerHeir(address heirAddress, uint256 truthAllocation) external onlyOwner {
    require(!heirs[heirAddress].active, "Heir already registered");
    heirs[heirAddress] = Heir({
      heirAddress: heirAddress,
      truthAllocation: truthAllocation,
      vestingStart: block.timestamp,
      vestingDuration: 5 * 365 * 24 * 3600, // 5 years
      active: true
    });
    heirList.push(heirAddress);
    emit HeirRegistered(heirAddress, truthAllocation);
  }

  // Updates allocation for an existing heir (e.g., Clarke)
  function updateHeir(address heirAddress, uint256 newAllocation) external onlyOwner {
    require(heirs[heirAddress].active, "Heir not registered");
    heirs[heirAddress].truthAllocation = newAllocation;
    emit HeirUpdated(heirAddress, newAllocation);
  }

  // Allows heirs (e.g., Clarke) to claim vested TRUTH
  function claimVested(address heirAddress) external {
    Heir storage heir = heirs[heirAddress];
    require(heir.active, "Heir not registered");
    uint256 vested = calculateVested(heirAddress);
    require(vested > 0, "No vested TRUTH");
    heir.truthAllocation -= vested;
    (bool sent, ) = heirAddress.call{value: vested}("");
    require(sent, "Transfer failed");
    emit VestedClaimed(heirAddress, vested);
  }

  function calculateVested(address heirAddress) internal view returns (uint256) {
    Heir storage heir = heirs[heirAddress];
    if (block.timestamp < heir.vestingStart) return 0;
    uint256 elapsed = block.timestamp - heir.vestingStart;
    if (elapsed >= heir.vestingDuration) return heir.truthAllocation;
    return (heir.truthAllocation * elapsed) / heir.vestingDuration;
  }

  event HeirRegistered(address heirAddress, uint256 truthAllocation);
  event HeirUpdated(address heirAddress, uint256 newAllocation);
  event VestedClaimed(address heirAddress, uint256 amount);
}
