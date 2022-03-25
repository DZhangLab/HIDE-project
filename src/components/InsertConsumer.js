import { useState } from "react";
import { ethers } from "ethers";
import "../css/bootstrap.css";
import ConsumerRegistry from "../artifacts/contracts/ConsumerRegistry.sol/ConsumerRegistry.json";

const consumerRegistryAddress = process.env.REACT_APP_DEPLOY_ADDRESS;

const InsertConsumer = () => {
    const [did, setDid] = useState("");
    const [contractKey, setContractKey] = useState("");
    const [result, setResult] = useState("");


    // uses metamask injected browser window to make sure user has a connected account
    async function requestAccount() {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    // verify for did 
    function checkDid(inputtxt){ 

        // 6 to 30 characters which contain only characters, numeric digits and underscore and first character must be a letter.
        var passw=  /^[A-Za-z]\w{6,28}$/;
    
        if(inputtxt.match(passw)){ 
          console.log("Good did")
          return true;
        }
        else{ 
          console.log("Bad did")
          return false;
        }
      }
      // verify for contractKey
        function checkContractKey(inputtxt) {

            // 6 to 20 char which contain at least one numeric digit, one uppercase and one lowercase letter
            var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

            if(inputtxt.match(passw)) {
                console.log("Good Password")
                return true;
                }
            else{
                console.log("Bad Password")
                return false;
                }
            }
            async function insert() {
                if (!did || !contractKey)
                {
                    console.log("Insert values are empty");
                    setResult(`Insert Values are empty`);
                    return;
                }
                // ensure did meets verification
                if (!checkDid(did))
                {
                    console.log("Did is not valid");
                    setResult(`Did is not valid`);
                    return;
                }
                // ensure contractKey meets verification
                if (!checkContractKey(contractKey))
                {
                    console.log("ContractKey is not valid");
                    setResult(`ContractKey is not valid`);
                    return;
                }

                if (typeof window.ethereum != "undefined")
                {
                    await requestAccount();
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    // signer required 
                    const signer = provider.getSigner();
                    // contract instance
                    const contract = new ethers.Contract(consumerRegistryAddress, ConsumerRegistry.abi, signer);

                    // listen for emit event 
                    contract.on("LogConsumerInsert", (did, contractKey) => {
                        setResult(`Consumer inserted with DID: ${did} and ContractKey: ${contractKey}`);
                    });

                    try {
                        const transaction = await contract.insertConsumer(did, contractKey);
                        await transaction.wait();
                        console.log({ transaction });
                    }
                    catch (error) {
                        console.log("error: ", error);
                        setResult(`Error. check console`);
                    }
                }
            }
            return (
                <div className="container">
                    <header className= "App-header">
                        <h1>Insert Consumer to Consumer Registry</h1>
                        <input
                            type="text"
                            required
                            placeholder="Set DID"
                            onChange={(e) => setDid(e.target.value)}
                        />
                        <input
                            type="text"
                            required
                            placeholder="Set ContractKey"
                            onChange={(e) => setContractKey(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" onClick={insert}>
                            Insert Consumer
                        </button>
                        {result}
                    </header>
                </div>
            );
        };
    export default InsertConsumer;

            