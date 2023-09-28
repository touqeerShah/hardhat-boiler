import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../instructions/verify-code"
import { networkConfig, contractAddressFile } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { storeProposalId } from "../utils/storeContractAddress"

const deployDocumentSignature: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log, get } = deployments
    let { deployer, } = await getNamedAccounts();


    log("Deploying Mock Contract .... ")
    let DECIMALS: number = 8;

    const ethUsdPriceFeed = await deploy("MockV3Aggregator", {
        from: deployer,
        args: [DECIMALS, ethers.utils.parseEther('2000')],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    const btcUsdPriceFeed = await deploy("MockV3Aggregator", {
        from: deployer,
        args: [DECIMALS, ethers.utils.parseEther('1000')],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    const wethMock = await deploy("ERC20Mock", {
        from: deployer,
        args: ["WETH", "WETH", deployer, 100000000000],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    const wbtcMock = await deploy("ERC20Mock", {
        from: deployer,
        args: ["WBTC", "WBTC", deployer, 1000e8],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    log("wethMock", wethMock.address)
    log("wbtcMock", wbtcMock.address)
    log("ethUsdPriceFeed", ethUsdPriceFeed.address)
    log("btcUsdPriceFeed", btcUsdPriceFeed.address)
    let tokenAddresses = [wethMock.address, wbtcMock.address];
    let priceFeedAddresses = [ethUsdPriceFeed.address, btcUsdPriceFeed.address];

    const DecentralizedStableCoin = await deploy("DecentralizedStableCoin", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    log(`DecentralizedStableCoin at ${DecentralizedStableCoin.address}`)

    // log(tokenAddresses, priceFeedAddresses, DecentralizedStableCoin.address)
    const DSCEngine = await ethers.getContractFactory("DSCEngine");

    // Deploy the contract with the specified constructor arguments
    const myContract = await DSCEngine.deploy(tokenAddresses, priceFeedAddresses, DecentralizedStableCoin.address);
    await myContract.deployed();

    // const DSCEngine = await deploy("DSCEngine", {
    //     from: deployer,
    //     args: ['["0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"]', ' ["0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"]', "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"],
    //     log: true,
    //     // we need to wait if on a live network so we can verify properly
    //     waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    // })

    log(`DSCEngine at ${myContract.address}`)
    let documentSignature = await ethers.getContractAt("DecentralizedStableCoin", DecentralizedStableCoin.address);

    let tx = await documentSignature.transferOwnership(myContract.address);
    await tx.wait(1)
    await storeProposalId(DecentralizedStableCoin.address, "DecentralizedStableCoin", contractAddressFile)
    await storeProposalId(myContract.address, "DSCEngine", contractAddressFile)
    await storeProposalId(wethMock.address, "wethMock", contractAddressFile)
    await storeProposalId(wbtcMock.address, "wbtcMock", contractAddressFile)
    await storeProposalId(ethUsdPriceFeed.address, "ethUsdPriceFeed", contractAddressFile)
    await storeProposalId(btcUsdPriceFeed.address, "btcUsdPriceFeed", contractAddressFile)



}


export default deployDocumentSignature
deployDocumentSignature.tags = ["all", "developmentChains", "orcale"];