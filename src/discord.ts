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
        activities?: DiscordActivity[];
    };
}

interface DiscordActivity {
    name?: string;
    type?: number;
    details?: string;
    state?: string;
    assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
    };
}

interface DiscordProfileData {
    user: DiscordUser;
    status: "online" | "idle" | "dnd" | "offline";
    activities: DiscordActivity[];
}


/* =========================================================
   HELPERS
   ========================================================= */

function getElement<T extends HTMLElement>(
    selector: string,
): T | null {
    return document.querySelector(selector) as T | null;
}


function getAvatarUrl(
    user: DiscordUser,
    size = 256,
): string {

    if (!user.avatar) {
        return "";
    }

    const extension =
        user.avatar.startsWith("a_")
            ? "gif"
            : "png";

    return (
        `https://cdn.discordapp.com/avatars/` +
        `${user.id}/${user.avatar}.${extension}?size=${size}`
    );
}


function getDecorationUrl(
    user: DiscordUser,
): string {

    const asset =
        user.avatar_decoration_data?.asset;

    if (!asset) {
        return "";
    }

    return (
        `https://cdn.discordapp.com/` +
        `avatar-decoration-presets/` +
        `${asset}.png?size=256`
    );
}


function statusName(
    status: DiscordProfileData["status"],
): string {

    const names = {
        online: "Online",
        idle: "Idle",
        dnd: "Do Not Disturb",
        offline: "Offline",
    };

    return names[status];
}


/* =========================================================
   MODAL
   ========================================================= */

function initDiscordModal(
    profileData: DiscordProfileData,
): void {

    const profile =
        getElement<HTMLElement>("#discord-profile");

    const modal =
        getElement<HTMLElement>("#discord-modal");

    const closeButton =
        getElement<HTMLButtonElement>(
            "#discord-modal-close",
        );

    const backdrop =
        getElement<HTMLElement>(
            "#discord-modal-backdrop",
        );

    if (!profile || !modal || !closeButton) {
        return;
    }


    /* -----------------------------------------------------
       Elements
       ----------------------------------------------------- */

    const modalAvatar =
        getElement<HTMLImageElement>(
            "#discord-modal-avatar",
        );

    const modalDecoration =
        getElement<HTMLImageElement>(
            "#discord-modal-decoration",
        );

    const modalStatus =
        getElement<HTMLElement>(
            "#discord-modal-status",
        );

    const modalName =
        getElement<HTMLElement>(
            "#discord-modal-name",
        );

    const modalUsername =
        getElement<HTMLElement>(
            "#discord-modal-username",
        );

    const modalAbout =
        getElement<HTMLElement>(
            "#discord-modal-about",
        );

    const modalCustomStatus =
        getElement<HTMLElement>(
            "#discord-modal-custom-status",
        );

    const modalActivity =
        getElement<HTMLElement>(
            "#discord-modal-activity",
        );


    /* -----------------------------------------------------
       Fill profile
       ----------------------------------------------------- */

    const user =
        profileData.user;


    if (modalAvatar) {

        const url =
            getAvatarUrl(user, 512);

        if (url) {
            modalAvatar.src = url;
        }
    }


    if (modalDecoration) {

        const url =
            getDecorationUrl(user);

        if (url) {

            modalDecoration.src = url;
            modalDecoration.hidden = false;

        } else {

            modalDecoration.hidden = true;
        }
    }


    if (modalName) {

        modalName.textContent =
            user.global_name ||
            user.username;
    }


    if (modalUsername) {

        modalUsername.textContent =
            `@${user.username}`;
    }


    if (modalStatus) {

        modalStatus.className =
            `discord-modal-status ${profileData.status}`;

        modalStatus.title =
            statusName(profileData.status);
    }


    /*
     * Lanyard's basic endpoint does not provide
     * a full Discord "About Me" field.
     *
     * So don't invent one.
     */
    if (modalAbout) {

        modalAbout.textContent =
            "Hobbyist developer and network engineer.";
    }


    /* -----------------------------------------------------
       Activity
       ----------------------------------------------------- */

    const activities =
        profileData.activities.filter(
            activity =>
                activity.name &&
                activity.name !== "Custom Status",
        );


    if (modalActivity) {

        if (activities.length === 0) {

            modalActivity.textContent =
                "No activity";

        } else {

            modalActivity.innerHTML = "";

            for (const activity of activities) {

                const item =
                    document.createElement("div");

                item.className =
                    "discord-modal-activity-item";


                const title =
                    document.createElement("strong");

                title.textContent =
                    activity.name || "Activity";

                item.append(title);


                if (activity.details) {

                    const details =
                        document.createElement("div");

                    details.textContent =
                        activity.details;

                    item.append(details);
                }


                if (activity.state) {

                    const state =
                        document.createElement("div");

                    state.textContent =
                        activity.state;

                    item.append(state);
                }


                modalActivity.append(item);
            }
        }
    }


    /* -----------------------------------------------------
       Status
       ----------------------------------------------------- */

    if (modalCustomStatus) {

        const customStatus =
            profileData.activities.find(
                activity =>
                    activity.name ===
                    "Custom Status",
            );

        if (
            customStatus?.state ||
            customStatus?.details
        ) {

            modalCustomStatus.textContent =
                customStatus.state ||
                customStatus.details ||
                "-";

        } else {

            modalCustomStatus.textContent =
                statusName(profileData.status);
        }
    }


    /* -----------------------------------------------------
       Open
       ----------------------------------------------------- */

    const openModal = (): void => {

        modal.classList.add("open");

        document.body.classList.add(
            "discord-modal-open",
        );

        closeButton.focus();
    };


    /* -----------------------------------------------------
       Close
       ----------------------------------------------------- */

    const closeModal = (): void => {

        modal.classList.remove("open");

        document.body.classList.remove(
            "discord-modal-open",
        );
    };


    /* -----------------------------------------------------
       Click avatar
       ----------------------------------------------------- */

    profile.addEventListener(
        "click",
        (event) => {

            const target =
                event.target as HTMLElement;

            /*
             * Don't accidentally open the modal
             * when clicking something inside the
             * profile that later becomes interactive.
             */
            if (
                target.closest(
                    "a, button",
                )
            ) {
                return;
            }

            openModal();
        },
    );


    /* -----------------------------------------------------
       Close button
       ----------------------------------------------------- */

    closeButton.addEventListener(
        "click",
        closeModal,
    );


    /* -----------------------------------------------------
       Backdrop
       ----------------------------------------------------- */

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeModal,
        );
    }


    /* -----------------------------------------------------
       Escape
       ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("open")
            ) {
                closeModal();
            }
        },
    );
}


/* =========================================================
   DISCORD
   ========================================================= */

