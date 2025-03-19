const axios = require('axios');
const Contest = require('../models/Contest');
const mongoose = require('mongoose');

// YouTube API helper function
async function fetchYouTubeVideos(playlistId) {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50,
        key: process.env.YOUTUBE_API_KEY
      }
    });
    return response.data.items.map(item => item.snippet.resourceId.videoId);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

// Get platform-specific playlist ID
function getPlaylistId(platform) {
  switch (platform.toLowerCase()) {
    case 'codeforces':
      return process.env.CODEFORCES_PLAYLIST_ID;
    case 'codechef':
      return process.env.CODECHEF_PLAYLIST_ID;
    case 'leetcode':
      return process.env.LEETCODE_PLAYLIST_ID;
    case 'atcoder':
      return process.env.ATCODER_PLAYLIST_ID;
    default:
      return null;
  }
}

// Get all contests
exports.getContests = async (req, res) => {
  try {
    const { platform, status } = req.query;
    const now = new Date();
    
    let query = {};
    
    // Handle status filter
    if (status === 'upcoming') {
      query.startTime = { $gt: now };
    } else if (status === 'ongoing') {
      query.startTime = { $lte: now };
      query.endTime = { $gte: now };
    } else if (status === 'past') {
      query.endTime = { $lt: now };
    }
    
    // Handle platform filter
    if (platform && platform !== '') {
      query.platform = platform.includes(',') ? { $in: platform.split(',') } : platform;
    }
    
    const contests = await Contest.find(query).sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get bookmarked contests
exports.getBookmarkedContests = async (req, res) => {
  try {
    const contests = await Contest.find({ isBookmarked: true }).sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle bookmark status
exports.toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contest ID' });
    }

    // Use findOneAndUpdate for atomic operation
    const updatedContest = await Contest.findOneAndUpdate(
      { _id: id },
      [{ $set: { isBookmarked: { $not: "$isBookmarked" } } }],
      { new: true }
    );

    if (!updatedContest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    
    res.json(updatedContest);
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ 
      message: 'Error toggling bookmark',
      error: error.message 
    });
  }
};

// Get related videos
exports.getRelatedVideos = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    
    const playlistId = getPlaylistId(contest.platform);
    if (!playlistId) {
      return res.json([]);
    }
    
    const videos = await fetchYouTubeVideos(playlistId);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contests
