'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/superbase';

type Tournament = {
  id: number;
  name: string;
  game: string;
  start_date: string | null;
  end_date: string | null;
  prize_pool: number | null;
  status: 'upcoming' | 'live' | 'completed';
};

const TournamentManagement: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    game: 'Call of Duty Mobile',
    start_date: '',
    end_date: '',
    prize_pool: '',
    status: 'upcoming' as 'upcoming' | 'live' | 'completed',
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setError('');
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        setError(`Error fetching tournaments: ${error.message}`);
        return;
      }
      setTournaments(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error fetching tournaments: ${errorMessage}`);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      game: 'Call of Duty Mobile',
      start_date: '',
      end_date: '',
      prize_pool: '',
      status: 'upcoming',
    });
    setEditingTournament(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const tournamentData = {
        ...form,
        prize_pool: form.prize_pool ? parseFloat(form.prize_pool) : null,
      };

      if (editingTournament) {
        const { error } = await supabase
          .from('tournaments')
          .update(tournamentData)
          .eq('id', editingTournament.id);

        if (error) {
          setError(`Error updating tournament: ${error.message}`);
          return;
        }
      } else {
        const { error } = await supabase
          .from('tournaments')
          .insert([tournamentData]);

        if (error) {
          setError(`Error creating tournament: ${error.message}`);
          return;
        }
      }

      resetForm();
      await fetchTournaments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error saving tournament: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setForm({
      name: tournament.name,
      game: tournament.game,
      start_date: tournament.start_date || '',
      end_date: tournament.end_date || '',
      prize_pool: tournament.prize_pool?.toString() || '',
      status: tournament.status,
    });
  };

  const handleDelete = async (tournamentId: number) => {
    if (!confirm('Are you sure? This will delete all associated matches.')) return;

    try {
      setError('');
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', tournamentId);

      if (error) {
        setError(`Error deleting tournament: ${error.message}`);
        return;
      }
      await fetchTournaments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error deleting tournament: ${errorMessage}`);
    }
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
          {editingTournament ? 'Edit Tournament' : 'Create Tournament'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Tournament Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter tournament name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Game</label>
            <select
              value={form.game}
              onChange={(e) => setForm({ ...form, game: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="Call of Duty Mobile">Call of Duty Mobile</option>
              <option value="PUBG Mobile">PUBG Mobile</option>
              <option value="Free Fire">Free Fire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'upcoming' | 'live' | 'completed' })}
              className="w-full p-2 border rounded-md"
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Prize Pool ($)</label>
            <input
              type="number"
              step="0.01"
              value={form.prize_pool}
              onChange={(e) => setForm({ ...form, prize_pool: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="10000.00"
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingTournament ? 'Update Tournament' : 'Create Tournament'}
            </button>

            {editingTournament && (
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

      {/* List Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Tournaments ({tournaments.length})</h2>
        <div className="grid gap-4">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{tournament.name}</h3>
                <p className="text-gray-600 text-sm">
                  {tournament.game} • {tournament.status}
                  {tournament.prize_pool !== null && ` • $${tournament.prize_pool.toLocaleString()}`}
                </p>
                <p className="text-gray-500 text-xs">
                  {tournament.start_date || 'N/A'} - {tournament.end_date || 'N/A'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tournament)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tournament.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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

export default TournamentManagement;