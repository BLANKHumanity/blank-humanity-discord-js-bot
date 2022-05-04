const { prefix } = require('../../config.json');

/**
 * Runs the help command, explaining each available command to the user.
 */
module.exports = {
    name: 'chillking',
    description: 'Output info for King of the Chill',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    async execute(message, args) {
        console.log("Executing chillking command");

        const channel = message.client.channels.cache.get("968618022837317712");

        console.log(channel);

        let messages = await getAllChannelMessages(channel, 5000);

        console.log("NUM MESSAGES: "+messages.length);

        console.log("FINISHED");

        let userPointsMap = {}; // {name: points, name: points}
        let currentKing = null;
        let previousKingTime = 0;

        for (const message of messages.reverse()) {
            let name = message.author.username;
            let time = message.createdTimestamp;

            if (name == "BLANK") continue; // don't count BLANK's first message

            if (previousKingTime == 0) previousKingTime = time; // Initialize if first message

            if (!userPointsMap[name]) userPointsMap[name] = 0;

            if (name != currentKing) {
                currentKing = name;
                let pointsEarned = time-previousKingTime;
                previousKingTime = time;

                userPointsMap[name] += pointsEarned;
            }
        }

        // Append hours to userPointsMap 
        let userHoursMap = {};
        Object.keys(userPointsMap).forEach((name) => {
            let milliseconds = userPointsMap[name];

            userHoursMap[name] = parseFloat(milliseconds)/1000/60/60;
        });


        console.log(userPointsMap);
        console.log(userHoursMap);


        var phrases = [
            'Command executed hehe it tickled'
        ];

        return message.reply(phrases[Math.floor(Math.random()*phrases.length)]); // Replies to the user with a random phrase
    },
};


async function getAllChannelMessages(channel, limit = 500) {
    const sum_messages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.messages.fetch(options);
        sum_messages.push(...messages.array());
        last_id = messages.last().id;

        console.log(messages.size);
        console.log(sum_messages.length);

        if (messages.size != 100 || sum_messages.length >= limit) {
            break;
        }
    }

    return sum_messages;
}
