// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract FarmDApp {
    address public owner;
    bool private topCustomersRetrieved;
    address[5] public topCustomerAddresses;
    uint256[5] public topMoocoins;

    // Struct to represent daily sales data
    struct DailySales {
        uint256 milkSoldToDairy;
        uint256 milkSoldToCustomers;
    }

    // Mapping to store daily sales data for each day
    mapping(uint256 => DailySales) public dailySales;

    // Struct to represent customer churn data
    struct Churn {
        bool cycledToFarm;
        bool boughtDirectly;
        bool returnedGlassBottle;
        uint256 moocoinsEarned;
    }

    // Mapping to store customer churn data
    mapping(address => Churn) public customerChurn;

    // Dynamic array to store customer addresses
    address[] public customers;

    // Event to log milk sales
    event MilkSold(address indexed farmer, uint256 milkSoldToDairy, uint256 milkSoldToCustomers, uint256 timestamp);

    // Event to log MooCoins earned by a customer
    event MooCoinsEarned(address indexed customer, uint256 moocoinsEarned, uint256 timestamp);

    // Event to log top customer information
    event TopCustomerInfo(address customerAddress, uint256 moocoinsEarned);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function for the farmer to upload daily milk sales data
    function uploadDailySales(uint256 _milkSoldToDairy, uint256 _milkSoldToCustomers) external onlyOwner {
        uint256 today = block.timestamp / 1 days;

        dailySales[today].milkSoldToDairy += _milkSoldToDairy;
        dailySales[today].milkSoldToCustomers += _milkSoldToCustomers;

        emit MilkSold(msg.sender, _milkSoldToDairy, _milkSoldToCustomers, block.timestamp);
    }

    // Function for the customer to earn MooCoins by performing activities
    function earnMooCoins(bool _cycledToFarm, bool _boughtDirectly, bool _returnedGlassBottle) external {
        Churn storage churn = customerChurn[msg.sender];

        if (_cycledToFarm) {
            churn.cycledToFarm = true;
            churn.moocoinsEarned += 5; // arbitrary value, you can adjust as needed
        }

        if (_boughtDirectly) {
            churn.boughtDirectly = true;
            churn.moocoinsEarned += 10; // arbitrary value, you can adjust as needed
        }

        if (_returnedGlassBottle) {
            churn.returnedGlassBottle = true;
            churn.moocoinsEarned += 3; // arbitrary value, you can adjust as needed
        }

        // If the customer is interacting for the first time, add their address to the customers array
        if (!customerExists(msg.sender)) {
            customers.push(msg.sender);
        }

        emit MooCoinsEarned(msg.sender, churn.moocoinsEarned, block.timestamp);
    }

    // Function to check if a customer already exists in the array
    function customerExists(address customerAddress) public view returns (bool) {
        for (uint256 i = 0; i < customers.length; i++) {
            if (customers[i] == customerAddress) {
                return true;
            }
        }
        return false;
    }

    // Function to return top 5 customers by MooCoins
    function getTopCustomers() external {
        require(customers.length >= 5, "Not enough customers to determine top 5");

        address[5] memory tempCustomerAddresses;
        uint256[5] memory tempMoocoins;

        for (uint256 i = 0; i < 5; i++) {
            uint256 maxMoocoins = 0;
            address topCustomer;

            for (uint256 j = 0; j < customers.length; j++) {
                address customerAddress = customers[j];

                if (customerChurn[customerAddress].moocoinsEarned > maxMoocoins) {
                    bool customerAlreadyAdded = false;
                    for (uint256 k = 0; k < i; k++) {
                        if (tempCustomerAddresses[k] == customerAddress) {
                            customerAlreadyAdded = true;
                            break;
                        }
                    }

                    if (!customerAlreadyAdded) {
                        maxMoocoins = customerChurn[customerAddress].moocoinsEarned;
                        topCustomer = customerAddress;
                    }
                }
            }

            tempCustomerAddresses[i] = topCustomer;
            tempMoocoins[i] = maxMoocoins;
        }

        // Store top customers in state variables
        topCustomerAddresses = tempCustomerAddresses;
        topMoocoins = tempMoocoins;

        // Emit event for each of the top customers
        for (uint256 i = 0; i < 5; i++) {
              emit TopCustomerInfo(tempCustomerAddresses[i], tempMoocoins[i]);
        }
    }

    // Function to fetch top customer information
    function fetchTopCustomers() external view returns (address[5] memory, uint256[5] memory) {
        return (topCustomerAddresses, topMoocoins);
    }
}
