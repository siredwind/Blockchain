import React, { useEffect } from 'react';

// Components
import Navigation from './components/Navigation';
import Home from './components/Home';
import CreateCampaign from './components/Campaign/CreateCampaign';

// Redux
import { useDispatch } from 'react-redux';

// Routes
import { HashRouter, Route, Routes } from 'react-router-dom';

// Store
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadToken,
  loadMC,
  loadCampaigns,
} from "./store/interactions";


const App = () => {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = loadProvider(dispatch);

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch);

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    })

    // Fetch current account from Metamask when changed
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(dispatch);
    })

    // Initiate contracts
    await loadToken(provider, chainId, dispatch);
    const mc = await loadMC(provider, chainId, dispatch);

    // Load campaigns details
    await loadCampaigns(mc, dispatch);
  }

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <HashRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
      </Routes>

    </HashRouter>
  );
};

export default App;
