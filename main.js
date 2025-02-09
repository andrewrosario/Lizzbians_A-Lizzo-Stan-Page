document.addEventListener('DOMContentLoaded', (event) => {
    const signupButton = document.getElementById('signup')
    const loginButton = document.getElementById('login')
    const usernameField = document.getElementById('username')
    const userLoginURL = `https://morning-beach-63879.herokuapp.com/sessions/`
    const userCreate = `https://morning-beach-63879.herokuapp.com/users`
    const themeButton = document.getElementById('theme')
    const leaderboardButton = document.getElementById('leaderboard')
    const innerContentWrapper = document.getElementById('inner-content')
    const trillAudio = document.getElementById('trill-audio')
    const byeBitch = document.getElementById('delete')
    const staticElements = document.getElementById('static-elements').children
    const gameChoice = document.getElementById('choose-game-type')
    const loginDiv = document.getElementById('login-div')
    const lyrics = document.getElementById('lyrics')
    const trillButton = document.getElementById('trill-button')
    const menuToggle = document.getElementById('menu-toggle')
    let username; 

    function userLogIn() {
        // loginButton.addEventListener('click', (event) => {
        //     event.preventDefault()
        //     username = usernameField.value 
        //     let wrapper = document.getElementById('page-content-wrapper')
        //     wrapper.setAttribute('data-username', username)
        //     console.log(username)
        //     fetch(userLoginURL, {
        //         method: 'POST',
        //         body: JSON.stringify ({
        //             username: username
        //         }),
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     .then(handleErrors)

        //     .then (response => {
        //         clearInnerContent(innerContentWrapper);
        //         loginDiv.classList.add('hide')
        //         gameChoice.classList.toggle('hidden')
        //         trillButton.classList.toggle('hidden')
        //         menuToggle.classList.toggle('hidden')
        //     })
        //     .catch(function (error){
        //         alert ("Login was unsuccsessful. Please try again!");
        //         console.log(`this doesn't work`, error);
        //     })
        // })
        username = usernameField.value 
        clearInnerContent(innerContentWrapper);
        loginDiv.classList.add('hide')
        gameChoice.classList.toggle('hidden')
        trillButton.classList.toggle('hidden')
        menuToggle.classList.toggle('hidden')
    };

    function userSignUp() {
        // signupButton.addEventListener('click', (event) => {
        //     username = usernameField.value 
        //     const wrapper = document.getElementById('page-content-wrapper')
        //     wrapper.setAttribute('data-username', username)
        //     fetch(userCreate, {
        //         method: 'POST',
        //         body: JSON.stringify ({
        //             username: username
        //         }),
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     .then(handleErrors)

        //     .then (response => {
        //         clearInnerContent(innerContentWrapper);
        //         loginDiv.classList.add('hide')
        //         gameChoice.classList.toggle('hidden')
        //         trillButton.classList.toggle('hidden')
        //         menuToggle.classList.toggle('hidden')
        //     })
        //     .catch(function (error){
        //         console.log(`this doesn't work`, error);
        //     })
        // })
        clearInnerContent(innerContentWrapper);
    }

    function userSignOut() {
        byeBitch.addEventListener('click', (event) => {
            document.location.reload(true)
        })
    }

    userLogIn();
    userSignUp();
    userSignOut();
        
    // Handling Errors
    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    }

    // Remove Content From Inner-Conent Div
    function clearInnerContent(innerContentWrapper) {
        innerContentWrapper.innerHTML = ''
    }

    // Leaderboard Table Helper Methods
    function renderLeaderTables(gameTypeDiv, type) {
        const scoresTitle = document.createElement('h2')
        scoresTitle.innerText = `${type} scores table`
        gameTypeDiv.appendChild(scoresTitle)

        const scoresTable = document.createElement('table')
        scoresTable.setAttribute('id', type)
        scoresTable.setAttribute('class', 'text-center')
        gameTypeDiv.appendChild(scoresTable)

        const scoresHeaderRow = document.createElement('tr')
        scoresHeaderRow.setAttribute('class', 'table-header-row')
        scoresTable.appendChild(scoresHeaderRow)

        const scoresNameHeader = document.createElement('th')
        scoresNameHeader.innerText = 'Name'
        scoresHeaderRow.appendChild(scoresNameHeader)

        const scoreHeader = document.createElement('th')
        scoreHeader.innerText = 'Score'
        scoresHeaderRow.appendChild(scoreHeader)
    }

    // Build Leaderboard
    function renderLeaderboard(type) {

        hideStaticElements()

        fetch(`https://morning-beach-63879.herokuapp.com/games/${type}`)
        .then(resp => resp.json())
        .then(resp => {

            const scoresDiv = document.createElement('div')
            scoresDiv.setAttribute('class', 'container-fluid text-center')
            scoresDiv.setAttribute('id', 'scores-div')
            innerContentWrapper.appendChild(scoresDiv)
            renderLeaderTables(scoresDiv, type)

            const thisTable = document.getElementById(`${type}`)
            
            if(resp.length === 0) {
                const noScores = document.createElement('p')
                noScores.innerText = 'There are no Scores yet. Play?'
                scoresDiv.appendChild(noScores)
            } else {
                for(let i = 0; i < resp.length; i++) {
                    const thisRow = document.createElement('tr')
                    thisTable.appendChild(thisRow)
                    
                    const myName = document.createElement('td')
                    myName.innerText = resp[i].user.username
                    thisRow.appendChild(myName)

                    const myScore = document.createElement('td')
                    myScore.innerText = resp[i].score
                    thisRow.appendChild(myScore)
                }
            }
        })
    }

    // Build Theme Menu
    function renderThemeSettings(wrapper) {
        const sidebarWrapper = document.getElementById('sidebar-wrapper')

        const classicButton = document.createElement('button')
        classicButton.innerText = 'Classic'
        wrapper.appendChild(classicButton)
        classicButton.addEventListener('click', function(event) {
            event.preventDefault()
            sidebarWrapper.setAttribute('class', 'classic-theme')
        })

        const darkButton = document.createElement('button')
        darkButton.innerText = 'Dark'
        darkButton.addEventListener('click', function(event) {
            event.preventDefault()
            sidebarWrapper.setAttribute('class', 'dark-theme')
        })
        wrapper.appendChild(darkButton)

        const lightButton = document.createElement('button')
        lightButton.innerText = 'Light'
        lightButton.addEventListener('click', function(event) {
            event.preventDefault()
            sidebarWrapper.setAttribute('class', 'light-theme')
        })
        wrapper.appendChild(lightButton)   
    }

    function hideStaticElements() {
        for(element of staticElements) {
            element.classList.add('hidden')
        }
    }

    $("#menu-toggle").click(function(event){
        event.preventDefault()
        $("#wrapper").toggleClass("menuDisplayed")
    });

    themeButton.addEventListener('click', (event) => {
        hideStaticElements()
        clearInnerContent(innerContentWrapper)
        renderThemeSettings(innerContentWrapper)
    })

    leaderboardButton.addEventListener('click', (event) => {
        clearInnerContent(innerContentWrapper)
        renderLeaderboard('speed')
        renderLeaderboard('regular')
    })

    trillButton.addEventListener('mousedown', (event) => {
        trillAudio.play()
    })

    trillButton.addEventListener('mouseup', (event) => {
        trillAudio.pause()
    })
    

    lyrics.addEventListener('click', (event) => {
        clearInnerContent(innerContentWrapper);
        hideStaticElements();
        fetch("https://genius.p.rapidapi.com/artists/84514/songs", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "genius.p.rapidapi.com",
                "x-rapidapi-key": "3d58d2935bmsh1b1152c34f96a11p1a7439jsn25bb3f4d4554"
            }
        })
        .then(response => response.json())
        .then(response => {
            let songObj = response.response
                for (var songs of songObj.songs) {
                    let innerContent = document.getElementById('inner-content')
                    let div = document.createElement('lizzo-songs')
                    div.setAttribute('class', 'lizzo-songs')
                    let ul = document.createElement('ul')
                    let link = document.createElement('a')
                    let linkText = document.createTextNode(`${songs.full_title}`)
                    link.title = `${songs.full_title}`
                    link.href = `${songs.url}`
                    link.appendChild(linkText)
                    ul.appendChild(link)
                    div.appendChild(ul)
                    innerContent.appendChild(div)
                }
            })
            .catch(err => {
                console.log(err);
            });
        });
});
        