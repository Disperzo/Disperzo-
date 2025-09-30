# Disperzo – Bulk Token & Asset Distribution Made Simple

Disperzo is a blockchain-powered bulk transfer platform that enables users to send fungible tokens (ERC-20), non-fungible tokens (ERC-721), and semi-fungible tokens (ERC-1155) to hundreds or thousands of wallet addresses in one **gas-optimized transaction**.

Currently, Disperzo is deployed on **U2U Network**, leveraging its performance and scalability to deliver seamless bulk distribution of assets.

---

## 🚀 Project Goals

Disperzo was designed to solve the inefficiencies of mass token transfers by providing:

* **Multi-standard token support**: ERC-20, ERC-721, and ERC-1155.
* **Batch transfers**: Distribute assets to hundreds of recipients in one transaction.
* **CSV/Excel uploads**: Easily manage large recipient lists.
* **Payroll-style scheduling**: Automate recurring payments.
* **Gas optimization**: Reduce fees by consolidating transactions.
* **Transparency and security**: Audited smart contracts and on-chain records.

---

## 🔗 U2U Network Integration

Disperzo is deployed on the **U2U Network**, chosen for its scalability, low transaction fees, and EVM-compatibility.

* **Smart Contracts**: Written in Solidity and deployed on U2U.
* **Wallet Support**: Users can connect with privy and other providers like MetaMask (configured for U2U).
* **Explorer Links**: All transactions are directly visible on the U2U blockchain explorer.

Using U2U allows Disperzo to handle **large-scale token distributions** efficiently while keeping costs affordable for DAOs, gaming studios, and organizations.

---

## 🖥️ Running the Demo

Follow these steps to test the demo of Disperzo on U2U Network:

### 1. Prerequisites

* Install [Node.js](https://nodejs.org/) (v18+ recommended).

### 2. Clone the Repository

```bash
git clone https://github.com/Disperzo/Disperzo-
cd Disperzo-
```

### 3. Install Dependencies

```bash
yarn install
# or
npm install
```

### 4. Start the Frontend

```bash
yarn dev
# or
npm run dev
```

The app will run locally.

### 5. Connect Wallet & Test

* Open the app in your browser.
* Connect with Privy
* Select a token type (ERC-20, ERC-721, ERC-1155).
* Click **Distribute** to access distribute page and execute a bulk transfer.

---

## 📦 Example Use Case

* A DAO distributing **USDC (ERC-20)** to 500 contributors.
* An NFT project distributing **ERC-721 badges** to event attendees.
* A gaming studio distributing **ERC-1155 in-game items** in one go.

With Disperzo on U2U, all of these can be achieved **in a single optimized transaction**.

---

## 🛠️ Tech Stack

* **Smart Contracts**: Solidity (EVM-compatible, deployed on U2U).
* **Frontend**: React.js / Next.js.
* **Backend**: Node.js (for scheduling, CSV parsing).
* **Storage**: PostgreSQL + IPFS for metadata.
* **Wallet Support**: MetaMask, WalletConnect.

---

## 📍 Future Roadmap

* Gasless distributions via meta-transactions.
* Token vesting and cliff schedules.
* DAO treasury + multisig integration.
* Cross-chain expansion beyond U2U.
