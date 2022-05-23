//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Myzk2Greeter {
    //string private greeting;
    uint256 storedData;
    uint256 deviceID;
    uint256 dataTime;
    uint256 dataValue;

    constructor(uint256 _storedData) {
        storedData = _storedData;
        deviceID = 0;
        dataTime = 0;
        dataValue = 0;
    }

    function set(uint256 x) public {
        storedData = x;
    }
    
    function setData(uint256 dev_id, uint256 value) public {
        deviceID = dev_id;
        dataTime = block.timestamp;
        dataValue = value;
    }

    function get() public view returns (uint256) {
        return storedData;
    }

    function getData() public view returns (uint256,uint256,uint256) {
        return (deviceID,dataTime,dataValue);
    }
}