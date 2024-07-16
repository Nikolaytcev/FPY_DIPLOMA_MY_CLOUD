import { useContext } from "react"
import { AppContext } from "../../contexst/AppContexst"
import { NavLink, useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, setIsLoggedIn, setError, setUser} = useContext(AppContext);
  const navigate = useNavigate()

  const handleLogout = () => {
    fetch('http://127.0.0.1:8000/api/logout')
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
    <div className="header">
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="#">My cloud</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                      <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" aria-current="page" to="/" onClick={handleLogout}>Logout</NavLink>
                    </li>
                </ul>
                </div>
                {user.username !== '' ? 
                    <span className="navbar-text">
                      Hi, {user.username}
                    </span>
                     : ''
                    }
            </div>
        </nav>
    </div>
  )
}
