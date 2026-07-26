import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import Downloads from '@/pages/Downloads';

const StaticGalleryApp = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/recorrido" element={<Gallery />} />
    <Route path="/descargas" element={<Downloads />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <StaticGalleryApp />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

