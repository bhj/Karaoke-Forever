-- Up
CREATE TABLE IF NOT EXISTS "artists" (
  "artistId" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" text NOT NULL COLLATE NOCASE
);

CREATE UNIQUE INDEX IF NOT EXISTS name ON "artists" ("name" ASC);

CREATE TABLE IF NOT EXISTS "media" (
  "mediaId" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "songId" integer NOT NULL,
  "duration" integer NOT NULL,
  "provider" text NOT NULL,
  "providerData" text NOT NULL,
  "isPreferred" integer(1) NOT NULL DEFAULT(0),
  "lastTimestamp" integer NOT NULL DEFAULT(0)
);

CREATE INDEX IF NOT EXISTS songId ON "media" ("songId" ASC);

CREATE TABLE IF NOT EXISTS "prefs" (
  "key" text PRIMARY KEY NOT NULL,
  "data" text NOT NULL
);

INSERT INTO prefs (key,data) VALUES ('isFirstRun','true');

CREATE TABLE IF NOT EXISTS "providers" (
  "name" text PRIMARY KEY NOT NULL,
  "isEnabled" integer(1) NOT NULL DEFAULT(1),
  "priority" integer NOT NULL DEFAULT(0),
  "prefs" text
);

CREATE INDEX IF NOT EXISTS providerName ON "providers" ("name" ASC);

INSERT INTO providers (name, prefs) VALUES ('file', '{"paths":[]}');
INSERT INTO providers (name, prefs) VALUES ('youtube', '{"channels":[],"apiKey":""}');

CREATE TABLE IF NOT EXISTS "queue" (
  "queueId" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "roomId" integer NOT NULL,
  "mediaId" integer NOT NULL,
  "userId" integer NOT NULL
);

CREATE INDEX IF NOT EXISTS roomId ON "queue" ("roomId" ASC);

CREATE TABLE IF NOT EXISTS "rooms" (
  "roomId" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" text NOT NULL,
  "status" text NOT NULL,
  "dateCreated" text NOT NULL
);

CREATE INDEX IF NOT EXISTS status ON "rooms" ("status" ASC);

CREATE TABLE IF NOT EXISTS "songs" (
  "songId" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "artistId" integer NOT NULL,
  "title" text NOT NULL COLLATE NOCASE
);

CREATE INDEX IF NOT EXISTS title ON "songs" ("title" ASC);

CREATE TABLE IF NOT EXISTS "stars" (
  "userId" integer NOT NULL,
  "songId" integer NOT NULL
);

CREATE INDEX IF NOT EXISTS userId ON "stars" ("userId" ASC);

CREATE TABLE IF NOT EXISTS "users" (
  "userId" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "name" text NOT NULL,
  "isAdmin" integer(1) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS email ON "users" ("email" ASC);

-- Down
DROP TABLE artists;
DROP TABLE media;
DROP TABLE prefs;
DROP TABLE providers;
DROP TABLE queue;
DROP TABLE rooms;
DROP TABLE songs;
DROP TABLE stars;
DROP TABLE users;
