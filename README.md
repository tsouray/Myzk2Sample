#Prerequisites： Ref. (https://v2-docs.zksync.io/dev/guide/hello-world.html#prerequisites)
- yarn package manager. npm examples will be added soon.  
- Docker for compilation.  
- A wallet with some Görli ETH on L1 (Görli USDC is also required for the ERC-20 tutorial) to pay for bridging funds to zkSync as well as deploying smart contracts.  
-----
#Steps：

0. %cd "this project"

1. %yarn install

2. %cd frontend

3. %yarn install

4. %cd ..

5. Compile : (Before compile, turn on Docker).   
   %yarn hardhat compile
   >> 
   5-1: After compile and with no error.    
   Replace frontend\src\abi.json from ./artifacts/contracts/Myzk2SGreeter.sol/Myzk2SGreeter.json
   You should copy the abi array and paste it into the abi.json     
   Ref. :https://v2-docs.zksync.io/dev/guide/hello-world.html#front-end-integration

6. Deploy :     
   6-1. Copy your 'Account Private KEY' into deploy.js, and make sure you have enough ETH.   
   deploy.js :  const wallet = new Wallet("Your Account Private key ");        
   
   6-2.    
   %yarn hardhat deploy-zksync   
   
   6-3. output Ex:        
   ...    
   Myzk2Greeter was deployed to 0x3A07a1fB08a22368C511d2A7E1030B693467C242     
   Done in 335.97s.    

7. Copy deployed smart contract address at step (6-3)

8. Paste address into frontend/src/App.vue。  
   const MYZK2GREETER_CONTRACT_ADDRESS = '0x.. YOUR Deployed smart contract address';

9. %cd frontend

10. %yarn serve

11. Open browser --> http://localhost:8080/ 
