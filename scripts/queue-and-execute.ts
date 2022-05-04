import { ethers, network } from "hardhat"
import { exit } from "process"
import { FUNC, MIN_DELAY, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } from "../hardhat-var";
import { moveBlocks } from "../utils/move-blocks";
import {moveTime} from "../utils/move-time"

export async function queueAndExecute(){
    const box = await ethers.getContract("Box");
    const args = [NEW_STORE_VALUE];
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);

    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));
    
    const governor = await ethers.getContract("GovernorContract");
    console.log("Queueing...");
    const queueTx = await governor["queue(address[],uint256[],bytes[],bytes32)"]([box.address], [0], [encodedFunctionCall], descriptionHash);
    await queueTx.wait(1);

    if(network.name=="localhost"){
        await moveTime(MIN_DELAY+1);
        await moveBlocks(1);
    }
    console.log("Executing...");
    const executeTx = await governor["execute(address[],uint256[],bytes[],bytes32)"]([box.address], [0], [encodedFunctionCall], descriptionHash);
    await executeTx.wait(1);
    
    const boxNewValue = await box.retrieve();
    console.log(`New Box Value ${boxNewValue.toString()}`);
    
}

queueAndExecute().then(()=>{
    exit(0)
}).catch((error)=>{
    console.error(error)
    exit(1)
})