'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/superbase';

// --- Type Definitions ---
type TeamRef = {
  id: number;
  name: string;
  logo_url?: string;
};

type TournamentRef = {
  name: string;
};

type Match = {
  id: number;
  tournament_id: number;
  team1_id: number;
  team2_id: number;
  match_date: string | null;
  map_name?: string;
  game_mode?: string;
  round?: string;
  status: string;
  team1?: TeamRef;
  team2?: TeamRef;
  tournaments?: TournamentRef;
};

type Tournament = {
  id: number;
  name: string;
};

type Team = {
  id: number;
  name: string;
  logo_url?: string;
};

// --- Component ---
const MatchManagement: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string>('');

  const [form, setForm] = useState({
    tournament_id: '',
    team1_id: '',
    team2_id: '',
    match_date: '',
    map_name: '',
    game_mode: '',
    round: '',
    status: 'scheduled',
  });

  useEffect(() => {
    fetchMatches();
    fetchTournaments();
    fetchTeams();
  }, []);

  // --- Fetch Data ---
  const fetchMatches = async () => {
    try {
      setError('');
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          team1:teams!matches_team1_id_fkey(id, name, logo_url),
          team2:teams!matches_team2_id_fkey(id, name, logo_url),
          tournaments(name)
        `)
        .order('match_date', { ascending: false });

      if (error) {
        setError(`Error fetching matches: ${error.message}`);
        return;
      }
      setMatches((data as Match[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching matches: ${errorMessage}`);
    }
  };

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('name');

      if (error) {
        setError(`Error fetching tournaments: ${error.message}`);
        return;
      }
      setTournaments((data as Tournament[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching tournaments: ${errorMessage}`);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (error) {
        setError(`Error fetching teams: ${error.message}`);
        return;
      }
      setTeams((data as Team[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching teams: ${errorMessage}`);
    }
  };

  // --- Handle Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const matchData = {
        ...form,
        tournament_id: parseInt(form.tournament_id),
        team1_id: parseInt(form.team1_id),
        team2_id: parseInt(form.team2_id),
        match_date: form.match_date
          ? new Date(form.match_date).toISOString()
          : null,
      };

      if (editingMatch) {
        const { error } = await supabase
          .from('matches')
          .update(matchData)
          .eq('id', editingMatch.id);

        if (error) {
          setError(`Error updating match: ${error.message}`);
          return;
        }
      } else {
        const { error } = await supabase.from('matches').insert([matchData]);
        if (error) {
          setError(`Error creating match: ${error.message}`);
          return;
        }
      }

      setForm({
        tournament_id: '',
        team1_id: '',
        team2_id: '',
        match_date: '',
        map_name: '',
        game_mode: '',
        round: '',
        status: 'scheduled',
      });
      setEditingMatch(null);
      await fetchMatches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error saving match: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handle Edit ---
  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setForm({
      tournament_id: match.tournament_id.toString(),
      team1_id: match.team1_id.toString(),
      team2_id: match.team2_id.toString(),
      match_date: match.match_date
        ? new Date(match.match_date).toISOString().slice(0, 16)
        : '',
      map_name: match.map_name || '',
      game_mode: match.game_mode || '',
      round: match.round || '',
      status: match.status,
    });
  };

  // --- Handle Delete ---
  const handleDelete = async (matchId: number) => {
    if (!confirm('Are you sure? This will delete all match statistics.')) return;

    try {
      setError('');
      const { error } = await supabase.from('matches').delete().eq('id', matchId);
      if (error) {
        setError(`Error deleting match: ${error.message}`);
        return;
      }
      await fetchMatches();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error deleting match: ${errorMessage}`);
    }
  };

  const resetForm = () => {
    setForm({
      tournament_id: '',
      team1_id: '',
      team2_id: '',
      match_date: '',
      map_name: '',
      game_mode: '',
      round: '',
      status: 'scheduled',
    });
    setEditingMatch(null);
  };

  return (
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          {editingMatch ? 'Edit Match' : 'Create Match'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tournament *</label>
            <select
              required
              value={form.tournament_id}
              onChange={(e) => setForm({ ...form, tournament_id: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Tournament</option>
              {tournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Team 1 *</label>
            <select
              required
              value={form.team1_id}
              onChange={(e) => setForm({ ...form, team1_id: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Team 1</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Team 2 *</label>
            <select
              required
              value={form.team2_id}
              onChange={(e) => setForm({ ...form, team2_id: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Team 2</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Match Date</label>
            <input
              type="datetime-local"
              value={form.match_date}
              onChange={(e) => setForm({ ...form, match_date: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Map Name</label>
            <input
              type="text"
              value={form.map_name}
              onChange={(e) => setForm({ ...form, map_name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Nuketown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Game Mode</label>
            <input
              type="text"
              value={form.game_mode}
              onChange={(e) => setForm({ ...form, game_mode: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Team Deathmatch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Round</label>
            <input
              type="text"
              value={form.round}
              onChange={(e) => setForm({ ...form, round: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Quarter Finals"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingMatch ? 'Update Match' : 'Create Match'}
            </button>

            {editingMatch && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Matches List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Matches ({matches.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Tournament</th>
                <th className="px-4 py-2 text-left">Teams</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Details</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-t">
                  <td className="px-4 py-2">
                    {match.tournaments?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span>{match.team1?.name || 'TBD'}</span>
                      <span className="text-gray-500">vs</span>
                      <span>{match.team2?.name || 'TBD'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {match.match_date 
                      ? new Date(match.match_date).toLocaleString()
                      : 'TBD'
                    }
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm">
                      {match.map_name && <div>Map: {match.map_name}</div>}
                      {match.game_mode && <div>Mode: {match.game_mode}</div>}
                      {match.round && <div>Round: {match.round}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      match.status === 'live' ? 'bg-red-100 text-red-800' :
                      match.status === 'completed' ? 'bg-green-100 text-green-800' :
                      match.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {match.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(match)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(match.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatchManagement;