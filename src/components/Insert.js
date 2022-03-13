import { useState } from "react";
import { ethers } from "ethers";
import "../css/bootstrap.css";
import UserRegistry from "../artifacts/contracts/UserRegistry.sol/UserRegistry.json";

// May need to pdate on deployment. This is the address the contract is deployed to.\
const userRegistryAddress = process.env.REACT_APP_DEPLOY_ADDRESS;

const Insert = () => {
  const [did, setDid] = useState("");
  const [contractKey, setContractKey] = useState("");
  const [result, setResult] = useState("");

  // uses metamask injected browser window to make sure user has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function insert() {
    // making sure input is not empty
    if (!did || !contractKey) {
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
      contract.on("EntryEvent", (did, contractKey) => {
        setResult(
          `Event caught. Transaction with did: ${did} and key: ${contractKey}`
        );
      });

      try {
        const transaction = await contract.insert(did, contractKey); //is there a way to get return value
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
        <h2>Insert User to User Regristry</h2>
        <input
          type="text"
          required
          placeholder="Set DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Set Key"
          onChange={(e) => setContractKey(e.target.value)}
        />
        <button class="btn btn-outline-secondary" onClick={insert}>
          Insert Entry
        </button>
        {result}
      </header>
    </div>
  );
};

export default Insert;
