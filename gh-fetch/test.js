import { Octokit } from '@octokit/core'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import { marked } from 'marked'

const folderPath = './test' // target folder

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

const response = await octokit.request('GET /users/{username}/repos', {
  username: 'samifouad',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

const gh_test = response.data

console.log(gh_test)