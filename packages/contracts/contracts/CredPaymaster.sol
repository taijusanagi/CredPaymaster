// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {Attestation} from "./Common.sol";

contract CredPaymaster is BasePaymaster, AxelarExecutable {
    // schema ID => attester => deposit
    mapping(bytes32 => mapping(address => uint)) public deposits;
    // attestation ID => attestation
    mapping(bytes32 => Attestation) public attestaitons;

    string public trustedSourceChain;
    string public trustedSourceAddress;

    constructor(
        IEntryPoint _entryPoint,
        address gateway_,
        string memory trustedSourceChain_,
        string memory trustedSourceAddress_
    ) BasePaymaster(_entryPoint) AxelarExecutable(gateway_) {
        trustedSourceChain = trustedSourceChain_;
        trustedSourceAddress = trustedSourceAddress_;
    }

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
        bytes32 attestationId = abi.decode(
            userOp.paymasterAndData[ATTESTATION_ID_OFFSET:],
            (bytes32)
        );
        Attestation memory attestation = attestaitons[attestationId];
        uint256 deposit = deposits[attestation.schema][attestation.attester];
        require(attestation.recipient == userOp.sender, "Invalid sender");
        require(deposit >= maxCost, "Insufficient deposit");
        return (abi.encode(attestation.schema, attestation.attester), 0);
    }

    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) internal override {
        (bytes32 schemaId, address attester) = abi.decode(
            context,
            (bytes32, address)
        );
        deposits[schemaId][attester] -= actualGasCost;
    }

    function sponsorAddFund(
        bytes32 schemaId,
        address attester
    ) external payable {
        deposits[schemaId][attester] += msg.value;
        deposit();
    }

    function debugAddAttestation(
        bytes32 attestationId,
        Attestation memory attestation
    ) external {
        attestaitons[attestationId] = attestation;
    }

    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        Attestation memory attestation = abi.decode(payload_, (Attestation));
        require(keccak256(abi.encodePacked(sourceChain_)) == keccak256(abi.encodePacked(trustedSourceChain)), "Invalid source chain");
        require(keccak256(abi.encodePacked(sourceAddress_)) == keccak256(abi.encodePacked(trustedSourceAddress)), "Invalid source address");
        attestaitons[attestation.uid] = attestation;
    }
}
