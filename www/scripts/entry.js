// DOM Selections
const script_bundle = document.getElementById('bundle');
const script_wallet = document.getElementById('wallet');
const wallet_area   = document.getElementById('wallet_area');

// Choose Currency
$(".currency_choice").click(function() {
  let currency = '';
  switch (this.value) {
    case 'btc':
      currency = 'Bitcoin';
      loadJS(`./scripts/bundle_btc.js`);
      loadJS(`./scripts/wallet_btc.js`);
      break;
    case 'eth':
      currency = 'Ethereum';
      loadJS(`./scripts/bundle_eth.js`);
      loadJS(`./scripts/wallet_eth.js`);
      break;
    case 'bch':
      currency = 'BitcoinCash';
      loadJS(`./scripts/wallet_bch.js`);
      break;
    case 'xmr':
      currency = 'Monero';
      loadJS(`./scripts/bundle_xmr.js`);  
      loadJS(`./scripts/wallet_xmr.js`);
      break;
  }

  $('#entry')[0].style.display = 'none';
  $('#wallet_area')[0].style.display = 'block';
  $(`.fg-${this.value} input`)[0].checked = "true";
  $('#foretag')[0].innerText = `Arcane's ${currency} Wallet`;
  Array.from(document.getElementsByClassName(`fg-${this.value}`)).forEach(fg => { fg.style.display = 'block'; });
})

// Return to Currency Selection
$('#return-select').click(() => {
  Array.from(document.getElementsByClassName('form-group')).forEach(fg => { fg.style.display = 'none'; });
  $('#entry')[0].style.display = 'block';
  $('#wallet_area')[0].style.display = 'none';
  $('#output-area')[0].innerHTML = '';
})

$('#alert-msg')[0].addEventListener('click',(alert) => { alert.target.parentElement.style.display = 'none'; })