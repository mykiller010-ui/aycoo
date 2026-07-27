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
  };
}

export async function initDiscord(): Promise<void> {
  const avatar = document.querySelector<HTMLImageElement>("#discord-avatar");
  const decoration = document.querySelector<HTMLImageElement>(
    "#discord-decoration",
  );
  
  const presence = document.querySelector<HTMLElement>("#discord-presence");
  const status = document.querySelector<HTMLElement>("#discord-status");

  if (!avatar || !decoration || !presence || !status) return;

  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
    );

    const result = (await response.json()) as LanyardResponse;

    if (!result.success) {
      presence.textContent = "Offline";
      return;
    }

    const data = result.data;
    const user = data.discord_user;

   

    const statusNames = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline",
    };

    presence.textContent = statusNames[data.discord_status];

    status.className = `discord-status ${data.discord_status}`;

    // Avatar
    if (user.avatar) {
      const extension = user.avatar.startsWith("a_") ? "gif" : "png";

      avatar.src =
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=256`;
    }

    // Avatar Decoration
    if (user.avatar_decoration_data?.asset) {
      decoration.src =
        `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=256`;

      decoration.hidden = false;
    } else {
      decoration.hidden = true;
    }
  } catch (error) {
    console.error("Discord presence error:", error);
    presence.textContent = "Offline";
  }
}
