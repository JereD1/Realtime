// types/database.types.ts
export interface Team {
  id: number
  name: string
  logo_url?: string
  country?: string
  created_at: string
}

export interface Player {
  id: number
  name: string
  team_id?: number
  avatar_url?: string
  country?: string
  created_at: string
}

export interface Tournament {
  id: number
  name: string
  game: string
  start_date?: string
  end_date?: string
  prize_pool?: number
  status: string
  created_at: string
}

export interface Match {
  id: number
  tournament_id: number
  team1_id: number
  team2_id: number
  team1_score: number
  team2_score: number
  match_duration?: string
  team1_kills: number
  team1_deaths: number
  team1_impact: number
  team2_kills: number
  team2_deaths: number
  team2_impact: number
  match_date?: string
  map_name?: string
  game_mode?: string
  status: string
  round?: string
  winner_team_id?: number
  team1_kd_ratio: number
  team2_kd_ratio: number
  created_at: string
}

export interface PlayerMatchStats {
  id: number
  match_id: number
  player_id: number
  team_id: number
  score: number
  kills: number
  deaths: number
  assists: number
  time_played?: string
  impact_score: number
  earned_rank_xp: number
  earned_xp: number
  accuracy: number
  headshot_percentage: number
  is_mvp: boolean
  has_star: boolean
  kd_ratio: number
  created_at: string
}