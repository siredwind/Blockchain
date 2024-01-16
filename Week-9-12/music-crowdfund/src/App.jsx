import React from 'react';

// Components
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateCampaign from './components/Campaign/CreateCampaign';

// Routes
import { Route, Routes } from 'react-router-dom';

// Hooks
import { useAccount } from 'wagmi';

const App = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
      </Routes>
    </>
  );
};

export default App;
