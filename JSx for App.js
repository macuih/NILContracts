import React, { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>NIL Transparency DApp</h1>

      {/* Tab Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("register")}>Register</button>
        <button onClick={() => setActiveTab("submitNIL")}>Submit NIL Contract</button>
        <button onClick={() => setActiveTab("logTransaction")}>Log Transaction</button>
        <button onClick={() => setActiveTab("viewContracts")}>View Contracts</button>
        <button onClick={() => setActiveTab("payAthlete")}>Pay Athlete</button>
        <button onClick={() => setActiveTab("admin")}>Admin</button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "register" && (
          <div>
            <h2>Register as Athlete</h2>
            <button onClick={() => console.log("registerAthlete()")}>Register</button>
          </div>
        )}

        {activeTab === "submitNIL" && (
          <div>
            <h2>Submit NIL Contract</h2>
            <input placeholder="Contract Value (USD)" />
            <input placeholder="Description" />
            <label>
              <input type="checkbox" /> Public?
            </label>
            <button onClick={() => console.log("submitNILContract()")}>Submit</button>
          </div>
        )}

        {activeTab === "logTransaction" && (
          <div>
            <h2>Log Transaction</h2>
            <input placeholder="Amount (ETH)" />
            <input placeholder="Purpose" />
            <button onClick={() => console.log("logTransaction()")}>Log</button>
          </div>
        )}

        {activeTab === "viewContracts" && (
          <div>
            <h2>View Contracts</h2>
            <input placeholder="Athlete Address (optional)" />
            <button onClick={() => console.log("viewAthleteContracts()")}>View</button>
          </div>
        )}

        {activeTab === "payAthlete" && (
          <div>
            <h2>Pay Athlete</h2>
            <input placeholder="Athlete Address" />
            <input placeholder="Amount (ETH)" />
            <input placeholder="Purpose" />
            <button onClick={() => console.log("payAthlete()")}>Send</button>
          </div>
        )}

        {activeTab === "admin" && (
          <div>
            <h2>Admin Tools</h2>
            <input placeholder="Athlete Address" />
            <button onClick={() => console.log("verifyAthlete()")}>Verify</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
