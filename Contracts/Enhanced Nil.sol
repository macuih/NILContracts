// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NILTransparencyContract {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct NILContract {
        uint256 contractValue;
        bool isPublic;
        string description;
    }

    struct Transaction {
        uint256 amount;
        string purpose;
        address fromAddress;
        bool isPublic;
    }

    struct Athlete {
        address walletAddress;
        bool isVerified;
    }

    mapping(address => Athlete) public athletes;
    mapping(address => NILContract[]) public athleteContracts;
    mapping(address => Transaction[]) public athleteTransactions;
    address[] public registeredAthletes;

    // Register an athlete
    function registerAthlete() public {
        require(athletes[msg.sender].walletAddress == address(0), "Already registered");
        athletes[msg.sender] = Athlete(msg.sender, false);
        registeredAthletes.push(msg.sender);
    }

    // Owner can verify an athlete
    function verifyAthlete(address athleteAddr) public {
        require(msg.sender == owner, "Only owner can verify");
        require(athletes[athleteAddr].walletAddress != address(0), "Athlete not registered");
        athletes[athleteAddr].isVerified = true;
    }

    // Submit a NIL contract
    function submitNILContract(uint256 value, string memory description, bool isPublic) public {
        require(athletes[msg.sender].walletAddress != address(0), "Athlete not registered");

        NILContract memory newContract = NILContract(value, isPublic, description);
        athleteContracts[msg.sender].push(newContract);
    }

    // Log a transaction to the athlete's history
    function logTransaction(uint256 amount, string memory purpose, bool isPublic) public {
        require(athletes[msg.sender].walletAddress != address(0), "Athlete not registered");

        Transaction memory txRecord = Transaction(amount, purpose, msg.sender, isPublic);
        athleteTransactions[msg.sender].push(txRecord);
    }

    // Pay an athlete and log the transaction
    function payAthlete(address payable athleteAddr, string memory purpose) public payable {
        require(athletes[athleteAddr].walletAddress != address(0), "Athlete not registered");
        require(msg.value > 0, "Payment must be greater than 0");

        Transaction memory txRecord = Transaction(msg.value, purpose, msg.sender, true);
        athleteTransactions[athleteAddr].push(txRecord);

        athleteAddr.transfer(msg.value);
    }

    // View an athlete's NIL contracts
    function viewAthleteContracts(address athlete) public view returns (NILContract[] memory) {
        if (msg.sender == athlete || msg.sender == owner) {
            return athleteContracts[athlete];
        }

        uint count;
        for (uint i = 0; i < athleteContracts[athlete].length; i++) {
            if (athleteContracts[athlete][i].isPublic) {
                count++;
            }
        }

        NILContract[] memory publicContracts = new NILContract[](count);
        uint index = 0;
        for (uint i = 0; i < athleteContracts[athlete].length; i++) {
            if (athleteContracts[athlete][i].isPublic) {
                publicContracts[index] = athleteContracts[athlete][i];
                index++;
            }
        }

        return publicContracts;
    }

    // View an athlete's transactions (respects isPublic flag)
    function getAthleteTransactions(address athlete) public view returns (Transaction[] memory) {
        if (msg.sender == athlete || msg.sender == owner) {
            return athleteTransactions[athlete];
        }

        uint count;
        for (uint i = 0; i < athleteTransactions[athlete].length; i++) {
            if (athleteTransactions[athlete][i].isPublic) {
                count++;
            }
        }

        Transaction[] memory publicTxs = new Transaction[](count);
        uint index = 0;
        for (uint i = 0; i < athleteTransactions[athlete].length; i++) {
            if (athleteTransactions[athlete][i].isPublic) {
                publicTxs[index] = athleteTransactions[athlete][i];
                index++;
            }
        }

        return publicTxs;
    }

    // View athlete details
    function getAthlete(address athleteAddr) public view returns (
        address wallet,
        bool isVerified,
        uint256 contractCount,
        uint256 transactionCount
    ) {
        Athlete memory a = athletes[athleteAddr];
        return (
            a.walletAddress,
            a.isVerified,
            athleteContracts[athleteAddr].length,
            athleteTransactions[athleteAddr].length
        );
    }

    // Return all registered athlete addresses
    function getAllAthletes() public view returns (address[] memory) {
        return registeredAthletes;
    }
}
