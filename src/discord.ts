const DISCORD_ID = "229072391521697792";

type DiscordStatus =
  | "online"
  | "idle"
  | "dnd"
  | "offline";

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string | null;
  avatar: string | null;

  avatar_decoration_data?: {
    asset: string;
    sku_id?: string;
  } | null;
}

interface DiscordActivity {
  name: string;
  type: number;
  state?: string | null;
  details?: string | null;

  emoji?: {
    name?: string | null;
    id?: string | null;
    animated?: boolean;
  } | null;
}

interface SpotifyData {
  song: string;
  artist: string;
  album_art_url: string;
}

interface LanyardResponse {
  success: boolean;

  data: {
    discord_status: DiscordStatus;
    discord_user: DiscordUser;

    activities?: DiscordActivity[];

    listening_to_spotify?: boolean;

    spotify?: SpotifyData | null;
  };
}


/* =========================================================
   HELPERS
========================================================= */

function getAvatarUrl(user: DiscordUser): string {
  if (!user.avatar) return "";

  const extension =
    user.avatar.startsWith("a_")
      ? "gif"
      : "png";

  return (
    `https://cdn.discordapp.com/avatars/` +
    `${user.id}/${user.avatar}.${extension}?size=512`
  );
}


function getDecorationUrl(user: DiscordUser): string {
  const asset =
    user.avatar_decoration_data?.asset;

  if (!asset) return "";

  return (
    `https://cdn.discordapp.com/` +
    `avatar-decoration-presets/` +
    `${asset}.png?size=512`
  );
}


function getStatusName(status: DiscordStatus): string {
  switch (status) {
    case "online":
      return "Online";

    case "idle":
      return "Idle";

    case "dnd":
      return "Do Not Disturb";

    default:
      return "Offline";
  }
}


/* =========================================================
   INIT
========================================================= */

