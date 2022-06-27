//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ConsumerRegistry} from "../Registries/ConsumerRegistry.sol";
import {UserRegistry} from "../Registries/UserRegistry.sol";
import {VerifierRegistry} from "../Registries/VerifierRegistry.sol";
import {DelegateRegistry} from "../Registries/DelegateRegistry.sol";

import {Base64} from "../libraries/Base64.sol";

library RoleCheck {
  /**
   * @dev Checks if a did exists in any of the four registries
   * Emits an event if it exists in any of the registries.
   *
   */

  enum Role {
    USER,
    DELEGATE,
    CONSUMER,
    VERIFIER
  }

  function verifyRole(
    string memory _did,
    UserRegistry ur,
    ConsumerRegistry cr,
    VerifierRegistry vr,
    DelegateRegistry dr
  ) public view returns (Role) {
    if (ur.verifyEntry(Base64.encode(bytes(_did)))) {
      return Role.USER;
    } else if (cr.verifyEntry(Base64.encode(bytes(_did)))) {
      return Role.CONSUMER;
    } else if (vr.verifyEntry(Base64.encode(bytes(_did)))) {
      return Role.VERIFIER;
    } else if (dr.verifyEntry(Base64.encode(bytes(_did)))) {
      return Role.DELEGATE;
    } else {
      revert("The did exists in no registry");
    }
  }

  function verifyVerifier(string memory _did, VerifierRegistry vr) public view returns (bool){
    return (vr.verifyEntry(Base64.encode(bytes(_did))));
  }
}
