import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";
import ConsumerRegistry from "../../artifacts/contracts/Registries/ConsumerRegistry.sol/ConsumerRegistry.json";

// May need to pdate on deployment. This is the address the contract is deployed to.\
const consumerRegistryAddress = process.env.REACT_APP_CONSUMER_ADDRESS;

const VerifyAttestationWithSig = () => {
  const [did, setDid] = useState("");
  const [attestationSig, setAttestationSig] = useState("");
  const [result, setResult] = useState("");

  // uses metamask injected browser window to make sure consumer has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call to the insert method of the smart contract
  async function verify() {
    // making sure input is not empty
    if (!did || !attestationSig) {
      console.log("Insert values are empty");
      setResult(`Insert Values are empty`);
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        consumerRegistryAddress,
        ConsumerRegistry.abi,
        provider
      );

      try {
        const data = await contract.verifyAttestationWithSig(
          did,
          attestationSig
        );
        if (data) {
          setResult(`Function returned true`);
        } else {
          setResult(`Function returned false`);
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
        <h2>Verify consumer, need to fix</h2>
        <input
          type="text"
          required
          placeholder="DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Attestation Signature"
          onChange={(e) => setAttestationSig(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={verify}>
          Verify Consumer
        </button>
        {result}
      </header>
    </div>
  );
};

export default VerifyAttestationWithSig;
