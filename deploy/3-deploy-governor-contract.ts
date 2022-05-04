import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../hardhat-func";
import { QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD } from "../hardhat-var";


const deployGovernorContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  //@ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");

  log("Deploying Governor Contract...");
  const GovernorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE
    ],
    log: true,
    // waitConfirmations:
  });
  log(`Deployed GovernorContract to address ${GovernorContract.address}`);

  if (network.name != "hardhat") {
    await verify(GovernorContract.address, []);
  }
};

export default deployGovernorContract;
