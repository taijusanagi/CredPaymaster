// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import {Attestation} from "./Common.sol";

contract CredPaymaster is BasePaymaster {
    // schema ID => attester => deposit
    mapping(bytes32 => mapping(address => uint)) public deposits;
    // attestation ID => attestation
    mapping(bytes32 => Attestation) public attestaitons;

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {}

    uint256 private constant ATTESTATION_ID_OFFSET = 20;

    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    )
        internal
        view
        override
        returns (bytes memory context, uint256 validationData)
    {
        (bytes32 attestationId) = abi.decode(
            userOp.paymasterAndData[ATTESTATION_ID_OFFSET:],
            (bytes32)
        );
        Attestation memory attestation = attestaitons[attestationId];
        uint256 deposit = deposits[attestation.schema][attestation.attester];
        //TODO: add validation to check the receipient is the same account address
        
        require(deposit >= maxCost, "Insufficient deposit");
        return (abi.encode(attestation.schema, attestation.attester), 0);
    }

    function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) internal override {
        (bytes32 schemaId, address attester) = abi.decode(context, (bytes32, address));
        deposits[schemaId][attester] -= actualGasCost;
    }

    function sponsorAddFund(bytes32 schemaId, address attester) payable external {
        deposits[schemaId][attester] += msg.value;
        deposit();
    }

    function syncAttestation(bytes32 attestationId, Attestation memory attestation) external {
        attestaitons[attestationId] = attestation;
    }
}
