import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";

import ConsumerRegistry from "../../artifacts/contracts/Registries/ConsumerRegistry.sol/ConsumerRegistry.json";

const consumerRegistryAddress = process.env.REACT_APP_CONSUMER_ADDRESS;

const GetConsumer = () => {
  const [did, setDid] = useState("");
  const [result, setResult] = useState("");

  // uses metamask injected browser window to make sure consumer has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function getConsumer() {
    // making sure input is not empty
    if (!did) {
      console.log("Insert values are empty");
      setResult(`Insert Values are empty`);
      return;
    }
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
        const data = await contract.getConsumer(did);
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
        <h2>Get Consumer Entry With Consumer DID</h2>
        <input
          type="text"
          required
          placeholder="DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={getConsumer}>
          Get Consumer
        </button>
        {result}
      </header>
    </div>
  );
};

export default GetConsumer;