export async function initDiscord(): Promise<void> {

  /* =======================================================
     MAIN SMALL PROFILE
  ======================================================= */

  const profile =
    document.querySelector(
      "#discord-profile",
    ) as HTMLElement | null;

  const avatar =
    document.querySelector(
      "#discord-avatar",
    ) as HTMLImageElement | null;

  const decoration =
    document.querySelector(
      "#discord-decoration",
    ) as HTMLImageElement | null;

  const presence =
    document.querySelector(
      "#discord-presence",
    ) as HTMLElement | null;

  const status =
    document.querySelector(
      "#discord-status",
    ) as HTMLElement | null;


  if (
    !profile ||
    !avatar ||
    !decoration ||
    !presence ||
    !status
  ) {
    console.error(
      "[Discord] Main Discord HTML elements are missing.",
    );

    return;
  }


  /* =======================================================
     POPUP
  ======================================================= */

  const popup =
    document.querySelector(
      "#discord-popup",
    ) as HTMLElement | null;

  const popupClose =
    document.querySelector(
      "#discord-popup-close",
    ) as HTMLButtonElement | null;

  const popupAvatar =
    document.querySelector(
      "#discord-popup-avatar",
    ) as HTMLImageElement | null;

  const popupDecoration =
    document.querySelector(
      "#discord-popup-decoration",
    ) as HTMLImageElement | null;

  const popupStatus =
    document.querySelector(
      "#discord-popup-status",
    ) as HTMLElement | null;

  const popupName =
    document.querySelector(
      "#discord-popup-name",
    ) as HTMLElement | null;

  const popupUsername =
    document.querySelector(
      "#discord-popup-username",
    ) as HTMLElement | null;

  const popupAbout =
    document.querySelector(
      "#discord-popup-about",
    ) as HTMLElement | null;

  const popupStatusText =
    document.querySelector(
      "#discord-popup-status-text",
    ) as HTMLElement | null;

  const popupActivity =
    document.querySelector(
      "#discord-popup-activity",
    ) as HTMLElement | null;


  /* =======================================================
     OPEN POPUP
  ======================================================= */

  function openPopup(): void {
    if (!popup) return;

    popup.hidden = false;

    requestAnimationFrame(() => {
      popup.classList.add("open");
    });

    document.body.classList.add(
      "discord-popup-open",
    );
  }


  /* =======================================================
     CLOSE POPUP
  ======================================================= */

  function closePopup(): void {
    if (!popup) return;

    popup.classList.remove("open");

    document.body.classList.remove(
      "discord-popup-open",
    );

    window.setTimeout(() => {
      if (!popup.classList.contains("open")) {
        popup.hidden = true;
      }
    }, 250);
  }


  profile.addEventListener(
    "click",
    () => {
      openPopup();
    },
  );


  popupClose?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      closePopup();
    },
  );


  /* Click anywhere outside popup */

  document.addEventListener(
    "pointerdown",
    (event) => {

      if (!popup) return;

      if (popup.hidden) return;

      const target =
        event.target as Node | null;

      if (!target) return;

      if (popup.contains(target)) return;

      if (profile.contains(target)) return;

      closePopup();
    },
  );


  /* ESC */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closePopup();
      }

    },
  );


  /* =======================================================
     LOAD LANYARD
  ======================================================= */

  presence.textContent =
    "Loading...";


  try {

    const url =
      `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;


    console.log(
      "[Discord] Requesting:",
      url,
    );


    const response =
      await fetch(url);


    console.log(
      "[Discord] HTTP status:",
      response.status,
    );


    if (!response.ok) {
      throw new Error(
        `Lanyard HTTP ${response.status}`,
      );
    }


    const result =
      (await response.json()) as LanyardResponse;


    console.log(
      "[Discord] Lanyard response:",
      result,
    );


    if (
      !result ||
      result.success !== true ||
      !result.data
    ) {
      throw new Error(
        "Invalid Lanyard response.",
      );
    }


    const data =
      result.data;

    const user =
      data.discord_user;


    if (!user) {
      throw new Error(
        "discord_user missing from Lanyard response.",
      );
    }


    /* =====================================================
       STATUS
    ===================================================== */

    const currentStatus =
      data.discord_status || "offline";


    const statusName =
      getStatusName(currentStatus);


    presence.textContent =
      statusName;


    status.className =
      `discord-status ${currentStatus}`;


    if (popupStatus) {
      popupStatus.className =
        `discord-popup-status ${currentStatus}`;
    }


    /* =====================================================
       NAME
    ===================================================== */

    const displayName =
      user.global_name ||
      user.username;


    if (popupName) {
      popupName.textContent =
        displayName;
    }


    if (popupUsername) {
      popupUsername.textContent =
        `@${user.username}`;
    }


    /* =====================================================
       AVATAR
    ===================================================== */

    const avatarUrl =
      getAvatarUrl(user);


    console.log(
      "[Discord] Avatar URL:",
      avatarUrl,
    );


    if (avatarUrl) {

      avatar.src =
        avatarUrl;


      if (popupAvatar) {
        popupAvatar.src =
          avatarUrl;
      }

    } else {

      console.warn(
        "[Discord] No avatar hash returned.",
      );
    }


    /* =====================================================
       AVATAR DECORATION
    ===================================================== */

    const decorationUrl =
      getDecorationUrl(user);


    console.log(
      "[Discord] Decoration URL:",
      decorationUrl || "none",
    );


    if (decorationUrl) {

      decoration.src =
        decorationUrl;

      decoration.hidden =
        false;


      if (popupDecoration) {

        popupDecoration.src =
          decorationUrl;

        popupDecoration.hidden =
          false;
      }

    } else {

      decoration.hidden =
        true;


      if (popupDecoration) {
        popupDecoration.hidden =
          true;
      }
    }


    /* =====================================================
       CUSTOM STATUS
    ===================================================== */

    const activities =
      data.activities ?? [];


    const customStatus =
      activities.find(
        (activity) =>
          activity.type === 4,
      );


    if (popupStatusText) {

      if (customStatus?.state) {

        const emoji =
          customStatus.emoji?.name
            ? `${customStatus.emoji.name} `
            : "";


        popupStatusText.textContent =
          `${emoji}${customStatus.state}`;

      } else {

        popupStatusText.textContent =
          statusName;
      }
    }


    /* =====================================================
       ACTIVITY / SPOTIFY
    ===================================================== */

    if (popupActivity) {

      if (
        data.listening_to_spotify &&
        data.spotify
      ) {

        popupActivity.textContent =
          `${data.spotify.song} — ${data.spotify.artist}`;

      } else {

        const activity =
          activities.find(
            (item) =>
              item.type !== 4 &&
              item.name !== "Spotify",
          );


        if (!activity) {

          popupActivity.textContent =
            "No activity";

        } else {

          const pieces: string[] = [
            activity.name,
          ];


          if (activity.details) {
            pieces.push(
              activity.details,
            );
          }


          if (activity.state) {
            pieces.push(
              activity.state,
            );
          }


          popupActivity.textContent =
            pieces.join(" — ");
        }
      }
    }


    /* =====================================================
       ABOUT

       Lanyard does not expose Discord profile bio.
    ===================================================== */

    if (popupAbout) {

      popupAbout.textContent =
        "Hobbyist developer and network engineer.";
    }


    console.log(
      "[Discord] Loaded successfully:",
      {
        username: user.username,
        globalName: user.global_name,
        status: currentStatus,
        avatar: avatarUrl,
        decoration: decorationUrl,
        activities,
      },
    );


  } catch (error) {

    console.error(
      "[Discord] FAILED:",
      error,
    );


    presence.textContent =
      "Offline";


    status.className =
      "discord-status offline";


    if (popupStatus) {

      popupStatus.className =
        "discord-popup-status offline";
    }


    if (popupStatusText) {

      popupStatusText.textContent =
        "Offline";
    }


    if (popupActivity) {

      popupActivity.textContent =
        "Unable to load Discord";
    }
  }
}
