App = {
  web3Provider: null,
  contracts: {},
  url: 'http://127.0.0.1:7545',
  owner:null,
  currentAccount:null,


  init: async function () {
      return await App.initWeb3();
  },

  initWeb3: async function () {
      // Modern dapp browsers
      if (window.ethereum) {
          App.web3Provider = window.ethereum;
          try {
              // Request account access
              await window.ethereum.enable();
              return App.initContract();
          } catch (error) {
              console.error("User denied account access");
          }
      }
      // Legacy dapp browsers
      else if (window.web3) {
          App.web3Provider = window.web3.currentProvider;
          return App.initContract();
      }
      // Non-dapp browsers
      else {
          console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
      }
  },

  initContract: function () {
      $.getJSON('FarmDApp.json', function (data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract
          var FarmDAppArtifact = data;
          App.contracts.FarmDApp = TruffleContract(FarmDAppArtifact);

          // Set the provider for our contract
          App.contracts.FarmDApp.setProvider(App.web3Provider);

          // Use contract functions here or set up event listeners
         
          // Example: App.getTopCustomers();
      });
  },

  //Populate sales data

  // Function to check if the wallet is connected
 checkWalletConnection: function() {
    if (App.web3Provider.selectedAddress === null || App.web3Provider.selectedAddress === undefined) {
        // Wallet is not connected, prompt the user to connect
        console.log("Please connect your wallet.");
        
        return false;
    }
    // Wallet is connected
    console.log("Wallet connected:", App.web3Provider.selectedAddress);
    return true;
},
  
  // Function to handle earning MooCoins by interacting with the contract
  earnMooCoins:function(option) {

     // Check if the wallet is connected before proceeding
     if (!checkWalletConnection()) {
        return;
    }

    //options
    var cycledToFarm = false;
    var boughtDirectly = false;
    var returnedGlassBottle = false;

    // Update based on the selected option
    if (option === 'cycled') {
        cycledToFarm = true;
    } else if (option === 'bought') {
        boughtDirectly = true;
    } else if (option === 'returned') {
        returnedGlassBottle = true;
    }

    // Call the earnMooCoins function in the contract with selected options
    App.contracts.FarmDApp.deployed().then(function (instance) {
        return instance.earnMooCoins(cycledToFarm, boughtDirectly, returnedGlassBottle, { from: App.web3Provider.selectedAddress });
    }).then(function (result) {
        // Handle success if needed (e.g., update UI)
        console.log("MooCoins earned successfully:", result);
        // Example: Update UI to reflect MooCoins earned
    }).catch(function (err) {
        console.error("Error earning MooCoins:", err);
        // Handle error here (e.g., display a message to the user)
    });
    }

    // Function to handle UI click event for earning MooCoins
    //$('.selectBtn').click(function () {
    //   var option = $(this).closest('.card').attr('id'); // Get the ID of the clicked card
     //   earnMooCoins(option);
    //});

    // ... (other code)

    // Example function to get top customers
    // getTopCustomers: function () {
    //  App.contracts.FarmDApp.deployed().then(function (instance) {
    //      return instance.getTopCustomers();
    //  }).then(function (result) {
     //       console.log("Top Customer Addresses:", result[0]);
     //        console.log("Top MooCoins Earned:", result[1]);
     //     }).catch(function (err) {
     //        console.error("Error fetching top customers:", err);
    //    });
    // },

  // Other functions to interact with your contract can be added here
  // For example:
  // uploadDailySales: function(milkSoldToDairy, milkSoldToCustomers) { ... },
};

// Initialize the app when the window loads
//$(function () {
 // $(window).load(function () {
 //     App.init();
//      console.log('starting app.js');
//  });
//});
