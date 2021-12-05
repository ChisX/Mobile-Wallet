// ------ Imports ------ //
var EthWalletAPI = require('./api');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const axios = require('axios');

// ------ Main Code ------ //
class ETHWallet {
  constructor() {
    this.api = new EthWalletAPI();
    this.url_main = "https://mainnet.infura.io/v3/4ae1a7cf65794f9dbb5222f2e10316c8";
    this.url_rinkeby = "https://rinkeby.infura.io/v3/4ae1a7cf65794f9dbb5222f2e10316c8";
    this.url_ropsten = "https://ropsten.infura.io/v3/4ae1a7cf65794f9dbb5222f2e10316c8";
    this.url_kovan = "https://kovan.infura.io/v3/4ae1a7cf65794f9dbb5222f2e10316c8";
    this.url_goerli = "https://goerli.infura.io/v3/4ae1a7cf65794f9dbb5222f2e10316c8";
    this.url = this.url_main; // Default Network is the Ethereum Mainnet
    
    // Array to hold all accounts for a user
    this.keychain = [];
  }

  ShowWallet() {
    return this.keychain[0];
  }

  SwitchNetwork(net) {
    switch(net) {
      case "main":
        this.url = this.url_main; break;
      case "rinkeby":
        this.url = this.url_rinkeby; break;
      case "ropsten":
        this.url = this.url_ropsten; break;
      case "kovan":
        this.url = this.url_kovan; break;
      case "goerli":
        this.url = this.url_goerli; break;
      default:
        console.log("Error: Network Not Supported --- Default to Mainnet");
        this.url = this.url_main;
    }
  }

  NewWallet(net="main") {
    // Switch Network if Necessary, and Establish Connection
    if (net !== "main") {this.SwitchNetwork(net);}
    let web3 = new Web3(new Web3.providers.HttpProvider(this.url));

    // Create New Account
    let Account = web3.eth.accounts.create();
    this.keychain.push(Account);
    return new Promise((resolve, reject) => {
      resolve(this.keychain);
    });
  }

  OldWallet(net="main", key=0) {
    // Switch Network if Necessary, and Establish Connection
    if (net !== "main") {this.SwitchNetwork(net);}
    let web3 = new Web3(new Web3.providers.HttpProvider(this.url));

    // Create New Account
    let Account = web3.eth.accounts.privateKeyToAccount(key);
    this.keychain.push(Account);
    return new Promise((resolve, reject) => {
      resolve(Account);
    });
  }

  // CAUTION: Returns in Wei
  AccountBalance(net="main", Address=this.keychain[0].address) {
    // Switch Network if Necessary, and Establish Connection
    if (net !== "main") {this.SwitchNetwork(net);}
    let web3 = new Web3(new Web3.providers.HttpProvider(this.url));

    // Fetch Address Balance
    let res = web3.eth.getBalance(Address);
    return res;
  }

  getCurrentGasPrices() {
    return new Promise((resolve, reject) => {
      axios.get('https://ethgasstation.info/json/ethgasAPI.json')
      .then(response => {
        resolve({
          low: response.data.safeLow / 10,
          medium: response.data.average / 10,
          high: response.data.fast / 10
        });
      }).catch(error => {
        reject(error)
      })
    })
  }

  getBalance(net="main", address) {
    // Switch Network if Necessary, and Establish Connection
    if (net !== "main") {this.SwitchNetwork(net);}
    let web3 = new Web3(new Web3.providers.HttpProvider(this.url));

    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address, async (err, result) => {
            if(err) {
                return reject(err);
            }
            resolve(web3.utils.fromWei(result, "ether"));
        });
    });
  }

  PrivateFromPublic(Address, Array=this.keychain) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i<Array.length; i++) {
        if (Array[i].address == Address) { resolve(Array[i].privateKey); }
      }
      reject("Error: Address Not Found")
    })
  }
}

module.exports = new ETHWallet();