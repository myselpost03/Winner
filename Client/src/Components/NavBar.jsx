import React from 'react';
import './NavBar.scss';
import Tabs from './Tabs';
import SearchBar from './SearchBar';

const NavBar = () => {
  return (
    <div className='desktop-navbar'>
      <div className="website-title">
        <h1>MySelpost</h1>
      </div>
      <div className='search'>
        <SearchBar />
      </div>
      <div className="tabs">
        <Tabs />
      </div>
    </div>
  )
}

export default NavBar
