// DOM Selections
const input = document.getElementById('WalletName');

// Inits
const SATperBCH = 10**8; let wlt; var db;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || 
window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || 
window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || 
window.webkitIDBKeyRange || window.msIDBKeyRange
if (!window.indexedDB) {window.alert("Your browser doesn't support a stable version of IndexedDB.")}
var request = window.indexedDB.open("bchtest", 30);
request.onerror = function(event) {console.log("error");};
request.onsuccess = function(event) { db = request.result; };

// Create New Wallet button click
$("#create-wallet").click(function() {
  $("#old-wallet").hide();
  $("#new-wallet").show();
  $("#output-area").html("");
})

// Import Existing Wallet button click
$('#import-wallet').click(function() {
  $("#old-wallet").show();
  $("#new-wallet").hide();
  $("#output-area").html("");
})

// Create Button Click
$("#new-wallet-form").on('submit', function(e) {
  e.preventDefault(e);
  MakeBCHWallet(input.value).then(function(wallet) {
    $('#new-wallet-form')[0].reset();
    $('#new-wallet').hide();
    $('#output-area').html(generateNewWalletInfo(wallet));
  });
})

// Label unlock button click
$('#old-wallet-form').on('submit', function(e) {
  e.preventDefault();
  var key = $('input[name="label"]').val();

  MakeBCHWallet(key).then(function(wallet) {
    $('#old-wallet-form')[0].reset();
    $('#old-wallet').hide();
    $('#output-area').html(generateWalletUI(wallet));
    document.getElementById('sendBCHButton').addEventListener('click',SendBCH);
  }).catch(function(err) { displayAlert("danger", err); });
})

async function MakeBCHWallet(inp) {
  wlt = await Wallet.named(inp);
  const addr = wlt.cashaddr;
  const priv = wlt.privateKeyWif;
  const bal  = await wlt.getBalance('bch')

  let result = {
    "Label": inp,
    "PrivateKey": priv,
    "Address": addr,
    "Balance": bal
  };
  return result;
}

async function SendBCH() {
  const InpNumb = document.getElementById('AmountSent');
  const InpAddr = document.getElementById('AddressSent');
  const Numb = await parseFloat(InpNumb.value);
  const Addr = await InpAddr.value;
  wlt.send([[Addr, Numb, 'BCH'],])
    .then((txData) => displayAlert('success','Transaction Succeeded ['+`${txData.txId}`+']'))
    .catch((err) => displayAlert('danger',err));
}

//==============================
// Helper Functions
//==============================

function displayAlert(type, msg) {
  var alert = `
    <div class='alert alert-dismissible alert-${type}'>
      <p>${msg}</p>
      <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    </div>
  `;
  $('#alert-msg').append(alert);
}

function generateNewWalletInfo(wallet) {
  // New wallet confirmation button click
  $('#output-area').on('click', '#confirm-key', function(e) {
    $('#output-area').html(generateWalletUI(wallet));
    document.getElementById('sendBCHButton').addEventListener('click',SendBCH);
    updateBchBalance(wallet);
  })

  return `
    <h4>Save your private key and DO NOT lose it!</h4>
    <div class='key-info'>${wallet.PrivateKey}</div>
    <button id='confirm-key' type='submit' class='btn btn-warning'>Ok, got it!</button>
  `;
}

function generateWalletUI(wallet) {
  var html = `
    <h5 id='bch-balance'>Balance: 0 BCH</h5>
    <h5>Address: ${wallet.Address.slice(12)}</h5>
    <h5><u>Send Transaction</u></h5>
    <form id='tx-form'>
      <div class='form-group'>
        <input type='number' min='0' step='any' name='bch' placeholder='Amount in BCH' class='form-control' id='AmountSent'>
        <input type='text' name='addr' placeholder='Recipient Address' class='form-control' id='AddressSent'>
      </div>
      <button type="button" id="sendBCHButton" class='btn btn-warning'>Send Bitcoin Cash</button>
    </form>
  `;
  return html;
}

function updateBchBalance(wallet) {
  $('#bch-balance').html("Balance: " + wallet.Balance + " BCH");
}