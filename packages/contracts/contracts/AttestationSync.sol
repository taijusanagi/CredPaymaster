// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

import {IEAS} from "./IEAS.sol";
import {Attestation} from "./Common.sol";

contract AttestationSync is AxelarExecutable {
    IEAS public immutable eas;
    IAxelarGasService public immutable gasService;

    constructor(
        address eas_,
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        eas = IEAS(eas_);
        gasService = IAxelarGasService(gasReceiver_);
    }

    function syncAttestation(
        string memory destinationChain,
        string memory destinationAddress,
        bytes32 attestationId
    ) external payable {
        require(msg.value > 0, "Gas payment is required");
        Attestation memory attestation = eas.getAttestation(attestationId);
        bytes memory payload = abi.encode(attestation);
        gasService.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );
        gateway.callContract(destinationChain, destinationAddress, payload);
    }
}
