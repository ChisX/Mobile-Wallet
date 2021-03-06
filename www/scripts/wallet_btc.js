// Create New Wallet button click
$("#create-wallet").click(function() {
  $("#old-wallet").hide();
  $("#new-wallet").show();
  $("#output-area").html("");
})

// Network selection and Create button click
$("#new-wallet-form").on('submit', function(e) {
  e.preventDefault(e);
  var network = $('input[name=network]:checked').val();
  bitcoin.NewWallet(network).then(function() {
    $('#new-wallet-form')[0].reset();
    $('#new-wallet').hide();
    $('#output-area').html(generateNewWalletInfo());
  });
})

// New wallet confirmation button click
$('#output-area').on('click', '#confirm-key', function(e) {
  $('#output-area').html(generateWalletUI());
  updateBtcBalance();
})

// Handle sending of transaction
$('#output-area').on('click', '#tx-form button', function(e) {
  e.preventDefault(e);

  var amount = $('input[name="btc"]').val();
  var addr = $('input[name="addr"]').val();

  if (amount <= 0 || Number.isNaN(amount)) {
    displayAlert("danger", "Please enter valid amount!");
    return;
  }

  bitcoin.ShowBalance().then(function(balance) {
    if (amount > balance) {
      displayAlert("danger", "Not enough bitcoin in account!");
    } else {
      return bitcoin.SendBitcoin(amount, addr);
    }
  }).then(function(result) {
    if (result === undefined) {
      displayAlert("danger", "Error! Invalid Address or Amount!");
    } else {
      displayAlert("success", "Success! TX ID: " + result);
      $('#tx-form')[0].reset();
    }
  }).catch(function(err){
    displayAlert("danger", "Unable to send TX!");
    console.log(err);
    console.log(amount, addr);
  });
})

// Import Existing Wallet button click
$('#import-wallet').click(function() {
    $("#old-wallet").show();
    $("#new-wallet").hide();
    $("#output-area").html("");
})

// Private key unlock button click
$('#old-wallet-form').on('submit', function(e) {
  e.preventDefault(e);
  var key = $('input[name="cipher"]').val();

  bitcoin.NewWallet("", key).then(function(wallet) {
      if (wallet.privateKey === key) {
          $('#old-wallet-form')[0].reset();
          $('#old-wallet').hide();
          $('#output-area').html(generateWalletUI());
          updateBtcBalance();
      } else {
          displayAlert("danger", "Not a valid key, only WIF-compressed format is supported!");
      }
  }).catch(function(err) {
      displayAlert("danger", err);
  });
})

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

function generateNewWalletInfo() {
  var html = `
    <h4>Save your private key and DO NOT lose it!</h4>
    <div class='key-info'>${bitcoin.ShowWallet().privateKey}</div>
    <button id='confirm-key' type='submit' class='btn btn-warning'>Ok, got it!</button>
  `;
  return html;
}

function generateWalletUI() {
  var html = `
    <h5 id='btc-balance'>Balance: 0</h5>
    <h5>Address: ${bitcoin.ShowWallet().address}</h5>
    <h5><u>Send Transaction</u></h5>
    <form id='tx-form'>
      <div class='form-group'>
        <input type='number' min='0' step='any' name='btc' placeholder='Amount in BTC' class='form-control'>
        <input type='text' name='addr' placeholder='Recipient Address' class='form-control'>
      </div>
      <button type='submit' class='btn btn-warning'>Send Bitcoin</button>
    </form>
  `;
  return html;
}

function round(x, n) {
  let y = Math.round(x * (10**n))/(10**n);
  return y;
}

function updateBtcBalance() {
  bitcoin.ShowBalance().then(function(balance) {
    let balanceinbtc = round(balance/1000, 4);
    $('#btc-balance').html("Balance: " + balanceinbtc + " BTC");
  })
}