import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";

import ConsumerRegistry from "../../artifacts/contracts/Registries/ConsumerRegistry.sol/ConsumerRegistry.json";

const consumerRegistryAddress = process.env.REACT_APP_CONSUMER_ADDRESS;

const TotalConsumers = () => {
  const [result, setResult] = useState("");
  // uses metamask injected browser window to make sure consumer has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function getTotalEntries() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // we do not need a signer because getEntry is view
      const contract = new ethers.Contract(
        consumerRegistryAddress,
        ConsumerRegistry.abi,
        provider
      );
      try {
        const data = await contract.getTotalEntries();
        console.log({ data });
        setResult(`Total Entries: ${data}`);
      } catch (err) {
        console.log("Error: ", err);
        setResult("Error. Check console");
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Get Total Entries</h2>
        <button className="btn btn-outline-secondary" onClick={getTotalEntries}>
          Entry Count
        </button>
        {result}
      </header>
    </div>
  );
};

export default TotalConsumers;
