import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/Navbar';
import ContestList from './components/ContestList';
import BookmarkedContests from './components/BookmarkedContests';
import PastContests from './components/PastContests';
//import SolutionForm from './components/SolutionForm';
import Bookmarks from './components/Bookmarks';
import SolutionVideoForm from './components/SolutionVideoForm';

function App() {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<ContestList />} />
              <Route path="/bookmarked" element={<BookmarkedContests />} />
              <Route path="/past" element={<PastContests />} />
              <Route path="/add-solution" element={<SolutionVideoForm />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
