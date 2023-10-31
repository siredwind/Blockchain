import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Create from './Create';
import Loading from './Loading';
import Proposals from './Proposals';

// ABIs: Import your contract ABIs here
import DAO_ABI from '../abis/DAO.json'

// Config: Import your network config here
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [dao, setDao] = useState(null)
  const [treasuryBalance, setTreasuryBalance] = useState(0)
  const [proposals, setProposals] = useState([])
  const [votes, setVotes] = useState([])
  const [quorum, setQuorum] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Initiate contracts
    const dao = new ethers.Contract(config[31337].dao.address, DAO_ABI, provider)
    setDao(dao)

    // Fetch treasury balance
    let treasuryBalance = await provider.getBalance(dao.address)
    treasuryBalance = ethers.utils.formatUnits(treasuryBalance, 18)
    setTreasuryBalance(treasuryBalance)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    const balance = await provider.getBalance(account)
    setBalance(ethers.utils.formatUnits(balance.toString(), 18))

    // Fetch proposals count
    const count = await dao.proposalCount()
    let proposals = []
    let votes = {}

    for (let no = 1; no <= count; no++) {
      // Fetch proposals
      const proposal = await dao.proposals(no)
      proposals.push(proposal)

      // Fetch user votes 
      const vote = await dao.votes(account, no)
      votes[no] = vote
    }
    setProposals(proposals)
    setVotes(votes);
  
    // Fetch quorum
    setQuorum(await dao.quorum())

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  // Add an event listener for MetaMask account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        setIsLoading(true);
      });
    }
  }, []);

  console.log(balance)
  return (
    <Container>
      <Navigation account={account} balance={balance}/>

      <h1 className='my-4 text-center'>Welcome to our DAO!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Create {...{ provider, dao, setIsLoading }} />
          <hr />
          <p className='text-center'>
            <strong>Treasury Balance:</strong> {treasuryBalance} ETH
          </p>
          <p className='text-center'>
            <strong>Quorum:</strong> {ethers.utils.formatUnits(quorum, 18)} ETH
          </p>
          <hr />
          <Proposals {...{ provider, proposals, dao, quorum, votes, setIsLoading }} />
        </>
      )}
    </Container>
  )
}

export default App;
