const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const title = document.querySelector('#title');
const cover = document.querySelector('#cover');

const volumeContainer = document.querySelector('.volume-container');
const volumeBar = document.querySelector('.volume-bar');
const volumeBtn = document.querySelector('.fa-volume-up');

const musicWord = document.querySelector('.music-word');
const lyricBtn = document.querySelector('#lyric');
const wordContainer = document.querySelector('.word-container');
const ulLyric = document.querySelector(".ul-lyric");

const seekBtn = document.querySelector("#seek");
const songsList = document.querySelector('.songs-list');
const searchInput = document.querySelector('#searchInput');
const searchContainer = document.querySelector(".search-container");

// 页面初始化
const songObj = {
    id: 0,
    name: "卡农（经典钢琴版）",
    mp3Url: "http://m7.music.126.net/20210907214026/6641091b7f8e784390f0ca895766c910/ymusic/055a/535b/5359/206bffe62bd149b82531d34775e2eeb3.mp3",
    picUrl: "http://p4.music.126.net/fL7FAeRby1s7JreBqoOKjg==/109951165175371079.jpg"
};
let songs = [songObj];
let songIndex = 0;
ulLyric.innerHTML = `<li>这首歌暂无歌词...</li>`;

// 初始化音量调为50%
let oldVolume = 0.5;
audio.volume = 0.5;
loadSong(songObj);

// 歌词变量初始化
let lineNo = 0;     // 当前行歌词
let rollLine = 1;   // 开始滚动行
let moveHeight = -30;  // 滚动距离
let lyricList = [];

playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
volumeBtn.addEventListener('click', changeVolState);
lyricBtn.addEventListener('click', showContainer);
seekBtn.addEventListener("click", () => {
    if (searchContainer.style.opacity === "1") {
        searchContainer.style.opacity = 0;
    } else {
        searchContainer.style.opacity = 1;
    }
});

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
audio.addEventListener("loadstart", () => {
    ulLyric.innerHTML = "";
    lineNo = 0;
    ulLyric.style.top = "0px";
    const { id } = songs[songIndex];
    if(musicWord.style.opacity === "1") {
        // console.log("5");
        setLyric(id)
    }
})

progressContainer.addEventListener('click', changeProgress);
volumeContainer.addEventListener('click', changeVolume);

searchInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        // alert(searchInput.value);
        const value = searchInput.value;
        if (value === '') {
            alert('请输入歌名');
        } else {
            searchSongs(value);
        }
    } else {
        return;
    }
});

// 加载歌曲信息
function loadSong(obj) {
    const { name, mp3Url, picUrl } = obj;
    title.innerText = name;
    audio.src = mp3Url;
    cover.src = picUrl;
}

// 播放
function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    
    audio.play();
}

// 暂停
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    
    audio.pause();
}

// 上一首
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    changeSong(-1);
}

// 下一首
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    changeSong(1);
}

function changeSong(flag) {
    const { id } = songs[songIndex];
    // 初始页面播放的音乐，不进行检验
    if (id === 0) {
        audio.currentTime = 0;
        playSong();
        return;
    }
    checkSong(id, success => {
        if (!success) {
            pauseSong();
            if (flag === 1) {
                nextSong();
            } else if(flag === -1 ){
                prevSong();
            }   
            return;
        }
        getSong(id, mp3Url => {
            loadSong({ ...songs[songIndex], mp3Url });
            playSong();
        })
    });
}

// 更新进度条
function updateProgress(e) {
    // console.log(e.srcElement.duration);
    // console.log(e.srcElement.currentTime);
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

// 改变进度条
function changeProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    // console.log(clickX, duration);
    // audio.currentTime = Math.floor((clickX / width) * duration);
    audio.currentTime = (clickX / width) * duration;
}

// 切换音量静音状态
function changeVolState() {
    const volIconClass = volumeBtn.classList;
    const isVolmeUp = volIconClass.contains('fa-volume-up');
    // console.log(oldVolume);
    if (isVolmeUp) {
        volIconClass.remove('fa-volume-up');
        volIconClass.add('fa-volume-off');
        audio.volume = 0;
        volumeBar.style.height = '0%';
    } else {
        volIconClass.remove('fa-volume-off');
        volIconClass.add('fa-volume-up');
        audio.volume = oldVolume;
        volumeBar.style.height = oldVolume * 100 + '%';
    }
}

// 改变音量
function changeVolume(e) {
    const height = this.clientHeight;
    const clickY = e.offsetY;
    // console.log(height,clickY);
    const volume = (clickY / height);
    audio.volume = volume;
    volumeBar.style.height = volume * 100 + '%';

    oldVolume = volume;
}

// 显示歌词框
function showContainer() {
    const isShowing = musicWord.style.opacity;
    const { id } = songs[songIndex];
    if (isShowing === '1') {
        musicWord.style.opacity = 0;
    } else {
        musicWord.style.opacity = 1;
    }
    setLyric(id);
}

// 整理歌词
function setLyric(id) {
    ulLyric.innerHTML = "";
    getLyric(id, (lyric) => {
        if (lyric !== null) {
            // console.log(lyric);
            lyricList = parseLyric(lyric);
            addLyric(lyricList);
            audio.addEventListener('timeupdate', updateLyric);
        } else {
            audio.removeEventListener('timeupdate', updateLyric);
            ulLyric.innerHTML = `<li>这首歌暂无歌词...</li>`;
        }
    });
}

// 将获取的歌词转换成包含时间和歌词的对象
function parseLyric(lyric) {
    let lyricArr = lyric.split('\n');
    // console.log(lyricArr);
    let lyricList = [];
    for (let i = 0, length = lyricArr.length; i < length; i++) {
        let playTimeArr = lyricArr[i].match(/\[\d{2}\:\d{2}(\.(\d{3}|\d{2}))\]/g);
        // console.log("playTimeArr",playTimeArr);
        let lineLyric = "";
        if (lyricArr[i].split(playTimeArr).length > 0) {
            lineLyric = lyricArr[i].split(playTimeArr)[1];
        }
        // console.log(lineLyric);
        if (playTimeArr !== null) {
            for (let j = 0,length=playTimeArr.length; j < length; j++) {
                let time = playTimeArr[j].substring(1, playTimeArr[j].indexOf(']')).split(":");
                // console.log(time);
                lyricList.push({
                    time: (parseInt(time[0]) * 60 + parseFloat(time[1])).toFixed(4),
                    content: String(lineLyric)
                });
            }
        }
    }
    return lyricList;
}

// 渲染歌词列表
function addLyric(lyricList) {
    for (let i = 0,length=lyricList.length; i < length; i++) {
        ulLyric.innerHTML += `<li key=${i}>${lyricList[i].content}</li>`;
    }
}

// 更新歌词
function updateLyric() {
    if (lineNo === lyricList.length) return;
    lineNo = getLineNo(audio.currentTime);
    if (ulLyric.children.length !== 0) {
        highLight();
    }
    lineNo++;
}

// 高亮行
function highLight() {
    const lis = ulLyric.children;
    lis[lineNo].classList.add('active');
    if (lis[lineNo - 1]) {
        lis[lineNo-1].classList.remove('active');
    }
    if (lineNo > rollLine) {
        ulLyric.style.top = ((lineNo - rollLine) * moveHeight)+"px";
    }
}

// 获取歌词行号
function getLineNo(currentTime) {
    // 当前播放比歌词快
    if (currentTime >= parseFloat(lyricList[lineNo].time)) {
        // 快进
        for (let i = lyricList.length-1; i >= lineNo; i--) {
            if (currentTime >= parseFloat(lyricList[i].time)){
                return i;
            }
        }
    } else {// 当前播放比歌词慢
        for (let i = 0; i <= lineNo; i++) {
            if (currentTime <= parseFloat(lyricList[i].time)) {
                if (i === 0) {
                    return 0;
                }
                return i-1;
            }
        }
    }
}

// 搜索音乐
function searchSongs(song) {
    const url = `/cloudsearch?keywords=${song}`;
    doAjax(url, response => {
        const result = response.result.songs;
        songs = [];
        var mp3Url = "";
        for (let i = 0; i < result.length; i++) {
            const { id, name, al: { picUrl }, ar } = result[i];
            songs.push({ id, name, ar, mp3Url, picUrl });
        }
        setSongsList(songs);
        searchContainer.style.marginTop = "0px";
    })
}

// 渲染搜索页面
function setSongsList(obj) {
    songsList.innerHTML = obj.map(song => {
        const { id, name, ar } = song;
        if (ar.length === 1) {
            return `<li key=${id}>${name} - ${ar[0].name}</li>`
        } else {
            let artistsList = ar.map(one => one.name);
            return `<li key=${id}>${name} - ${artistsList}</li>`
        }
    }).join('');
    const lis = document.querySelector('.songs-list');
    for (let i = 0; i < lis.children.length; i++) {
        lis.children[i].onclick = function () {
            const id = this.getAttribute("key");
            songIndex = i;
            checkSong(id, success => {
                if (!success) {
                    alert("亲爱的，暂无版权...");
                    pauseSong();
                    nextSong();
                    return;
                }
                getSong(id, function (mp3Url) {
                    loadSong({ ...obj[i], mp3Url });
                    playSong();
                })
            })
            
        }
    }
}

// 获取音乐
function getSong(id, callback) {
    const url = `/song/url?id=${id}`;
    doAjax(url, response => {
        const { data } = response;
        callback(data[0].url);
    })
}

// 获取歌词
function getLyric(id,callback) {
    const url = `/lyric?id=${id}`;
    doAjax(url, response => {
        if (response.uncollected || response.nolyric) {
            callback(null);
        } else {
            callback(response.lrc.lyric);
        }
    })
}

// 音乐是否可用
function checkSong(id, callback) {
    const url = `/check/music?id=${id}`;
    doAjax(url, response => {
        if (response === "404") {
            callback(false);
            return;
        }
        const { success } = response;
        callback(success);
    })
}

function doAjax(url,callback) {
    const baseUrl = `http://localhost:3000`;
    const fullUrl = baseUrl + url;
    const xhr = new XMLHttpRequest();
    xhr.open('get', fullUrl, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.response);
                callback(response);
            }else{
                return (xhr.status);
            }
        }
    }
}