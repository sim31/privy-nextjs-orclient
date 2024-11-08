'use client'
// import { ORClient } from "orclient";
// import { ORContext, ConfigWithOrnode } from "ortypes/orContext.js";
// import { config } from "./config.js"
import { ORContext } from "@ordao/ortypes";
import { RemoteOrnode, ORClient } from "@ordao/orclient";
import { BrowserProvider } from "ethers";
import { ConnectedWallet } from "@privy-io/react-auth";

// For seeing orclient debug logs in console

console.debug = console.log;

// Configuration for OP Sepolia 1 deployment
// Copied from console output in https://test2-console.frapps.xyz/
const config = {
  "contracts": {
    "oldRespect": "0x6b11FC2cec86edeEd1F3705880deB9010F0D584B",
    "newRespect": "0xF7640995eAffAf5dB5ABEa7cE1F06Be968BFF5e5",
    "orec": "0x430f3F482831898Bc83c7Fe11948b3ADBE025B66"
  },
  "ornodeUrl": "https://test2-ornode.frapps.xyz",
  "appTitle": "ORConsole (test)",
  "chainInfo": {
    "chainId": "0xAA37DC",
    "rpcUrls": [
      "https://sepolia.optimism.io"
    ],
    "chainName": "OP Sepolia",
    "blockExplorerUrl": "https://optimism-sepolia.blockscout.com/",
  }
}
// Configurations for other deployments:
// For Optimism Fractal deployment: https://of-console.frapps.xyz/
// For ORDAO office hours config: https://ordao-console.frapps.xyz/
// Look for console output that starts with "Parsing config: "

export async function createOrclient(wallet: ConnectedWallet): Promise<ORClient> {
  const ornode: RemoteOrnode = new RemoteOrnode(config.ornodeUrl);

  await wallet.switchChain(config.chainInfo.chainId as `0x${string}`);

  const provider = await wallet.getEthereumProvider();
  const bp = new BrowserProvider(provider);
  const signer = await bp.getSigner();

  const ctxCfg: ORContext.ConfigWithOrnode = {
    orec: config.contracts.orec,
    newRespect: config.contracts.newRespect,
    ornode,
    contractRunner: signer
  }
  const ctx = await ORContext.ORContext.create<ORContext.ConfigWithOrnode>(ctxCfg);

  const orclient = new ORClient(ctx);

  // If you want to be able to use through console
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).c = orclient;

  return orclient;
}

