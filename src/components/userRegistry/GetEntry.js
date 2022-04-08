import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";

import UserRegistry from "../../artifacts/contracts/UserRegistry.sol/UserRegistry.json";

const userRegistryAddress = process.env.REACT_APP_DEPLOY_ADDRESS;

const GetEntry = () => {
  const [did, setDid] = useState("");
  const [result, setResult] = useState("");

  // uses metamask injected browser window to make sure user has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function getEntry() {
    // making sure input is not empty
    if (!did) {
      console.log("GetEntry value for did is empty");
      setResult(`GetEntry value for did is empty`);
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // we do not need a signer because getEntry is view
      const contract = new ethers.Contract(
        userRegistryAddress,
        UserRegistry.abi,
        provider
      );
      try {
        const data = await contract.getUser(did);
        console.log({ data });
        setResult(`Retrieved Did: ${data[0]} with Key: ${data[1]}`);
      } catch (err) {
        console.log("Error: ", err);
        setResult("Error. Check console");
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Get Entry With User DID</h2>
        <input
          type="text"
          required
          placeholder="DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={getEntry}>
          Get Entry
        </button>
        {result}
      </header>
    </div>
  );
};

export default GetEntry;
