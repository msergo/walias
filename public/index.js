function renderAliases(aliases) {
    const dataContainer = document.getElementById('container')
    // Create table element ant populate with items
    const table = document.createElement('table')
    table.classList.add('table')
    const thead = document.createElement('thead')
    const tr = document.createElement('tr')

    for (const value of ['Address', 'Created']) {
        const th = document.createElement('th')
        th.setAttribute('scope', 'col')
        th.innerText = value
        tr.appendChild(th)
    }

    thead.appendChild(tr)
    table.appendChild(thead)

    const tbody = document.createElement('tbody')
    // sort by field created
    aliases
        .sort((a, b) => new Date(a.created) - new Date(b.created))
        .forEach(alias => {
            const tr = document.createElement('tr')
            const tdAddress = document.createElement('td')
            // On click copy to clipboard
            tdAddress.addEventListener('click', () => {
                navigator.clipboard.writeText(alias.address)
            })
            tdAddress.innerText = alias.address
            const tdCreated = document.createElement('td')
            tdCreated.innerText = alias.created
            const tdActions = document.createElement('td')
            const aDelete = document.createElement('a')
            aDelete.classList.add('btn')
            aDelete.classList.add('btn-danger')
            aDelete.innerText = 'Delete'
            aDelete.setAttribute('href', `/aliases/${alias.id}`)
            tdActions.appendChild(aDelete)

            tr.appendChild(tdAddress)
            tr.appendChild(tdCreated)
            tr.appendChild(tdActions)
            tbody.appendChild(tr)
        })
    table.appendChild(tbody)

    dataContainer.innerHTML = ''
    dataContainer.appendChild(table)

    renderCreateButton();
}

function renderCreateButton() {
    const dataContainer = document.getElementById('container')
    const button = document.createElement('a')
    button.classList.add('btn')
    button.classList.add('btn-primary')

    button.addEventListener('click', async () => {
        button.innerText = 'Creating, please wait...'
        const res = await fetch('/aliases', {
            method: 'POST'
        })

        if (res.ok) {
            const data = await res.json()
            renderAliases(data)
            return
        }
    })

    button.innerText = 'Create new alias'
    dataContainer.appendChild(button)
}

fetch('/aliases').then(async res => {
    const data = await res.json()
    const dataContainer = document.getElementById('container')

    if (!res.ok) {
        dataContainer.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Login to see your aliases
            </div>
            <a href="/auth-oidc" class="btn btn-primary">Login</a>
        `

        return
    }

    renderAliases(data);
})