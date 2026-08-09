const DISCORD_ID = "229072391521697792";

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  avatar: string | null;
  avatar_decoration_data?: {
    asset: string;
    sku_id?: string;
  } | null;
}

interface LanyardResponse {
  success: boolean;
  data: {
    discord_status: "online" | "idle" | "dnd" | "offline";
    discord_user: DiscordUser;
    activities: Array<{
      name: string;
      type: number;
      state?: string;
      details?: string;
    }>;
    spotify?: {
      song: string;
      artist: string;
      album_art_url: string;
    } | null;
  };
}

export async function initDiscord(): Promise<void> {
  const profile = document.querySelector(
    "#discord-profile",
  ) as HTMLElement | null;

  const avatar = document.querySelector(
    "#discord-avatar",
  ) as HTMLImageElement | null;

  const decoration = document.querySelector(
    "#discord-decoration",
  ) as HTMLImageElement | null;

  const presence = document.querySelector(
    "#discord-presence",
  ) as HTMLElement | null;

  const status = document.querySelector(
    "#discord-status",
  ) as HTMLElement | null;

  if (!profile || !avatar || !decoration || !presence || !status) {
    console.warn("Discord profile elements not found.");
    return;
  }

  /*
   * =========================================================
   * POPUP ELEMENTS
   * =========================================================
   */

  const popup = document.querySelector(
    "#discord-popup",
  ) as HTMLElement | null;

  const popupClose = document.querySelector(
    "#discord-popup-close",
  ) as HTMLButtonElement | null;

  const popupAvatar = document.querySelector(
    "#discord-popup-avatar",
  ) as HTMLImageElement | null;

  const popupDecoration = document.querySelector(
    "#discord-popup-decoration",
  ) as HTMLImageElement | null;

  const popupStatus = document.querySelector(
    "#discord-popup-status",
  ) as HTMLElement | null;

  const popupName = document.querySelector(
    "#discord-popup-name",
  ) as HTMLElement | null;

  const popupUsername = document.querySelector(
    "#discord-popup-username",
  ) as HTMLElement | null;

  const popupAbout = document.querySelector(
    "#discord-popup-about",
  ) as HTMLElement | null;

  const popupStatusText = document.querySelector(
    "#discord-popup-status-text",
  ) as HTMLElement | null;

  const popupActivity = document.querySelector(
    "#discord-popup-activity",
  ) as HTMLElement | null;

  /*
   * =========================================================
   * OPEN / CLOSE POPUP
   * =========================================================
   */

 function openPopup(): void {
    if (!popup) return;

    popup.hidden = false;
    popup.classList.add("open");

    document.body.classList.add("discord-popup-open");
}

  function closePopup(): void {
    if (!popup) return;

    popup.classList.remove("open");
    popup.hidden = true;

    document.body.classList.remove("discord-popup-open");
}

  /*
   * CLICK DISCORD PROFILE
   */

  profile.addEventListener("click", () => {
    openPopup();
  });

  /*
   * CLOSE BUTTON
   */

  popupClose?.addEventListener("click", (event) => {
    event.stopPropagation();
    closePopup();
  });

  /*
   * CLICK OUTSIDE POPUP
   */

  popup?.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });

  /*
   * ESC KEY
   */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePopup();
    }
  });

  /*
   * =========================================================
   * LOAD DISCORD
   * =========================================================
   */

  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
    );

    if (!response.ok) {
      throw new Error(`Discord API returned ${response.status}`);
    }

    const result = (await response.json()) as LanyardResponse;

    if (!result.success) {
      throw new Error("Lanyard request failed.");
    }

    const data = result.data;
    const user = data.discord_user;

    /*
     * =======================================================
     * STATUS
     * =======================================================
     */

    const statusNames: Record<string, string> = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline",
    };

    const statusName =
      statusNames[data.discord_status] ?? "Offline";

    presence.textContent = statusName;

    status.className =
      `discord-status ${data.discord_status}`;

    /*
     * =======================================================
     * AVATAR
     * =======================================================
     */

    let avatarURL = "";

    if (user.avatar) {
      const extension = user.avatar.startsWith("a_")
        ? "gif"
        : "png";

      avatarURL =
        `https://cdn.discordapp.com/avatars/` +
        `${user.id}/${user.avatar}.${extension}?size=256`;

      avatar.src = avatarURL;
    }

    /*
     * =======================================================
     * AVATAR DECORATION
     * =======================================================
     */

    if (user.avatar_decoration_data?.asset) {
      decoration.src =
        `https://cdn.discordapp.com/avatar-decoration-presets/` +
        `${user.avatar_decoration_data.asset}.png?size=256`;

      decoration.hidden = false;
    } else {
      decoration.hidden = true;
    }

    /*
     * =======================================================
     * POPUP DATA
     * =======================================================
     */

    if (popupAvatar && avatarURL) {
      popupAvatar.src = avatarURL;
    }

    if (popupDecoration) {
      if (user.avatar_decoration_data?.asset) {
        popupDecoration.src =
          `https://cdn.discordapp.com/avatar-decoration-presets/` +
          `${user.avatar_decoration_data.asset}.png?size=256`;

        popupDecoration.hidden = false;
      } else {
        popupDecoration.hidden = true;
      }
    }

    if (popupStatus) {
      popupStatus.className =
        `discord-popup-status ${data.discord_status}`;
    }

    if (popupName) {
      popupName.textContent =
        user.global_name || user.username;
    }

    if (popupUsername) {
      popupUsername.textContent =
        `@${user.username}`;
    }

    if (popupStatusText) {
      popupStatusText.textContent = statusName;
    }

    /*
     * =======================================================
     * ABOUT ME
     *
     * Lanyard does not provide Discord profile bio.
     * So leave the section hidden unless you provide it
     * yourself.
     * =======================================================
     */

    if (popupAbout) {
      popupAbout.textContent =
        "Hobbyist developer and network engineer.";
    }

    /*
     * =======================================================
     * ACTIVITY
     * =======================================================
     */

    if (popupActivity) {
      const activities = data.activities ?? [];

      if (data.spotify) {
        popupActivity.textContent =
          `Listening to ${data.spotify.song} — ${data.spotify.artist}`;
      } else if (activities.length > 0) {
        const activity = activities[0];

        if (activity.details && activity.state) {
          popupActivity.textContent =
            `${activity.name} — ${activity.details} — ${activity.state}`;
        } else if (activity.details) {
          popupActivity.textContent =
            `${activity.name} — ${activity.details}`;
        } else {
          popupActivity.textContent =
            activity.name;
        }
      } else {
        popupActivity.textContent =
          "No activity";
      }
    }

  } catch (error) {
    console.error(
      "Discord presence error:",
      error,
    );

    presence.textContent = "Offline";

    status.className =
      "discord-status offline";
  }
}
