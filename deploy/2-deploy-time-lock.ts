import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../hardhat-func";
import { MIN_DELAY } from "../hardhat-var";

const deployTimeLock: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  //@ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying Time Lock...");

  const TimeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
    // waitConfirmations:
  });
  log(`Deployed Time Lock to address ${TimeLock.address}`);

  if (network.name != "hardhat") {
    await verify(TimeLock.address, []);
  }
};

export default deployTimeLock;
