import { Octokit } from '@octokit/core'
import fs from 'fs'
import path from 'path'

const folderPath = './public/json';

// Delete all files in the target folder first
if (fs.existsSync(folderPath)) {
fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    if (fs.lstatSync(filePath).isFile()) {
    fs.unlinkSync(filePath); // Delete the file
    }
});
} else {
// Create the folder if it doesn't exist
fs.mkdirSync(folderPath, { recursive: true });
}

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

const response = await octokit.request('GET /users/{username}/repos', {
  username: 'samifouad',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

const project_list = response.data
                    .filter(repo => !repo.private)
                    .map(repo => repo.full_name)

//console.log(project_list)

async function saveContentToLocalFile(repo, content) {

  // Split the repo string to get the owner and repo name
  const [owner, repoName] = repo.split('/');

  // Create a filename like "samifouad.website.json"
  const fileName = `${owner}.${repoName}`;
  const filePath = path.join(folderPath, `${fileName}.json`);

  // Save the content to a file
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`Saved: ${filePath}`);
}

async function getFileContent(owner, repo, path) {
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
		// Decode content if it's base64 encoded
		const content = Buffer.from(file.content, 'base64').toString('utf-8');
		// Parse the JSON string into an object
		const parsedContent = JSON.parse(content);
		
		return parsedContent;
	} else {
		throw Error('unknown error');
	}
    
  } catch (error) {
    if (error.status === 404) {
      //console.log(`File ${path} does not exist in the repository ${repo}.`);
      return null;
    } else {
      console.error("An error occurred:", error);
      throw error;  // Rethrow the error for network or other issues
    }
  }
}

const website_projects = await project_list.map(async (item) => {
	const [owner, repo] = item.split('/');
	const content = await getFileContent(owner, repo, 'sf.json');
	if (content !== null) {
		//console.log('found for: '+ item)
		await saveContentToLocalFile(item, content)
		return content;
	}
})

await Promise.all(website_projects);
// const filteredResults = results.filter(content => content !== undefined)

// let projects = filteredResults

// console.log(projects)