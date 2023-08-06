CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS Favourites (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER,
    user_id INTEGER REFERENCES Users
);

CREATE TABLE IF NOT EXISTS Ratings (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    user_id INTEGER REFERENCES Users NOT NULL,
    rating INTEGER NOT NULL
);

DO $$ BEGIN
    CREATE TYPE FriendshipStatus as ENUM ('friends', 'pending_user_one', 'pending_user_two');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS Friends (
    id SERIAL PRIMARY KEY,
    user_one INTEGER REFERENCES Users NOT NULL,
    user_two INTEGER REFERENCES Users NOT NULL,
    status FriendshipStatus NOT NULL
);
