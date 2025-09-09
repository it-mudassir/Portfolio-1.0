if (document.body.classList.contains("home_page")) {

fetch("header.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("header_inclusion").innerHTML = data;
      });

fetch("footer.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer_includer").innerHTML = data;
      });

let texts = [
  "As-salamu Alaikum",
  "Hello",
  "Hola",
  "Bonjour",
  "Ciao",
  "Hallo",
  "Konnichiwa",
  "Namaste",
  "Nǐ hǎo",
  "Annyeong"
];


  let count = 0;        // which text
  let index = 0;        // which letter
  let currentText = "";
  let letter = "";
  let isDeleting = false;

  function type() {
    currentText = texts[count];
    
    if (isDeleting) {
      letter = currentText.slice(0, --index);
    } else {
      letter = currentText.slice(0, ++index);
    }

    document.getElementById("typing").textContent = letter || "\u00A0";


    let speed = isDeleting ? 50 : 100; // typing/erasing speed

    if (!isDeleting && letter.length === currentText.length) {
      speed = 1500; // pause at end
      isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
      isDeleting = false;
      count = (count + 1) % texts.length; // move to next text
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();

// word pop animation

const wordPopTexts = [
    "Dedicated",
    "Driven",
    "Visionary",
    "Creative",
    "Dynamic",
    "Passionate"
  ];
  
  
  

  let wordPopIndex = 0;

  function showWordPop(text) {
    const target = document.getElementById("wordPopTarget");
    target.textContent = text;

    // restart animation
    target.style.animation = "none";
    target.offsetHeight; // force reflow
    target.style.animation = "";
  }

  function cycleWordPop() {
    showWordPop(wordPopTexts[wordPopIndex]);
    wordPopIndex = (wordPopIndex + 1) % wordPopTexts.length;
  }

  cycleWordPop(); // show first
  setInterval(cycleWordPop, 2500); // change every 2.5s

// image Slide

/* ----- SLIDES (replace with your images + links + captions) ----- */
const SLIDES = [
    { src: "images/monograms/logo9.webp", link: "projects.html#monograms", caption: "Pemela Learning Center" },
    { src: "images/brouchers/broucher1 (1).jpg", link: "projects.html#brouchers", caption: "University Broucher" },
    { src: "images/UI/ui1 (1).webp", link: "projects.html#Ui", caption: "Portfolio Ui" },
    { src: "images/cover/cover (1).jpg", link: "projects.html#cover", caption: "University Cover" }
  ];
  
  /* ----- read durations from CSS vars so CSS+JS stay in sync ----- */
  const cs = getComputedStyle(document.documentElement);
  const parseMs = v => {
    v = v.trim();
    if (!v) return 0;
    if (v.endsWith('ms')) return parseFloat(v);
    if (v.endsWith('s'))  return parseFloat(v) * 1000;
    return parseFloat(v);
  };
  const D_ENTER = parseMs(cs.getPropertyValue('--d-enter'));
  const D_CENTER = parseMs(cs.getPropertyValue('--d-center'));
  const D_BG_FADE = parseMs(cs.getPropertyValue('--d-bg-fade'));
  const D_EXIT = parseMs(cs.getPropertyValue('--d-exit'));
  const TOTAL = D_ENTER + D_CENTER + D_EXIT;
  
  /* ----- elements & state ----- */
  const bgBase = document.getElementById('bgBase');
  const bgFade = document.getElementById('bgFade');
  const fgLink = document.getElementById('fgLink');
  const fgCaption = document.getElementById('fgCaption');
  const fgDots = document.getElementById('fgDots');
  
  let current = 0;
  let timers = []; // store setTimeout ids to clear when jumping
  
  /* build dots inside the foreground */
  function buildDots() {
    fgDots.innerHTML = '';
    SLIDES.forEach((s, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'fg-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i+1}`);
      d.addEventListener('click', e => {
        e.stopPropagation(); e.preventDefault(); // prevent the anchor navigation
        goto(i);
      });
      fgDots.appendChild(d);
    });
  }
  buildDots();
  
  /* helper: set base background immediately */
  function setBaseBackground(url) {
    bgBase.style.backgroundImage = `url(${url})`;
  }
  
  /* helper: fade-in the bgFade layer, then copy to base */
  function fadeInBackground(url) {
    bgFade.style.backgroundImage = `url(${url})`;
    // ensure CSS transition is present
    bgFade.style.transition = `opacity ${D_BG_FADE}ms ease-in-out`;
    // start fade
    requestAnimationFrame(() => bgFade.style.opacity = '1');
  
    // after fade completes, copy into base and reset fade layer
    const tid = setTimeout(() => {
      setBaseBackground(url);
      // hide fade instantly (disable transition to avoid visible flicker)
      bgFade.style.transition = 'none';
      bgFade.style.opacity = '0';
      // force reflow then restore transition for future cycles
      bgFade.offsetHeight;
      bgFade.style.transition = `opacity ${D_BG_FADE}ms ease-in-out`;
    }, D_BG_FADE);
    timers.push(tid);
  }
  
  /* update active dot visuals */
  function setActiveDot(idx) {
    const all = fgDots.querySelectorAll('.fg-dot');
    all.forEach((d,i)=> d.classList.toggle('active', i===idx));
  }
  
  /* clear scheduled timers */
  function clearTimers() {
    while (timers.length) clearTimeout(timers.pop());
  }
  
  /* show one slide and drive the timeline: enter -> bg fade -> exit -> repeat */
  function showSlide(idx) {
    clearTimers();
    current = idx;
  
    // set foreground background, href & caption
    const slide = SLIDES[idx];
    fgLink.style.backgroundImage = `url(${slide.src})`;
    fgLink.href = slide.link || '#';
    fgCaption.textContent = slide.caption || '';
  
    // reset classes and transition
    fgLink.classList.remove('fg-centered','fg-exit');
    fgLink.style.transition = 'none';
    fgLink.offsetHeight; // reflow
  
    // 1) ENTER: add transition for enter time and move to center
    fgLink.style.transition = `transform ${D_ENTER}ms cubic-bezier(.22,1,.36,1), opacity 180ms linear`;
    requestAnimationFrame(()=> fgLink.classList.add('fg-centered'));
  
    // 2) After ENTER completes, start background fade to the same image
    timers.push(setTimeout(()=> fadeInBackground(slide.src), D_ENTER));
  
    // 3) After ENTER + CENTER, start EXIT (use exit duration for transition)
    timers.push(setTimeout(()=> {
      fgLink.style.transition = `transform ${D_EXIT}ms cubic-bezier(.22,1,.36,1), opacity 180ms linear`;
      fgLink.classList.remove('fg-centered');
      fgLink.classList.add('fg-exit');
    }, D_ENTER + D_CENTER));
  
    // 4) Update dots immediately when this slide begins
    setActiveDot(idx);
  
    // 5) After full cycle, move to next slide automatically
    timers.push(setTimeout(()=> {
      const next = (idx + 1) % SLIDES.length;
      showSlide(next);
    }, TOTAL));
  }
  
  /* goto slide immediately (used by dot clicks) */
  function goto(idx) {
    clearTimers();
    showSlide(idx);
  }
  
  /* initialize: set initial base bg then start loop after small delay */
  setBaseBackground(SLIDES[0].src);
  setTimeout(()=> showSlide(0), 300);
  
  /* Optional: pause autoplay while mouse over the carousel */
  const carouselWrap = document.getElementById('carousel');
  let isHover = false;
  carouselWrap.addEventListener('mouseenter', () => {
    isHover = true;
    clearTimers();
  });
  carouselWrap.addEventListener('mouseleave', () => {
    if (!isHover) return;
    isHover = false;
    // resume from next slide
    const next = (current + 1) % SLIDES.length;
    showSlide(next);
  });

// link copy and redirect for projects page

document.querySelectorAll(".copy-link").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault(); // stop default navigation

    let popupText = this.getAttribute("data-text");
    let url = this.getAttribute("data-url");

    // Create custom popup
    let popup = document.createElement("div");
    popup.className = "custom-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <p>Do you want to copy <strong>"${popupText}"</strong> or visit the link?</p>
        <button class="copy-btn">Copy</button>
        <button class="visit-btn">Visit</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    `;

    document.body.appendChild(popup);

    // Handle Copy
    popup.querySelector(".copy-btn").addEventListener("click", () => {
      navigator.clipboard.writeText(popupText).then(() => {
        alert(`"${popupText}" copied!`);
        popup.remove();
      }).catch(err => {
        console.error("Copy failed: ", err);
        popup.remove();
      });
    });

    // Handle Visit
    popup.querySelector(".visit-btn").addEventListener("click", () => {
      window.location.href = url;
      popup.remove();
    });

    // Handle Cancel
    popup.querySelector(".cancel-btn").addEventListener("click", () => {
      popup.remove();
    });
  });
});

// hamburger menu
const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });    


// form data handler    

const scriptURL = "https://script.google.com/macros/s/AKfycbzjuk8Rg1Toi4hDFoEe5EO1M3VYuFjf58hcQ1I8d9aE2xoZXj2BM_WjynNuqmp-kaqq/exec";
  const form = document.getElementById("myForm");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(res => alert("Data Successfully Submitted."))
    .catch(err => alert("Error: " + err));
  });

}



// ----------------projects script section---------------

 

fetch("header.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("header_inclusion").innerHTML = data;
      });

fetch("footer.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer_includer").innerHTML = data;
      });


// cover page text animation

if (document.body.classList.contains("projects_page")) {

// hamburger menu
const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });   

 const textEl = document.getElementById("highlightText");
    const words = textEl.textContent.split(" ");
    textEl.textContent = "";

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word + " ";
      span.style.animationDelay = `${i * 0.5}s`; // shift effect word by word
      span.style.animationDuration = `${words.length * 0.5}s`; // full loop timing
      textEl.appendChild(span);
    });
  
// projects detail

// Example data for multiple sections
const sectionsData = {
  1: [
    { 
      src: "images/monograms/logo1.webp", 
      name: "Bakers Kitchen", 
      summary: "Short description for first image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo3.webp", 
      name: "Zina Logistics", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo4.webp", 
      name: "Carot Media", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo5.webp", 
      name: "Drago Invest", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo6.webp", 
      name: "Firm Foundation Acadmey", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo7.webp", 
      name: "My Paradise School", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo8.webp", 
      name: "Nexit Construction", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo9.webp", 
      name: "Pemela Learning Center", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo10.webp", 
      name: "Young Star Football Club", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    },
    { 
      src: "images/monograms/logo11.webp", 
      name: "Usmania Tool", 
      summary: "Quick summary for second image.", 
      build: "Built in Adobe Illustrator."
    }
  ],
  2: [
    { 
      src: "images/UI/ui1 (1).webp", 
      name: "Portfolio Web Page 1", 
      summary: "This is the third one.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui1 (2).webp", 
      name: "Portfolio Web Page 2", 
      summary: "Another image example.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui1 (3).webp", 
      name: "Portfolio Web Page 3", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui4 (1).webp", 
      name: "Portfolio Mobile Page 1", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui4 (2).webp", 
      name: "Portfolio Mobile Page 2", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui4 (3).webp", 
      name: "Portfolio Mobile Page 3", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui4 (4).webp", 
      name: "Portfolio Mobile Hamburger Menu", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui2 (1).webp", 
      name: "LMS 1.0 Login Form", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui2 (2).jpg", 
      name: "LMS 1.0 Home Page", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui2 (3).jpg", 
      name: "LMS 1.0 Detail Page", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui2 (4).jpg", 
      name: "LMS 1.0 Cart Page", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma.",
      type: "ui"
    },
    { 
      src: "images/UI/ui3 (1).webp", 
      name: "LMS 1.1 Signup Form", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma."
    },
    { 
      src: "images/UI/ui3 (2).webp", 
      name: "LMS 1.1 Login Form", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma."
    },
    { 
      src: "images/UI/ui3 (3).webp", 
      name: "LMS 1.1 Home Page (1)", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma."
    },
    { 
      src: "images/UI/ui3 (4).webp", 
      name: "LMS 1.1 Home Page (2)", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma."
    },
    { 
      src: "images/UI/ui3 (5).webp", 
      name: "LMS 1.1 Course Detail Page (1)", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma."
    },
    { 
      src: "images/UI/ui3 (6).webp", 
      name: "LMS 1.1 Course Detail Page (2)", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma."
    },
    { 
      src: "images/UI/ui3 (7).webp", 
      name: "LMS 1.1 Course Detail Page (3)", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma."
    },
    { 
      src: "images/UI/ui3 (8).webp", 
      name: "LMS 1.1 Cart Page", 
      summary: "Quick summary for second image.", 
      build: "Designed in Figma."
    }
  ],
  3: [
    { 
      src: "images/brouchers/broucher1 (1).jpg", 
      name: "University Broucher", 
      summary: "This is the third one.", 
      build: "Designed in Corel Draw."
    },
    { 
      src: "images/brouchers/broucher1 (2).png", 
      name: "University Broucher", 
      summary: "Another image example.", 
      build: "Designed in Corel Draw.",
      type: "photo"
    },
    { 
      src: "images/brouchers/broucher1 (3).png", 
      name: "University Broucher", 
      summary: "Another image example.", 
      build: "Designed in Corel Draw.",
      type: "photo"
    },
    { 
      src: "images/brouchers/broucher1 (4).jpg", 
      name: "University Broucher", 
      summary: "Another image example.", 
      build: "Designed in Corel Draw.",
      type: "photo"
    },
    { 
      src: "images/brouchers/broucher1 (5).png", 
      name: "University Broucher", 
      summary: "Another image example.", 
      build: "Designed in Corel Draw.",
      type: "photo"
    },
    { 
      src: "images/brouchers/broucher1 (6).png", 
      name: "University Broucher", 
      summary: "Another image example.", 
      build: "Designed in Corel Draw.",
      type: "photo"
    }
  ],
  4: [
    { 
      src: "images/cover/cover (1).jpg", 
      name: "Website Cover Page", 
      summary: "This is the third one.", 
      build: "Designed in Corel Draw."
    },
    { 
      src: "images/cover/cover (2).jpg", 
      name: "Website Cover Page", 
      summary: "Another image example.", 
      build: "Designed in Corel Draw.",
      type: "photo"
    } 
  ],
  5: [
    { 
      src: "images/cards/card (1).png", 
      name: "Univesity Card Front", 
      summary: "This is the third one.", 
      build: "Designed in Adobe Illustrator."
    },
    { 
      src: "images/cards/card (2).png", 
      name: "University Card Back", 
      summary: "Another image example.", 
      build: "Designed in Adobe Illustrator.",
      type: "photo"
    } 
  ]
};


const template = document.getElementById("card-template");

// Overlay elements
const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlay-img");
const overlayTitle = document.getElementById("overlay-title");
const overlaySummary = document.getElementById("overlay-summary");
const overlayBuild = document.getElementById("overlay-build");
const closeOverlay = document.getElementById("close-overlay");

// Generate section titles + cards
document.querySelectorAll(".cards-section").forEach(section => {
  const titleText = section.getAttribute("data-title");
  if (titleText) {
    const heading = document.createElement("h2");
    heading.textContent = titleText;
    section.insertBefore(heading, section.firstChild);
  }

  const container = section.querySelector(".cards-container");
  const sectionId = container.getAttribute("data-section");
  const images = sectionsData[sectionId];

  images.forEach(item => {
    const card = template.content.cloneNode(true);
    const img = card.querySelector("img");
    const box = card.querySelector(".image_box");
    const name = card.querySelector(".card-name");

    // Set img src
    img.src = item.src;

    // Also set as background (box styling)
    box.style.backgroundImage = `url('${item.src}')`;
    box.style.backgroundSize = "cover";
    box.style.backgroundPosition = "center";

    // Extract dominant color and set as background of <img>
    // getDominantColor(img, (color) => {
    //   img.style.backgroundColor = color; // semi-transparent dominant color
    // });

    // Set name
    name.textContent = item.name;

    // Click event for overlay
    card.querySelector(".card").addEventListener("click", () => {
      overlay.classList.add("active");
      overlayImg.src = item.src;
      overlayTitle.textContent = item.name;
      overlaySummary.textContent = item.summary;
      overlayBuild.textContent = item.build;

      const frame = document.querySelector(".overlay-image-frame");
      if (item.type === "ui") {
        frame.style.height = "auto";
      } else {
        frame.style.height = "100%";
      }

      // Also apply dominant color background for overlay image
      // getDominantColor(overlayImg, (color) => {
      //   overlayImg.style.backgroundColor = color;
      // });
    });

    container.appendChild(card);
  });
});

// Close overlay
closeOverlay.addEventListener("click", () => {
  overlay.classList.remove("active");
});

// Close when clicking outside
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});

// Function to get dominant color from an image
// function getDominantColor(imgElement, callback) {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   imgElement.crossOrigin = "Anonymous"; // avoid CORS errors if external

//   imgElement.onload = () => {
//     canvas.width = imgElement.naturalWidth;
//     canvas.height = imgElement.naturalHeight;
//     ctx.drawImage(imgElement, 0, 0);

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
//     let r = 0, g = 0, b = 0, count = 0;

//     for (let i = 0; i < imageData.length; i += 16) {
//       r += imageData[i];
//       g += imageData[i + 1];
//       b += imageData[i + 2];
//       count++;
//     }

//     r = Math.floor(r / count);
//     g = Math.floor(g / count);
//     b = Math.floor(b / count);

//     callback(`rgba(${r}, ${g}, ${b}, 1)`);
//   };
// }

// Function to get dominant color from an image (faster)
// function getDominantColor(imgElement, callback) {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   imgElement.crossOrigin = "Anonymous"; // avoid CORS errors if external

//   imgElement.onload = () => {
//     // Downscale image to speed up pixel processing
//     const width = 50;  // small size is enough
//     const height = 50;
//     canvas.width = width;
//     canvas.height = height;

//     // Draw image scaled down
//     ctx.drawImage(imgElement, 0, 0, width, height);

//     const imageData = ctx.getImageData(0, 0, width, height).data;
//     let r = 0, g = 0, b = 0, count = 0;

//     // Loop through pixels
//     for (let i = 0; i < imageData.length; i += 4) {
//       r += imageData[i];
//       g += imageData[i + 1];
//       b += imageData[i + 2];
//       count++;
//     }

//     // Average color
//     r = Math.floor(r / count);
//     g = Math.floor(g / count);
//     b = Math.floor(b / count);

//     callback(`rgba(${r}, ${g}, ${b}, 1)`);
//   };
// }

function getRandomColor() {
  // Generate a pastel-like color (lighter tones)
  const r = Math.floor(150 + Math.random() * 100);
  const g = Math.floor(150 + Math.random() * 100);
  const b = Math.floor(150 + Math.random() * 100);
  const a = 0.5;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Apply random background to all images
document.querySelectorAll("img").forEach(img => {
  img.style.backgroundColor = getRandomColor();
});



// link copy and redirect for projects page

document.querySelectorAll(".copy-link").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault(); // stop default navigation

    let popupText = this.getAttribute("data-text");
    let url = this.getAttribute("data-url");

    // Create custom popup
    let popup = document.createElement("div");
    popup.className = "custom-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <p>Do you want to copy <strong>"${popupText}"</strong> or visit the link?</p>
        <button class="copy-btn">Copy</button>
        <button class="visit-btn">Visit</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    `;

    document.body.appendChild(popup);

    // Handle Copy
    popup.querySelector(".copy-btn").addEventListener("click", () => {
      navigator.clipboard.writeText(popupText).then(() => {
        alert(`"${popupText}" copied!`);
        popup.remove();
      }).catch(err => {
        console.error("Copy failed: ", err);
        popup.remove();
      });
    });

    // Handle Visit
    popup.querySelector(".visit-btn").addEventListener("click", () => {
      window.location.href = url;
      popup.remove();
    });

    // Handle Cancel
    popup.querySelector(".cancel-btn").addEventListener("click", () => {
      popup.remove();
    });
  });
});

}


