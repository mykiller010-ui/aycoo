import type { IconName } from "./icons";

export interface SocialLink {
  label: string;
  icon: IconName;
  color: string;
  href?: string;
  copy?: string;
  toast?: string;
}

export interface Track {
  title: string;
  src: string;
}

export const profile = {
  kanji: "夜",
  name: "AYcoo",
  tagline: "",
};

export const links: SocialLink[] = [
  {
    label: "Discord",
    icon: "discord",
    color: "#5865f2",
    copy: "aycoo",
    toast: "Copied — <b>aycoo</b>",
  },
  {
    label: "GitHub",
    icon: "github",
    color: "#e6edf3",
    href: "https://github.com/anwarvip",
  },
  {
    label: "instagram",
    icon: "instagram",
    color: "#9146ff",
    href: "https://www.instagram.com/aycoo1/",
  },
  {
     label: "Gallery",
    icon: "rhythia",
    color: "#88a9fc",
    href: "/gallery",
  },
  
   {
  label: "Steam",
  icon: "steam",
  color: "#66c0f4",
  href: "https://steamcommunity.com/id/AYcoo1/",
},
  {
  label: "TikTok",
  icon: "tiktok",
  color: "#ffffff",
  href: "https://www.tiktok.com/@YOUR_USERNAME",
},
{
  label: "X",
  icon: "x",
  color: "#ffffff",
  href: "https://x.com/YOUR_USERNAME",
},
{
  label: "Spotify",
  icon: "spotify",
  color: "#1db954",
  href: "https://open.spotify.com/user/ebi00oxrqpcj99vi96cii1xxn?si=2785c1039e01465c",
},
  
 
];

export const tracks: Track[] = [
  


{
  title: "H - Echoes_Don’t_Leave",
    src: "./music/Echoes_Don’t_Leave.mp3",
  
  },
  {
    title: "P - Para_Qué_Me_Hiciste_Ben_Grant",
    src: "./music/Para_Qué_Me_Hiciste_Ben_Grant.mp3",
  },
  {
    title: "Kudasai - Dream Of Her",
    src: "./music/kudasai_dream_of_her.mp3",
  },
  {
    title: "Kudasai - The Girl I Haven't Met",
    src: "./music/kudasai_the_girl_i_havent_met.mp3",
  },
  {
    title: "Lovey - Ever Since",
    src: "./music/lovey_ever_since.mp3",
  },
  {
     title: "Caleb Belkin - I Fall In Love Too Easily",
    src: "./music/caleb_belkin_i_fall_in_love_too_easily.mp3",
  },
];

export const slides: string[] = Array.from(
  { length: 7 },
  (_, i) => `./slides/${String(i + 1).padStart(2, "0")}.webp`,
);

export const settings = {
  slideInterval: 9000,
  slideFade: 1800,
  shuffleSlides: true,
  startVolume: 0.12,
  autoplayOnFirstInteraction: true,
};
