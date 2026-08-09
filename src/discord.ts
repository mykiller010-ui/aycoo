const DISCORD_ID = "229072391521697792";

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

    assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
    };

    timestamps?: {
        start?: number;
        end?: number;
    };
}

interface SpotifyData {
    song: string;
    artist: string;
    album_art_url: string;
    timestamps?: {
        start: number;
        end: number;
    };
}

interface LanyardResponse {
    success: boolean;

    data: {
        discord_status:
            | "online"
            | "idle"
            | "dnd"
            | "offline";

        discord_user: DiscordUser;

        activities: DiscordActivity[];

        spotify?: SpotifyData | null;
    };
}

export async function initDiscord(): Promise<void> {

    // =========================================================
    // MAIN DISCORD PROFILE
    // =========================================================

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
        console.warn(
            "Discord profile elements not found.",
        );

        return;
    }


    // =========================================================
    // POPUP
    // =========================================================

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


    // =========================================================
    // POPUP OPEN / CLOSE
    // =========================================================

    function openPopup(): void {

        if (!popup) {
            console.warn(
                "#discord-popup was not found.",
            );

            return;
        }

        popup.hidden = false;

        popup.classList.add(
            "open",
        );

        document.body.classList.add(
            "discord-popup-open",
        );
    }


    function closePopup(): void {

        if (!popup) return;

        popup.classList.remove(
            "open",
        );

        popup.hidden = true;

        document.body.classList.remove(
            "discord-popup-open",
        );
    }


    // =========================================================
    // CLICK PROFILE
    // =========================================================

    profile.addEventListener(
        "click",
        (event) => {

            /*
             * Prevent clicks on links/buttons inside the
             * profile from accidentally opening the popup.
             */

            const target =
                event.target as HTMLElement | null;

            if (
                target?.closest(
                    "a, button",
                )
            ) {
                return;
            }

            openPopup();
        },
    );


    // =========================================================
    // CLOSE BUTTON
    // =========================================================

    popupClose?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            closePopup();
        },
    );


    // =========================================================
    // CLICK BACKGROUND TO CLOSE
    // =========================================================

    popup?.addEventListener(
        "click",
        (event) => {

            if (
                event.target === popup
            ) {
                closePopup();
            }
        },
    );


    // =========================================================
    // ESC TO CLOSE
    // =========================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {
                closePopup();
            }
        },
    );


    // =========================================================
    // LOAD DISCORD / LANYARD
    // =========================================================

    try {

        presence.textContent =
            "Loading...";


        const response =
            await fetch(
                `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
            );


        if (!response.ok) {

            throw new Error(
                `Lanyard returned HTTP ${response.status}`,
            );
        }


        const result =
            (await response.json()) as LanyardResponse;


        if (!result.success) {

            throw new Error(
                "Lanyard request was not successful.",
            );
        }


        const data =
            result.data;

        const user =
            data.discord_user;


        // =====================================================
        // STATUS
        // =====================================================

        const statusNames: Record<
            string,
            string
        > = {

            online: "Online",

            idle: "Idle",

            dnd: "Do Not Disturb",

            offline: "Offline",
        };


        const statusName =
            statusNames[
                data.discord_status
            ] ?? "Offline";


        // Main profile status

        presence.textContent =
            statusName;


        status.className =
            `discord-status ${data.discord_status}`;


        // Popup status

        if (popupStatus) {

            popupStatus.className =
                `discord-popup-status ${data.discord_status}`;
        }


        if (popupStatusText) {

            popupStatusText.textContent =
                statusName;
        }


        // =====================================================
        // USERNAME
        // =====================================================

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


        // =====================================================
        // AVATAR
        // =====================================================

        let avatarURL = "";


        if (user.avatar) {

            const extension =
                user.avatar.startsWith(
                    "a_",
                )
                    ? "gif"
                    : "png";


            avatarURL =
                `https://cdn.discordapp.com/avatars/` +
                `${user.id}/` +
                `${user.avatar}.` +
                `${extension}?size=512`;
        }


        if (avatarURL) {

            // Main profile

            avatar.src =
                avatarURL;

            avatar.loading =
                "eager";


            // Popup

            if (popupAvatar) {

                popupAvatar.src =
                    avatarURL;

                popupAvatar.loading =
                    "eager";
            }
        }


        // =====================================================
        // AVATAR DECORATION
        // =====================================================

        if (
            user.avatar_decoration_data?.asset
        ) {

            const decorationURL =
                `https://cdn.discordapp.com/` +
                `avatar-decoration-presets/` +
                `${user.avatar_decoration_data.asset}.png?size=512`;


            // Main

            decoration.src =
                decorationURL;

            decoration.hidden =
                false;


            // Popup

            if (popupDecoration) {

                popupDecoration.src =
                    decorationURL;

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


        // =====================================================
        // ACTIVITY
        // =====================================================

        const activities =
            data.activities ?? [];


        // -----------------------------------------------------
        // CUSTOM STATUS
        //
        // Discord custom status uses activity type 4.
        // -----------------------------------------------------

        const customStatus =
            activities.find(
                (activity) =>
                    activity.type === 4,
            );


        if (popupStatusText) {

            if (
                customStatus?.state
            ) {

                popupStatusText.textContent =
                    customStatus.state;

            } else {

                popupStatusText.textContent =
                    statusName;
            }
        }


        // =====================================================
        // SPOTIFY
        // =====================================================

        if (
            data.spotify
        ) {

            const spotify =
                data.spotify;


            if (popupActivity) {

                popupActivity.textContent =
                    `Listening to ${spotify.song} — ${spotify.artist}`;
            }

        } else {

            // =================================================
            // OTHER DISCORD ACTIVITY
            // =================================================

            const normalActivities =
                activities.filter(
                    (activity) =>
                        activity.type !== 4,
                );


            if (
                popupActivity &&
                normalActivities.length > 0
            ) {

                const activity =
                    normalActivities[0];


                if (
                    activity.details &&
                    activity.state
                ) {

                    popupActivity.textContent =
                        `${activity.name} — ` +
                        `${activity.details} — ` +
                        `${activity.state}`;

                } else if (
                    activity.details
                ) {

                    popupActivity.textContent =
                        `${activity.name} — ` +
                        `${activity.details}`;

                } else if (
                    activity.state
                ) {

                    popupActivity.textContent =
                        `${activity.name} — ` +
                        `${activity.state}`;

                } else {

                    popupActivity.textContent =
                        activity.name;
                }

            } else if (
                popupActivity
            ) {

                popupActivity.textContent =
                    "No activity";
            }
        }


        // =====================================================
        // ABOUT ME
        // =====================================================
        //
        // IMPORTANT:
        //
        // Lanyard does NOT provide the actual Discord
        // profile "About Me" bio through this endpoint.
        //
        // Therefore we don't pretend this came from Discord.
        //
        // Put your own website bio here if you want it shown.
        // =====================================================

        if (popupAbout) {

            popupAbout.textContent =
                "Hobbyist developer and network engineer.";
        }


        // =====================================================
        // READY
        // =====================================================

        profile.classList.add(
            "discord-loaded",
        );


    } catch (error) {

        console.error(
            "Discord presence error:",
            error,
        );


        // Main profile

        presence.textContent =
            "Offline";


        status.className =
            "discord-status offline";


        // Popup

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
                "Unable to load activity";
        }
    }
}
