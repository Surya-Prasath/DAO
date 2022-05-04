import { readFileSync } from "fs";
import { ethers, network } from "hardhat";
import { proposalFile, VOTING_PERIOD } from "../hardhat-var";
import { moveBlocks } from "../utils/move-blocks";

async function vote(proposalIndex: number) {
  const governor = await ethers.getContract("GovernorContract");

  const proposals = JSON.parse(readFileSync(proposalFile, "utf-8"));
  const chainId = await proposals[network.config.chainId!.toString()]
  
  const proposalId =
  chainId[chainId.length-proposalIndex];

  // 0 - Against, 1 - For, 2 - Abstain
  const voteWay = 1;
  const reason = "I like blockchain";
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  await voteTx.wait(1);

  if (network. name == "localhost") {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  console.log("Voted! Ready to go!");
}
const index = 1;
vote(index)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
