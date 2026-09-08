import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WelfareProvider } from './context/WelfareContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PersonnelModal } from './components/PersonnelModal';
import { ExportModal } from './components/ExportModal';
import { Toast } from './components/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { PersonnelPage } from './pages/PersonnelPage';
import { MonitorPage } from './pages/MonitorPage';
import { AlertsPage } from './pages/AlertsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen military-grid">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div
        className="transition-all duration-300 flex flex-col min-h-screen"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '256px' }}
      >
        <Header />

        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/personnel" element={<PersonnelPage />} />
            <Route path="/monitor" element={<MonitorPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>

      {/* Global Overlays */}
      <PersonnelModal />
      <ExportModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <WelfareProvider>
        <AppContent />
      </WelfareProvider>
    </BrowserRouter>
  );
}
