import { assert, expect, use } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { DecentralizedStableCoin, DSCEngine, MockV3Aggregator, ERC20Mock } from "../typechain-types"


import { getMockWethMock, getMockWBtcMock, geMockEthUsdPriceFeed, getDecentralizedStableCoin, getDSCEngine } from "../instructions"
import { moveBlock } from "../utils/move-block"
import { moveTime } from "../utils/move-time"
import { getStringToBytes } from "../utils/convert"
import { castVote } from "../instructions"
import { DS_SIGNING_DOMAIN_NAME, DS_SIGNING_DOMAIN_VERSION, IPFS_SIMPLE } from "../helper-hardhat-config"

describe("Stable Coin ", async function () {
  let deployer: Signer;
  let deployer2: Signer
  let deployer3: Signer
  let deployer4: Signer
  let deployer5: Signer
  let deployer6: Signer //0x0308b55f7bACa0324Ba6Ff06b22Af1B4e5d71a74

  let dsc: DecentralizedStableCoin;
  let engine: DSCEngine;
  let etherPrice: MockV3Aggregator;
  let weth: ERC20Mock;
  let wbtc: ERC20Mock;


  let amountCollateral: number = 1//1000000000;
  let collateralToCover: number = 2//2000000000;
  let amountToMint: number = 100//10000000000;

  before(async () => {
    [deployer, deployer2, deployer3, deployer4, deployer5, deployer6] = await ethers.getSigners(); // could also do with getNamedAccounts
    dsc = await getDecentralizedStableCoin();
    engine = await getDSCEngine();
    etherPrice = await geMockEthUsdPriceFeed();
    weth = await getMockWethMock();
    wbtc = await getMockWBtcMock();

    // const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
    // const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
    // name = getStringToBytes("Document Art");
    // documentDescribe = getStringToBytes("This is document for testing...");
    // signatureStartingPeriod = 4;
    // signatureEndingingPeriod = 5;
    // const _documentName = getStringToBytes(name)
    // const _purpose = getStringToBytes(documentDescribe)
    // partiesTokenId = [1];
    // documentId = await documentSignature.getDocumentId(await deployer.getAddress(), _documentName,
    //   _purpose,
    //   partiesTokenId)
    // voucher = (await castVote(
    //   documentSignature,
    //   deployer,
    //   await deployer.getAddress(),
    //   "https://ipfs.io/ipfs/QmYqybDx5JhWQXwbBVrKQ9KUUeA2PiEkxJKsyMCfjsExQG",
    //   documentId,
    //   DS_SIGNING_DOMAIN_NAME,
    //   DS_SIGNING_DOMAIN_VERSION
    // ));
    // // voucher2 = (await castVote(
    // //   documentSignature,
    // //   deployer2,
    // //   1,
    // //   documentId,
    // //   DS_SIGNING_DOMAIN_NAME,
    // //   DS_SIGNING_DOMAIN_VERSION
    // // ));
    // // voucher3 = (await castVote(
    // //   documentSignature,
    // //   deployer3,
    // //   1,
    // //   documentId,
    // //   DS_SIGNING_DOMAIN_NAME,
    // //   DS_SIGNING_DOMAIN_VERSION
    // // ));

  });

  describe("Test liquidated", async function () {
    it("Try to Attack", async function () {
      let user: string = await deployer.getAddress();
      let user2: string = await deployer2.getAddress();

      let tx = await weth.connect(deployer).approve(engine.address, amountCollateral)
      await tx.wait(1);
      console.log("amountCollateral, amountToMint", await weth.connect(deployer).balanceOf(user));

      tx = await engine.connect(deployer).depositCollateralAndMintDsc(weth.address, amountCollateral, amountToMint);
      await tx.wait(1);

      // tx = await etherPrice.updateAnswer(1);
      // await tx.wait(1);
      // // console.log("user", user);
      // let response = await engine.getAccountInformation(await deployer.getAddress());

      // let userHealthFactor: BigNumber = await engine.connect(deployer).getHealthFactor("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
      // // console.log("userHealthFactor", userHealthFactor);

      // tx = await weth.connect(deployer2).mint(user2, collateralToCover)
      // await tx.wait(1);
      // tx = await weth.connect(deployer2).approve(engine.address, collateralToCover)
      // await tx.wait(1);
      // tx = await engine.connect(deployer2).depositCollateralAndMintDsc(weth.address, collateralToCover, amountToMint);
      // await tx.wait(1);
      // tx = await dsc.connect(deployer2).approve(engine.address, amountToMint);
      // await tx.wait(1);
      // let userDeatils = await engine.getAccountInformation(user);
      // console.log(user, "userDeatils", userDeatils);
      // let userDeatils2 = await engine.getAccountInformation(user2);
      // console.log(user2, "userDeatils2", userDeatils2);
      // let userBalanceAfter = await dsc.balanceOf(user);
      // console.log(user, "userBalanceAfter", userBalanceAfter);
      // let liquidatorCoinBalance = await dsc.balanceOf(user2);
      // console.log(user2, "liquidatorCoinBalance", liquidatorCoinBalance);
      console.log("before = ", await engine.getCollateralBalanceOfUser(user, weth.address));
      console.log("before = ", await engine.getCollateralBalanceOfUser(user2, weth.address));


      // tx = await engine.connect(deployer2).liquidate(weth.address, user, amountToMint, { gasLimit: 209780 });
      await tx.wait(1);
      console.log("after = ", await engine.getCollateralBalanceOfUser(user, weth.address));
      console.log("after = ", await engine.getCollateralBalanceOfUser(user2, weth.address));



    });
    it("Check Attack", async function () {
      let user: string = await deployer.getAddress();
      let user2: string = await deployer2.getAddress();
      console.log("after = ", await engine.getCollateralBalanceOfUser(user, weth.address));
      console.log("after = ", await engine.getCollateralBalanceOfUser(user2, weth.address));
      let userDeatils = await engine.getAccountInformation(user);
      console.log(user, "After userDeatils", userDeatils);
      let userDeatils2 = await engine.getAccountInformation(user2);
      console.log(user, "After userDeatils2", userDeatils2);
      let userBalanceAfter = await dsc.balanceOf(user);
      console.log(user, "After userBalanceAfter", userBalanceAfter);
      let liquidatorCoinBalance = await dsc.balanceOf(user2);
      console.log(user2, "After liquidatorCoinBalance", liquidatorCoinBalance);
    });


    // estimateGas BigNumber { value: "209782" }
  });

});




