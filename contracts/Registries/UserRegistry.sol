//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Base64} from "../libraries/Base64.sol";
import {Registry} from "./Registry.sol";

import {VerifierRegistry} from "../Registries/VerifierRegistry.sol";

/**
 * @dev Contract for managing User Registries
 *
 * UserRegistry is an implementation of the Registry Contract
 * supporting get, insert and delete operations.
 *
 * The dictionary structure of the registry maps did's to
 * the DID document generation contract keys. Both variables are
 * encoded in Base64.
 */
contract UserRegistry is Registry {
  VerifierRegistry public verifierRegistry;

  /**
   * @dev Constructor initiates the values of the respective registries
   *
   * @param _verifierRegistryAddr: the address of the verifier registry deployed contract
   */
  constructor(
    address _verifierRegistryAddr
  ) {
    verifierRegistry = VerifierRegistry(_verifierRegistryAddr);
  }
  

  /**
   * @dev Get a user from the registry, given their did
   *
   * Returns a did-contractKey pair of the entry, or reverts with an error message
   */
  function getUser(string memory _did)
    public
    view
    returns (string memory did, string memory contractKey)
  {
    (did, contractKey) = Registry.getEntry(Base64.encode(bytes(_did)));

    did = string(Base64.decode(did));
    contractKey = string(Base64.decode(contractKey));
  }

  /**
   * @dev Insert a new user in the registry
   *
   * Emits the EntryInserted event
   * Reverts with an error message if entry already exists
   * Returns the updated total number of entries
   */
  function insertUser(string memory _did, string memory _contractKey)
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
   * @dev Deletes a user from the registry.
   *
   * Emits EntryDeleted event
   * Returns true if the entry was successfully deleted.
   */
  function deleteUser(string memory _did) public returns (bool) {
    return Registry.deleteEntry(Base64.encode(bytes(_did)));
  }

}
