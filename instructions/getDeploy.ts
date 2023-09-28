import { BigNumber } from "ethers";
import { artifacts, ethers } from "hardhat";
import { contractAddressFile } from "../helper-hardhat-config"
import * as fs from "fs";
import { DecentralizedStableCoin, DSCEngine, MockV3Aggregator, ERC20Mock } from "../typechain-types"

export async function getMockWethMock(): Promise<ERC20Mock> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let mockOracle = await ethers.getContractAt("ERC20Mock", contractAddress["wethMock"]);
  return mockOracle;
}
export async function getMockWBtcMock(): Promise<ERC20Mock> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let mockOracle = await ethers.getContractAt("ERC20Mock", contractAddress["wbtcMock"]);
  return mockOracle;
}
export async function geMockEthUsdPriceFeed(): Promise<MockV3Aggregator> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let orcaleUrlProvider = await ethers.getContractAt("MockV3Aggregator", contractAddress["ethUsdPriceFeed"]);
  return orcaleUrlProvider;
}
export async function getDecentralizedStableCoin(): Promise<DecentralizedStableCoin> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let linkToken = await ethers.getContractAt("DecentralizedStableCoin", contractAddress["DecentralizedStableCoin"]);
  return linkToken;
}
export async function getDSCEngine(): Promise<DSCEngine> {
  let contractAddress = JSON.parse(fs.readFileSync(contractAddressFile, "utf8"))
  let figurePrintOracle = await ethers.getContractAt("DSCEngine", contractAddress["DSCEngine"]);
  return figurePrintOracle;
}