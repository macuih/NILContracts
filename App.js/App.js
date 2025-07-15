// SPDX-License-Identifier: MIT
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NILContractABI from "./NILTransparencyContract.json"; // ensure ABI is here

const CONTRACT_ADDRESS = "<PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE>";

function App() {
  const [activeTab, setActiveTab] = useState("register");
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  // Inputs
  const [contractValue, setContractValue] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [txAmount, setTxAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [queryAddress, setQueryAddress] = useState("");
  const [payAddress, setPayAddress] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payPurpose, setPayPurpose] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [verifyAddress, setVerifyAddress] = useState("");

  const [contractsList, setContractsList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [athleteInfo, setAthleteInfo] = useState(null);

  useEffect(() => {
    const loadBlockchain = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, NILContractABI.abi, signer);
        const userAddress = await signer.getAddress();

        setContract(contractInstance);
        setAccount(userAddress);
      } else {
        alert("Please install MetaMask!");
      }
    };
    loadBlockchain();
  }, []);

  const handleRegister = async () => {
    try {
      const tx = await contract.registerAthlete();
      await tx.wait();
      alert("Athlete registered!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitContract = async () => {
    try {
      const value = ethers.utils.parseEther(contractValue || "0");
      const tx = await contract.submitNILContract(value, description, isPublic);
      await tx.wait();
      alert("Contract submitted!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogTransaction = async () => {
    try {
      const amount = ethers.utils.parseEther(txAmount || "0");
      const tx = await contract.logTransaction(amount, purpose);
      await tx.wait();
      alert("Transaction logged!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewContracts = async () => {
    try {
      const result = await contract.viewAthleteContracts(queryAddress);
      setContractsList(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewTransactions = async () => {
    try {
      const result = await contract.getAthleteTransactions(queryAddress);
      setTransactionsList(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayAthlete = async () => {
    try {
      const value = ethers.utils.parseEther(payAmount || "0");
      const tx = await contract.payAthlete(payAddress, payPurpose, { value });
      await tx.wait();
      alert("Payment sent!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckStatus = async () => {
    try {
      const result = await contract.getAthlete(checkAddress);
      setAthleteInfo(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyAthlete = async () => {
    try {
      const tx = await contract.verifyAthlete(verifyAddress);
      await tx.wait();
      alert("Athlete verified!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>NIL Transparency DApp</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("register")}>Register</button>
        <button onClick={() => setActiveTab("submitActivity")}>Submit Activity</button>
        <button onClick={() => setActiveTab("viewActivity")}>View Athlete Activity</button>
        <button onClick={() => setActiveTab("payAthlete")}>Pay Athlete</button>
        <button onClick={() => setActiveTab("checkStatus")}>Check Status</button>
        <button onClick={() => setActiveTab("admin")}>Admin</button>
      </div>

      {activeTab === "register" && (
        <div>
          <h2>Register as Athlete</h2>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}

      {activeTab === "submitActivity" && (
        <div>
          <h2>Submit NIL Activity</h2>
          <h3>Submit NIL Contract</h3>
          <input placeholder="Contract Value (ETH)" value={contractValue} onChange={e => setContractValue(e.target.value)} />
          <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <label>
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} /> Public?
          </label>
          <button onClick={handleSubmitContract}>Submit Contract</button>

          <h3>Log Transaction</h3>
          <input placeholder="Amount (ETH)" value={txAmount} onChange={e => setTxAmount(e.target.value)} />
          <input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} />
          <button onClick={handleLogTransaction}>Log Transaction</button>
        </div>
      )}

      {activeTab === "viewActivity" && (
        <div>
          <h2>View Athlete Activity</h2>
          <input placeholder="Athlete Address" value={queryAddress} onChange={e => setQueryAddress(e.target.value)} />
          <button onClick={handleViewContracts}>View Contracts</button>
          {contractsList.map((c, i) => (
            <div key={i}>
              <p>Value: {ethers.utils.formatEther(c.contractValue)} ETH</p>
              <p>Description: {c.description}</p>
              <p>Public: {c.isPublic ? "Yes" : "No"}</p>
            </div>
          ))}
          <button onClick={handleViewTransactions}>View Transactions</button>
          {transactionsList.map((t, i) => (
            <div key={i}>
              <p>Amount: {ethers.utils.formatEther(t.amount)} ETH</p>
              <p>Purpose: {t.purpose}</p>
              <p>From: {t.fromAddress}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "payAthlete" && (
        <div>
          <h2>Pay Athlete</h2>
          <input placeholder="Athlete Address" value={payAddress} onChange={e => setPayAddress(e.target.value)} />
          <input placeholder="Amount (ETH)" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
          <input placeholder="Purpose" value={payPurpose} onChange={e => setPayPurpose(e.target.value)} />
          <button onClick={handlePayAthlete}>Send Payment</button>
        </div>
      )}

      {activeTab === "checkStatus" && (
        <div>
          <h2>Check Athlete Status</h2>
          <input placeholder="Enter Athlete Address" value={checkAddress} onChange={e => setCheckAddress(e.target.value)} />
          <button onClick={handleCheckStatus}>Check</button>
          {athleteInfo && (
            <div>
              <p>Wallet: {athleteInfo[0]}</p>
              <p>Verified: {athleteInfo[1] ? "Yes" : "No"}</p>
              <p>Total Contracts: {athleteInfo[2].toString()}</p>
              <p>Total Transactions: {athleteInfo[3].toString()}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "admin" && (
        <div>
          <h2>Admin Tools</h2>
          <input placeholder="Athlete Address" value={verifyAddress} onChange={e => setVerifyAddress(e.target.value)} />
          <button onClick={handleVerifyAthlete}>Verify Athlete</button>
        </div>
      )}
    </div>
  );
}

export default App;
