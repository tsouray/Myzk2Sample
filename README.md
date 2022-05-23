0. %cd <this project>

1. %yarn install

2. %cd frontend

3. %yarn install

4. %cd ..

5. Compile : 
   %npx hardhat compile

6. Deploy :
   %npx hardhat run --network rinkeby deploy/deploy.js

7. Copy deployed smart contract address at step 6

8. Copy address to frontend/src/App.vue
  const MYZK2GREETER_CONTRACT_ADDRESS = '0x3A07a1fB08a22368C511d2A7E1030B693467C242';

9. %cd frontend

10. %yarn serve

11. Open browser --> http://localhost:8080/ 