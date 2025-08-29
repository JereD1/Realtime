'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/superbase';

// Types
interface Team {
  id: number;
  name: string;
  logo_url?: string;
  country?: string;
}

interface Player {
  id: number;
  name: string;
  team_id?: number;
  avatar_url?: string;
  country?: string;
  teams?: {
    name: string;
  };
}

const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string>('');
  const [showPlayerForm, setShowPlayerForm] = useState(false);

  const [teamForm, setTeamForm] = useState({
    name: '',
    country: '',
    logo_url: '',
  });

  const [playerForm, setPlayerForm] = useState({
    name: '',
    team_id: '',
    country: '',
    avatar_url: '',
  });

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  // --- Fetch Teams ---
  const fetchTeams = async () => {
    try {
      setError('');
      const { data, error } = await supabase.from('teams').select('*').order('name');
      if (error) {
        setError(`Error fetching teams: ${error.message}`);
        return;
      }
      setTeams(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching teams: ${errorMessage}`);
    }
  };

  // --- Fetch Players ---
  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase.from('players')
        .select(`*, teams(name)`)
        .order('name');
      if (error) {
        setError(`Error fetching players: ${error.message}`);
        return;
      }
      setPlayers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching players: ${errorMessage}`);
    }
  };

  // --- Submit Team ---
  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (editingTeam) {
        const { error } = await supabase.from('teams')
          .update(teamForm)
          .eq('id', editingTeam.id);
        if (error) {
          setError(`Error updating team: ${error.message}`);
          return;
        }
      } else {
        const { error } = await supabase.from('teams')
          .insert([teamForm]);
        if (error) {
          setError(`Error creating team: ${error.message}`);
          return;
        }
      }

      setTeamForm({ name: '', country: '', logo_url: '' });
      setEditingTeam(null);
      await fetchTeams();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error saving team: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Submit Player ---
  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const playerData = {
        ...playerForm,
        team_id: playerForm.team_id ? parseInt(playerForm.team_id) : null,
      };

      const { error } = await supabase.from('players').insert([playerData]);
      if (error) {
        setError(`Error creating player: ${error.message}`);
        return;
      }

      setPlayerForm({ name: '', team_id: '', country: '', avatar_url: '' });
      setShowPlayerForm(false);
      await fetchPlayers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error saving player: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Edit Team ---
  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      country: team.country || '',
      logo_url: team.logo_url || '',
    });
  };

  // --- Delete Team ---
  const handleDeleteTeam = async (teamId: number) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      setError('');
      const { error } = await supabase.from('teams').delete().eq('id', teamId);
      if (error) {
        setError(`Error deleting team: ${error.message}`);
        return;
      }
      await fetchTeams();
      await fetchPlayers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error deleting team: ${errorMessage}`);
    }
  };

  // --- Delete Player ---
  const handleDeletePlayer = async (playerId: number) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      setError('');
      const { error } = await supabase.from('players').delete().eq('id', playerId);
      if (error) {
        setError(`Error deleting player: ${error.message}`);
        return;
      }
      await fetchPlayers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error deleting player: ${errorMessage}`);
    }
  };

  const resetTeamForm = () => {
    setTeamForm({ name: '', country: '', logo_url: '' });
    setEditingTeam(null);
  };

  const resetPlayerForm = () => {
    setPlayerForm({ name: '', team_id: '', country: '', avatar_url: '' });
    setShowPlayerForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Team Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          {editingTeam ? 'Edit Team' : 'Create Team'}
        </h2>

        <form onSubmit={handleTeamSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Team Name *</label>
            <input
              type="text"
              required
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={teamForm.country}
              onChange={(e) => setTeamForm({ ...teamForm, country: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="US, UK, etc."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Logo URL</label>
            <input
              type="url"
              value={teamForm.logo_url}
              onChange={(e) => setTeamForm({ ...teamForm, logo_url: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingTeam ? 'Update Team' : 'Create Team'}
            </button>
            {editingTeam && (
              <button
                type="button"
                onClick={resetTeamForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Team List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Teams ({teams.length})</h2>
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="flex justify-between items-center border p-4 rounded">
              <div className="flex items-center gap-2">
                {team.logo_url && (
                  <img 
                    src={team.logo_url} 
                    alt={team.name} 
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <span>{team.name}</span>
                {team.country && <span className="text-gray-500">({team.country})</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditTeam(team)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player Management Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Players ({players.length})</h2>
          <button
            onClick={() => setShowPlayerForm(!showPlayerForm)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            {showPlayerForm ? 'Cancel' : 'Add Player'}
          </button>
        </div>

        {/* Player Form */}
        {showPlayerForm && (
          <form onSubmit={handlePlayerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded">
            <div>
              <label className="block text-sm font-medium mb-2">Player Name *</label>
              <input
                type="text"
                required
                value={playerForm.name}
                onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Enter player name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Team</label>
              <select
                value={playerForm.team_id}
                onChange={(e) => setPlayerForm({ ...playerForm, team_id: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="">No Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={playerForm.country}
                onChange={(e) => setPlayerForm({ ...playerForm, country: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="US, UK, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Avatar URL</label>
              <input
                type="url"
                value={playerForm.avatar_url}
                onChange={(e) => setPlayerForm({ ...playerForm, avatar_url: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="https://example.com/avatar.png"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : 'Add Player'}
              </button>
              <button
                type="button"
                onClick={resetPlayerForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Player List */}
        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="flex justify-between items-center border p-4 rounded">
              <div className="flex items-center gap-2">
                {player.avatar_url && (
                  <img 
                    src={player.avatar_url} 
                    alt={player.name} 
                    className="w-8 h-8 object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <span className="font-medium">{player.name}</span>
                  {player.teams && (
                    <span className="text-gray-600 text-sm ml-2">• {player.teams.name}</span>
                  )}
                  {player.country && (
                    <span className="text-gray-500 text-sm ml-2">({player.country})</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;