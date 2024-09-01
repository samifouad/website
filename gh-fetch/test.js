import { Octokit } from '@octokit/core'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import { marked } from 'marked'
import Database from 'better-sqlite3';


const dbPath = 'gh-fetch/events.db';

// Delete the database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

// Create a new SQLite database
const db = new Database(dbPath);

const folderPath = './test' // target folder

// Create the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    event_type TEXT,
    repo_name TEXT,
    actor_login TEXT,
    actor_avatar_url TEXT,
    event_url TEXT,
    created_at TEXT,
    payload TEXT
  );
`);

const insertEvent = (event) => {
  const eventUrl = `https://github.com/${event.repo.name}/commit/${event.id}`;

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO events (id, event_type, repo_name, actor_login, actor_avatar_url, event_url, created_at, payload)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    stmt.run(
      event.id,
      event.type,
      event.repo.name,
      event.actor.login,
      event.actor.avatar_url,
      eventUrl,
      event.created_at,
      JSON.stringify(event.payload)
    );
  } catch (error) {
    console.error('Error inserting event:', error);
  }
};


// delete all files first, in case something is accidentally commit
// this isn't necessary for CI environments, but whatever. it's needed in dev
if (fs.existsSync(folderPath)) {
  fs.readdirSync(folderPath).forEach((file) => {

      const filePath = path.join(folderPath, file)

      if (fs.lstatSync(filePath).isFile()) {

        fs.unlinkSync(filePath); // delete 

      }
  })
} else {
  
  fs.mkdirSync(folderPath, { recursive: true }); // create folder if it doesn't exist

}

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

const fetchAllEvents = async (username) => {
  let page = 1;
  let allEvents = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await octokit.request('GET /users/{username}/events/public', {
      username,
      per_page: 100,
      page,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const events = response.data;
    allEvents = allEvents.concat(events);

    // Check if there's another page
    hasNextPage = events.length === 100; // If less than 100, we're on the last page
    page++;
  }

  return allEvents;
};

const username = 'samifouad';
const allEvents = await fetchAllEvents(username);

allEvents.forEach((event) => {
  insertEvent(event)
  console.log('Ingested event! id: ', event.id);
})

// Utility function to format a date in 'YYYY-MM-DD' format
const formatDate = (date) => date.toISOString().split('T')[0];

// Utility function to get the start of the week (Sunday)
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getUTCDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
  const diff = d.getUTCDate() - day; // Adjust to the previous Sunday
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0); // Normalize to the start of the day (UTC)
  return d;
};

// Calculate date ranges
const now = new Date();
const startOfThisWeek = getStartOfWeek(now);
const startOfLastWeek = getStartOfWeek(new Date(startOfThisWeek));
startOfLastWeek.setUTCDate(startOfLastWeek.getUTCDate() - 7); // Move to the previous week's start

const startOfThisWeekStr = formatDate(startOfThisWeek);
const startOfLastWeekStr = formatDate(startOfLastWeek);

// Create a category for "this week", "last week", and "older"
const categorizedEvents = {
  thisWeek: [],
  lastWeek: [],
  older: [],
};

// Query for this week's events
const stmtThisWeek = db.prepare(`
  SELECT * FROM events WHERE DATE(created_at) >= ? AND DATE(created_at) < ?
  ORDER BY created_at DESC
`);
categorizedEvents.thisWeek = stmtThisWeek.all(startOfThisWeekStr, formatDate(now));

// Query for last week's events
const stmtLastWeek = db.prepare(`
  SELECT * FROM events WHERE DATE(created_at) >= ? AND DATE(created_at) < ?
  ORDER BY created_at DESC
`);
categorizedEvents.lastWeek = stmtLastWeek.all(startOfLastWeekStr, startOfThisWeekStr);

// Query for older events
const stmtOlder = db.prepare(`
  SELECT * FROM events WHERE DATE(created_at) < ?
  ORDER BY created_at DESC
`);
categorizedEvents.older = stmtOlder.all(startOfLastWeekStr);

// Display events in each category
const displayEvents = () => {
  console.log('Events for this week:');
  categorizedEvents.thisWeek.forEach(({ created_at, id, event_type, repo_name }) => {
    console.log(`  ${new Date(created_at).toLocaleDateString()}: ${id}: ${event_type} in ${repo_name}`);
  });

  console.log('Events for last week:');
  categorizedEvents.lastWeek.forEach(({ created_at, id, event_type, repo_name }) => {
    console.log(`  ${new Date(created_at).toLocaleDateString()}: ${id}: ${event_type} in ${repo_name}`);
  });

  console.log('Older events:');
  categorizedEvents.older.forEach(({ created_at, id, event_type, repo_name }) => {
    console.log(`  ${new Date(created_at).toLocaleDateString()}: ${id}: ${event_type} in ${repo_name}`);
  });
};

displayEvents();


