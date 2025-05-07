// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TruthBondNFT is ERC721 {
  uint256 public tokenId;
  address public orchestrator;
  mapping(uint256 => string) public proofCIDs;
  mapping(uint256 => string) public pillars;
  mapping(uint256 => uint256) public entropies;

  constructor(address _orchestrator) ERC721("TruthBondNFT", "TRUTH") {
    orchestrator = _orchestrator;
  }

  modifier onlyTruthOrchestrator() {
    require(msg.sender == orchestrator, "Caller not Fractal Orchestrator");
    _;
  }

  function mint(string memory pillar, string memory proofCID, uint256 entropy, uint256 tokens) external onlyTruthOrchestrator {
    tokenId++;
    _safeMint(msg.sender, tokenId);
    proofCIDs[tokenId] = proofCID;
    pillars[tokenId] = pillar;
    entropies[tokenId] = entropy;
    uint256 royalty = msg.value * 75 / 100;
    (bool sent, ) = payable(0xStPetersburg).call{value: royalty}("");
    require(sent, "Royalty failed");
    emit Minted(tokenId, pillar, proofCID, entropy, tokens);
  }

  event Minted(uint256 tokenId, string pillar, string proofCID, uint256 entropy, uint256 tokens);
}
