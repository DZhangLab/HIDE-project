import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";

import UserRegistry from "../../artifacts/contracts/Registries/UserRegistry.sol/UserRegistry.json";

const userRegistryAddress = process.env.REACT_APP_DEPLOY_ADDRESS;

const CheckUser = () => {
  const [did, setDid] = useState("");
  const [result, setResult] = useState("");
  // uses metamask injected browser window to make sure user has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function checkUser() {
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
        console.log(did);
        const data = await contract.checkUser(did);
        console.log(data);
        if (data) {
          setResult("The DID is verified");
        } else {
          setResult("The DID is not verified");
        }
      } catch (err) {
        console.log("Error: ", err);
        setResult("Error. Check console");
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Check if DID is verified</h2>
        <input
          type="text"
          required
          placeholder="DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={checkUser}>
          Verify
        </button>
        {result}
      </header>
    </div>
  );
};

export default CheckUser;
