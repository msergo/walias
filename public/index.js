fetch('/aliases').then(async res => {
    const data = await res.json()
    const dataContainer = document.getElementById('container')

    if (!res.ok) {
        // Show message "Login to see your aliases" and create a div with a button to login, url is /auth-oidc
        dataContainer.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Login to see your aliases
            </div>
            <a href="/auth-oidc" class="btn btn-primary">Login</a>
        `

        return
    }

    dataContainer.innerHTML = `
        <div class="alert alert-success" role="alert">
            Your aliases
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Address</th> 
                    <th scope="col">Created</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(alias => `
                    <tr>
                        <td>${alias.address}</td>
                        <td>${alias.created}</td>
                        <td>
                            <a href="/aliases/${alias.id}" class="btn btn-danger">Delete</a>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `
})