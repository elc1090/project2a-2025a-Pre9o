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

// Listen for changes in the repository dropdown
repoSelect.addEventListener('change', (e) => {
    let selectedRepo = e.target.value;
    let usernameInput = document.getElementById('usernameInput');
    let gitHubUsername = usernameInput.value.trim();

    if (!selectedRepo) {
        alert('Please select a repository.');
        return;
    }

    requestRepoCommits(gitHubUsername, selectedRepo)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let userRepos = document.getElementById('userRepos');
            userRepos.innerHTML = '';

            if (data.length === 0) {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `No commits found for repository: ${selectedRepo}`;
                userRepos.appendChild(li);
                return;
            }

            data.forEach(commit => {
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
            alert('An error occurred while fetching commits. Please try again.');
        });
});

function requestUserRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos`);
}

function requestRepoCommits(username, repo) {
    return fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
}

function requestUserRepos(username) {
    // Fetch the user's repositories from the GitHub API
    return fetch(`https://api.github.com/users/${username}/repos`);
}