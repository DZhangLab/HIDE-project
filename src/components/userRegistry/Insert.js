import { useState } from "react";
import { ethers } from "ethers";
import "../../css/bootstrap.css";
import QRCodeNew from "./qrcodeNew";
import UserRegistry from "../../artifacts/contracts/Registries/UserRegistry.sol/UserRegistry.json";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

// May need to pdate on deployment. This is the address the contract is deployed to.\
const userRegistryAddress = process.env.REACT_APP_DEPLOY_ADDRESS;
const verificationNum = process.env.REACT_APP_VERIFICATION;

const client = create("https://ipfs.infura.io:5001/api/v0");

const Insert = () => {
  const [did, setDid] = useState("");
  const [submit, setSubmit] = useState("");
  const [contractKey, setContractKey] = useState("");
  const [result, setResult] = useState("");
  const [show, setShow] = useState(false);
  const [src, setSrc] = useState("");
  const [url, setUrl] = useState("");

  // uses metamask injected browser window to make sure user has a connected account
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

  function createAndSetDID() {
    let date = new Date();
    let formatted =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      "T" +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      "Z";

    let data = {
      "@context": "https://www.w3.org/ns/did/v1",
      id: `did:hide${userRegistryAddress}`,
      verifcationMethod: [
        {
          id: `did:hide${userRegistryAddress}#controller`,
          type: "EcdsaSecp256k1RecoveryMethod2020",
          controller: `did:hide${userRegistryAddress}`,
          blockchainAccountId: `${userRegistryAddress}@eip155:1`,
        },
      ],
      created: `${formatted}`,
      updated: `${formatted}`,
      deactivated: false,
      authentication: [`did:hide${userRegistryAddress}#controller`],
    };

    console.log("here1");
    return data;
  }

  const handleSubmit = async () => {
    let jsonDID = createAndSetDID();
    console.log(jsonDID);
    try {
      const buf = Buffer.from(JSON.stringify(jsonDID), "utf8");
      const created = await client.add(buf);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setUrl(url);
    } catch (error) {
      console.log(error.message);
    }
  };

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
        userRegistryAddress,
        UserRegistry.abi,
        signer
      );

      // Listening for the emmitted event
      contract.on("EntryInserted", (did, contractKey) => {
        setResult(
          `Event caught. Transaction with did: ${did} and key: ${contractKey}`
        );
      });

      try {
        const transaction = await contract.insertUser(did, contractKey);
        await transaction.wait();
        setSubmit(did);
        //creating json object and ipfs url
        handleSubmit();
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
        <h2>Insert User to User Regristry</h2>
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
                <QRCodeNew text={submit} />
              </div>
              <div>{url}</div>
            </div>
          ) : null}
        </div>
      </header>
    </div>
  );
};

export default Insert;
