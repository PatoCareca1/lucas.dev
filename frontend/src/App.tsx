import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Labs from './pages/Labs';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Guides from './pages/Guides';
import GuideArticle from './pages/GuideArticle';

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
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetails />} />
          <Route path="guias" element={<Guides />} />
          <Route path="guias/:slug" element={<GuideArticle />} />
          <Route path="guides" element={<Guides />} />
          <Route path="guides/:slug" element={<GuideArticle />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
