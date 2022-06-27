//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Base64} from "./libraries/Base64.sol";

import {RoleCheck} from "./utils/RoleCheck.sol";

import {UserRegistry} from "./Registries/UserRegistry.sol";
import {DelegateRegistry} from "./Registries/DelegateRegistry.sol";
import {ConsumerRegistry} from "./Registries/ConsumerRegistry.sol";
import {VerifierRegistry} from "./Registries/VerifierRegistry.sol";

/**
 * @dev Contract for managing interoperability functions between registries
 *
 * RegistryController implements the following methods:
 *     1. createAttestation
 *     2. verifyAttestationWithSig
 *
 */
contract RegistryController {
  using RoleCheck for *;

  UserRegistry public userRegistry;
  DelegateRegistry public delegateRegistry;
  ConsumerRegistry public consumerRegistry;
  VerifierRegistry public verifierRegistry;

  // Attestation creation events
  event attestationCreateSuccess(
    string _verifierDid,
    string _userDid,
    string _attesteeDid
  );
  event attestationCreateFail(
    string _verifierDid,
    string _userDid,
    string _attesteeDid,
    string _err
  );

  // Attestation verification events
  event passAttestation();
  event blockAttestation();

  struct Attestation {
    uint256 attestationId;
    string verifierDid;
    string userDid;
    string attesteeDid;
  }

  Attestation[] public attestations;
  uint256 private curAttestationId = 0;

  /**
   * @dev Constructor initiates the values of the respective registries
   *
   * @param _userRegistryAddr: the address of the user registry deployed contract
   * @param _delegateRegistryAddr: the address of the delegate registry deployed contract
   * @param _consumerRegistryAddr: the address of the consumer registry deployed contract
   * @param _verifierRegistryAddr: the address of the verifier registry deployed contract
   */
  constructor(
    address _userRegistryAddr,
    address _delegateRegistryAddr,
    address _consumerRegistryAddr,
    address _verifierRegistryAddr
  ) {
    userRegistry = UserRegistry(_userRegistryAddr);
    delegateRegistry = DelegateRegistry(_delegateRegistryAddr);
    consumerRegistry = ConsumerRegistry(_consumerRegistryAddr);
    verifierRegistry = VerifierRegistry(_verifierRegistryAddr);
  }

  /**
   * @dev Creates an attestation by the verifier for the targetDid
   *
   * Emits an attestationCreateSuccess event on success or an attestationCreateFail on failure
   * Returns true if attestation is created successfully, false otherwise.
   */
  function createAttestation(
    string memory _verifierDid,
    string memory _userDid,
    string memory _attesteeDid
  ) public returns (bool) {
    // Firstly, ensure that the verifier is indeed in the verifier registry
    if (
      RoleCheck.verifyRole(
        _verifierDid,
        userRegistry,
        consumerRegistry,
        verifierRegistry,
        delegateRegistry
      ) != RoleCheck.Role.VERIFIER
    ) {
      emit attestationCreateFail(
        _verifierDid,
        _userDid,
        _attesteeDid,
        "Verifier DID is not valid verifier"
      );
      return false;
    }

    if (
      RoleCheck.verifyRole(
        _attesteeDid,
        userRegistry,
        consumerRegistry,
        verifierRegistry,
        delegateRegistry
      ) == RoleCheck.Role.USER
    ) {
      // case attestee is a user themselves

      Attestation memory newAttestation;
      newAttestation.attestationId = curAttestationId;
      newAttestation.verifierDid = _verifierDid;
      newAttestation.userDid = _userDid;
      newAttestation.attesteeDid = _attesteeDid;

      // TODO: Change to newer version of adding attestation to DID Doc
      attestations.push(newAttestation);

      curAttestationId += 1;

      emit attestationCreateSuccess(_verifierDid, _userDid, _attesteeDid);
      return true;
    } else if (
      RoleCheck.verifyRole(
        _attesteeDid,
        userRegistry,
        consumerRegistry,
        verifierRegistry,
        delegateRegistry
      ) ==
      RoleCheck.Role.DELEGATE &&
      delegateRegistry.userIsDelegate(_userDid, _attesteeDid)
    ) {
      // case attestee is a user's delegate

      Attestation memory newAttestation;
      newAttestation.attestationId = curAttestationId;
      newAttestation.verifierDid = _verifierDid;
      newAttestation.userDid = _userDid;
      newAttestation.attesteeDid = _attesteeDid;

      attestations.push(newAttestation);

      // TODO: Update attestation ID method
      curAttestationId += 1;

      emit attestationCreateSuccess(_verifierDid, _userDid, _attesteeDid);
      return true;
    } else {
      // we cannot confirm attestee's role

      emit attestationCreateFail(
        _verifierDid,
        _userDid,
        _attesteeDid,
        "Cannot verify attestee role."
      );
      return false;
    }
  }

  /**
   * @dev Verifies that an attestation is valid with the provided signature
   *
   * Emits a passAttestation event on success or a blockAttestation event on failure
   * Returns true if verification succeeds, false otherwise.
   */
  function verifyAttestationWithSig(
    uint256 _attestationId,
    string memory _signature
  ) public returns (bool) {
    // verify attestation exists
    if (attestations[_attestationId].attestationId != _attestationId) {
      emit blockAttestation();
      return false;
    }

    string memory verifierDid = attestations[_attestationId].verifierDid;

    // check if signature exists in verifier registry that
    // the attestation's verifier is the same as signature.
    if (
      RoleCheck.verifyRole(
        _signature,
        userRegistry,
        consumerRegistry,
        verifierRegistry,
        delegateRegistry
      ) !=
      RoleCheck.Role.VERIFIER ||
      keccak256(abi.encodePacked(verifierDid)) !=
      keccak256(abi.encodePacked(_signature))
    ) {
      emit blockAttestation();
      return false;
    } else {
      emit passAttestation();
      return true;
    }
  }
}
