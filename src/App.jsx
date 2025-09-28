import React from 'react';
import './App.css';
import DashboardCard from './components/DashboardCard';
import JvmHeapChart from './components/JvmHeapChart';
import HttpErrorsChart from './components/HttpErrorsChart';
import NodeDiskChart from './components/NodeDiskChart';
import DbConnectionChart from './components/DbConnectionChart';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1> opslinked-ai Dashboard </h1>
      </header>
      <main className="dashboard-grid">
        <DashboardCard title="JVM Heap Memory Usage (%)">
          <JvmHeapChart />
        </DashboardCard>
        
        <DashboardCard title="HTTP 5xx Server Error Rate (%)">
          <HttpErrorsChart />
        </DashboardCard>
        
        <DashboardCard title="Node Root Disk Usage (%)">
          <NodeDiskChart />
        </DashboardCard>
        
        <DashboardCard title="Active DB Connections">
          <DbConnectionChart />
        </DashboardCard>
      </main>
    </div>
  );
}

export default App;