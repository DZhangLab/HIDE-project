//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Base64} from "./libraries/Base64.sol";
import {Registry} from "./Registry.sol";

/*The mapping assigs the _did (a string) to an address that we want to make sure belongs to our registry.
  Ideally the value of that address is our own blockchain's address

  The verifyDid function will first confirm the verifier_did of 
  the verifier so we know they are approved by our network,
  and then it will run the verification process
*/
contract VerifierRegistry is Registry {
    mapping(string => address) checkStringAddress;

    event passDID(string verifier_did, address _did);
    /* Event is triggered after verification,
    relevant info is supplied in event*/

    event blockDID(string verifier_did, address _did);

    /* Event is triggered after verification,
    relevant info is supplied in event*/

    function verifyDid(string memory verifier_did, string memory _did)
        internal
        returns (address sender)
    {
        string memory value;
        string memory key;
        (value, key) = Registry.getEntry(_did);

        if (
            keccak256(abi.encodePacked(value)) !=
            keccak256(abi.encodePacked(verifier_did))
        ) {
            emit blockDID(verifier_did, msg.sender);
            /* Solidity doesn't like to store strings that aren't encoded, hence the keccak
            /* This makes sure that the patient's _did is indeed in our database 
            The blockDID event is triggered if the address is not approved*/

            revert();
        }

        checkStringAddress[_did] = msg.sender;
        /* Store address of verifier in msg.sender*/

        emit passDID(verifier_did, msg.sender);
        return msg.sender;
        /* This is out desired output from this process*/
    }

    /* Base code for the Verifier Registry
    taken largely from other registries*/
    function insertVerifier(string memory _did, string memory _contractKey)
        public
        returns (uint256)
    {
        return
            Registry.insertEntry(
                Base64.encode(bytes(_did)),
                Base64.encode(bytes(_contractKey))
            );
    }

    function deleteVerifier(string memory _did) public returns (bool) {
        return Registry.deleteEntry(Base64.encode(bytes(_did)));
    }

    function getVerifier(string memory _did)
        public
        view
        returns (string memory, string memory)
    {
        return Registry.getEntry(Base64.encode(bytes(_did)));
    }
}
