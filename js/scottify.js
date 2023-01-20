
const playlist = [
]
/* url of song api --- https versions hopefully a little later this semester */
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';


/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/


let songJSON = localStorage.getItem("listOfSongs");
let songs;
if(songJSON){
   songs = JSON.parse(songJSON);
   mainProgram(songs)
}else{
   fetch(api)
   .then(resp => resp.json())
   .then(data => {
      localStorage.setItem("listOfSongs", JSON.stringify(data))
      songs = JSON.parse(localStorage.getItem("listOfSongs"))
      mainProgram(songs)
   })
}

function mainProgram(songs){
   loadTable('songs')
   sortTitleHandler()
   const browser = document.querySelector("#browseSongsView")
   const singleSongView = document.querySelector("#singleSongView")
   const closeBtn = document.querySelector("#close")
   const playlistBtn = document.querySelector("#playlistBtn")
   const playlistView = document.querySelector("#playlistView")

   const genres = getGenres()
   const artists = getArtists()

   loadGenreDropDown(genres)
   loadArtistDropDown(artists)
   resetSearch()


   /*
      Loads the drop-down for the different set of genres needed to search.
   */
   function loadGenreDropDown(genres) {
      const genreDropDown = document.querySelector("#genreSearch")
      for (let g of genres) {
         const option = document.createElement("option")
         option.setAttribute("value", g)
         option.textContent = g
         genreDropDown.appendChild(option)
      }
   }

   /*
      Loads the drop-down for the different set of Artists needed to search.
   */
   function loadArtistDropDown(artists) {
      const artistDropDown = document.querySelector("#artistSearch")
      for (let a of artists) {
         const option = document.createElement("option")
         option.setAttribute("value", a)
         option.textContent = a
         artistDropDown.appendChild(option)
      }
   }


   /*
      Returns array of genres.
   */
   function getGenres() {
      const genres = [];
      for (let song of songs) {
         if (!genres.includes(song.genre.name))
            genres.push(song.genre.name)
      }
      genres.sort()
      return genres
   }
   /*
      Returns array of artists.
   */
   function getArtists() {
      const artists = [];
      for (let song of songs) {
         if (!artists.includes(song.artist.name))
            artists.push(song.artist.name)
      }
      artists.sort()
      return artists
   }

   const sortTitle = document.querySelector("#sortIconTitle")

   /*
      Sets the icon arrow for the header row to point downwards, except for the header element selected.
   */
   function setIcons(whichIcon) {
      const icons = document.querySelectorAll("#songTable img")
      const icon = document.querySelector(`#${whichIcon}`)
      for (let i of icons) {
         i.src = "assets/images/sort-down-solid.svg"
      }
      icon.src = "assets/images/sort-up-solid.svg"
   }

   sortTitle.addEventListener("click", sortTitleHandler)

   /*
      Sorts the songs titles alphabetically.
   */
   function sortTitleHandler() {
      setIcons("sortIconTitle")
      songs.sort(function (a, b) {
         if (a.title < b.title) {
            return -1;
         }
         if (a.title > b.title) {
            return 1;
         }
         return 0;
      })
      const tBody = document.querySelector(".songTable tbody")
      tBody.innerHTML = "";
      loadTable('songs')
   }

   const sortArtist = document.querySelector("#sortIconArtist");
   sortArtist.addEventListener("click", sortArtistHandler)

   /*
      Sorts the songs artists alphabetically.
   */
   function sortArtistHandler() {
      setIcons("sortIconArtist")
      songs.sort(function (a, b) {
         if (a.artist.name < b.artist.name) {
            return -1;
         }
         if (a.artist.name > b.artist.name) {
            return 1;
         }
         return 0;
      })
      const tBody = document.querySelector(".songTable tbody")
      tBody.innerHTML = "";
      loadTable('songs')
   }

   const sortPop = document.querySelector("#sortIconPop")
   sortPop.addEventListener("click", sortPopHandler)

   /*
      Sorts the songs popularity numerically.
   */
   function sortPopHandler() {
      setIcons("sortIconPop")
      songs.sort(function (a, b) {
         return a.details.popularity - b.details.popularity;
      })
      const tBody = document.querySelector(".songTable tbody")
      tBody.innerHTML = "";
      loadTable('songs')
   }


   const sortGenre = document.querySelector("#sortIconGenre")
   sortGenre.addEventListener("click", sortGenreHandler)


      /*
      Sorts the songs genres alphabetically.
   */
   function sortGenreHandler() {
      setIcons("sortIconGenre")
      songs.sort(function (a, b) {
         if (a.genre.name < b.genre.name) {
            return -1;
         }
         if (a.genre.name > b.genre.name) {
            return 1;
         }
         return 0;
      })
      const tBody = document.querySelector(".songTable tbody")
      tBody.innerHTML = "";
      loadTable('songs')
   }


   const sortYear = document.querySelector("#sortIconYear")
   sortYear.addEventListener("click", sortYearHandler)

   /*
      Sorts the songs year numerically.
   */
   function sortYearHandler() {
      setIcons("sortIconYear")
      songs.sort(function (a, b) {
         return a.year - b.year;
      })
      const tBody = document.querySelector(".songTable tbody")
      tBody.innerHTML = "";
      loadTable('songs')
   }

   const creditButton = document.querySelector("#creditButton");

   /*
      Makes it so that a mouseover on the credit button will have the dropdown menu disappear after 5 seconds.
   */
   function creditButtonHandler() {
      let myDropdown = document.querySelector("#credit");
      myDropdown.style.display = "block";
      setTimeout(function() { myDropdown.style.display = "none"; }, 5000);

   }
   creditButton.addEventListener("mouseover", creditButtonHandler);

   const clearButton = document.querySelector("#clearButton");
   /*
      Clears the textbox for title, and sets artist and genre to first option.
   */
   function resetSearch() {
      loadTable('songs')
      const radios = document.querySelectorAll("input[name=basicSongSearchButton]")
      for (let radio of radios) {
         const textBox = document.querySelector(`#${radio.value}Search`)
         if (radio.value == 'title') {
            radio.checked = true
            textBox.removeAttribute("disabled")
            textBox.value = ""
         } else {
            textBox.setAttribute('disabled', "")
            radio.checked == false
            textBox.selectedIndex = 0;
         }
      }

   }
   clearButton.addEventListener("click", resetSearch);

   const searchButton = document.querySelector("#searchButton");
   /*
      Checks which search method was selected and searches using that criteria.
   */
   function searchButtonHandler() {
      const radios = document.querySelectorAll("input[name=basicSongSearchButton]")
      let searchType;
      let searchVal;
      for (let r of radios) {
         if (r.checked) {
            searchType = r.value
            searchVal = document.querySelector(`#${searchType}Search`).value
         }
      }
      search(searchType, searchVal)
   }

   /*
      Searches for songs and stores them in results array.
   */
   let results = [];
   function search(type, val) {

      results = type == 'title' ? songs.filter(song => String(song.title).includes(val)) : type == 'artist' ? songs.filter(song => song.artist.name == val) : songs.filter(song => song.genre.name == val)

      const icons = document.querySelectorAll("#songTable img")
      for (let i of icons) {
         i.src = "assets/images/sort-down-solid.svg"
      }
      loadTable("search")
   }

   searchButton.addEventListener("click", searchButtonHandler);

   /*
      Sets table data for given song.
   */
   function getTableData(song) {
      const title = document.createElement("td")
      title.setAttribute('id', song.song_id)
      title.setAttribute("data-song", song.song_id)
      title.textContent = song.title


      const artist = document.createElement("td")
      artist.setAttribute('id', song.artist.id)
      artist.setAttribute("data-song", song.song_id)
      artist.textContent = song.artist.name

      const year = document.createElement("td")
      year.setAttribute('id', song.year)
      year.setAttribute("data-song", song.song_id)
      year.textContent = song.year

      const genre = document.createElement("td")
      genre.setAttribute('id', song.genre.id)
      genre.setAttribute("data-song", song.song_id)
      genre.textContent = song.genre.name

      const popularity = document.createElement("td")
      popularity.setAttribute('id', song.details.popularity)
      popularity.setAttribute("data-song", song.song_id)
      popularity.textContent = song.details.popularity

      return { title, artist, year, genre, popularity }
   }

   /*
      Creates add button for Browse song view.
   */
   function getAddBtn(song) {
      const addBtn = document.createElement("button")
      addBtn.classList.add("addBtn")
      addBtn.setAttribute('id', song.song_id)
      addBtn.textContent = "Add"

      return addBtn
   }

   /*
      Creates remove button for playlist view.
   */
   function getRemoveBtn(song) {
      const removeBtn = document.createElement("button")
      removeBtn.classList.add("removeBtn")
      removeBtn.setAttribute('id', song.song_id)
      removeBtn.textContent = "Remove"

      return removeBtn
   }

   /*
      Loads list of songs for given circumstances, one for unfiltered songs, one for playlist view and one for searched song view.
   */
   function loadTable(type) {
      if (type == 'songs') {
         const tBody = document.querySelector(".songTable tbody")
         tBody.innerHTML = ""
         for (let song of songs) {
            const tableData = getTableData(song)
            const addBtn = getAddBtn(song)

            const newRow = document.createElement("tr")
            newRow.setAttribute('id', "tableRow")
            newRow.setAttribute("data-song", song.song_id)

            newRow.appendChild(tableData.title)
            newRow.appendChild(tableData.artist)
            newRow.appendChild(tableData.year)
            newRow.appendChild(tableData.genre)
            newRow.appendChild(tableData.popularity)
            newRow.appendChild(addBtn)

            tBody.appendChild(newRow)
         }

         tBody.addEventListener('click', showSongDetails)
         tBody.addEventListener('click', addToPlaylist)
      } else if (type == 'playlist') {
         const tBody = document.querySelector("#playlistTable .songTable tbody")
         tBody.innerHTML = ""
         for (let song of playlist) {
            const tableData = getTableData(song)
            const removeBtn = getRemoveBtn(song)

            const newRow = document.createElement("tr")
            newRow.setAttribute('id', "tableRow")


            newRow.appendChild(tableData.title)
            newRow.appendChild(tableData.artist)
            newRow.appendChild(tableData.year)
            newRow.appendChild(tableData.genre)
            newRow.appendChild(tableData.popularity)
            newRow.appendChild(removeBtn)

            tBody.appendChild(newRow)
         }
         tBody.addEventListener('click', showSongDetails)
         tBody.addEventListener('click', removeFromPlaylist)
      } else if (type == 'search') {
         const tBody = document.querySelector(".songTable tbody")
         tBody.innerHTML = ""
         for (let song of results) {
            const tableData = getTableData(song)
            const addBtn = getAddBtn(song)

            const newRow = document.createElement("tr")
            newRow.setAttribute('id', "tableRow")
            newRow.setAttribute("data-song", song.song_id)

            newRow.appendChild(tableData.title)
            newRow.appendChild(tableData.artist)
            newRow.appendChild(tableData.year)
            newRow.appendChild(tableData.genre)
            newRow.appendChild(tableData.popularity)
            newRow.appendChild(addBtn)

            tBody.appendChild(newRow)
         }

         tBody.addEventListener('click', showSongDetails)
         tBody.addEventListener('click', addToPlaylist)

      }
   }

   /*
      Song Search Function
   */
   function getSong(songId) {
      return songs.find(song => song.song_id == songId)
   }

   /*
      Adds song to playlist if "Add" button was clicked
   */
   function addToPlaylist(e) {
      if (e.target && e.target.nodeName == "BUTTON") {
         const songId = e.target.id
         const song = getSong(songId)
         console.log(songId)
         playlist.push(song)

         const snackbar = document.querySelector("#snackbar")
         snackbar.className = "show"
         setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);

      }
   }

   /*
      Removes a song from playlist.
   */
   function removeFromPlaylist(e) {
      if (e.target && e.target.nodeName == "BUTTON") {
         const songId = e.target.id
         const index = playlist.findIndex(s => s.song_id == songId)
         playlist.splice(index, 1)
         updatePlaylistDetails()
         loadTable('playlist')
      }
   }

   function getAveragePopularity() {
      let sum = 0;
      let avg;
      for (let song of playlist) {
         sum = sum + song.details.popularity
      }

      avg = Math.round(sum/playlist.length)

      if(avg){
         return avg
      } else {
         return 0
      }
   }

   /*
      Shows information for single song view, lists bpm,energy,danceability,liveness,valence, speechiness and popularity.
      Also shows radar graph for song.
   */
   function showSongDetails(e) {
      if (e.target && e.target.nodeName == "TD") {

         playlistBtn.classList.add("hide")
         closeBtn.classList.remove("hide")
         browser.classList.add("hide")
         singleSongView.classList.remove("hide")
         playlistView.classList.add("hide")


         const songId = e.target.getAttribute("data-song")
         const song = songs.find(song => song.song_id == songId);

         const bpm = document.querySelector("#songInfo ul #bpm")
         bpm.textContent = "BPM: " + song.details.bpm;

         const energy = document.querySelector("#songInfo ul #energy")
         energy.textContent = "Energy: " + song.analytics.energy;

         const danceability = document.querySelector("#songInfo ul #danceability")
         danceability.textContent = "Danceability: " + song.analytics.danceability;

         const liveness = document.querySelector("#songInfo ul #liveness")
         liveness.textContent = "Liveness: " + song.analytics.liveness;

         const valence = document.querySelector("#songInfo ul #valence")
         valence.textContent = "Valence: " + song.analytics.valence;

         const acousticness = document.querySelector("#songInfo ul #acousticness")
         acousticness.textContent = "Acousticness: " + song.analytics.acousticness;

         const speechiness = document.querySelector("#songInfo ul #speechiness")
         speechiness.textContent = "Speechiness: " + song.analytics.speechiness;

         const loudness = document.querySelector("#songInfo ul #loudness")
         loudness.textContent = "Loudness: " + song.details.loudness

         const popularity = document.querySelector("#songInfo ul #popularity")
         popularity.textContent = "Popularity: " + song.details.popularity;

         const songInfo = document.querySelector("#songInfo p")
         const infoHeader = document.querySelector("#songInfo h2")
         infoHeader.textContent = `${song.title}-${song.artist.name}`
         let songMinutes = song.details.duration / 60;
         songMinutes = Math.round(songMinutes);
         let songSeconds = song.details.duration % 60;
         if(songSeconds > 9){
         songInfo.textContent = `${song.genre.name}, ${song.year}, ${songMinutes}:${songSeconds}`;
         }else{
            songInfo.textContent = `${song.genre.name}, ${song.year}, ${songMinutes}:0${songSeconds}`;
         }
         createRadarGraph(song)

      }
   }

   /*
      Creates Radar Graph for given song.
   */
   function createRadarGraph(song){
      const radar = document.querySelector("#radarChart")
      radar.innerHTML = "";
      const canvas = document.createElement("canvas")
      canvas.id = "myChart";
      radar.appendChild(canvas);

      const ctx = document.getElementById('myChart').getContext('2d');
      const myChart = new Chart(ctx, {
         type: 'radar',
         data: {
            labels: ['danceability', 'energy', 'speechiness', 'loudness', 'liveness', 'valence'],
            color: "white",
            datasets: [{
               label: '',
               data: [song.analytics.danceability, song.analytics.energy, song.analytics.speechiness, song.details.loudness, song.analytics.liveness, song.analytics.valence],
               backgroundColor: [
                  'rgba(#ff8c50, #ff8c50, #ff8c50, #ff8c50)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
               ],
               borderColor: [
                  'white'
               ],
               borderWidth: 1.2
            }]
         },
         options: {
            plugins: {
               title: {
                   display: true,
                   text: song.title,
                   color: "#ff8c50",
                   font: {
                     size: 25,
                     family: 'Roboto Mono'
                     
                  }
               }},
            scales: {
               r: {        
                  suggestedMin: 1,
                  suggestedMax: 100,  
                  ticks: {
                  color: "#ff8c50"
                  },
                  angleLine: {
                     color: "#ff8c50"
                  },    
                  grid: {
                     color: "#ff8c50"
                  },              
                  pointLabels: {  
                     color: "#ff8c50",
                  font: {
                     size: 15,
                     
                  }
                  }
               }
            }
         }
      });
   }

   const closeView = document.querySelector("#close")
   closeView.addEventListener('click', showBrowseSongsView)

   /*
      Shows Browse Song page and hides other pages.
   */
   function showBrowseSongsView() {
      playlistBtn.classList.remove("hide")
      closeBtn.classList.add("hide")
      browser.classList.remove("hide")
      singleSongView.classList.add("hide")
      playlistView.classList.add("hide")
   }

   const playListBtn = document.querySelector("#playlistBtn")

   /*
      Shows Playlist page and hides other pages.
   */
   playListBtn.addEventListener('click', function () {


      playlistBtn.classList.add("hide")
      closeBtn.classList.remove("hide")
      browser.classList.add("hide")
      playlistView.classList.remove("hide")

      updatePlaylistDetails()

      loadTable("playlist")
   })

   const clearPlaylistBtn = document.querySelector("#clearPlaylist")
   /*
      Clears playlist if "Clear Playlist button" is clicked.
   */
   clearPlaylistBtn.addEventListener('click', function () {
      while (playlist.length > 0) {
         playlist.pop()
      }

      updatePlaylistDetails()
      loadTable('playlist')
   })

   /*
      Updates playlist after a song is removed.
   */
   function updatePlaylistDetails() {

      const avgPopularity = document.querySelector("#playlistView li #avgPop")
      const numSongs = document.querySelector("#playlistView li #numSongs")

      avgPopularity.textContent = getAveragePopularity()
      numSongs.textContent = playlist.length

   }

   const radios = document.querySelectorAll('input[type="radio"')
   const form = document.querySelector("form")
   /*
      Checks which search method was selected and enables it, while disabling other methods.
   */
   form.addEventListener('click', function (e) {
      if (e.target && e.target.getAttribute("type") == "radio") {
         loadTable('songs')
         for (let radio of radios) {
            const textBox = document.querySelector(`#${radio.value}Search`)
            if (radio.checked) {
               textBox.removeAttribute("disabled")
            } else {
               textBox.setAttribute('disabled', "")
            }
         }
      }

   })
   }
   
