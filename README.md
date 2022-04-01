# Basic Sample DApp User Registry

This project uses Hardhat, ethers.js, and React to create a basic DApp that provides the functionality for the User Registry smart contract.

To start clone this repository into your own directory.

1) Install the dependencies with 
```shell
npm i
```
or manually with 
```shell
npm install ethers hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers
npm install react-router-dom
npm install bootstrap react-bootstrap
```
2) Start a hardhat node (keep this terminal open)
```shell
npx hardhat node
```
3) In another terminal. To run locally enter the command
```shell
npx hardhat run scripts/deploy.js --network localhost
```
Change the REACT_APP_DEPLOY_ADDRESS in .env to the new UserRegistry deployed address
Change the REACT_APP_CONSUMER_ADDRESS to the new ConsumerRegistry deployed address

To run on the ropsten test network, change accounts: [] in hardhat.config.js to your exported private key Ropsten Test Network metamask account.
Enter the command:
```shell
npx hardhat run scripts/deploy.js --network ropsten
```
You will need to change the deployed address in .env given the deployed address shown in terminal.

4) Connect a hardhat account to metamask. Open metamask, change network to localhost:8545, import account, and paste a private key from an address supplied by the hardhat node. Tha balance should be ~10000 eth.

5) Run the react application on your local machine with the command
```shell
npm start
```
