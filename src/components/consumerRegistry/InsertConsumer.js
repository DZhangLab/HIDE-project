import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";
import ConsumerRegistry from "../../artifacts/contracts/Registries/ConsumerRegistry.sol/ConsumerRegistry.json";

// May need to pdate on deployment. This is the address the contract is deployed to.\
const consumerRegistryAddress = process.env.REACT_APP_CONSUMER_ADDRESS;
const verificationNum = process.env.REACT_APP_VERIFICATION;

const InsertConsumer = () => {
  const [did, setDid] = useState("");
  const [contractKey, setContractKey] = useState("");
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);

  // uses metamask injected browser window to make sure consumer has a connected account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

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

  // call to the insert method of the smart contract
  async function insert() {
    // making sure input is not empty
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

    // Ensures the contract key meets the verification
    if (!checkContractKey(contractKey)) {
      setResult(
        `Contract key of length ${contractKey.length} needs to be at least  ${verificationNum}`
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
      contract.on("EntryInserted", (did, contractKey) => {
        setResult(
          `Event caught. Transaction with did: ${did} and key: ${contractKey}`
        );
      });

      try {
        const transaction = await contract.insertConsumer(did, contractKey); //is there a way to get return value
        // of non view function?
        await transaction.wait();
        console.log({ transaction });
      } catch (err) {
        console.log("Error: ", err);
        setResult("Error. Check console");
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Insert Consumer to Consumer Registry</h2>
        <input
          type="text"
          required
          placeholder="Set DID"
          onChange={(e) => setDid(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Set Key"
          onChange={(e) => setContractKey(e.target.value)}
        />
        <div>
          <button className="btn btn-outline-secondary" onClick={insert}>
            Insert Entry
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShow(!show)}
          >
            Show/Hide
          </button>
        </div>
        <div>
          {show ? (
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Transaction Data</h5>
                <p class="card-text">{result}</p>
              </div>
            </div>
          ) : null}
        </div>
      </header>
    </div>
  );
};

export default InsertConsumer;
