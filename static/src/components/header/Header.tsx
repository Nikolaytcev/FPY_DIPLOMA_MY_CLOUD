import { useContext } from "react"
import { AppContext } from "../../contexst/AppContexst"
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../pages/Home";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export const Header = () => {
  const { user, setIsLoggedIn, setError, setUser} = useContext(AppContext);
  const navigate = useNavigate()

  const handleLogout = () => {
    fetch(`${BASE_URL}/api/logout`)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setUser({id: 0, username: '', status: ''})
        setIsLoggedIn(false);
        navigate('/')
      })
      .catch(error => setError(error));
  }

  return (
    <Navbar collapseOnSelect expand="lg" fixed="top" className="navbar-dark bg-primary">
      <Container>
        <Navbar.Brand href="/">My-cloud</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/" onClick={handleLogout}>logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {user.username !== '' ? 
              <span className="navbar-text">
                Hi, {user.username} <br />
                {user.status === 'admin' ? <span>status: admin</span> : <span>status: user</span>}
              </span>
              : ''
            }
          </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>
  )
}

