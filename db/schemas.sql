-- Eliminar tablas existentes en orden inverso para evitar problemas de dependencia (Comentado para seguridad)
-- DROP TABLE IF EXISTS events;
-- DROP TABLE IF EXISTS match_lineups;
-- DROP TABLE IF EXISTS matches;
-- DROP TABLE IF EXISTS players;
-- DROP TABLE IF EXISTS teams;
-- DROP TABLE IF EXISTS users;

-- Tabla para los usuarios del sistema
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(120),
    password_hash VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para los equipos
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    coach VARCHAR(255),
    logo_url VARCHAR(1024),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para los jugadores, cada uno pertenece a un equipo
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL, -- Si se borra un equipo, el jugador queda libre
    position VARCHAR(80),
    date_of_birth DATE,
    jersey_number INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para los partidos
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    date TIMESTAMPTZ,
    venue VARCHAR(255),
    video_path VARCHAR(1024),
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para las alineaciones de cada partido
CREATE TABLE IF NOT EXISTS match_lineups (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    is_starter BOOLEAN DEFAULT TRUE, -- TRUE para titular, FALSE para suplente
    UNIQUE (match_id, player_id) -- Un jugador solo puede estar una vez en una alineación
);

-- Tabla para los eventos, ahora vinculados a un jugador
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE, -- Vinculado al jugador
    event_type VARCHAR(80),
    "timestamp" REAL, -- Cambiado de 'minute' para más precisión
    x INTEGER,
    y INTEGER,
    data JSONB, -- Usar JSONB para metadatos más complejos
    created_at TIMESTAMPTZ DEFAULT NOW()
);
