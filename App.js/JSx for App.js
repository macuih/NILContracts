import React, { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>NIL Transparency DApp</h1>

      {/* Tab Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("register")}>Register</button>
        <button onClick={() => setActiveTab("submitActivity")}>
          Submit Activity
        </button>
        <button onClick={() => setActiveTab("viewActivity")}>
          View Athlete Activity
        </button>
        <button onClick={() => setActiveTab("payAthlete")}>Pay Athlete</button>
        <button onClick={() => setActiveTab("checkStatus")}>
          Check Status
        </button>
        <button onClick={() => setActiveTab("admin")}>Admin</button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "register" && (
          <div>
            <h2>Register as Athlete</h2>
            <button onClick={() => console.log("registerAthlete()")}>
              Register
            </button>
          </div>
        )}

        {activeTab === "submitActivity" && (
          <div>
            <h2>Submit NIL Activity</h2>

            <div style={{ marginBottom: "20px" }}>
              <h3>Submit NIL Contract</h3>
              <input placeholder="Contract Value (ETH)" />
              <input placeholder="Description" />
              <label>
                <input type="checkbox" /> Public?
              </label>
              <button onClick={() => console.log("submitNILContract()")}>
                Submit Contract
              </button>
            </div>

            <div>
              <h3>Log Transaction</h3>
              <input placeholder="Amount (ETH)" />
              <input placeholder="Purpose" />
              <button onClick={() => console.log("logTransaction()")}>
                Log Transaction
              </button>
            </div>
          </div>
        )}

        {activeTab === "viewActivity" && (
          <div>
            <h2>View Athlete Activity</h2>

            <div style={{ marginBottom: "20px" }}>
              <h3>View NIL Contracts</h3>
              <input placeholder="Athlete Address" />
              <button onClick={() => console.log("viewAthleteContracts()")}>
                View Contracts
              </button>
            </div>

            <div>
              <h3>View Transactions</h3>
              <input placeholder="Athlete Address" />
              <button onClick={() => console.log("getAthleteTransactions()")}>
                View Transactions
              </button>
            </div>
          </div>
        )}

        {activeTab === "payAthlete" && (
          <div>
            <h2>Pay Athlete</h2>
            <input placeholder="Athlete Address" />
            <input placeholder="Amount (ETH)" />
            <input placeholder="Purpose" />
            <button onClick={() => console.log("payAthlete()")}>
              Send Payment
            </button>
          </div>
        )}

        {activeTab === "checkStatus" && (
          <div>
            <h2>Check Athlete Status</h2>
            <input placeholder="Enter Athlete Address" />
            <button onClick={() => console.log("getAthlete()")}>Check</button>
          </div>
        )}

        {activeTab === "admin" && (
          <div>
            <h2>Admin Tools</h2>
            <input placeholder="Athlete Address" />
            <button onClick={() => console.log("verifyAthlete()")}>
              Verify Athlete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
