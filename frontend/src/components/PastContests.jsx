import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContests } from '../store/contestSlice';
import ContestCard from './ContestCard';

const PastContests = () => {
  const dispatch = useDispatch();
  const { contests, status, error } = useSelector((state) => state.contests);

  useEffect(() => {
    dispatch(fetchContests({ status: 'past' }));
  }, [dispatch]);

  if (status === 'loading') {
    return <div className="loading">Loading past contests...</div>;
  }

  if (status === 'failed') {
    return <div className="error-message">{error}</div>;
  }

  const pastContests = contests.filter(contest => contest.status === 'past');

  if (pastContests.length === 0) {
    return <div className="message">No past contests found.</div>;
  }

  return (
    <div className="past-contests">
      <h1>Past Contests</h1>
      <div className="grid">
        {pastContests.map((contest) => (
          <ContestCard 
            key={contest._id} 
            contest={contest}
          />
        ))}
      </div>
    </div>
  );
};

export default PastContests; 