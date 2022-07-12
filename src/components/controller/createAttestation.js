import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import RegistryController from "../../artifacts/contracts/RegistryController.sol/RegistryController.json";

// const userRegistryAddress = process.env.REACT_APP_DEPLOY_ADDRESS;
// const verificationRegistryAddress = process.env.REACT_APP_VERIFIER_ADDRESS;
// const delegateRegistryAddress = process.env.REACT_APP_DELEGATE_ADDRESS;
// const consumerRegistryAddress = process.env.REACT_APP_CONSUMER_ADDRESS;

const controllerAddress = process.env.REACT_APP_CONTROLLER_ADDRESS;

const CreateAttestation = () => {
  const [verifierDid, setVerifierDid] = useState("");
  const [userDid, setUserDid] = useState("");
  const [attesteeDid, setAttesteeDid] = useState("");
  const [result, setResult] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function attestationCreate() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // no need signer because view function
      const contract = new ethers.Contract(
        controllerAddress,
        RegistryController.abi,
        signer
      );
      try {
        console.log("here");
        const data = await contract.createAttestation(
          verifierDid,
          userDid,
          attesteeDid
        );
        setResult(`Sucessfully created attestation`);
        console.log(data);
      } catch (err) {
        console.log("Error: ", err);
        setResult("Error. Check console");
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Create Attestation</h2>
        <p>
          Currently the attestee must be in user registry. TODO: implement
          delegate registry
        </p>
        <input
          type="text"
          required
          placeholder="Verifier DID"
          onChange={(e) => setVerifierDid(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="User DID"
          onChange={(e) => setUserDid(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Attestee DID"
          onChange={(e) => setAttesteeDid(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          onClick={attestationCreate}
        >
          Create Attestation
        </button>
        {result}
      </header>
    </div>
  );
};

export default CreateAttestation;
