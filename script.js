
//for current song details and playbar
let songNumber = -1, currentSong = null, timer = null;
let playBar = document.querySelector(".bar_fill");
let songlist=null;

//for event listeners 
const playbarPlayButton = document.querySelector(".playbar-button>.play-icon");
const icon = playbarPlayButton.querySelector("img");
const bar = document.querySelector(".bar");
const playbarButtons = document.querySelector(".playbar-button");
const nextSong = playbarButtons.querySelector(".next-song");
const previousSong = playbarButtons.querySelector(".prev-song");


//to get the songs from the directory
async function get_songs_list() {
    let a = await fetch("public/songs/");
    const text = await a.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let songs = div.getElementsByTagName('a');
    let songlist = [];
    for (let song of songs) {
        if (song["href"].endsWith(".mp3"))
            songlist.push(song.href.substring(song.href.indexOf("public/songs")));
    }
    return songlist;
}

// adds the songs to song-container
async function add_songs(songlist) {
    const container = document.querySelector(".songs-container");
    let c = 0;
    for (let song of songlist) {
        const s = document.createElement("div");
        s.setAttribute('class', "song");
        let name = song.substring(song.lastIndexOf("/") + 1);
        name = name.replaceAll("%20", " ");
        const songName = name.replace(".mp3", "");
        s.innerHTML = `<img id = "music-icon" src="public/music.svg" alt="">
                        <div class="details">${songName}</div>
                        <button class= "play">
                            <img class = "play-icon${++c}" src="public/play.svg" alt="">
                        </button>`;
        container.append(s);
        const playBtn = document.querySelector(`.play-icon${c}`);
        playBtn.addEventListener('click', () => {
            let currSong = event.target.getAttribute("class");
            let currNumber = currSong.charAt(currSong.length - 1) - '0';
            let src = event.target.getAttribute("src");
            if (songNumber === -1) {
                event.target.setAttribute("src", "public/pause.svg");
                icon.setAttribute("src","public/pause.svg");
                songNumber = currNumber;
                currentSong = new Audio(songlist[songNumber - 1]);
                currentSong.play();
                if (timer) clearInterval(timer);
                timer = setInterval(() => {
                    let width = currentSong.currentTime / currentSong.duration * 100;
                    playBar.style.width = `${width}%`;
                    if (width === 100) {
                        clearInterval(timer);
                        playBar.style.width = "0%";
                        const csong = document.querySelector(`.play-icon${songNumber}`);
                        csong.setAttribute("src","public/play.svg");
                        icon.setAttribute("src","public/play.svg");
                        currentSong = null;
                        songNumber = -1;
                    }
                }, 1000);
            }
            else if (songNumber === currNumber) {
                if (!currentSong.paused) {
                    event.target.setAttribute("src", "public/play.svg");
                    icon.setAttribute("src", "public/play.svg");
                    currentSong.pause();
                }
                else{
                    event.target.setAttribute("src", "public/pause.svg");
                    icon.setAttribute("src", "public/pause.svg");
                    currentSong.play();
                }
            }
            else {
                prevSong = document.querySelector(`.play-icon${songNumber}`);
                prevSong.setAttribute("src", "public/play.svg");
                event.target.setAttribute("src", "public/pause.svg");
                icon.setAttribute("src", "public/pause.svg");
                if (timer) clearInterval(timer);
                songNumber = currNumber;
                currentSong.pause();
                currentSong = new Audio(songlist[songNumber - 1]);
                currentSong.play();
                timer = setInterval(() => {
                    let width = currentSong.currentTime / currentSong.duration * 100;
                    playBar.style.width = `${width}%`;
                    if (width === 100) {
                        clearInterval(timer);
                        playBar.style.width = "0%";
                        const csong = document.querySelector(`.play-icon${songNumber}`);
                        csong.setAttribute("src","public/play.svg");
                        icon.setAttribute("src","public/play.svg");
                        currentSong = null;
                        songNumber = -1;
                    }
                }, 1000);
            }
        });
    }
}

//event listener for playbar click
bar.addEventListener("click", (event) => {
    if (!currentSong) return;
    const rect = bar.getBoundingClientRect();
    let total = rect.right - rect.left;
    let width = (event.clientX - rect.left) / total * 100;
    currentSong.currentTime = currentSong.duration / 100 * width;
    playBar.style.width = `${width}%`;
    if(currentSong.paused) {
        icon.setAttribute("src","public/pause.svg");
        const csong = document.querySelector(`.play-icon${songNumber}`);
        csong.setAttribute("src","public/pause.svg");
        currentSong.play();
    }
});

//event listener for playbarPlayButton
playbarPlayButton.addEventListener("click", () => {
    if (!currentSong) return;
    const playingSong = document.querySelector(`.play-icon${songNumber}`);
    if (!currentSong.paused) {
        currentSong.pause();
        playingSong.setAttribute("src", "public/play.svg");
        icon.setAttribute("src", "public/play.svg");
    }
    else {
        currentSong.play();
        playingSong.setAttribute("src", "public/pause.svg");
        icon.setAttribute("src", "public/pause.svg");
    }
});

//evnetlistener for nextSong
nextSong.addEventListener("click",()=>{
    if(!currentSong) return;
    const playingSong = document.querySelector(`.play-icon${songNumber}`);
    playingSong.setAttribute("src","public/play.svg");
    currentSong.pause();
    if((songNumber+1)<=songlist.length){
        songNumber++;
        const next = document.querySelector(`.play-icon${songNumber}`);
        next.setAttribute("src","public/pause.svg");
        icon.setAttribute("src", "public/pause.svg");
        currentSong = new Audio(songlist[songNumber-1]);
        currentSong.play();
    }
    else{
        icon.setAttribute("src","public/play.svg");
    }
});

//eventlistener for prevvsong
previousSong.addEventListener("click",()=>{
    if(!currentSong) return;
    const playingSong = document.querySelector(`.play-icon${songNumber}`);
    playingSong.setAttribute("src","public/play.svg");
    currentSong.pause();
    if(songNumber>1){
        songNumber--;
        const prev= document.querySelector(`.play-icon${songNumber}`);
        prev.setAttribute("src","public/pause.svg");
        icon.setAttribute("src","public/pause.svg");
        currentSong = new Audio(songlist[songNumber-1]);
        currentSong.play();
    }
    else{
        icon.setAttribute("src","public/play.svg");
    }
});

async function main() {
    songlist = await get_songs_list();
    await add_songs(songlist);
}
main();

