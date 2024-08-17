import { Octokit } from '@octokit/core'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import { marked } from 'marked'

const folderPath = './public/data' // target folder

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

const project_list = response.data
                    .filter(repo => !repo.private) // get rid of private repos
                    .map(repo => repo.full_name) // return new array

//console.log(project_list)

async function saveContentToLocalFile(repo, content, type) {

  const [owner, repoName] = repo.split('/') // array values are formatted: <owner>/<repo>
  
  let fileName
  
  switch (type) {
    case 'repo':
      fileName = `${owner}.${repoName}._.json`
    break
    case 'info':
      fileName = `${owner}.${repoName}.info.json`
    break
    case 'readme':
      fileName = `${owner}.${repoName}.readme.md`
    break
    case 'readme_html':
      fileName = `${owner}.${repoName}.readme.html`
    break
    case 'lang':
      fileName = `${owner}.${repoName}.lang.json`
    break
    case 'topics':
      fileName = `${owner}.${repoName}.topics.json`
    break;
    default:
      fileName = `${owner}.${repoName}.data.json`
    break
  }
  
  //`${owner}.${repoName}.json`
  const filePath = path.join(folderPath, fileName) // create a filename, eg. samifouad.website.json

  fs.writeFileSync(filePath, content) // save to file

  console.log(`Saved: ${filePath}`) // log for sanity check and CI logs
}

async function loadContentFromLocalFile(repo, type='all') {

  const [owner, repoName] = repo.split('/') // array values are formatted: <owner>/<repo>
  let fileName
  let filePath
  let data
  
  switch (type) {
    case 'data':
      fileName = `${owner}.${repoName}._.json`
      filePath = path.join(folderPath, fileName) 
      data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    break
    case 'info':
      fileName = `${owner}.${repoName}.info.json`
      filePath = path.join(folderPath, fileName) 
      data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    break
    case 'readme':
      fileName = `${owner}.${repoName}.readme.md`
      filePath = path.join(folderPath, fileName) 
      data = fs.readFileSync(filePath, 'utf8');
      return data;
    break
    case 'readme_html':
      fileName = `${owner}.${repoName}.readme.html`
      filePath = path.join(folderPath, fileName) 
      data = fs.readFileSync(filePath, 'utf8');
      return data;
    break
    case 'lang':
      fileName = `${owner}.${repoName}.lang.json`
      filePath = path.join(folderPath, fileName) 
      data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    break
    case 'topics':
      fileName = `${owner}.${repoName}.topics.json`
      filePath = path.join(folderPath, fileName) 
      data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    break
    default:
      fileName = `${owner}.${repoName}.data.json`
      filePath = path.join(folderPath, fileName) 
      data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    break
  }
}

async function getRepoContent(owner, repo, path) {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: owner,
      repo: repo,
      path: path,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!Array.isArray(response)) {
      const file = response.data
      
      const content = Buffer.from(file.content, 'base64').toString('utf-8') // decode base64 encoded content
      
      // NOTE: this should be done when json is used in component
      // ALSO: this breaks md intake
      //const parsedContent = JSON.parse(content) // parse the JSON string into an object to work with it
      
      return content
    }
    
  } catch (e) {
    if (e.status === 404) {
      return null // not a big deal if file doesn't exist
    } else {
      console.error("An error occurred:", e);
      throw error;  // this is actually a problem
    }
  }
}

let full_array = []


console.log('repo data injested:')

const project_info = await project_list.map(async (item) => {
	const [owner, repo] = item.split('/') // array values are formatted: <owner>/<repo>

	const content = await getRepoContent(owner, repo, 'sf.json')

	if (content !== null) {
		//console.log('found for: '+ item)
    full_array.push(`${owner}/${repo}`)
		await saveContentToLocalFile(item, content, 'info')
		return content;
	}
})

const full_list = await Promise.all(project_info) // necessary because map returns multiple promises

console.log('\nlist of repos:')
console.log(full_array)
console.log('\nREADME injested:')

const project_readme = await full_array.map(async (item) => {
	const [owner, repo] = item.split('/') // array values are formatted: <owner>/<repo>

  const readme = await getRepoContent(owner, repo, 'README.md')

  if (readme !== null) {
		//console.log('found for: '+ item)
		await saveContentToLocalFile(item, readme, 'readme')
		await saveContentToLocalFile(item, marked(readme), 'readme_html')
		return readme;
	}
})

await Promise.all(project_readme) // necessary because map returns multiple promises

console.log('\nlang info injested:')

const project_languages = await full_array.map(async (item) => {
	const [owner, repo] = item.split('/') // array values are formatted: <owner>/<repo>

  const response = await octokit.request('GET /repos/{owner}/{repo}/languages', {
    owner: `${owner}`,
    repo: `${repo}`,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  //console.log('saved language info for: '+ item)
	await saveContentToLocalFile(item, JSON.stringify({ repo: item, data: response.data }), 'lang')
})

await Promise.all(project_languages)

console.log('\nrepo topics injested:')

const project_topics = await full_array.map(async (item) => {
	const [owner, repo] = item.split('/') // array values are formatted: <owner>/<repo>

  const response = await octokit.request('GET /repos/{owner}/{repo}/topics', {
    owner: `${owner}`,
    repo: `${repo}`,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  
  //console.log('saved topics for: '+ item)
	await saveContentToLocalFile(item, JSON.stringify({ repo: item, data: response.data.names }), 'topics')
})

await Promise.all(project_topics)

// const filteredResults = results.filter(content => content !== undefined)

// let projects = filteredResults

// console.log(projects)

console.log('\nunifying repo content:')

const unified_data = await full_array.map(async (item) => {
	const [owner, repo] = item.split('/') // array values are formatted: <owner>/<repo>

  const info_data = await loadContentFromLocalFile(item, 'info')
  const lang_data = await loadContentFromLocalFile(item, 'lang')
  const topics_data = await loadContentFromLocalFile(item, 'topics')
  const readme_data = await loadContentFromLocalFile(item, 'readme')
  
  let projectobj = {
    id: repo,
    title: info_data.title,
    tag: info_data.tag,
    url: info_data.url,
    code: info_data.code,
    colour: info_data.colour,
    size: info_data.size,
    lang: lang_data.data,
    topics: topics_data.data,
    readme: readme_data
  }

  await saveContentToLocalFile(item, JSON.stringify(projectobj), 'repo')
})

await Promise.all(unified_data)