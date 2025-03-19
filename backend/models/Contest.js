const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Codeforces', 'CodeChef', 'LeetCode', 'AtCoder'],
    set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() // Normalize platform names
  },
  contestCode: {
    type: String,
    required: true,
    unique: true // This ensures no duplicates
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'past'],
    required: true,
    default: 'upcoming'
  },
  solutionVideo: {
    youtubeUrl: String,
    title: String,
    addedAt: Date,
    addedBy: String
  },
  relatedVideos: [{ type: String }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time remaining
contestSchema.virtual('timeRemaining').get(function() {
  if (this.status === 'past') return '0';
  const now = new Date();
  const diff = this.startTime - now;
  
  if (diff <= 0 && now <= this.endTime) {
    return 'Ongoing';
  }
  
  if (diff <= 0) return '0';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${hours}h ${minutes}m`;
});

// Function to calculate status
function calculateStatus(startTime, endTime) {
  const now = new Date();
  if (endTime < now) {
    return 'past';
  } else if (startTime <= now && endTime >= now) {
    return 'ongoing';
  } else {
    return 'upcoming';
  }
}

// Update status before saving
contestSchema.pre('save', function(next) {
  this.status = calculateStatus(this.startTime, this.endTime);
  next();
});

// Update status before findOneAndUpdate
contestSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.startTime && update.endTime) {
    update.status = calculateStatus(update.startTime, update.endTime);
  }
  next();
});

module.exports = mongoose.model('Contest', contestSchema); 