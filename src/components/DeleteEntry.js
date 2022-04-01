import { useState } from "react";
import { ethers } from "ethers";
import "../css/bootstrap.css";
import UserRegistry from "../artifacts/contracts/UserRegistry.sol/UserRegistry.json";

// May need to update on deployment. This is the address the contract is deployed to.\
const userRegistryAddress = process.env.REACT_APP_DEPLOY_ADDRESS;

const DeleteEntry = () => {
  const [did, setDid] = useState("");
  const [result, setResult] = useState("");

  // uses metamask injected browser window to make sure user has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function deleteEntry() {
    // making sure input is not empty
    if (!did) {
      console.log("DeleteEntry value for did is empty");
      setResult(`DeleteEntry value for did is empty`);
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
      contract.on("EntryDeleted", (did) => {
        setResult(`Event caught. Delete with did: ${did}`);
      });

      try {
        // TODO: Solidity function should have a require or check before this event is emmitted. Can't tell if it was successful
        const transaction = await contract.deleteUser(did); //is there a way to get return value
        // of non view function?
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
        <h2>Delete User Entry</h2>
        <input
          type="text"
          required
          placeholder="Set DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={deleteEntry}>
          Delete Entry
        </button>
        {result}
      </header>
    </div>
  );
};

export default DeleteEntry;
