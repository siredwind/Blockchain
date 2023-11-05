import { Table, Button } from "react-bootstrap";
import { ethers } from "ethers";

const Proposals = ({ provider, dao, proposals, quorum, votes, setIsLoading }) => {
    const voteHandler = async (id) => {
        try {
            const signer = await provider.getSigner()
            const transaction = await dao.connect(signer).vote(id)
            await transaction.wait()
        }
        catch {
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }

    const downVoteHandler = async (id) => {
        try {
            const signer = await provider.getSigner()
            const transaction = await dao.connect(signer).downvote(id)
            await transaction.wait()
        }
        catch {
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }

    const finalizeHandler = async (id) => {
        try {
            const signer = await provider.getSigner()
            const transaction = await dao.connect(signer).finalizeProposal(id)
            await transaction.wait()
        }
        catch {
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Proposal Name</th>
                    <th>Recipient Address</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Total Votes</th>
                    <th>Cast Vote</th>
                    <th>Finalize</th>
                </tr>
            </thead>
            <tbody>
                {proposals.map((proposal, index) => (
                    <tr key={index}>
                        <td>{proposal.id.toString()}</td>
                        <td>{proposal.name}</td>
                        <td>{proposal.recipient}</td>
                        <td>{ethers.utils.formatUnits(proposal.amount, 18)} ETH</td>
                        <td>{proposal.finalized ? 'Approved' : 'In Progress'}</td>
                        <td>{proposal.votes.toString()}</td>
                        <td>
                            {
                                !proposal.finalized && !votes[proposal.id] &&
                                <Button
                                    variant="primary"
                                    style={{ width: '100%' }}
                                    onClick={() => voteHandler(proposal.id)}
                                >
                                    Vote
                                </Button>
                            }
                            {
                                !proposal.finalized && !votes[proposal.id] &&
                                <Button
                                    variant="primary"
                                    style={{ width: '100%', background: 'red' }}
                                    onClick={() => downVoteHandler(proposal.id)}
                                >
                                    Down Vote
                                </Button>
                            }
                        </td>
                        <td>
                            {
                                !proposal.finalized && proposal.votes > quorum &&
                                <Button
                                    variant="primary"
                                    style={{ width: '100%' }}
                                    onClick={() => finalizeHandler(proposal.id)}>
                                    Finalize
                                </Button>
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default Proposals;