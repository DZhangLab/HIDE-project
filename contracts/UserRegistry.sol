//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract UserRegistry {

  // Entries is a map from DID to Contract Key
  mapping(string => string) public entries;
  uint256 public totalEntries;

  constructor() {
    totalEntries = 0;
  }

  event EntryEvent(string did, string contractKey);
  event EntryDelete(string did);

  function insert(string memory did, string memory contractKey)
    public
    returns (uint256 numEntries)
  {
    
    entries[did] = contractKey;
    totalEntries++;

    //emit event
    emit EntryEvent(did, contractKey);
    return totalEntries;
  }

  function deleteEntry(string memory did) public returns (bool success) {
    require(totalEntries > 0);
    
    delete entries[did];
    totalEntries--;
    emit EntryDelete(did);

    return testEmpty(entries[did]);
  }

  function getEntry(string memory entryDid)
    public
    view
    returns (
      string memory did,
      string memory contractKey
    )
  {

    if (!testEmpty(entries[entryDid])) {
      return(entryDid, entries[entryDid]);
    }

    revert("Entry not found");

  }

  function testEmpty(string memory str) public pure returns (bool empty) {
    bytes memory myStr = bytes(str);
    if (myStr.length == 0) return true;
    return false;
  }

  function getTotalEntries() public view returns (uint256 length) {
    return totalEntries;
  }
}