export async function initDiscord(): Promise<void> {

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
        !avatar ||
        !decoration ||
        !presence ||
        !status
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
            );


        if (!response.ok) {

            throw new Error(
                `Discord request failed: ${response.status}`,
            );
        }


        const result =
            (await response.json()) as LanyardResponse;


        if (!result.success) {

            presence.textContent =
                "Offline";

            return;
        }


        const data =
            result.data;

        const user =
            data.discord_user;


        /* -------------------------------------------------
           Status
           ------------------------------------------------- */

        const statusNames = {
            online: "Online",
            idle: "Idle",
            dnd: "Do Not Disturb",
            offline: "Offline",
        };


        presence.textContent =
            statusNames[data.discord_status];


        status.className =
            `discord-status ${data.discord_status}`;


        /* -------------------------------------------------
           Avatar
           ------------------------------------------------- */

        const avatarUrl =
            getAvatarUrl(user, 256);


        if (avatarUrl) {

            avatar.src =
                avatarUrl;
        }


        /* -------------------------------------------------
           Avatar decoration
           ------------------------------------------------- */

        const decorationUrl =
            getDecorationUrl(user);


        if (decorationUrl) {

            decoration.src =
                decorationUrl;

            decoration.hidden =
                false;

        } else {

            decoration.hidden =
                true;
        }


        /* -------------------------------------------------
           Modal
           ------------------------------------------------- */

        initDiscordModal({
            user,
            status: data.discord_status,
            activities:
                data.activities ?? [],
        });


    } catch (error) {

        console.error(
            "Discord presence error:",
            error,
        );

        presence.textContent =
            "Offline";
    }
}
