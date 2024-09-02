import { Octokit } from '@octokit/core'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const folderPath = './public/changelog' // target folder

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

async function saveCommitsToLocalFile(repo, content) {

  const [owner, repoName] = repo.split('/') // array values are formatted: <owner>/<repo>
  
  const filePath = path.join(folderPath, `${owner}.${repoName}.commits.json`)

  fs.writeFileSync(filePath, content) // save to file

  console.log(`Saved: ${filePath}`) // log for sanity check and CI logs
}

async function saveAllCommitsToLocalFile(content) {
  
  const filePath = path.join(folderPath, `all_commits.json`)

  fs.writeFileSync(filePath, content) // save to file

  console.log(`Saved: ${filePath}`) // log for sanity check and CI logs
}

let repo_list = {}

try {
  // get repo list
  const response = await fetch('https://samifouad.com/data/repos.json')

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  repo_list = await response.json()

} catch (e) {
  console.error(e.message)
}

console.log('all repos:')
console.log(repo_list)

async function getRepoCommits (repo) {
  const [owner, repoName] = repo.split('/')

  // calculate two weeks ago
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 14);
  const twoWeeksAgo = currentDate.toISOString();

  const octokit = new Octokit({ auth: process.env.GH_TOKEN });

  const response = await octokit.request('GET /repos/{username}/'+ repoName +'/commits?since='+ twoWeeksAgo, {
    username: 'samifouad',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  return response.data;
}

async function getCommitStats (repo, xRef) {
  const [xOwner, xRepo] = repo.split('/')

  // calculate two weeks ago
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 14);
  const twoWeeksAgo = currentDate.toISOString();

  const octokit = new Octokit({ auth: process.env.GH_TOKEN });

  const response = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
    owner: xOwner,
    repo: xRepo,
    ref: xRef,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  return response.data;
}

console.log('\n')
console.log('repos with commits:')

let running_tally = []

const all_commits = await Promise.all(repo_list.map(async (subj) => {
  const commits = await getRepoCommits(subj)

  const commit_list = await Promise.all(commits.map(async (commit) => {
    try {
      const stats = await getCommitStats(subj, commit.sha)
        if (stats.commit.author.name === 'Sami Fouad') {
          return {
            repo: subj,
            name: stats.commit.author.name,
            email: stats.commit.author.email,
            avatar: stats.committer.avatar_url,
            date: stats.commit.author.date,
            sha: stats.sha,
            url: stats.commit.url,
            message: stats.commit.message,
            verified: stats.commit.verification.verified,
            stats: stats.stats
          }
        }
    } catch (e) {
      return null
    }
  }))  

    
    if (typeof commit_list[0] === 'object') {
      running_tally.push(...commit_list)

      // sort by newest first
      commit_list.sort((a, b) => new Date(b.date) - new Date(a.date));

      //save to file
      await saveCommitsToLocalFile(subj, JSON.stringify(commit_list))
    }
}))

running_tally.sort((a, b) => new Date(b.date) - new Date(a.date));

// saving all commits
await saveAllCommitsToLocalFile(JSON.stringify(running_tally))

console.log('\n')

console.log('commit count: ' + running_tally.length)


console.log('\n')


console.log('starting astro...\n')

// running_tally.map((item) => {
//   console.log(item)
// })