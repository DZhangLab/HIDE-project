//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Registry} from "./Registry.sol";
import {Base64} from "../libraries/Base64.sol";

/**
 * @dev Contract for managing Verifier Registries
 *
 * VerifierRegistry is an implementation of the Registry Contract
 * supporting get, insert and delete operations.
 *
 * The dictionary structure of the registry maps verifier DIDs to
 * the DID document key. Both variables are encoded in Base64.
 */
contract VerifierRegistry is Registry {
  /**
   * @dev Get a verifier from the registry, given their did
   *
   * Returns a (DID, DID Document Key) pair of the entry,
   * or reverts with an error message
   */
  function getVerifier(string memory _did)
    public
    view
    returns (string memory did, string memory contractKey)
  {
    (did, contractKey) = Registry.getEntry(Base64.encode(bytes(_did)));

    did = string(Base64.decode(did));
    contractKey = string(Base64.decode(contractKey));
  }

  /**
   * @dev Insert a new verifier in the registry
   *
   * Emits the EntryInserted event
   * Reverts with an error message if entry already exists
   * Returns the updated total number of entries
   */
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

  /**
   * @dev Deletes a verifier from the registry.
   *
   * Emits EntryDeleted event
   * Returns true if the entry was successfully deleted.
   */
  function deleteVerifier(string memory _did) public returns (bool) {
    return Registry.deleteEntry(Base64.encode(bytes(_did)));
  }
}
