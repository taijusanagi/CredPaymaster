# CredPaymaster

## Description
**CredPaymaster** is a credential-based account abstraction paymaster system designed to provide a flexible way to manage paymasters using credentials. Built atop the Ethereum Attestation Service for credential registry, it capitalizes on the power of decentralized solutions to enhance the chain's ecosystem.

## Benefit
By employing CredPaymaster, chains can:
- Attract more users to their ecosystem with a simplified and innovative system.
- Provide a seamless way for sponsors to create sponsorships based on certain credentials.
- Enable users with the required credentials to benefit from free transactions under these sponsorships.

## How it works
1. **Infrastructure Deployment**: The entire account abstraction infrastructure of CredPaymaster is deployed on Base.
2. **Utilizing Ethereum Attestation Service**: This service acts as the main credential registry. However, due to the absence of an Ethereum Attestation Service on Base, there arises a need to sync credentials.
3. **Cross-Chain Messaging with Axelar**: To bridge the gap, CredPaymaster uses Axelar as the cross-chain messaging protocol. This ensures that credentials are seamlessly synced from the Ethereum Attestation Service to Base.
4. **Sponsorship Creation**: Sponsors have the ability to create sponsorships for the paymaster using specific credentials.
5. **Free Transactions for Users**: Users who possess the necessary credentials can perform transactions without any cost, leveraging the sponsorships created.
