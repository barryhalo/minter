import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { BigNumber, Contract } from 'ethers'
import {
  deployContract,
  isValidContract,
  isValidERC20
} from './util/DeployContract'

/**
 * Assert vs expect vs should:
 * https://stackoverflow.com/questions/21396524/what-is-the-difference-between-assert-expect-and-should-in-chai#21405128
 * we are going with expect for now
 */

// Helper vars
let accounts,
  otherUserAddress: string,
  userAddress: string,
  collateralAddress: string,
  expandedERC20LabelString: string = 'ExpandedERC20',
  tokenFactoryLabelString: string = 'TokenFactory',
  // name not as impt, since does not have an artifact to reference since auto deployed by TokenFactory
  phmContractLabelString: string = 'PHMContract',
  minterContractLabelString: string = 'Minter'

// account that signs deploy txs
let contractCreatorAccount: SignerWithAddress

// Constants
// const priceFeedIdentifier = utf8ToHex('ETH/USD') // need this for UMA minting

// Contract variables that store deployed Contracts
let tokenFactoryContract: Contract,
  phmContract: Contract,
  minterContract: Contract,
  daiContract: Contract

// PHM Token Details
const tokenDetails = {
  name: 'Mochi PH Token',
  symbol: 'PHM',
  decimals: '18'
}

// Fake DAI Collaeral details
const collateralTokenDetails = {
  name: 'DAI Dummy Token',
  symbol: 'DAI',
  decimals: '18'
}

const collateralToMint = 3333

// single run per test setup
before(async () => {
  // define signers
  accounts = await ethers.getSigners()
  contractCreatorAccount = accounts[0]
  userAddress = accounts[1]
  otherUserAddress = accounts[2]

  // create the collateral token (this should be the existing DAI contract not created by us)
  it('Can deploy and get ref to DAI Contract', async () => {
    // deploy Contract with 'expect' assurances
    daiContract = await deployContract(
      expandedERC20LabelString,
      collateralTokenDetails
    )

    // (to check) assign dai address
    collateralAddress = daiContract.address

    // add address as minter - contractCreatorAddress not automatically added as minter for some reason
    await daiContract.addMinter(contractCreatorAccount.address)

    // mint token
    await daiContract.mint(contractCreatorAccount.address, collateralToMint)

    // get balance
    const daiBalance = BigNumber.from(
      await daiContract.balanceOf(contractCreatorAccount.address)
    ).toNumber()

    // test if values are equal
    expect(daiBalance).to.be.equal(
      collateralToMint,
      'contract creator ' +
        contractCreatorAccount.address +
        ' does not have expected balance of ' +
        collateralToMint
    )
  })

  // create the TokenFactory (existing contract by UMA not us)
  it('Can deploy and get ref to TokenFactory', async () => {
    tokenFactoryContract = await deployContract(tokenFactoryLabelString)
  })

  // create the synthetic token (this should be created by UMA not us)
  it('Can deploy and get ref to PHM Contract', async () => {
    // create token
    const tx = await tokenFactoryContract.createToken(
      tokenDetails.name,
      tokenDetails.symbol,
      tokenDetails.decimals,
      { from: contractCreatorAccount.address }
    )

    // check transaction receipt to obtain token's address
    const txReceipt = await tx.wait()
    const txReceiptEvent = txReceipt.events.pop()

    /**
     * get contract prev deployed by tokenFactory using address and account[0] as signer
     */
    phmContract = await ethers.getContractAt(
      expandedERC20LabelString,
      txReceiptEvent.address,
      accounts[0]
    )

    // check if valid Contract obj
    await isValidContract(phmContract, 'expandedERC20LabelString')
    // check if valid ERC20 Contract obj
    await isValidERC20(phmContractLabelString, phmContract, tokenDetails)
  })

  it('Can deploy and get ref to Minter Contract', async () => {
    minterContract = await deployContract(minterContractLabelString)
    await minterContract.initialize()

    // add whitelisting of the collateral address
  })
  beforeEach(async () => {})

  /**
   * TODO: test util funcs for events emitted after every state changing tx (Transfer, Mint, Burn, etc)
   * TODO: these tests are still an initial outline, can actually break these down into smaller fixtures
   * TODO: Need to think of every success/failure scenario
   */
  describe('Can accept collateral and mint synthetic', async () => {
    it('sending collateral ERC20 to deposit func should mint PHM, return PHM to msg.sender', async () => {
      // add  minterContract as minter
      await daiContract.addMinter(minterContract.address)
      // approve contract to spend collateral tokens
      daiContract.approve(minterContract.address, 300)
      const collateralDeposit = 123

      // test if  contract has no collateral
      // change to balance before
      expect(
        BigNumber.from(
          await daiContract.balanceOf(minterContract.address)
        ).toNumber()
      ).to.be.equal(
        0,
        `contract ${minterContract.address} does not have expected balance of 0`
      )

      // deposit collateral to minter contract
      const depositTxn = await minterContract.depositByCollateralAddress(
        collateralDeposit,
        collateralAddress
      )

      await depositTxn.wait()

      // Check latest values from the contract so need to call again
      expect(
        BigNumber.from(
          await daiContract.balanceOf(contractCreatorAccount.address)
        ).toNumber()
      ).to.be.equal(
        collateralToMint - collateralDeposit,
        `contract ${minterContract.address} does not have expected balance of the difference of collateralDeposit and user previous balance.`
      )

      expect(
        BigNumber.from(
          await daiContract.balanceOf(minterContract.address)
        ).toNumber()
      ).to.be.equal(
        collateralDeposit,
        `contract ${minterContract.address} does not have expected balance of ${collateralDeposit}`
      )
    })
  })
  it('sending non collateral ERC20 to deposit func should not mint PHM, not return PHM to msg.sender and return error', async () => {})
})
describe('Can transfer synth to recipient wallet', () => {})
describe('Can redeem synth for original ERC20 collateral', () => {
  it(
    'sending synth and calling redeem func should burn synth, return ERC20 collateral to msg.sender, and return true'
  )
  it(
    'sending invalid synth and calling redeem func should not burn synth, not return ERC20 collateral to msg.sender, and return err'
  )
})
describe('Can earn HALO upon synth mint', () => {})
describe('Can earn HALO on transfer to whitelisted AMM address', () => {})
