//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Base64} from "../libraries/Base64.sol";
import {Registry} from "./Registry.sol";

/**
 * @dev Contract for managing Consumer Registries
 *
 * ConsumerRegistry is an implementation of the Registry Contract
 * supporting get, insert and delete operations. It additionally
 * supports an update operation.
 *
 * The dictionary structure of the registry maps did's to
 * the DID document generation contract keys. Both variables are
 * encoded in Base64.
 */
contract ConsumerRegistry is Registry {
  /**
   * @dev Get a user from the registry, given their did
   *
   * Returns a did-contractKey pair of the entry, or reverts with an error message
   */
  function getConsumer(string memory _did)
    public
    view
    returns (string memory, string memory)
  {
    string memory did;
    string memory contractKey;
    (did, contractKey) = Registry.getEntry(Base64.encode(bytes(_did)));

    did = string(Base64.decode(did));
    contractKey = string(Base64.decode(contractKey));

    return (did, contractKey);
  }

  /**
   * @dev Updates the Consumer Registry
   *
   * Emits the EntryUpdated event
   * Returns the updated key-value pair
   */
  function updateConsumer(string memory _did, string memory _contractKey)
    public
    returns (string memory, string memory)
  {
    return
      Registry.updateEntry(
        Base64.encode(bytes(_did)),
        Base64.encode(bytes(_contractKey))
      );
  }

  /**
   * @dev Insert a new user in the registry
   *
   * Emits the EntryInserted event
   * Reverts with an error message if entry already exists
   * Returns the updated total number of entries
   */
  function insertConsumer(string memory _did, string memory _contractKey)
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
  function deleteConsumer(string memory _did) public returns (bool) {
    return Registry.deleteEntry(Base64.encode(bytes(_did)));
  }
}