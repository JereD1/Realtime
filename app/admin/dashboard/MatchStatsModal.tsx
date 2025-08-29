import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/superbase";

type Player = {
  id: number;
  name: string;
  team_id: number;
  avatar_url?: string;
};

type Team = {
  id: number;
  name: string;
  logo_url?: string;
};

type Match = {
  id: number;
  tournament_id: number;
  team1_id: number;
  team2_id: number;
  team1_score: number;
  team2_score: number;
  match_date: string | null;
  map_name?: string;
  game_mode?: string;
  round?: string;
  status: string;
  series_type: string;
  winner_team_id?: number;
  team1?: Team;
  team2?: Team;
};

type MatchMap = {
  id: number;
  match_id: number;
  map_number: number;
  map_name?: string;
  game_mode: string;
  winning_team_id?: number;
  team1_score: number;
  team2_score: number;
  status: string;
  duration_seconds?: number;
};

type PlayerMatchStat = {
  id?: number;
  match_map_id: number;
  player_id: number;
  team_id: number;
  kills: number;
  deaths: number;
  assists: number;
  damage_dealt: number;
  damage_taken: number;
  shots_fired: number;
  shots_hit: number;
  headshots: number;
  score: number;
  time_on_objective: number;
  captures: number;
  defends: number;
  plants: number;
  defuses: number;
  clutches: number;
  first_bloods: number;
  streak_best: number;
  mvp: boolean;
};

type MatchStatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
};

