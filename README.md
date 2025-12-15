PiastreACT (PACT)

PiastreACT (PACT) is a fixed-supply ERC-20 token used for governance and coordination within the Piastre ecosystem.

This repository uses Hardhat 3 (Beta) with the Node.js native test runner (node:test) and viem for Ethereum interactions.

⸻

Contract Overview

PiastreACTToken
	•	Standard: ERC-20 (OpenZeppelin v5)
	•	Symbol: PACT
	•	Decimals: 18
	•	Max supply: 1,000 PACT
	•	Premint: none
	•	Minting: owner-only
	•	Supply increase: capped (cannot exceed max supply)
	•	Burning: not supported
	•	Permit / governance logic: intentionally excluded

⸻

Repository Structure

.
├── contracts/
│   └── PiastreACTToken.sol
├── test/
│   └── PiastreACTToken.test.ts
├── hardhat.config.ts
├── package.json
├── tsconfig.json
└── README.md

⸻

Requirements
	•	Node.js ≥ 20
	•	npm

⸻

Install

```bash
npm install
```

⸻

Testing

Run all tests:

```bash
npx hardhat test nodejs
```

⸻

⸻

Deployment

Local (simulated network)

```bash
npx hardhat ignition deploy ignition/modules/PiastreACTToken.ts
```

⸻

Sepolia

Set the private key:

```bash
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

```
⸻

Deploy:

```bash
npx hardhat ignition deploy –network sepolia ignition/modules/PiastreACTToken.ts

```

⸻

License

MIT

⸻
