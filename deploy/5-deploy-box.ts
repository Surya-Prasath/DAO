import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../hardhat-func";
//@ts-ignore
import {ethers} from "hardhat";


const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  //@ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying Box...");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    // waitConfirmations:
  });
  log(`Deployed Box to address ${box.address}`);

  if (network.name != "hardhat") {
    await verify(box.address, []);
  }

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContractAt("Box", box.address);

  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);
  log("Transfered Ownership of box...")

  console.log(network.name);
  
};

export default deployBox;
