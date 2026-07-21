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
  tagline: "Hobbyist developer, network engineer, music enthusiast,artest love painting and co-op gamer",
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
    label: "osu!",
    icon: "osu",
    color: "#ff66aa",
    href: "https://osu.ppy.sh/users/",
  },
  {
    label: "VRChat",
    icon: "vrchat",
    color: "#5edee7",
    href: "https://vrchat.com/home/user/",
  },
];

export const tracks: Track[] = [
  


{
    title: "Caleb Belkin - I Fall In Love Too Easily",
    src: "./music/caleb_belkin_i_fall_in_love_too_easily.mp3",
  },
  {
    title: "Hisohkah - School Rooftop",
    src: "./music/hisohkah_school_rooftop.mp3",
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
    title: "Yagih Mael - Fly Me To The Moon",
    src: "./music/yagih_mael_fly_me_to_the_moon.mp3",
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
