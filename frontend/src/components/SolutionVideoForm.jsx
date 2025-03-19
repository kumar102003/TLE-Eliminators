import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContests } from '../store/contestSlice';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const SolutionVideoForm = () => {
  const [selectedContest, setSelectedContest] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [addedBy, setAddedBy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const allContests = useSelector(state => state.contests.contests);
  
  const contests = useMemo(() => 
    allContests.filter(contest => contest.status === 'past'),
    [allContests]
  );

  useEffect(() => {
    dispatch(fetchContests({ status: 'past' }));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedContest || !youtubeUrl) {
      setError('Please fill in all required fields');
      return;
    }

    // Simple validation - just check if it's a YouTube URL
    if (!youtubeUrl.includes('youtube.com/') && !youtubeUrl.includes('youtu.be/')) {
      setError('Please enter a YouTube URL');
      return;
    }

    console.log('Submitting form with data:', {
      contestId: selectedContest,
      youtubeUrl,
      addedBy
    });

    try {
      const response = await axios.post(`${API_URL}/contests/${selectedContest}/solution-video`, {
        youtubeUrl,
        addedBy
      });

      console.log('Response from server:', response.data);

      setMessage('Solution video added successfully!');
      setSelectedContest('');
      setYoutubeUrl('');
      setAddedBy('');
      
      // Refresh contests list
      dispatch(fetchContests({ status: 'past' }));
    } catch (error) {
      console.error('Error from server:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to add solution video');
    }
  };

  return (
    <div className="solution-form">
      <h2>Add Solution Video</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="contest">Contest:</label>
          <select
            id="contest"
            value={selectedContest}
            onChange={(e) => setSelectedContest(e.target.value)}
            required
          >
            <option value="">Select a contest</option>
            {contests.map(contest => (
              <option key={contest._id} value={contest._id}>
                {contest.name} ({contest.platform})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="youtubeUrl">
            YouTube Video URL:
            <small className="help-text"> (Enter a single video URL, not a playlist)</small>
          </label>
          <input
            type="url"
            id="youtubeUrl"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=XXXXXXXXXXX or https://youtu.be/XXXXXXXXXXX"
            required
          />
          <small className="url-examples">
            Valid formats:
            <ul>
              <li>https://youtube.com/watch?v=XXXXXXXXXXX</li>
              <li>https://youtu.be/XXXXXXXXXXX</li>
            </ul>
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="addedBy">Added By:</label>
          <input
            type="text"
            id="addedBy"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <button type="submit" className="btn">Add Solution Video</button>
      </form>
    </div>
  );
};

export default SolutionVideoForm; 