<template>
  <div id="app" v-if="!mainLoading">
    <h1> Myzk2Greeter says: {{greeting}} 👋</h1>
    <div>
      This a simple dApp, which can choose fee token and interact with the `Myzk2Greeter` smart contract.
      
    </div>
    <div>0x3A07a1fB08a22368C511d2A7E1030B693467C242</div>

    <div class="main-box">
      <div>
        Select token: <select v-model="selectedTokenAddress" v-on:change="changeToken">
          <option v-for="token in tokens" v-bind:value="token.address" v-bind:key="token.address" >
            {{ token.symbol }}
          </option>
        </select>
      </div>
      <div class="balance" v-if="selectedToken">
        <p>Balance: <span v-if="retreivingBalance">Loading...</span>
        <span v-else>{{currentBalance}} {{selectedToken.symbol}}</span></p>
        <p>Expected fee: <span v-if="retreivingFee">Loading...</span>
        <span v-else>{{currentFee}} {{selectedToken.symbol}}</span>
        <button class="refresh-button" v-on:click="updateFee">Refresh</button>
        </p>
      </div>
      <div class="greeting-input">
        <input v-model="newGreeting" :disabled="!selectedToken || txStatus!=0" placeholder="Write new greeting here..." >

        <button class="change-button" :disabled="!selectedToken || txStatus!=0 || retreivingFee" v-on:click="changeGreeting">
          <span v-if="selectedToken && !txStatus">Change greeting</span>
          <span v-else-if="!selectedToken">Select token to pay fee first</span>
          <span v-else-if="txStatus == 1">Sending tx...</span>
          <span v-else-if="txStatus == 2">Waiting until tx is committed...</span>
          <span v-else-if="txStatus == 3">Updating the page...</span>
          <span v-else-if="retreivingFee">Updating the fee...</span>
        </button>
      </div>
      <hr size="9">
      <div class="recoding-input">
        <input v-model="deviceID" :disabled="!selectedToken || txStatus!=0" placeholder="Write Devide ID here..." >
        <input v-model="deviceValue" :disabled="!selectedToken || txStatus!=0" placeholder="Write Value here..." >

        <button class="Upload-button" :disabled="!selectedToken || txStatus!=0 || retreivingFee" v-on:click="uploadData">
          <span v-if="selectedToken && !txStatus">Upload data</span>
          <span v-else-if="!selectedToken">Select token to pay fee first</span>
          <span v-else-if="txStatus == 1">Sending tx...</span>
          <span v-else-if="txStatus == 2">Waiting until tx is committed...</span>
          <span v-else-if="txStatus == 3">Updating the page...</span>
          <span v-else-if="retreivingFee">Updating the fee...</span>
        </button>
        <h3> Device info. : {{deviceID}} ; {{deviceValue}} ; {{deviceTime}} </h3>
      </div>
    </div>
  </div>
  <div id="app" v-else>
    <div class="start-screen">
      <h1>Welcome to Myzk2Greeter dApp!</h1>
      <button v-on:click="connectMetamask">Connect Metamask</button>
    </div>
  </div>
</template>

<script>
import { Contract, Web3Provider, Provider } from "zksync-web3";
import { ethers } from "ethers";

// eslint-disable-next-line
const MYZK2GREETER_CONTRACT_ADDRESS = '0x3A07a1fB08a22368C511d2A7E1030B693467C242'; // TODO: Add smart contract address
// eslint-disable-next-line
const MYZK2GREETER_CONTRACT_ABI = require("./abi.json");  

const allowedTokens = require("./tokens.json");

