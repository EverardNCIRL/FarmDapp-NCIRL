const FarmDApp = artifacts.require('FarmDApp');

//TEST 1//
// Test to ensure the owner can upload daily sales data
///////////////////////////////////////////////////////

contract('FarmDApp', (accounts) => {
  it('should allow the owner to upload daily sales data', async () => {
    const farmDApp = await FarmDApp.deployed();
    const milkSoldToDairy = 100;
    const milkSoldToCustomers = 150;

    //adding console logs to aid in debugging
    console.log("Starting Test 1...");
    console.log("Uploading daily sales data...");

    // Perform the upload of daily sales
    await farmDApp.uploadDailySales(milkSoldToDairy, milkSoldToCustomers);

    // Retrieve the uploaded data
    const today = Math.floor(Date.now() / 86400000); // Get today's timestamp in days
    const dailySales = await farmDApp.dailySales(today);

    //more console logs to aid debugging and flow of tests
    console.log("Retrieving uploaded data...");
    console.log("Milk sold to dairy:", dailySales.milkSoldToDairy);
    console.log("Milk sold to customers:", dailySales.milkSoldToCustomers);

    // Check if the data was correctly uploaded
    assert.equal(dailySales.milkSoldToDairy, milkSoldToDairy, 'Milk sold to dairy mismatch');
    assert.equal(dailySales.milkSoldToCustomers, milkSoldToCustomers, 'Milk sold to customers mismatch');
  });
});

//TEST 2//
// Test to verify a customer earning MooCoins for various activities
////////////////////////////////////////////////////////////////////

contract('FarmDApp', (accounts) => {
  it('should allow a customer to earn MooCoins', async () => {
    const farmDApp = await FarmDApp.deployed();
    const customer = accounts[1];

    //begin console log
    console.log("Starting Test 2...");
    console.log("Earning MooCoins...");

    // Perform activities to earn MooCoins
    await farmDApp.earnMooCoins(true, true, true, { from: customer });

    // Retrieve churn data for the customer
    const churnData = await farmDApp.customerChurn(customer);
    
    // conosole log checkpoints
    console.log("Retrieving churn data...");
    console.log("Cycled to farm:", churnData.cycledToFarm);
    console.log("Bought directly:", churnData.boughtDirectly);
    console.log("Returned glass bottle:", churnData.returnedGlassBottle);
    console.log("MooCoins earned:", churnData.moocoinsEarned);

    // Check if MooCoins were earned and activities were recorded
    assert(churnData.cycledToFarm, 'Cycled to farm not recorded');
    assert(churnData.boughtDirectly, 'Bought directly not recorded');
    assert(churnData.returnedGlassBottle, 'Returned glass bottle not recorded');
    assert(churnData.moocoinsEarned > 0, 'MooCoins not earned');
  });
});

//TEST 3//
// Test to ensure a customer is added to the array if interacting for the first time
//////////////////////////////////////////////////////////////////////////////////

contract('FarmDApp', (accounts) => {
  it('should add a customer to the array if interacting for the first time', async () => {
    const farmDApp = await FarmDApp.deployed();
    const customer = accounts[2];

    //begin console testing
    console.log("Starting Test 3...");
    console.log("Performing activity for a new customer...");

    // Perform an activity for a new customer
    await farmDApp.earnMooCoins(true, false, false, { from: customer });

    // Check if the customer is added to the array
    const customerExists = await farmDApp.customerExists(customer);

    //console log checkpoint
    console.log("Checking customer existence:", customerExists);
    assert(customerExists, 'Customer was not added to the array');
  });
});

//TEST 4//
// Test to retrieve top customers based on earned MooCoins
//////////////////////////////////////////////////////////////

// Test to retrieve top customers based on earned MooCoins

contract("FarmDApp", (accounts) => {
  let farmDAppInstance;

  before(async () => {
    farmDAppInstance = await FarmDApp.deployed();
  });

  it("should retrieve top 5 customers by MooCoins", async () => {
    // Call the function to retrieve top customers
    await farmDAppInstance.getTopCustomers();

    // Retrieve top customer addresses and MooCoins
    const topCustomerAddresses = await farmDAppInstance.fetchTopCustomers.call();

    // Log or use the retrieved data
    console.log("Top Customer Addresses:", topCustomerAddresses[0]);
    console.log("Top MooCoins:", topCustomerAddresses[1]);
  });
});



