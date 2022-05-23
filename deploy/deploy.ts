import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Myzk2Greeter contract`);

  // Initialize the wallet.
  const wallet = new Wallet("<your Rinkeby account private key>"); // your Rinkeby account private key

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Myzk2Greeter");

  // Deposit some funds to L2 in order to be able to perform L2 transactions.
  
  const depositAmount = ethers.utils.parseEther("0.001");
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: depositAmount,
  });
  // Wait until the deposit is processed on zkSync
  console.log(`Wait until the deposit is processed on zkSync-Goerli 2.0`);
  await depositHandle.wait();
  

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  console.log(`Deploy this contract.`);
  const storeData = 654;
  const myzk2greeterContract = await deployer.deploy(artifact, [storeData]);

  // Show the contract info.
  const contractAddress = myzk2greeterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}

