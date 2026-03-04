import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Labs from './pages/Labs';
import ProjectDetails from './pages/ProjectDetails';

// Helper component to ensure window scrolls to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="labs" element={<Labs />} />
          <Route path="projects/:slug" element={<ProjectDetails />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
