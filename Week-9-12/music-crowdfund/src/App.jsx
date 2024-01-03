import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Home from './components/Home/Home';

// ABIs: Import your contract ABIs here
// import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
// import config from '../config.json';

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch account balance
    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatUnits(balance, 18)
    setBalance(balance)

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return (
    // <Container>
    //   <Navigation account={account} />

    //   <h1 className='my-4 text-center'>React Hardhat Template</h1>

    //   {isLoading ? (
    //     <Loading />
    //   ) : (
    //     <>
    //       <p className='text-center'><strong>Your ETH Balance:</strong> {balance} ETH</p>
    //       <p className='text-center'>Edit App.js to add your code here.</p>
    //     </>
    //   )}
    // </Container>
    <>
      <Navbar />
      <Home />
    </>
  )
}

export default App;
