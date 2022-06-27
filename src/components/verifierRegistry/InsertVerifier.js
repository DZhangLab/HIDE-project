import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";
import VerifierRegistry from "../../artifacts/contracts/Registries/VerifierRegistry.sol/VerifierRegistry.json";

// May need to update on deployment. This is the address the contract is deployed to.

const verifierRegistryAddress = process.env.REACT_APP_VERIFIER_ADDRESS;
const verificationNum = process.env.REACT_APP_VERIFICATION;

const InsertVerifier = () => {
  const [did, setDid] = useState("");
  const [contractKey, setContractKey] = useState("");
  const [result, setResult] = useState("");

  // uses metamask injected browser window to make sure user has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

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

  // call to the insert method of the smart contract
  async function insert() {
    // make sure input not empty
    if (!did || !contractKey) {
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

    // Ensures the contractKey meets the verification
    if (!checkContractKey(contractKey)) {
      setResult(
        `Contract key of length ${contractKey.length} needs to be at least ${verificationNum}`
      );
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // need a signer for transaction
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        verifierRegistryAddress,
        VerifierRegistry.abi,
        signer
      );

      // listen for emmitted event
      contract.on("EntryInserted", (did, contractKey) => {
        setResult(
          `Event caught. Transaction with did: ${did} and contractKey: ${contractKey}`
        );
      });

      try {
        const transaction = await contract.insertVerifier(did, contractKey);
        await transaction.wait();
        console.log({ transaction });
      } catch (error) {
        console.log("Error: ", error);
        setResult("Error. check console");
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2> Insert Verifier to Verifier Registry </h2>
        <input
          type="text"
          required
          placeholder="Set DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Set Contract Key"
          onChange={(e) => setContractKey(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={insert}>
          Insert Verifier
        </button>
        {result}
      </header>
    </div>
  );
};

export default InsertVerifier;
