import React from 'react'
import { FaSquarePlus } from "react-icons/fa6";
import { Link } from "react-router-dom"
import './Navbar.css'

const NavBar = ({
  searchText,
  handelSearchText,
  isAuthenticated,
  username,
  handleLogout
}) => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <h4>Notey</h4>
        </Link>

        {isAuthenticated && (
          <>
            <div className="search-container">
              <div className="search-box">
                <input
                  className="search-input"
                  placeholder="Search (minimum 3 characters)"
                  value={searchText}
                  onChange={(e) => handelSearchText(e.target.value)}
                />
                <button className="search-button">
                  Search
                </button>
              </div>
            </div>

            <div className="nav-actions">
              <span className="welcome-text">Welcome, {username}!</span>
              <div className="action-buttons">
                <Link to="/add-note" className="add-note-link">
                  <button className="add-note-button">
                    <FaSquarePlus className="add-icon" /> Add Notes
                  </button>
                </Link>
                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar