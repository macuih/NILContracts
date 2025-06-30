*** Not updated to pseudocode ***


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract NILTransparency {

    struct NILContract {
        string sponsor;
        uint256 value;
        string description;
        uint256 timestamp;
        bool isPublic;
    }

    struct Transaction {
        uint256 amount;
        string purpose;
        uint256 timestamp;
        bool isVerified;
    }

    struct Athlete {
        address wallet;
        bool isVerified;
        NILContract[] contracts;
        Transaction[] transactions;
    }

    mapping(address => Athlete) public athletes;
    address[] public registeredAthletes;
    address public auditor;

    constructor() {
        auditor = msg.sender; // Deployer is default auditor
    }

    modifier onlyAuditor() {
        require(msg.sender == auditor, "Only auditor can verify.");
        _;
    }

    function registerAthlete(string memory _name, string memory _school) public {
        require(bytes(athletes[msg.sender].name).length == 0, "Already registered.");
        athletes[msg.sender].name = _name;
        athletes[msg.sender].school = _school;
        athletes[msg.sender].wallet = msg.sender;
        registeredAthletes.push(msg.sender);
    }

    function submitContract(string memory _sponsor, uint256 _value, string memory _description, bool _isPublic) public {
        require(bytes(athletes[msg.sender].name).length > 0, "Not registered.");
        NILContract memory newContract = NILContract(_sponsor, _value, _description, block.timestamp, _isPublic);
        athletes[msg.sender].contracts.push(newContract);
    }

    function logTransaction(uint256 _amount, string memory _purpose, bool _isVerified) public {
        require(bytes(athletes[msg.sender].name).length > 0, "Not registered.");
        Transaction memory txRecord = Transaction(_amount, _purpose, block.timestamp, _isVerified);
        athletes[msg.sender].transactions.push(txRecord);
    }

    function viewContracts(address _athlete) public view returns (NILContract[] memory) {
        if (_athlete == msg.sender) {
            return athletes[_athlete].contracts;
        }

        // Return only public contracts
        uint count = 0;
        for (uint i = 0; i < athletes[_athlete].contracts.length; i++) {
            if (athletes[_athlete].contracts[i].isPublic) {
                count++;
            }
        }

        NILContract[] memory publicContracts = new NILContract[](count);
        uint index = 0;
        for (uint i = 0; i < athletes[_athlete].contracts.length; i++) {
            if (athletes[_athlete].contracts[i].isPublic) {
                publicContracts[index++] = athletes[_athlete].contracts[i];
            }
        }

        return publicContracts;
    }

    function verifyAthlete(address _athlete) public onlyAuditor {
        athletes[_athlete].isVerified = true;
    }
}
