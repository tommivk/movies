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

DO $$ BEGIN
    CREATE TYPE NotificationType as ENUM ('welcome', 'friend_request', 'accepted_friend_request', 'denied_friend_request', 'new_movie_recommendation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS Notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users NOT NULL,
    fired_by INTEGER,
    notification_type NotificationType NOT NULL,
    seen BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    private BOOLEAN,
    password_hash VARCHAR,
    admin_id INTEGER REFERENCES Users
);

CREATE TABLE IF NOT EXISTS UserGroups (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users NOT NULL,
    group_id INTEGER REFERENCES Groups NOT NULL
);

CREATE TABLE IF NOT EXISTS Recommendations (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL REFERENCES Groups,
    user_id INTEGER NOT NULL REFERENCES Users,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
