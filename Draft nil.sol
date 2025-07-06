// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NILTransparencyContract {
    struct NILContract {
        uint256 contractValue; // in wei, **need conversion in front end**
        string description;
        uint256 timestamp;
        bool isPublic;
    }

    struct Transaction {
        address fromAddress;
        uint256 amount;
        string purpose;
        uint256 timestamp;
    }

    struct Athlete {
        address walletAddress;
        bool isVerified;
        NILContract[] nilContracts;
        Transaction[] transactions;
    }

    mapping(address => Athlete) public athletes;
    address[] public registeredAthletes;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyRegisteredAthlete() {
        require(athletes[msg.sender].walletAddress != address(0), "Athlete not registered");
        _;
    }

    // Register an athlete
    function registerAthlete() external {
        require(athletes[msg.sender].walletAddress == address(0), "Already registered");

        Athlete storage newAthlete = athletes[msg.sender];
        newAthlete.walletAddress = msg.sender;
        newAthlete.isVerified = false;

        registeredAthletes.push(msg.sender);
    }

    // Submit NIL contract (non-payment descriptive data)
    function submitNILContract(
        uint256 contractValue,
        string calldata description,
        bool isPublic
    ) external onlyRegisteredAthlete {
        NILContract memory newContract = NILContract({
            contractValue: contractValue,
            description: description,
            timestamp: block.timestamp,
            isPublic: isPublic
        });

        athletes[msg.sender].nilContracts.push(newContract);
    }

    // Pay ETH to athlete and log transaction
    function payAthlete(address payable athleteAddress, string calldata purpose) external payable {
        Athlete storage athlete = athletes[athleteAddress];
        require(athlete.walletAddress != address(0), "Athlete not found");
        require(athlete.isVerified, "Athlete not verified");
        require(msg.value > 0, "Must send ETH");

        // Transfer ETH
        (bool sent, ) = athleteAddress.call{value: msg.value}("");
        require(sent, "Payment failed");

        Transaction memory txRecord = Transaction({
            fromAddress: msg.sender,
            amount: msg.value,
            purpose: purpose,
            timestamp: block.timestamp
        });

        athlete.transactions.push(txRecord);
    }

    // Log non-payment transaction
    function logTransaction(uint256 amount, string calldata purpose) external onlyRegisteredAthlete {
        Transaction memory txRecord = Transaction({
            fromAddress: msg.sender,
            amount: amount,
            purpose: purpose,
            timestamp: block.timestamp
        });

        athletes[msg.sender].transactions.push(txRecord);
    }
    
    // returns total number of NIL contracts fo an athlete
    function getNILContractCount(address athleteAddress) external view returns (uint256) {
        return athletes[athleteAddress].nilContracts.length;
    }

    // returns a specific NIL contract by index for that athelte
    function getNILContract(address athleteAddress, uint index) external view returns (
        uint256 contractValue,
        string memory description,
        uint256 timestamp,
        bool isPublic
    ) {
        require(index < athletes[athleteAddress].nilContracts.length, "Index out of bounds");
        NILContract memory c = athletes[athleteAddress].nilContracts[index];
        return (c.contractValue, c.description, c.timestamp, c.isPublic);
    }


    // Verify athlete (restricted to owner/auditor)
    function verifyAthlete(address athleteAddress) external onlyOwner {
        require(athletes[athleteAddress].walletAddress != address(0), "Athlete not found");
        athletes[athleteAddress].isVerified = true;
    }

    // View transactions for debugging/auditing
    function getAthleteTransactions(address athleteAddress) external view returns (Transaction[] memory) {
        require(msg.sender == athleteAddress || msg.sender == owner, "Access denied");
        return athletes[athleteAddress].transactions;
    }
}
