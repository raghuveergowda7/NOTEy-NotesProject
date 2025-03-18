import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({
  searchText,
  handelSearchText,
  isAuthenticated,
  username,
  handleLogout
}) => {
  return (
    <div className="main-layout">
      <NavBar
        searchText={searchText}
        handelSearchText={handelSearchText}
        isAuthenticated={isAuthenticated}
        username={username}
        handleLogout={handleLogout}
      />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
      <ToastContainer 
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={true}
        theme="light"
        limit={3}
      />
    </div>
  )
}

export default MainLayout