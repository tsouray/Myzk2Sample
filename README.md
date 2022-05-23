0. %cd "this project"

1. %yarn install

2. %cd frontend

3. %yarn install

4. %cd ..

5. Compile : 
   %npx hardhat compile
   >> 
   5-1:
   Replace frontend\src\abi.json from ./artifacts/contracts/Myzk2SGreeter.sol/Myzk2SGreeter.json
   You should copy the abi array and paste it into the abi.json
   Ref. :https://v2-docs.zksync.io/dev/guide/hello-world.html#front-end-integration

6. Deploy :
   %npx hardhat run --network rinkeby deploy/deploy.js

7. Copy deployed smart contract address at step 6

8. Copy address to frontend/src/App.vue。  
   const MYZK2GREETER_CONTRACT_ADDRESS = '0x3A07a1fB08a22368C511d2A7E1030B693467C242';

9. %cd frontend

10. %yarn serve

11. Open browser --> http://localhost:8080/ 
