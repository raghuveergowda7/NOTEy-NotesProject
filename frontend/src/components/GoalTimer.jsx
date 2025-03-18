import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './GoalTimer.css';

const GoalTimer = () => {
  const [goalTime, setGoalTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchGoalTime = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8008/goal-timer/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      setGoalTime(response.data.goal_time);
    } catch (error) {
      console.error('Error fetching goal time:', error);
    }
  };

  const calculateTimeRemaining = () => {
    if (!goalTime) return null;

    const now = new Date();
    const goal = new Date(goalTime);
    const diff = goal - now;

    if (diff <= 0) {
      setGoalTime(null);
      deleteGoalTimer();
      toast.info('Goal time reached!', {
        autoClose: 2000,
        pauseOnFocusLoss: false
      });
      return null;
    }

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { years, months, days, hours, minutes, seconds };
  };

  useEffect(() => {
    fetchGoalTime();
  }, []);

  useEffect(() => {
    if (!goalTime) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [goalTime]);

  const handleSetGoal = async (e) => {
    e.preventDefault();
    const selectedDate = e.target.goalDate.value;
    const selectedTime = e.target.goalTime.value;
    
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time', {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        position: "top-center"
      });
      return;
    }

    const goalDateTime = new Date(selectedDate + 'T' + selectedTime);
    
    if (goalDateTime <= new Date()) {
      toast.error('Please select a future date and time', {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        position: "top-center"
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8008/goal-timer/',
        { goal_time: goalDateTime.toISOString() },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setGoalTime(goalDateTime.toISOString());
      setShowDatePicker(false);
      toast.success('Goal timer set successfully!', {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        position: "top-center"
      });
    } catch (error) {
      console.error('Error setting goal time:', error);
      toast.error('Failed to set goal timer', {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        position: "top-center"
      });
    }
  };

  const deleteGoalTimer = async () => {
    try {
      await axios.delete('http://127.0.0.1:8008/goal-timer/delete/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      setGoalTime(null);
      setTimeRemaining(null);
      toast.success('Goal timer deleted successfully!', {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        position: "top-center"
      });
    } catch (error) {
      console.error('Error deleting goal timer:', error);
      toast.error('Failed to delete goal timer', {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        position: "top-center"
      });
    }
  };

  return (
    <div className="goal-timer">
      {!goalTime && !showDatePicker && (
        <button className="set-goal-btn" onClick={() => setShowDatePicker(true)}>
          Set Goal Timer
        </button>
      )}

      {showDatePicker && (
        <form onSubmit={handleSetGoal} className="goal-form">
          <div className="date-time-inputs">
            <input
              type="date"
              name="goalDate"
              className="goal-input"
              min={new Date().toISOString().split('T')[0]}
            />
            <input
              type="time"
              name="goalTime"
              className="goal-input"
            />
          </div>
          <div className="goal-form-buttons">
            <button type="submit" className="save-goal-btn">
              Set Timer
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowDatePicker(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {goalTime && timeRemaining && (
        <div className="countdown-container">
          <div className="countdown-display">
            {timeRemaining.years > 0 && (
              <div className="time-unit">
                <span className="time-value">{timeRemaining.years}</span>
                <span className="time-label">years</span>
              </div>
            )}
            {timeRemaining.months > 0 && (
              <div className="time-unit">
                <span className="time-value">{timeRemaining.months}</span>
                <span className="time-label">months</span>
              </div>
            )}
            {timeRemaining.days > 0 && (
              <div className="time-unit">
                <span className="time-value">{timeRemaining.days}</span>
                <span className="time-label">days</span>
              </div>
            )}
            {timeRemaining.hours > 0 && (
              <div className="time-unit">
                <span className="time-value">{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span className="time-label">hours</span>
              </div>
            )}
            {timeRemaining.minutes > 0 && (
              <div className="time-unit">
                <span className="time-value">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span className="time-label">minutes</span>
              </div>
            )}
            {timeRemaining.seconds >= 0 && (
              <div className="time-unit">
                <span className="time-value">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                <span className="time-label">seconds</span>
              </div>
            )}
          </div>
          <button className="delete-goal-btn" onClick={deleteGoalTimer}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalTimer; 