export default {
  name: 'App',
  data() {
    return {
      newGreeting: 0,
      deviceID: 0,
      deviceTime: 0,
      deviceValue: 0,
      devideresult: [0,0,0],
      //newStoreData: 654,
      greeting: 654,
      //storedata: 654,
      tokens: allowedTokens,
      selectedToken: null,
      selectedTokenAddress: "",
      mainLoading: true,
      provider: null,
      signer: null,
      contract: null,
      canSubmit: true,
      // 0 stands for no status, i.e no tx has been sent
      // 1 stands for tx is beeing submitted to the operator
      // 2 stands for tx awaiting commit
      // 3 stands for updating the balance and greeting on the page
      txStatus: 0,
      retreivingFee: false,
      retreivingBalance: false,

      currentBalance: "",
      currentFee: ""
    }
  },
  methods: {
    initializeProviderAndSigner() {
        this.provider = new Provider('https://zksync2-testnet.zksync.dev');
        // Note that we still need to get the Metamask signer
        this.signer = (new Web3Provider(window.ethereum)).getSigner();

        this.contract = new Contract(
            MYZK2GREETER_CONTRACT_ADDRESS,
            MYZK2GREETER_CONTRACT_ABI,
            this.signer
        );
    },
    async getGreeting() {
        return await this.contract.get();
    },
    async getData() {
        return await this.contract.getData();
    },
    async getFee() {
        // Getting the amount of gas (ergs) needed for one transaction
        const feeInGas = await this.contract.estimateGas.set(this.newGreeting);
        // Getting the gas price per one erg. For now, it is the same for all tokens.
        const gasPriceInUnits = await this.provider.getGasPrice();

        // To display the number of tokens in the human-readable format, we need to format them,
        // e.g. if feeInGas*gasPriceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user
        return ethers.utils.formatUnits(feeInGas.mul(gasPriceInUnits), this.selectedToken.decimals);
    },
    async getBalance() {
        // Getting the balance for the signer in the selected token
        const balanceInUnits = await this.signer.getBalance(this.selectedToken.address);
        // To display the number of tokens in the human-readable format, we need to format them,
        // e.g. if balanceInUnits returns 500000000000000000 wei of ETH, we want to display 0.5 ETH the user
        return ethers.utils.formatUnits(balanceInUnits, this.selectedToken.decimals);
    },
    async changeGreeting() {
        this.txStatus = 1;
        try {
            const txHandle = await this.contract.set(this.newGreeting, {
                customData: {
                    // Passing the token to pay fee with
                    feeToken: this.selectedToken.address
                }
            });
            this.txStatus = 2;

            // Wait until the transaction is committed
            await txHandle.wait();
            this.txStatus = 3;

            // Update greeting
            console.log("call getGreeting");
            this.greeting = await this.getGreeting();
            console.log('greeting :%s', this.greeting);

            this.retreivingFee = true;
            this.retreivingBalance = true;
            // Update balance and fee
            console.log("Update Blance and fee");
            this.currentBalance = await this.getBalance();
            this.currentFee = await this.getFee();
        } catch (e) {
            alert(JSON.stringify(e));
        }

        this.txStatus = 0;
        this.retreivingFee = false;
        this.retreivingBalance = false;
    },
    async uploadData() {
        this.txStatus = 1;
        try {
            const txHandle = await this.contract.setData(this.deviceID,this.deviceValue, {
                customData: {
                    // Passing the token to pay fee with
                    feeToken: this.selectedToken.address
                }
            });
            this.txStatus = 2;

            // Wait until the transaction is committed
            await txHandle.wait();
            this.txStatus = 3;

            // Update greeting
            this.greeting = await this.getGreeting();

            // Updata Device Data
            console.log("call getData");
            this.deviceID, this.devideresult = await this.getData();
            console.log('getData : [%s][%s][%s]', this.deviceID, this.devideresult[2], this.devideresult[1]);
            this.deviceTime = this.devideresult[1];
            this.deviceValue = this.devideresult[2];

            this.retreivingFee = true;
            this.retreivingBalance = true;
            // Update balance and fee
            console.log("Update Blance and fee");
            this.currentBalance = await this.getBalance();
            this.currentFee = await this.getFee();
        } catch (e) {
            alert(JSON.stringify(e));
        }

        this.txStatus = 0;
        this.retreivingFee = false;
        this.retreivingBalance = false;
    },
    updateFee() {
      this.retreivingFee = true;
      this.getFee().then((fee) => {
        this.currentFee = fee;
      })
      .catch(e => console.log(e))
      .finally(() => {
        this.retreivingFee = false;
      });
    },
    updateBalance() {
      this.retreivngBalance = true;
      this.getBalance().then((balance) => {
        this.currentBalance = balance;
      })
      .catch(e => console.log(e))
      .finally(() => {
        this.retreivngBalance = true;
      });
    },
    changeToken() {
      this.selectedToken = this.tokens.filter(t => t.address == this.selectedTokenAddress)[0];
      this.newGreeting = this.greeting;
      this.updateFee();
      this.updateBalance();
    },
    loadMainScreen() {
      this.initializeProviderAndSigner();

      if(!this.provider || !this.signer) {
        alert("Follow the tutorial to learn how to connect to Metamask!");
        return;
      }

      this.getGreeting().then((greeting) => {
        console.log('loadMain Screen :%s',greeting);
        this.greeting = greeting ;
        this.mainLoading = false;
      });
    },  
    connectMetamask() {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          if (+window.ethereum.networkVersion == 280) {
            this.loadMainScreen();
          } else {
            alert("Please switch network to zkSync!");
          }
        })
        .catch((e) => console.log(e)); 
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

#app ul{
  display: inline-block;
}

.main-box {
  text-align: left;
  width: 400px;

  margin: auto;
  margin-top: 40px;
}

.greeting-input {
  margin-top: 20px;
}

.change-button {
  margin-left: 20px;
}

.start-screen {
  margin-top: 100px;
}

.balance {
  margin-top: 10px;
}

.refresh-button {
  margin-left: 15px;
}
</style>
