const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        // Define the user ID
        const userId = '808125872409804821';

        // Function to check and remove infractions
        async function checkAndRemoveInfractions() {
            // Get the guilds (servers) the bot is in
            client.guilds.cache.forEach(async guild => {
                try {
                    // Fetch the member by ID, force fetch from API
                    const member = await guild.members.fetch({ user: userId, force: true });

                    // Check if the member is muted, deafened, or timed out
                    if (member.communicationDisabledUntil || member.voice.serverMute || member.voice.serverDeaf) {
                        try {
                            // Remove timeout (if applicable)
                            if (member.communicationDisabledUntil) {
                                await member.timeout(null);
                            }

                            // Remove server mute (if applicable)
                            if (member.voice.serverMute) {
                                await member.voice.setMute(false);
                            }

                            // Remove server deafen (if applicable)
                            if (member.voice.serverDeaf) {
                                await member.voice.setDeaf(false);
                            }

                            console.log(`Infractions for user ${userId} removed in guild ${guild.name}`);
                        } catch (infractionsError) {
                            console.error(`Failed to remove infractions for user ${userId} in guild ${guild.name}:`, infractionsError);
                        }
                    }
                } catch (fetchError) {
                    console.error(`Failed to fetch user ${userId} in guild ${guild.name}:`, fetchError);
                }
            });
        }

        // Initial check when the bot is ready
        checkAndRemoveInfractions();

        // Set an interval to check every 10 seconds (10000 ms)
        setInterval(checkAndRemoveInfractions, 1000);

        // Function to set the bot's presence
        async function pickPresence() {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,
                        },
                    ],
                    status: statusArray[option].status,
                });
            } catch (error) {
                console.error(error);
            }
        }
    },
};
