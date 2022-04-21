import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";

import VerifierRegistry from "../../artifacts/contracts/VerifierRegistry.sol/VerifierRegistry.json";

const verifierRegistryAddress = process.env.REACT_APP_VERIFIER_ADDRESS;

const GetVerifier = () => {
    const [did, setDid] = useState("");
    const [result, setResult] = useState("");

    async function requestAccount() {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    async function getVerifier() {
        if (!did) {
            console.log("Insert values are empty");
            setResult(`Insert Values are empty`);
            return;
        }
        if (typeof window.ethereum !== "undefined") {
            await requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // no need signer because view function
            const contract = new ethers.Contract(
                verifierRegistryAddress,
                VerifierRegistry.abi,
                provider
            );
            try {
                const data = await contract.getVerifier(did);
                setResult(`Function returned ${data}`);
            } catch (err) {
                console.log("Error: ", err);
                setResult("Error. Check console");
            }
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h2>Get Verifier with Verifier DID</h2>
                <input
                    type="text"
                    required    
                    placeholder="DID"
                    onChange={(e) => setDid(e.target.value)}
                />
                <button className="btn btn-outline-secondary" onClick={getVerifier}>
                    Get Verifier
                </button>
                {result}
            </header>
        </div>
    );
};

export default GetVerifier;