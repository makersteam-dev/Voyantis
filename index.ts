// youtube.d.ts
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

declare var YT: any;

export {};

// Get the current URL
const url = new URL(window.location.href);

// Get the value of the 'gated' parameter
const gated = url.searchParams.get("gated");

// Function to set a cookie
function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/`;
  console.log(`Cookie set: ${name}=${value}`);
}

// Function to get the value of a cookie
function getCookie(name: string): string | null {
  const nameEQ: string = `${name}=`;
  const cookies: string[] = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

// Function to load the video
function loadVideo(videoId: string): void {
  if (player) {
    player.loadVideoById(videoId);
  } else {
    player = new YT.Player("player", {
      height: "590",
      width: "100%",
      videoId: videoId,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: onPlayerReady,
      },
    });
  }
}

let player: any;

// Function to handle form submission or gated=skip
function handleFormSubmission(videoId: string): void {
  const cookieName = `formSubmitted_${videoId}`;

  // Set a cookie to remember that the form has been submitted
  setCookie(cookieName, videoId);

  // Remove .gated-video-dummy-wrap
  const dummyWrap: Element | null = document.querySelector(
    ".gated-video-dummy-wrap"
  );
  dummyWrap?.parentNode?.removeChild(dummyWrap);

  // Load the video
  if (typeof YT !== "undefined" && YT.loaded) {
    loadVideo(videoId);
  } else {
    // Load YouTube API if not loaded yet
    const tag: HTMLScriptElement = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag: HTMLScriptElement =
      document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);

    // Queue loading of video after YouTube API is loaded
    window.onYouTubeIframeAPIReady = () => {
      loadVideo(videoId);
    };
  }
}

// Check if 'gated' is 'skip'
if (gated === "skip") {
  const videoId: string = (
    document.getElementById("videoId") as HTMLInputElement
  ).value;
  console.log("Gated skip detected with videoId:", videoId);
  handleFormSubmission(videoId);
} else {
  const videoId: string = (
    document.getElementById("videoId") as HTMLInputElement
  ).value;
  const cookieName = `formSubmitted_${videoId}`;

  // Check if the form has already been submitted
  let savedVideoId: string | null = getCookie(cookieName);
  if (savedVideoId) {
    console.log("Form already submitted with videoId:", savedVideoId);
    handleFormSubmission(savedVideoId);
  }
}

// Attach an event listener to the form submission event, and also hide the form and scroll to the video section
document
  .getElementById("wf-form-Gated-Form")!
  .addEventListener("submit", function (event: Event): void {
    event.preventDefault();

    // Hide the form
    document.querySelector('[mt-el="webinar-modal"]')!.classList.remove("show");

    // Scroll to the video section
    document
      .querySelector("#video-section")!
      .scrollIntoView({ behavior: "smooth" });

    // Retrieve the video ID from the form input field
    const videoId: string = (
      document.getElementById("videoId") as HTMLInputElement
    ).value;

    handleFormSubmission(videoId);
  });

// Functions for YouTube player events
function onPlayerReady(event: any): void {
  event.target.playVideo();
}

function stopVideo(): void {
  player.stopVideo();
}

// Add event listeners to all elements with the attribute mt-el="webinar-trigger"
// When these elements are clicked, the event listener checks if a cookie is set
// If the cookie is set, it prevents the default action and smoothly scrolls to the #video-section
// If the cookie is not set, it toggles the "show" class on the element with the attribute mt-el="webinar-modal"
document
  .querySelectorAll('[mt-el="webinar-trigger"]')
  .forEach((trigger: Element) => {
    trigger.addEventListener("click", function (event: Event): void {
      const videoId: string = (
        document.getElementById("videoId") as HTMLInputElement
      ).value;
      const cookieName = `formSubmitted_${videoId}`;
      const cookieValue = getCookie(cookieName);
      console.log("Webinar trigger clicked. Cookie value:", cookieValue);

      if (cookieValue) {
        event.preventDefault();
        document
          .querySelector("#video-section")!
          .scrollIntoView({ behavior: "smooth" });
      } else if (gated === "skip") {
        handleFormSubmission(videoId);
        document
          .querySelector("#video-section")!
          .scrollIntoView({ behavior: "smooth" });
      } else {
        document
          .querySelector('[mt-el="webinar-modal"]')!
          .classList.toggle("show");
      }
    });
  });

// Add event listeners to all elements with the attribute mt-el="webinar-close"
// When these elements are clicked, the "show" class is removed from the element with the attribute mt-el="webinar-modal"
document
  .querySelectorAll('[mt-el="webinar-close"]')
  .forEach((closeElement: Element) => {
    closeElement.addEventListener("click", function (): void {
      document
        .querySelector('[mt-el="webinar-modal"]')!
        .classList.remove("show");
    });
  });
