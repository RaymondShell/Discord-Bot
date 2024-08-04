const { SlashCommandBuilder, PermissionFlagsBits, GuildMember, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins a voice channel and plays a hardcoded MP3 file')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The voice channel to join')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const voiceChannel = interaction.options.getChannel('channel');
        if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
            return interaction.reply({ content: 'Please provide a valid voice channel.', ephemeral: true });
        }

        console.log(path.join(__dirname, "ear.mp3"))

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(path.join(__dirname, 'ear.mp3'));

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('The audio file is now playing!');
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('The audio file has finished playing, leaving the channel.');
            connection.destroy();
        });

        connection.on(VoiceConnectionStatus.Disconnected, () => {
            console.log('Disconnected from the voice channel.');
            connection.destroy();
        });

        await interaction.reply({ content: `Joining ${voiceChannel.name} and playing the audio file!` });
    }
};
