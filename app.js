// Listen for submissions on GitHub username input form
gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let usernameInput = document.getElementById('usernameInput');
    let gitHubUsername = usernameInput.value.trim();

    if (!gitHubUsername) {
        alert('Please enter a GitHub username.');
        return;
    }

    requestUserRepos(gitHubUsername)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let repoSelect = document.getElementById('repoSelect');
            repoSelect.innerHTML = '<option value="">Select a repository</option>';

            if (data.length === 0) {
                alert(`No repositories found for user: ${gitHubUsername}`);
                return;
            }

            data.forEach(repo => {
                let option = document.createElement('option');
                option.value = repo.name;
                option.textContent = repo.name;
                repoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while fetching repositories. Please try again.');
        });
});

repoSelect.addEventListener('change', (e) => {
    let selectedRepo = e.target.value;
    let usernameInput = document.getElementById('usernameInput');
    let gitHubUsername = usernameInput.value.trim();

    if (!selectedRepo) {
        alert('Please select a repository.');
        return;
    }

    fetch(`https://api.github.com/repos/${gitHubUsername}/${selectedRepo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(repoData => {
            let userRepos = document.getElementById('userRepos');
            userRepos.innerHTML = `
                <div class="repo-card">
                    <h3>${repoData.name}</h3>
                    <p>${repoData.description || 'No description available'}</p>
                    <p><strong>Stars:</strong> ${'&#11088;'.repeat(repoData.stargazers_count)}</p>
                </div>
                <h4>Commits:</h4>
                <ul class="commit-list"></ul>
`;

            return fetch(`https://api.github.com/repos/${gitHubUsername}/${selectedRepo}/commits`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(commitData => {
            let userRepos = document.getElementById('userRepos');

            if (commitData.length === 0) {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `No commits found for repository: ${selectedRepo}`;
                userRepos.appendChild(li);
                return;
            }

            commitData.forEach(commit => {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerHTML = `
                    <p><strong>Message:</strong> ${commit.commit.message}</p>
                    <p><strong>Date:</strong> ${new Date(commit.commit.author.date).toLocaleString()}</p>
                `;
                userRepos.appendChild(li);
            });
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while fetching repository details or commits. Please try again.');
        });
});

function requestUserRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos`);
}

function requestRepoCommits(username, repo) {
    return fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
}

function requestUserRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos`);
}