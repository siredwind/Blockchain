import Navbar from 'react-bootstrap/Navbar';

import logo from '../logo.png';

const Navigation = ({ account, balance }) => {
  return (
    <Navbar className='my-3'>
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#">MTH DAO</Navbar.Brand>
      <Navbar.Collapse className="justify-content-center">
        <Navbar.Text className='mx-5'>
          <strong>Address:</strong> {account}
        </Navbar.Text>
        &nbsp;
        <Navbar.Text className='mx-10'>
          <strong>Balance:</strong> {balance.toString().slice(0, 7)} ETH
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