const MatchStatsModal: React.FC<MatchStatsModalProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [matchMaps, setMatchMaps] = useState<MatchMap[]>([]);
  const [team1Players, setTeam1Players] = useState<Player[]>([]);
  const [team2Players, setTeam2Players] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<{
    [key: string]: PlayerMatchStat;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const gameModesMap = {
    bo1: ["Hardpoint"],
    bo3: ["Hardpoint", "Search and Destroy", "Control"],
    bo5: [
      "Hardpoint",
      "Search and Destroy",
      "Control",
      "Hardpoint",
      "Search and Destroy",
    ],
    bo7: [
      "Hardpoint",
      "Search and Destroy",
      "Control",
      "Hardpoint",
      "Search and Destroy",
      "Control",
      "Hardpoint",
    ],
  };

  const mapNames = [
    "Apocalypse",
    "Crossfire",
    "Firing Range",
    "Raid",
    "Standoff",
    "Summit",
  ];

  useEffect(() => {
    if (isOpen && match) {
      fetchMatchData();
    }
  }, [isOpen, match]);

  const fetchMatchData = async () => {
    setIsLoading(true);
    setError("");

    try {
      await initializeMatchMaps();
      await Promise.all([
        fetchTeamPlayers(match.team1_id, 1),
        fetchTeamPlayers(match.team2_id, 2),
      ]);
      await fetchPlayerStats();
    } catch (err) {
      setError(
        `Error loading match data: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMatchMaps = async () => {
    const { data: existingMaps, error: fetchError } = await supabase
      .from("match_maps")
      .select("*")
      .eq("match_id", match.id)
      .order("map_number");

    if (fetchError) throw fetchError;

    if (existingMaps && existingMaps.length > 0) {
      setMatchMaps(existingMaps);
      return;
    }

    const gameModes = gameModesMap[
      match.series_type as keyof typeof gameModesMap
    ] || ["Hardpoint"];
    const mapsToCreate = gameModes.map((gameMode, index) => ({
      match_id: match.id,
      map_number: index + 1,
      game_mode: gameMode,
      team1_score: 0,
      team2_score: 0,
      status: "pending",
    }));

    const { data: newMaps, error: createError } = await supabase
      .from("match_maps")
      .insert(mapsToCreate)
      .select("*");

    if (createError) throw createError;
    setMatchMaps(newMaps || []);
  };

  const fetchTeamPlayers = async (teamId: number, teamNumber: number) => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("team_id", teamId)
      .limit(5);

    if (error) throw error;

    if (teamNumber === 1) {
      setTeam1Players(data || []);
    } else {
      setTeam2Players(data || []);
    }
  };

  const fetchPlayerStats = async () => {
    if (matchMaps.length === 0) return;
    const mapIds = matchMaps.map((m) => m.id);
    const { data, error } = await supabase
      .from("player_match_stats")
      .select("*")
      .in("match_map_id", mapIds);

    if (error) throw error;

    const statsMap: { [key: string]: PlayerMatchStat } = {};
    data?.forEach((stat) => {
      const key = `${stat.match_map_id}-${stat.player_id}`;
      statsMap[key] = stat;
    });
    setPlayerStats(statsMap);
  };

  const getPlayerStat = (mapId: number, playerId: number): PlayerMatchStat => {
    const key = `${mapId}-${playerId}`;
    return (
      playerStats[key] || {
        match_map_id: mapId,
        player_id: playerId,
        team_id: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        damage_dealt: 0,
        damage_taken: 0,
        shots_fired: 0,
        shots_hit: 0,
        headshots: 0,
        score: 0,
        time_on_objective: 0,
        captures: 0,
        defends: 0,
        plants: 0,
        defuses: 0,
        clutches: 0,
        first_bloods: 0,
        streak_best: 0,
        mvp: false,
      }
    );
  };

  const updatePlayerStat = (
    mapId: number,
    playerId: number,
    field: keyof PlayerMatchStat,
    value: any
  ) => {
    const key = `${mapId}-${playerId}`;
    const currentStat = getPlayerStat(mapId, playerId);
    setPlayerStats((prev) => ({
      ...prev,
      [key]: {
        ...currentStat,
        [field]: value,
      },
    }));
  };

  const updateMapScore = (
    mapId: number,
    field: "team1_score" | "team2_score" | "map_name" | "winning_team_id",
    value: any
  ) => {
    setMatchMaps((prev) =>
      prev.map((map) => (map.id === mapId ? { ...map, [field]: value } : map))
    );
  };

  const saveMatchStats = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Save map data
      for (const map of matchMaps) {
        const { error: mapError } = await supabase
          .from("match_maps")
          .update({
            map_name: map.map_name,
            team1_score: map.team1_score,
            team2_score: map.team2_score,
            winning_team_id: map.winning_team_id,
            status:
              map.team1_score > 0 || map.team2_score > 0
                ? "completed"
                : "pending",
          })
          .eq("id", map.id);
        if (mapError) throw mapError;
      }

      // Save player stats
      const statsToSave = Object.values(playerStats).filter(
        (stat) =>
          stat.kills > 0 ||
          stat.deaths > 0 ||
          stat.assists > 0 ||
          stat.score > 0
      );

      for (const stat of statsToSave) {
        // Set team_id based on player
        const player = [...team1Players, ...team2Players].find(p => p.id === stat.player_id);
        const statWithTeamId = { ...stat, team_id: player?.team_id || 0 };

        if (stat.id) {
          const { error: updateError } = await supabase
            .from("player_match_stats")
            .update(statWithTeamId)
            .eq("id", stat.id);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from("player_match_stats")
            .insert([statWithTeamId]);
          if (insertError) throw insertError;
        }
      }

      // Update match series scores
      const team1SeriesWins = matchMaps.filter(
        (m) => m.winning_team_id === match.team1_id
      ).length;
      const team2SeriesWins = matchMaps.filter(
        (m) => m.winning_team_id === match.team2_id
      ).length;

      const { error: matchUpdateError } = await supabase
        .from("matches")
        .update({
          series_score_team1: team1SeriesWins,
          series_score_team2: team2SeriesWins,
          winner_team_id:
            team1SeriesWins > team2SeriesWins
              ? match.team1_id
              : team2SeriesWins > team1SeriesWins
                ? match.team2_id
                : null,
          status:
            team1SeriesWins > matchMaps.length / 2 ||
            team2SeriesWins > matchMaps.length / 2
              ? "completed"
              : "live",
        })
        .eq("id", match.id);

      if (matchUpdateError) throw matchUpdateError;

      alert("Match statistics saved successfully!");
      onClose();
    } catch (err) {
      setError(
        `Error saving match statistics: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Component to render player stat inputs
  const renderPlayerStatInputs = (player: Player, currentMap: MatchMap, teamColor: string) => {
    const stats = getPlayerStat(currentMap.id, player.id);
    const isSearchAndDestroy = currentMap.game_mode === "Search and Destroy";
    const isHardpoint = currentMap.game_mode === "Hardpoint";
    const isControl = currentMap.game_mode === "Control";

    const basicStats = [
      { field: "kills", label: "Kills" },
      { field: "deaths", label: "Deaths" },
      { field: "assists", label: "Assists" },
      { field: "score", label: "Score" },
    ];

    const gameModeSpecificStats = [];
    
    if (isHardpoint) {
      gameModeSpecificStats.push(
        { field: "time_on_objective", label: "Hill Time" },
        { field: "captures", label: "Hill Captures" }
      );
    } else if (isControl) {
      gameModeSpecificStats.push(
        { field: "time_on_objective", label: "Zone Time" },
        { field: "captures", label: "Zone Captures" },
        { field: "defends", label: "Zone Defends" }
      );
    } else if (isSearchAndDestroy) {
      gameModeSpecificStats.push(
        { field: "plants", label: "Plants" },
        { field: "defuses", label: "Defuses" },
        { field: "first_bloods", label: "First Bloods" },
        { field: "clutches", label: "Clutches" }
      );
    }

    const additionalStats = [
      { field: "damage_dealt", label: "Damage Dealt" },
      { field: "damage_taken", label: "Damage Taken" },
      { field: "headshots", label: "Headshots" },
      { field: "streak_best", label: "Best Streak" },
    ];

    return (
      <div className={`bg-${teamColor}-50 p-4 rounded-lg`}>
        <h4 className="font-semibold mb-3">{player.name}</h4>
        
        {/* Basic Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {basicStats.map(({ field, label }) => (
            <div key={field}>
              <label className="block text-xs font-medium">{label}</label>
              <input
                type="number"
                min="0"
                value={(stats[field as keyof PlayerMatchStat] as number) || 0}
                onChange={(e) =>
                  updatePlayerStat(
                    currentMap.id,
                    player.id,
                    field as keyof PlayerMatchStat,
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full p-1 border rounded text-sm"
              />
            </div>
          ))}
        </div>

        {/* Game Mode Specific Stats */}
        {gameModeSpecificStats.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {gameModeSpecificStats.map(({ field, label }) => (
              <div key={field}>
                <label className="block text-xs font-medium">{label}</label>
                <input
                  type="number"
                  min="0"
                  value={(stats[field as keyof PlayerMatchStat] as number) || 0}
                  onChange={(e) =>
                    updatePlayerStat(
                      currentMap.id,
                      player.id,
                      field as keyof PlayerMatchStat,
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
            ))}
          </div>
        )}

        {/* Additional Stats (Collapsible) */}
        <details className="mb-3">
          <summary className="text-xs font-medium cursor-pointer text-gray-600">
            Advanced Stats
          </summary>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {additionalStats.map(({ field, label }) => (
              <div key={field}>
                <label className="block text-xs">{label}</label>
                <input
                  type="number"
                  min="0"
                  value={(stats[field as keyof PlayerMatchStat] as number) || 0}
                  onChange={(e) =>
                    updatePlayerStat(
                      currentMap.id,
                      player.id,
                      field as keyof PlayerMatchStat,
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
            ))}
          </div>
        </details>

        {/* MVP Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`mvp-${player.id}-${currentMap.id}`}
            checked={stats.mvp}
            onChange={(e) =>
              updatePlayerStat(
                currentMap.id,
                player.id,
                "mvp",
                e.target.checked
              )
            }
            className="mr-2"
          />
          <label htmlFor={`mvp-${player.id}-${currentMap.id}`} className="text-xs font-medium">
            MVP
          </label>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const currentMap = matchMaps[activeTab];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Match Statistics</h2>
              <p className="text-gray-600">
                {match.team1?.name} vs {match.team2?.name} -{" "}
                {match.series_type.toUpperCase()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading match data...</div>
          </div>
        ) : (
          <>
            {/* Map Tabs */}
            <div className="flex border-b overflow-x-auto">
              {matchMaps.map((map, index) => (
                <button
                  key={map.id}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-3 whitespace-nowrap ${
                    activeTab === index
                      ? "border-b-2 border-blue-500 bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Map {map.map_number}: {map.game_mode}
                  {map.winning_team_id && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Map Details */}
            {currentMap && (
              <div className="p-6 border-b bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Map Name
                    </label>
                    <select
                      value={currentMap.map_name || ""}
                      onChange={(e) =>
                        updateMapScore(
                          currentMap.id,
                          "map_name",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Map</option>
                      {mapNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {match.team1?.name} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="250"
                      value={currentMap.team1_score}
                      onChange={(e) =>
                        updateMapScore(
                          currentMap.id,
                          "team1_score",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {match.team2?.name} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="250"
                      value={currentMap.team2_score}
                      onChange={(e) =>
                        updateMapScore(
                          currentMap.id,
                          "team2_score",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Winner
                    </label>
                    <select
                      value={currentMap.winning_team_id || ""}
                      onChange={(e) =>
                        updateMapScore(
                          currentMap.id,
                          "winning_team_id",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Winner</option>
                      <option value={match.team1_id}>
                        {match.team1?.name}
                      </option>
                      <option value={match.team2_id}>
                        {match.team2?.name}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Player Statistics */}
            {currentMap && (
              <div className="p-6 overflow-auto max-h-96">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Team 1 Players */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-blue-600">
                      {match.team1?.name} Players
                    </h3>
                    <div className="space-y-4">
                      {team1Players.map((player) => 
                        renderPlayerStatInputs(player, currentMap, "blue")
                      )}
                    </div>
                  </div>

                  {/* Team 2 Players */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-red-600">
                      {match.team2?.name} Players
                    </h3>
                    <div className="space-y-4">
                      {team2Players.map((player) => 
                        renderPlayerStatInputs(player, currentMap, "red")
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="p-6 flex justify-end gap-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={saveMatchStats}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Statistics"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchStatsModal;