// Main Admin Dashboard Component

'use client'
import React, { useState } from 'react';
import TeamManagement from './TeamManagement';
import TournamentManagement from './TournamentManagement';
import MatchManagement from './FixtureManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('teams');

  const tabs = [
    { id: 'teams', label: 'Teams & Players', component: TeamManagement },
    { id: 'tournaments', label: 'Tournaments', component: TournamentManagement },
    { id: 'matches', label: 'Matches', component: MatchManagement }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || TeamManagement;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            COD Mobile Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your esports tournament data
          </p>
        </div>

        <ActiveComponent />
      </div>
    </div>
  );
};