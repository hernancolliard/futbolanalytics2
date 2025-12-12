-- Crea la DB si no existe (ejecutar como superuser)
CREATE DATABASE futboldb;
-- Tablas (ejecutar conectados a futboldb)
CREATE TABLE users (
id serial PRIMARY KEY,
email varchar(255) UNIQUE NOT NULL,
name varchar(120),
password_hash varchar(255),
6
is_admin boolean DEFAULT false,
created_at timestamptz DEFAULT now()
);
CREATE TABLE matches (
id serial PRIMARY KEY,
title varchar(255),
date timestamptz,
venue varchar(255),
video_path varchar(1024),
notes text,
created_at timestamptz DEFAULT now()
);
CREATE TABLE events (
id serial PRIMARY KEY,
match_id integer REFERENCES matches(id) ON DELETE CASCADE,
event_type varchar(80),
minute integer,
x integer,
y integer,
metadata text,
created_at timestamptz DEFAULT now()
);