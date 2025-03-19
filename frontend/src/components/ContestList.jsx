import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContests } from '../store/contestSlice';
import ContestCard from './ContestCard';
import PlatformFilter from './PlatformFilter';

function ContestList() {
  const dispatch = useDispatch();
  const { contests, status, error, selectedPlatforms } = useSelector((state) => state.contests);

  useEffect(() => {
    dispatch(fetchContests({ status: 'upcoming', platform: selectedPlatforms.join(',') }));
  }, [dispatch, selectedPlatforms]);

  if (status === 'loading') {
    return <div className="loading">Loading contests...</div>;
  }

  if (status === 'failed') {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <PlatformFilter />
      <div className="grid">
        {contests.map((contest, index) => (
          <ContestCard key={index} contest={contest} />
        ))}
      </div>
    </div>
  );
}

export default ContestList; 