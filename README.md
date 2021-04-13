## Step 1
### Setting up environment variables
Check `env.example` at project root and fill in corresonpding values on your local

**INFURA_PROJECT_ID**

Can be found in 1password vault, inside `minter.env(local)` or `minter.env(kovan)` files

**MNEMONIC_SEED**

Generate a 12 word mnemonic seed phrase (can use ganache, metamask or ask project admin for current seed used for remote envs)

**CHAIN_NETWORK**

When setting up locally, paste `LOCALHOST` as value to `CHAIN_NETWORK`. Other values are `KOVAN` or `MAINNET` (we are not on other testnets atm)

## Step 2
### Running UMA protocol, this is a Minter dependency when running locally
1. Setup UMA locally by running `git clone https://github.com/HaloDAO/protocol` and following the quick start steps in that repo
2. Run the Ganache node using this command `npx ganache-cli -p 9545 -e 1000000 -l 10000000` (don't forget to note down the `account[0]` private key and wallet address somewhere)
3. While still in the `protocol` project root, run `yarn truffle console --network test` to enter the truffle console.
4. Running `migrate` will generate a file named `uma-contract-address.json` inside the minter repo, full path is `halodao-minter/test/uma-contract-address.json`, so make sure you already cloned the minter repo before running `migrate`, see Step 5, #1

Once minter is cloned, run `migrate` to migrate UMA contract in local Ganache node inside the truffle console.

6. Make an EMP following steps 3-8 [here](https://docs.umaproject.org/build-walkthrough/mint-locally#parameterize-and-deploy-a-contract)

## Step 3
### Setting up environment variables

**FINANCIAL_CONTRACT_ADDRESS**

Inside truffle console, get the emp address by entering `emp.address`, `emp.address` is the `FINANCIAL_CONTRACT_ADDRESS`

**DAI_CONTRACT_ADDRESS**

Inside truffle console, create an instance of the collateral token to get its address. Run `const collateralToken = await TestnetERC20.deployed()` then `collateralToken.address`, `collateralToken.address` is the `DAI_CONTRACT_ADDRESS`

**UBE_CONTRACT_ADDRESS**

Inside truffle console, create an instance of the synthetic token to get its address. Run `const syntheticToken = await SyntheticToken.at(await emp.tokenCurrency())` then `syntheticToken.address`, `syntheticToken.address` is the `UBE_CONTRACT_ADDRESS`

## Step 4
### Metamask
1. Be sure to have metamask plugin installed in your browser (recommended browser is Chrome)
2. Login to Metamask and point the network to localhost and port 9545 before starting the frontend app

Config

<img width="354" alt="Screen Shot 2021-04-13 at 7 54 58 AM" src="https://user-images.githubusercontent.com/81855319/114476831-94de7380-9c2d-11eb-81c4-bef5eb78929d.png">

## Step 5
### Running Minter
1. Open a new terminal window, if you haven't cloned minter yet, run `git clone https://github.com/HaloDAO/minter`
2. run `cd minter`
3. run `npm i` to install backend dependencies
4. run `npm run test:local` to run contract test suite to run smart contract test cases
5. run `npm run deploy:local` to compile and deploy the Minter contract to the ganache node that UMA was deployed on

## Step 6
### Running Minter frontend

1. cd to frontend `cd frontend`
2. run `npm i` to install frontend dependencies
3. run `npm start` to serve the app locally

## Environment Setup

#### Quickstart Setup

- [ ] Install all dependencies
- [ ] Deployed a local ethereum network with Ganache on the uma protocol/ protocol folder
- [ ] Compliled and deployed smart contract to the blockchain
- [ ] Contract artifact and typechain is auto generated in the front end folder

#### Terminal Setup Checklist

- [ ] Terminal 1 - React Front End for the dapp
- [ ] Terminal 2 - Ganache node deploy from the uma protocol folder
- [ ] Terminal 3 (Optional) - Truffle console to migrate and interact with the UMA Contracts in local

#### Dapp Setup Checklist

- [ ] Deploy the local ganache inside the uma protocol
- [ ] Metamask set to the network you are developing to (localhost:9545 for local, testnet of choice)
- [ ] Run a local react server

#### Smart Contract Development Setup Checklist

- [ ] Contract and other dependencies are in the same folder

#### Resources

[HardHat Documentation](https://hardhat.org/getting-started/) - Hardhat tutorials, config, network, and plugin references

## Troubleshooting

1. Error: Cannot use JSX unless the '--jsx' flag is provided

- Follow: https://vscode.readthedocs.io/en/latest/languages/typescript/#using-the-workspace-version-of-typescript - "Using the workspace version of TypeScript" section

2. Warning: Calling an account which is not a contract

- Compile and deploy your contract first. Run `npm run deploy:local` for local deployments.

3. If you get `ProviderError: Must be authenticated!` or https://hardhat.org/errors/#HH604 then make sure you've entered a key and value in `.env` for `ALCHEMY_KEY`
4. If you've accidentally started a background process for a node then you can use `sudo lsof -i :<port number>` to find the PID then kill it using `kill -9 <PID>` (from https://stackoverflow.com/questions/3855127/find-and-kill-process-locking-port-3000-on-mac)

5. UMA tests don't run due to `No tests configured` err: try `npm uninstall -g ganache-cli`, make sure `yarn ganache-cli --version` returns `Ganache CLI v6.12.2 (ganache-core: 2.13.2)` (or the same version as specified in `protocol` repo's root package.json) then run `yarn test` again
