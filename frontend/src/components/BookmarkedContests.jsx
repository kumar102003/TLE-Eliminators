import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContests } from '../store/contestSlice';
import ContestCard from './ContestCard';

function BookmarkedContests() {
  const dispatch = useDispatch();
  const { contests, status, error } = useSelector((state) => state.contests);

  useEffect(() => {
    dispatch(fetchContests({}));
  }, [dispatch]);

  const bookmarkedContests = contests.filter((contest) => contest.isBookmarked);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Bookmarked Contests</h1>
      {bookmarkedContests.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No bookmarked contests yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedContests.map((contest) => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarkedContests; 