import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarkedContests } from '../store/contestSlice';
import ContestCard from './ContestCard';

function Bookmarks() {
  const dispatch = useDispatch();
  const { contests, status, error } = useSelector((state) => state.contests);

  useEffect(() => {
    dispatch(fetchBookmarkedContests());
  }, [dispatch]);

  if (status === 'loading') {
    return <div className="loading">Loading bookmarked contests...</div>;
  }

  if (status === 'failed') {
    return <div className="error-message">{error}</div>;
  }

  if (contests.length === 0) {
    return <div className="message">No bookmarked contests found.</div>;
  }

  return (
    <div>
      <h1>Bookmarked Contests</h1>
      <div className="grid">
        {contests.map((contest) => (
          <ContestCard key={contest._id} contest={contest} />
        ))}
      </div>
    </div>
  );
}

export default Bookmarks; 