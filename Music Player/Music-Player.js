const cdThumb = document.querySelector(".cd-thumb");
const playList = document.querySelector(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem("PLAYER_STORAGE_KEY")) || {},
  songs: [
    {
      name: "Những Gì Anh Nói (Lofi Version)",
      singer: "Bozitt",
      path: "../songs/NhungGiAnhNoiLofiVersion-BozittBozitt-6986121.mp3",
      image: "./image/nhunggianhnoi.jpg",
    },
    {
      name: "YÊU ĐƠN PHƯƠNG LÀ GÌ",
      singer: "h0n",
      path: "../songs/Yeu-Don-Phuong-La-Gi-h0n-Xam.mp3",
      image: "./image/yeudonphuong.jpg",
    },
    {
      name: "Yêu Từ Đâu Mà Ra",
      singer: "Lil Zpoet",
      path: "../songs/YeuTuDauMaRa-LilZpoet-6239110.mp3",
      image: "./image/yeutudaumara.jpg",
    },
    {
      name: "Từ Em Mà Ra",
      singer: "Lil Zpoet",
      path: "../songs/Tu Em Ma Ra - Lil Zpoet_ Duc Anh_ Duc An.mp3",
      image: "./image/tuemmara.jpg",
    },
    {
      name: "Em Là Nhất",
      singer: "Kis x Hoàng Kaylee x Yahy x Minn",
      path: "../songs/Em La Nhat Cukak Remix_ - Kis_ Hoang Kay.mp3",
      image: "./image/emlanhat.jpg",
    },
    {
      name: "Nụ Cười Em Là Nắng",
      singer: "Green",
      path: "../songs/Nu Cuoi Em La Nang - Green.mp3",
      image: "./image/nucuoiemlanang.jpg",
    },
    {
      name: "Vì Mẹ Anh Bắt Chia Tay",
      singer: "Miu Lê x Karik x Châu Đăng Khoa",
      path: "../songs/VI M ANH BT CHIA TAY MIU LE X KARIK X CHAU DANG KHOA (tainhachay.us).mp3",
      image: "./image/vimeanhbatchiatay.jpg",
    },
    {
      name: "3 1 0 7",
      singer: "W/n, DuongG, Nâu",
      path: "../songs/3107.mp3  ",
      image: "./image/3107.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index = "${index}">
                <div
                class="thumb"
                style="
                    background-image: url('${song.image}');
                "
                ></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
    });
    playList.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cd = document.querySelector(".cd");
    const cdWidth = cd.offsetWidth;

    //Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    //Xử lý phóng to/ thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xử lý khi click Play
    const playBtn = document.querySelector(".btn-toggle-play");
    const player = document.querySelector(".player");
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    //Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      const progress = document.querySelector("#progress");
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };

    //Xử lý khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //Khi next song
    const nextBtn = document.querySelector(".btn-next");
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //Khi prev Song
    const prevBtn = document.querySelector(".btn-prev");
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //Bật tắt nút Random Song
    const randomBtn = document.querySelector(".btn-random");
    randomBtn.onclick = function () {
      if (_this.isRandom) {
        randomBtn.classList.remove("active");
        _this.isRandom = false;
      } else {
        randomBtn.classList.add("active");
        _this.isRandom = true;
      }
    };

    //Xử lý nextsong khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //Xử lý khi repeat song
    const repeatBtn = document.querySelector(".btn-repeat");
    repeatBtn.onclick = function () {
      if (_this.isRepeat) {
        _this.isRepeat = false;
        repeatBtn.classList.remove("active");
      } else {
        _this.isRepeat = true;
        repeatBtn.classList.add("active");
      }
    };

    //Lắng nghe hành vi click vào playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          // console.log(songNode.getAttribute("data-index"));
          _this.currentIndex = Number(songNode.getAttribute("data-index"));
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      if ((this.currentIndex === 0, 1)) {
        document.querySelector(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        document.querySelector(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 300);
  },

  loadCurrentSong: function () {
    const heading = document.querySelector("header h2");
    const audio = document.querySelector("#audio");
    heading.innerHTML = this.currentSong.name;
    audio.src = this.currentSong.path;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
