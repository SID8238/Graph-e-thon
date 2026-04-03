import React from 'react';
import Dashboard from './Dashboard';
import { useSpectar } from './useSpectar';

export default function App() {
  const { sensorData, threatHistory, alerts, connected } = useSpectar();

  return (
    <>
      <div className="spectar-bg" />
      <Dashboard
        sensorData={sensorData}
        threatHistory={threatHistory}
        alerts={alerts}
        connected={connected}
      />
    </>
  );
}