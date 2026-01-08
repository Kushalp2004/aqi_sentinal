import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onLoadComplete={() => setLoading(false)} />}
      {!loading && <Dashboard />}
    </>
  );
}

export default App;
