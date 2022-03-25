//updateEntry FROM Registry.sol NOT IN THE ABI ARRAY SO THIS FUNCTION CURRENTLY CAN NOT BE CALLED

import { useState } from "react";
import { ethers } from "ethers";
import "../css/bootstrap.css";
import UserRegistry from "../artifacts/contracts/UserRegistry.sol/UserRegistry.json";

// May need to pdate on deployment. This is the address the contract is deployed to.\
const userRegistryAddress = process.env.REACT_APP_DEPLOY_ADDRESS;

const UpdateEntry = () => {
  const [did, setDid] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  // uses metamask injected browser window to make sure user has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function updateEntry() {
    // making sure input is not empty
    if (!did) {
      console.log("Insert values are empty");
      setResult(`Insert Values are empty`);
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // we need a signer because insert requires a transaction
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        userRegistryAddress,
        UserRegistry.abi,
        signer
      );

      // Listening for the emmitted event
      contract.on("EntryUpdated", (did, key) => {
        setResult(`Event caught. Updated the did: ${did} with value: ${key}`);
      });

      try {
        const transaction = await contract.updateEntry(did, key);
        await transaction.wait();
        // console.log({ transaction });
      } catch (err) {
        console.log("Error: ", err);
        setResult("Error. Check console");
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Update User Entry</h2>
        <input
          type="text"
          required
          placeholder="Set DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="New Value"
          onChange={(e) => setKey(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={updateEntry}>
          Update Entry
        </button>
        {result}
      </header>
    </div>
  );
};

export default UpdateEntry;
