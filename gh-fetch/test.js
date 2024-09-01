import { Octokit } from '@octokit/core'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import { marked } from 'marked'
import Database from 'better-sqlite3';

const folderPath = './test' // target folder
const repo = 'website'

// calculate two weeks ago
const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 14);
const twoWeeksAgo = currentDate.toISOString();

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

const response = await octokit.request('GET /repos/{username}/'+ repo +'/commits?since='+ twoWeeksAgo, {
  username: 'samifouad',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

const events = response.data;


console.log(events)
//console.log(JSON.stringify(events[0]))