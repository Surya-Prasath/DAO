import { ethers, network } from "hardhat";
import { FUNC, NEW_STORE_VALUE, proposalFile, PROPOSAL_DESCRIPTION, VOTING_DELAY } from "../hardhat-var";
import { moveBlocks } from "../utils/move-blocks";
import { readFileSync, writeFileSync } from "fs";

export async function proposalFunc(
  functionToCall: string,
  args: any[],
  proposalDescription: string
) {
  const box = await ethers.getContract("Box");
  const governor = await ethers.getContract("GovernorContract");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal Description: \n ${proposalDescription}`);

  const proposeTx = await governor["propose(address[],uint256[],bytes[],string)"]([box.address], [0], [encodedFunctionCall], proposalDescription);
  const proposeReceipt = await proposeTx.wait(1);

  if (network.name == "localhost") {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log(`Proposed with proposal ID: ${proposalId}`);

  let proposals = JSON.parse(readFileSync(proposalFile, "utf-8"));

  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  writeFileSync(proposalFile, JSON.stringify(proposals));
}

proposalFunc(FUNC, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
