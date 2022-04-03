import { useState } from "react";
import { ethers } from "ethers";
import "../css/bootstrap.css";
import ConsumerRegistry from "../artifacts/contracts/ConsumerRegistry.sol/ConsumerRegistry.json";


// May need to update on deployment. This is the address the contract is deployed to.\
const consumerRegistryAddress = process.env.REACT_APP_CONSUMER_ADDRESS;

const DeleteConsumer = () => {
  const [did, setDid] = useState("");
  const [result, setResult] = useState("");

  // uses metamask injected browser window to make sure consumer has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function deleteConsumer() {
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
        consumerRegistryAddress,
        ConsumerRegistry.abi,
        signer
      );

      // Listening for the emmitted event
      contract.on("EntryDeleted", (did) => {
        setResult(`Event caught. Consumer deleted with did: ${did}`);
      });

      try {
        const transaction = await contract.deleteConsumer(did); //is there a way to get return value
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
        <h2>Delete Consumer Entry</h2>
        <input
          type="text"
          required
          placeholder="Set DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={deleteConsumer}>
          Delete Entry
        </button>
        {result}
      </header>
    </div>
  );
};

export default DeleteConsumer;


