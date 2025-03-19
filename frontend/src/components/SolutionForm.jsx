// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchContests } from '../store/contestSlice';
// import axios from 'axios';

// function SolutionForm() {
//   const dispatch = useDispatch();
//   const { contests } = useSelector((state) => state.contests);
//   const [selectedContest, setSelectedContest] = useState('');
//   const [youtubeUrl, setYoutubeUrl] = useState('');
//   const [status, setStatus] = useState('idle');
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     dispatch(fetchContests({ status: 'past' }));
//   }, [dispatch]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus('loading');
//     setError(null);

//     try {
//       await axios.post('http://localhost:5000/api/solutions', {
//         contestId: selectedContest,
//         youtubeUrl,
//         platform: contests.find(c => c._id === selectedContest)?.platform
//       });

//       setStatus('succeeded');
//       setSelectedContest('');
//       setYoutubeUrl('');
//     } catch (err) {
//       setStatus('failed');
//       setError(err.response?.data?.message || 'Failed to add solution');
//     }
//   };

//   const pastContests = contests.filter(contest => contest.status === 'past' && !contest.solutionUrl);

//   return (
//     <div className="max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-8">Add Contest Solution</h1>
      
//       <form onSubmit={handleSubmit} className="card">
//         <div className="mb-6">
//           <label htmlFor="contest" className="block text-sm font-medium mb-2">
//             Select Contest
//           </label>
//           <select
//             id="contest"
//             value={selectedContest}
//             onChange={(e) => setSelectedContest(e.target.value)}
//             className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//             required
//           >
//             <option value="">Select a contest...</option>
//             {pastContests.map((contest) => (
//               <option key={contest._id} value={contest._id}>
//                 {contest.name} ({contest.platform})
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-6">
//           <label htmlFor="youtubeUrl" className="block text-sm font-medium mb-2">
//             YouTube Solution URL
//           </label>
//           <input
//             type="url"
//             id="youtubeUrl"
//             value={youtubeUrl}
//             onChange={(e) => setYoutubeUrl(e.target.value)}
//             className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
//             placeholder="https://youtube.com/watch?v=..."
//             required
//           />
//         </div>

//         {status === 'failed' && (
//           <div className="mb-4 text-red-600 dark:text-red-400">
//             {error}
//           </div>
//         )}

//         {status === 'succeeded' && (
//           <div className="mb-4 text-green-600 dark:text-green-400">
//             Solution added successfully!
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={status === 'loading'}
//           className="btn btn-primary w-full"
//         >
//           {status === 'loading' ? 'Adding...' : 'Add Solution'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default SolutionForm; 