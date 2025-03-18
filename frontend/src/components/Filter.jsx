import React from 'react';
import { FaBriefcase, FaUser, FaStar } from 'react-icons/fa';
import GoalTimer from './GoalTimer';
import './Filter.css';

const Filter = ({ handleFilterText }) => {
  const categories = [
    { id: 'ALL', label: 'All Notes', icon: null },
    { id: 'BUSINESS', label: 'Business', icon: <FaBriefcase /> },
    { id: 'PERSONAL', label: 'Personal', icon: <FaUser /> },
    { id: 'IMPORTANT', label: 'Important', icon: <FaStar /> },
  ];

  return (
    <div className="filter-container">
      <div className="filter-content">
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category.id}
              className="filter-button"
              onClick={() => handleFilterText(category.id === 'ALL' ? '' : category.id)}
            >
              {category.icon && <span className="filter-icon">{category.icon}</span>}
              {category.label}
            </button>
          ))}
        </div>
        <GoalTimer />
      </div>
    </div>
  );
};

export default Filter;
