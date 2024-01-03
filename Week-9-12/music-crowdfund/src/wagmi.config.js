import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets } from "@rainbow-me/rainbowkit"

import { configureChains, createConfig, createStorage } from "wagmi"

import { hardhat, polygonMumbai } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

const { chains, publicClient } = configureChains(
    // [polygonMumbai, mainnet, polygon, optimism, arbitrum, base, zora, hardhat]
    [polygonMumbai, hardhat],
    [alchemyProvider({ apiKey: "-mN93uQwSHMo3x3ZqlvVmMC1zXvlHtFd" }), publicProvider()]
)

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains
  });  

const config = createConfig({
    autoConnect: true,
    connectors,
    storage: createStorage({ storage: window.localStorage }),
    alchemyProvider,
    publicClient,
})

export { chains, config }
