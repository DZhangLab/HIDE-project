//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Base64} from "./libraries/Base64.sol";
import {Registry} from "./Registry.sol";
import {StringUtils} from "./utils/StringUtils.sol";

/**
 * @dev Contract for managing Delegate Registries
 *
 * DelegateRegistry is an implementation of the Registry Contract
 * supporting get, insert and delete operations.
 *
 * The dictionary structure of the registry maps did's to
 * the DID document generation contract keys. Both variables are
 * encoded in Base64.
 *
 * There is also a bidirectional mapping between delegates and users available
 */
contract DelegateRegistry is Registry {
    // Entries is a map from DID to Contract Key
    mapping(string => string) public entries;

    //two different mappings allowing us to bidirectionally find a delegate given a user or vice versa
    mapping(string => string[]) public delegateToUsers;
    mapping(string => string[]) public userToDelegates;

    /**
     * @dev Create a new delegate that's paired to a certain user
     *
     * Emits the EntryInserted event
     * Reverts with an error message if entry already exists
     * Returns the updated total number of entries
     */
    function insertDelegate(
        string memory _did,
        string memory _contractKey,
        string memory _userDid
    ) public returns (uint256 numEntries) {
        //insert into the base registry
        Registry.insertEntry(
            Base64.encode(bytes(_did)),
            Base64.encode(bytes(_contractKey))
        );

        //create bidirectional connection between delegate did and user did
        delegateToUsers[_did].push(_userDid);
        userToDelegates[_userDid].push(_did);

        return totalEntries;
    }

    //delete the entry of a delegate and return boolean based on its success
    function deleteDelegate(string memory _did) public returns (bool success) {
        //delete from the base registry, save result as boolean
        bool result = Registry.deleteEntry(Base64.encode(bytes(_did)));

        //delete the mappings
        //Iterate through the delegateToUsers list and delete the delegate from each UsersToDelegate mapping
        uint256 i = 0;
        for (i = 0; i != delegateToUsers[_did].length; ++i) {
            uint256 j = 0;

            //userToDelegates[delegateToUsers[_did][i]][j] gets a User assocaited with delegate and then iterates over whatever is in its array
            //Should never produce an error since a given user should always have the given delegate in their array
            while (
                !StringUtils.equal(
                    userToDelegates[delegateToUsers[_did][i]][j],
                    _did
                )
            ) {
                ++j;
            }

            delete userToDelegates[delegateToUsers[_did][i]][j];
        }

        delete delegateToUsers[_did];

        return result;
    }

    /** @dev Look up a user based on their delegate DID
     *
     * Return a decoded string array of all associated delegates
     */
    function lookupUsers(string memory entryDid)
        public
        view
        returns (string[] memory did)
    {
        return (delegateToUsers[entryDid]);
    }

    /** @dev Looks up a the list of delegates associated with a user
     *
     * Returns a decoded string array of all associated users
     */
    function lookupDelegates(string memory userDid)
        public
        view
        returns (string[] memory did)
    {
        return (userToDelegates[userDid]);
    }
}