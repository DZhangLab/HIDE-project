import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";
import ConsumerRegistry from "../../artifacts/contracts/ConsumerRegistry.sol/ConsumerRegistry.json";

const consumerRegistryAddress = process.env.REACT_APP_CONSUMER_ADDRESS;
const verificationNum = process.env.REACT_APP_VERIFICATION;

const UpdateEntry = () => {
  const [did, setDid] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  // Not necesarily needed as the did must exist already, so it will satsisfy this condition
  // verification for the did
  function checkDid(inputtxt) {
    // 6 to 30 characters which contain only characters, numeric digits and underscore and first character must be a letter.
    // var passw=  /^[A-Za-z]\w{6,28}$/;

    // greater than 24 characters
    if (inputtxt.length >= verificationNum) {
      console.log("Good did");
      return true;
    } else {
      console.log("Bad did");
      return false;
    }
  }

  // verification for the contractKey
  function checkContractKey(inputtxt) {
    //6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter
    // var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (inputtxt.length >= verificationNum) {
      console.log("Good contract key");
      return true;
    } else {
      console.log("Bad contract key");
      return false;
    }
  }

  // uses metamask injected browser window to make sure consumer has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function updateConsumer() {
    // making sure input is not empty
    if (!did) {
      console.log("Insert values are empty");
      setResult(`Insert Values are empty`);
      return;
    }

    // Ensures the did meets the verification
    if (!checkDid(did)) {
      setResult(
        `DID of length ${did.length} needs to be at least ${verificationNum}`
      );
      return;
    }

    // Ensures the contract key meets the verification
    if (!checkContractKey(key)) {
      setResult(
        `Contract key of length ${key.length} needs to be at least  ${verificationNum}`
      );
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
      contract.on("EntryUpdated", (did, key) => {
        setResult(`Event caught. Updated the did: ${did} with value: ${key}`);
      });

      try {
        const transaction = await contract.updateConsumer(did, key);
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
        <h2>Update Consumer Entry</h2>
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
        <button className="btn btn-outline-secondary" onClick={updateConsumer}>
          Update Entry
        </button>
        {result}
      </header>
    </div>
  );
};

export default UpdateEntry;
