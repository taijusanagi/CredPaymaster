// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Attestation} from "./Common.sol";

interface IEAS {
    function getAttestation(
        bytes32 attestationId
    ) external returns (Attestation memory);
}
