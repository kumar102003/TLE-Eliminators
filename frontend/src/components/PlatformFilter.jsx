import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPlatforms } from '../store/contestSlice';

const platforms = ['CodeForces', 'CodeChef', 'LeetCode', 'AtCoder', 'HackerRank', 'HackerEarth'];

function PlatformFilter() {
  const dispatch = useDispatch();
  const selectedPlatforms = useSelector((state) => state.contests.selectedPlatforms);

  const togglePlatform = (platform) => {
    const newSelection = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    dispatch(setSelectedPlatforms(newSelection));
  };

  return (
    <div className="filter-section">
      <h2>Filter by Platform</h2>
      <div className="platform-tags">
        {platforms.map(platform => (
          <button
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={`platform-tag ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
            data-platform={platform}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PlatformFilter; 