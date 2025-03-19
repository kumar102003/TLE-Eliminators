import { useDispatch } from 'react-redux';
import { format, formatDistanceToNow } from 'date-fns';
import { toggleBookmark } from '../store/contestSlice';

function ContestCard({ contest }) {
  const dispatch = useDispatch();

  const getPlatformClass = (platform) => {
    return `platform-tag ${platform.toLowerCase()}`;
  };

  const handleBookmarkClick = async () => {
    try {
      await dispatch(toggleBookmark(contest._id)).unwrap();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // You might want to show an error message to the user here
      alert('Failed to toggle bookmark. Please try again.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{contest.name}</h3>
          <span className={getPlatformClass(contest.platform)}>
            {contest.platform}
          </span>
        </div>
        <button
          onClick={handleBookmarkClick}
          className="bookmark-btn"
          aria-label={contest.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {contest.isBookmarked ? '⭐' : '☆'}
        </button>
      </div>
      
      <div className="contest-details">
        <div className="detail-item">
          <span className="detail-label">Starts:</span>
          <span>{format(new Date(contest.startTime), 'PPp')}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Duration:</span>
          <span>{contest.duration} minutes</span>
        </div>
        {contest.status !== 'past' && (
          <div className="detail-item">
            <span className="detail-label">Starts in:</span>
            <span>{formatDistanceToNow(new Date(contest.startTime), { addSuffix: true })}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          View Contest
        </a>
        {contest.status === 'past' && (
          contest.solutionVideo?.youtubeUrl ? (
            <a
              href={contest.solutionVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              View Solution
            </a>
          ) : (
            <span className="no-solution">Solution not available yet</span>
          )
        )}
      </div>
    </div>
  );
}

export default ContestCard; 