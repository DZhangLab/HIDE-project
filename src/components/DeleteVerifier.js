import { useState } from "react";
import { ethers } from "ethers";
import "../css/bootstrap.css";
import VerifierRegistry from "../artifacts/contracts/VerifierRegistry.sol/VerifierRegistry.json";

// May need to update on deployment. This is the address the contract is deployed to.
const verifierRegistryAddress = process.env.REACT_APP_VERIFIER_ADDRESS;

const DeleteVerifier = () => {
    const [did, setDid] = useState("");
    const [result, setResult] = useState("");

    // uses metamask injected browser window to make sure user has a connected account
    async function requestAccount() {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    async function deleteVerifier() {
        if (!did){
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
                verifierRegistryAddress,
                VerifierRegistry.abi,
                signer
            );

            contract.on("EntryDeleted", (did) => {
                setResult(`Event caught. Verifier deleted with did: ${did}`);
            });

            try {
                const transaction = await contract.deleteVerifier(did); //is there a way to get return value
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
                <h2>Delete Verifier Entry</h2>
                <input
                    type="text"
                    required
                    placeholder= "Enter DID"
                    onChange={(e) => setDid(e.target.value)}
                />
                <button className="btn btn-outline-secondary" onClick={deleteVerifier}>
                    Delete Entry
                </button>
                {result}
            </header>
        </div>
    );
};

export default DeleteVerifier;