exports.updateContests = async () => {
  try {
    // Fetch Codeforces contests
    const cfResponse = await axios.get('https://codeforces.com/api/contest.list');
    const cfContests = cfResponse.data.result
      .filter(contest => !contest.phase.includes('FINISHED'))
      .map(contest => ({
        name: contest.name,
        url: `https://codeforces.com/contest/${contest.id}`,
        platform: 'Codeforces',
        startTime: new Date(contest.startTimeSeconds * 1000),
        endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
        duration: contest.durationSeconds / 60,
        contestCode: `cf_${contest.id}`
      }));

    // Fetch CodeChef contests
    const chefResponse = await axios.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc');
    const chefContests = [
      ...chefResponse.data.future_contests,
      ...chefResponse.data.present_contests
    ].map(contest => ({
      name: contest.contest_name,
      url: `https://www.codechef.com/${contest.contest_code}`,
      platform: 'CodeChef',
      startTime: new Date(contest.contest_start_date_iso),
      endTime: new Date(contest.contest_end_date_iso),
      duration: Math.round((new Date(contest.contest_end_date_iso) - new Date(contest.contest_start_date_iso)) / (60 * 1000)),
      contestCode: `cc_${contest.contest_code}`
    }));

    // Fetch AtCoder contests
    const atcoderResponse = await axios.get('https://kenkoooo.com/atcoder/resources/contests.json');
    const now = Date.now();
    const atcoderContests = atcoderResponse.data
      .filter(contest => new Date(contest.start_epoch_second * 1000) > now)
      .map(contest => ({
        name: contest.title,
        url: `https://atcoder.jp/contests/${contest.id}`,
        platform: 'AtCoder',
        startTime: new Date(contest.start_epoch_second * 1000),
        endTime: new Date((contest.start_epoch_second + contest.duration_second) * 1000),
        duration: Math.round(contest.duration_second / 60),
        contestCode: `ac_${contest.id}`
      }));

    // Combine all contests
    const allContests = [...cfContests, ...chefContests, ...atcoderContests];

    // First, get all bookmarked contests to preserve their status
    const bookmarkedContests = await Contest.find({ isBookmarked: true }, 'contestCode');
    const bookmarkedCodes = new Set(bookmarkedContests.map(c => c.contestCode));

    console.log('Currently bookmarked contest codes:', bookmarkedCodes);

    // Clean up non-past contests
    await Contest.deleteMany({
      $or: [
        { platform: 'CodeChef', status: { $ne: 'past' } },
        { platform: 'Codeforces', status: { $ne: 'past' } },
        { platform: 'AtCoder', status: { $ne: 'past' } }
      ]
    });

    // Update database with new contests, preserving bookmark status
    for (const contest of allContests) {
      const wasBookmarked = bookmarkedCodes.has(contest.contestCode);
      console.log(`Updating contest ${contest.contestCode}, wasBookmarked: ${wasBookmarked}`);
      
      await Contest.findOneAndUpdate(
        { contestCode: contest.contestCode },
        { 
          ...contest,
          isBookmarked: wasBookmarked // Preserve bookmark status
        },
        { upsert: true, new: true }
      );
    }

    console.log('Contests updated successfully');
  } catch (error) {
    console.error('Error updating contests:', error);
  }
};

// Update contest statuses
exports.updateContestStatus = async () => {
  const now = new Date();
  
  try {
    // Update to ongoing
    await Contest.updateMany(
      { 
        startTime: { $lte: now },
        endTime: { $gt: now },
        status: 'upcoming'
      },
      { $set: { status: 'ongoing' } }
    );

    // Update to past
    await Contest.updateMany(
      { 
        endTime: { $lte: now },
        status: { $in: ['upcoming', 'ongoing'] }
      },
      { $set: { status: 'past' } }
    );
  } catch (error) {
    console.error('Error updating contest status:', error);
  }
};

// Add solution video
exports.addSolutionVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contest ID' });
    }

    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    const videoDetails = await fetchVideoDetails(videoId);
    if (!videoDetails) {
      return res.status(400).json({ message: 'Could not fetch video details' });
    }

    contest.solutionVideo = videoDetails;
    const updatedContest = await contest.save();
    
    res.json(updatedContest);
  } catch (error) {
    console.error('Error adding solution video:', error);
    res.status(500).json({ message: error.message });
  }
};

// Edit solution video
exports.editSolutionVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contest ID' });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    const videoDetails = await fetchVideoDetails(videoId);
    if (!videoDetails) {
      return res.status(400).json({ message: 'Could not fetch video details' });
    }

    const updatedContest = await Contest.findByIdAndUpdate(
      id,
      { $set: { solutionVideo: videoDetails } },
      { new: true }
    );

    if (!updatedContest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.json(updatedContest);
  } catch (error) {
    console.error('Error editing solution video:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete solution video
exports.deleteSolutionVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contest ID' });
    }

    const updatedContest = await Contest.findByIdAndUpdate(
      id,
      { $unset: { solutionVideo: "" } },
      { new: true }
    );

    if (!updatedContest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.json(updatedContest);
  } catch (error) {
    console.error('Error deleting solution video:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Helper function to fetch video details from YouTube
async function fetchVideoDetails(videoId) {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY
      }
    });
    
    if (response.data.items.length === 0) {
      return null;
    }
    
    const video = response.data.items[0];
    return {
      youtubeId: videoId,
      title: video.snippet.title,
      addedAt: new Date(),
      addedBy: 'system'
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
} 