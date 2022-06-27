// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol"; //allows for different roles to be created
import {StringUtils} from "./utils/StringUtils.sol";

// TODO:
// 1. Create a struct for the DID Document
// 2. Create UML diagram to showcase current architecture
//    and interconnection between contracts
// 3. There is a possibility that a DID has multiple controllers:
//    We wither need to implement a solution that maps dids to multiple controllers
//    or a single controller contract that has permission to edit the did document
//    and multiple authenticated addresses can call methods on that contract

contract DIDIssuer is AccessControl {
  // Create a custom verifier role
  bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

  // NOTE: For now, we are assuming the JSON DID lives as a string on the blockchain this may
  // not be the case in the final version, and it may live as an IPFS hash

  // maps a user from their DID to their DID Document
  mapping(string => string) idToDocument;

  // maps a user from their address to their DID Document
  mapping(address => string) addressToDocument;

  // mapping of which controllers control which DIDs
  mapping(string => string) DIDToController;

  // takes an address and returns a string that is the controller key
  mapping(address => string) addressToControllerKey;

  /** @dev – Gives the specified address admin and verifier rights
   */
  constructor(address _owner) {
    _grantRole(DEFAULT_ADMIN_ROLE, _owner);
    _grantRole(VERIFIER_ROLE, _owner);
  }

  //todo - determine value of the verificationMethod string if our cryptographic proof is the existence of the document in a user's address
  //todo - Confirm that use of memory/storage/calldata is correct and cannot be optimized

  /**
   * @dev - Issues a DID to a specific address. Requires input of a DID and the controller, who is authorized to make changes to the document.
   * Also requires the DID Document itself to be inputted as a variable
   **/
  function issueDID(
    address _to,
    string memory _id,
    string memory _controller,
    string memory _document
  ) public onlyRole(VERIFIER_ROLE) {
    require(
      StringUtils.equal(idToDocument[_id], ""),
      "DID_document_already_exists"
    );

    idToDocument[_id] = _document;
    addressToDocument[_to] = _document;
    addressToControllerKey[msg.sender] = _controller;
    DIDToController[_id] = _controller;
  }

  /**
   * @dev - Allows for the modification of a DID by the controller of the DID
   * For removal, use this function and set _newDocument to be blank
   **/
  function modifyDID(
    address _addressOfDID,
    string memory _idToModify,
    string memory _newDocument
  ) public {
    // Check that the modifier of the DID Document has permission to do so
    require(
      StringUtils.equal(
        DIDToController[_idToModify],
        addressToControllerKey[msg.sender]
      )
    );

    idToDocument[_idToModify] = _newDocument;
    addressToDocument[_addressOfDID] = _newDocument;
  }

  /**
   * @dev - Grants the verifier role to an address, which allows for issuing DIDs and moving a DID to a new address
   *
   */
  function addVerifier(address _verifierAddress)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    _grantRole(VERIFIER_ROLE, _verifierAddress);
  }

  /**
   * @dev - Revokes the verifier role from an address
   *
   */
  function removeVerifier(address _verifierAddress)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    _revokeRole(VERIFIER_ROLE, _verifierAddress);
  }

  /**
   * @dev - Function for recovering a DID and setting it to a new address in the case of a lost address
   *
   **/
  function recoverDID(address _oldAddress, address _newAddress)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    //grab the DID from the old address and set it to the new one, reset previous to be blank
    string memory DID = addressToDocument[_oldAddress];
    addressToDocument[_oldAddress] = "";
    addressToDocument[_newAddress] = DID;

    addressToControllerKey[_newAddress] = addressToControllerKey[_oldAddress];
    addressToControllerKey[_oldAddress] = "";
  }

  /**
   * @dev - Interface for looking up a DID document given an ID
   *
   **/
  function idToDocumentLookup(string memory _id)
    public
    view
    returns (string memory)
  {
    return idToDocument[_id];
  }

  /**
   * @dev - Interface for looking up an address given a DID document
   *
   **/
  function addressToDocumentLookup(address _address)
    public
    view
    returns (string memory)
  {
    return addressToDocument[_address];
  }

  /**
   * @dev - Interface for looking up a DID given a controller
   *
   **/
  function DIDToControllerLookup(string memory _DID)
    public
    view
    returns (string memory)
  {
    return DIDToController[_DID];
  }

  /**
   * @dev - Interface for looking up an address given a controller key
   *
   **/
  function addressToControllerKeyLookup(address _address)
    public
    view
    returns (string memory)
  {
    return addressToControllerKey[_address];
  }
}
