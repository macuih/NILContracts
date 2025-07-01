START NILTransparencyContract

// --- Data Structures ---

// Only the athlete's wallet address is used for privacy
DEFINE struct Athlete {
    walletAddress
    isVerified
    array of NILContracts
    array of Transactions
}

// Defines the NIL deal but does NOT transfer funds.
// Descriptive only and avoids identifying payer information.
DEFINE struct NILContract {
    contractValue (in ETH)
    description        // Generic and privacy-safe
    timestamp
    isPublic
}

// Logs actual ETH transfers to the athlete.
DEFINE struct Transaction {
    fromAddress        // Wallet only; no identifiable sponsor/school name
    amount
    purpose            // Generic purpose, e.g., “endorsement,” “speaking”
    timestamp
}

// --- Storage ---

DECLARE mapping from walletAddress to Athlete
DECLARE array of all registered athletes

// --- Core Functions ---

// Register an athlete using their wallet address
FUNCTION registerAthlete()
    IF athlete already exists at msg.sender → revert
    CREATE new Athlete:
        - walletAddress = msg.sender
        - isVerified = false
        - empty NILContracts and Transactions arrays
    STORE in mapping and append to array of athletes

// Submit NIL deal information (does NOT handle ETH transfer)
FUNCTION submitNILContract(contractValue, description, isPublic)
    REQUIRE msg.sender is a registered athlete
    CREATE new NILContract:
        - contractValue = contractValue
        - description = description
        - timestamp = block.timestamp
        - isPublic = isPublic
    APPEND NILContract to msg.sender’s NILContracts array

// Pay ETH to an athlete and log the transaction
FUNCTION payAthlete(address athleteAddress, string purpose) payable
    REQUIRE athlete exists in mapping
    REQUIRE athlete isVerified == true
    REQUIRE msg.value > 0

    TRANSFER msg.value ETH to athleteAddress

    CREATE new Transaction:
        - fromAddress = msg.sender
        - amount = msg.value
        - purpose = purpose
        - timestamp = block.timestamp

    APPEND Transaction to athletes[athleteAddress].Transactions

// Log a non-payment transaction for recordkeeping
FUNCTION logTransaction(amount, purpose)
    REQUIRE msg.sender is a registered athlete
    CREATE new Transaction:
        - fromAddress = msg.sender
        - amount = amount
        - purpose = purpose
        - timestamp = block.timestamp
    APPEND to msg.sender’s Transactions array

// View NIL contracts of any athlete with access control
FUNCTION viewAthleteContracts(address athleteAddress)
    IF msg.sender == athleteAddress THEN
        RETURN all NILContracts
    ELSE
        RETURN only NILContracts where isPublic == true

// Mark athlete as verified (for example, by school compliance office)
FUNCTION verifyAthlete(address athleteAddress)
    REQUIRE msg.sender is an authorized auditor
    REQUIRE athlete exists
    SET athletes[athleteAddress].isVerified = true

END NILTransparencyContract
