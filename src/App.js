// App.js

import React, { useState } from 'react';
import './App.css';
import mockData from './heliverse_mock_data.json';

const UsersCard = ({ user, addToTeam }) => (
  <div className="user-card" key={user.id}>
    <div>{user.first_name + ' ' + user.last_name}</div>
    <div>{user.email}</div>
    <img src={user.avatar} alt={user.first_name} />
    <div>Domain - {user.domain}</div>
    <div>Gender - {user.gender}</div>
    <div>Available - {user.available ? 'Yes' : 'No'}</div>
    <button
      onClick={() => addToTeam(user)}
      disabled={!user.available}
      className={user.available ? '' : 'disabled'}
    >
      Add to Team
    </button>
  </div>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    domain: '',
    gender: '',
    availability: '',
  });

  const [team, setTeam] = useState([]);

  const usersPerPage = 20;

  const filteredUsers = mockData.filter((user) => {
    const nameMatches = user.first_name.toLowerCase().includes(searchQuery.toLowerCase());

    const domainMatches = !filters.domain || user.domain === filters.domain;
    const genderMatches = !filters.gender || user.gender === filters.gender;
    const availabilityMatches = !filters.availability || (user.available && filters.availability === 'available') || (!user.available && filters.availability === 'unavailable');

    return nameMatches && domainMatches && genderMatches && availabilityMatches;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
    setCurrentPage(1); // Reset to the first page when filters change
  };

  const addToTeam = (user) => {
    // Check if the user is available before adding to the team
    if (user.available) {
      // Check if the user's domain is already in the team
      if (!team.some((teamUser) => teamUser.domain === user.domain)) {
        setTeam([...team, user]);
      }
    }
  };

  return (
    <div className="App">
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select onChange={(e) => handleFilterChange('domain', e.target.value)}>
          <option value="">All Domains</option>
          {[...new Set(mockData.map((user) => user.domain))].map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
        <select onChange={(e) => handleFilterChange('gender', e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select onChange={(e) => handleFilterChange('availability', e.target.value)}>
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      <div className="user-cards">
        {currentUsers.map((user) => (
          <UsersCard key={user.id} user={user} addToTeam={addToTeam} />
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {team.length > 0 && (
        <div className="team-details">
          <h2>Team Details</h2>
          {team.map((teamUser) => (
            <div className="team-member" key={teamUser.id}>
              <div className="team-member-details">
                <img src={teamUser.avatar} alt={teamUser.first_name} />
                <div className="team-member-name">{teamUser.first_name} {teamUser.last_name}</div>
                <div className="team-member-domain">Domain: {teamUser.domain}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default App;
