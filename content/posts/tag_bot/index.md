---
title: Tag Bot
author: Kevin Ulrich

categories:
  - project
  - personal
  - blog
tags:
  - JavaScript
  - Discord
  - bot
summary: "Writing a Discord Bot for the classic game of tag"

---

A couple of days ago I wrote a Discord bot for the group of friends that I'm living with right now. They wanted to be able to play a game of tag with Nerf guns. The rules for the game are as follows, in case you want to try something similar:

```
1. You must fire the dart from the gun to tag someone.
2. Once you are tagged, you must wait until the next day to tag someone else
3. Don’t tag people while they are eating or drinking, or in other unreasonable circumstances.
4. Don’t tag people in their bedrooms
5. There are two guns. If you miss both shots on someone, you need to wait 30 minutes to try again

Rules may be updated if needed
```

I have worked on a [Discord bot previously](https://github.com/moromis/discord-channel-playlist-bot), but really just made someone else's old code work in that instance. This time around, I wanted to try writing my own bot from scratch.

When you write a Discord bot, you have a few options. Firstly, you can write everything from scratch, and follow the Discord Developer guidelines. I wanted to create this product quickly though, so this wasn't the best option. The other options are wrapper packages. There's two that I found in my initial search, though there might be more.
1. [Discord.js](https://discordjs.guide/)
2. [Discord.py](https://discordpy.readthedocs.io/en/stable/)

Both would be good options, but I decided to go with Discord.js as I want to build my experience with Javascript up again, and focus on some of my previous weaknesses.

I followed Discord.js's basic tutorial to get my bot running and responding to slash commands on a test server. [Here's the guide](https://discordjs.guide/#before-you-begin).

From there, I had to set up some sort of database. Here I came upon my first problem. I don't know a ton about setting up databases, and my quick look at even something like SQLite did not make it look like a simple or fast solution. So, for this quick and dirty bot I decided to just make my own database, of sorts. The program reads and writes from a file called [databaseManager](https://github.com/moromis/tag-bot/blob/master/databaseManager.js) to a JSON file aptly called `db.json`. Obviously this is not a great pattern, and there's improvements to be made, but the lesson here is that you don't always have to research the perfect pattern and spend time learning how to implement it. When making personal projects sometimes it's okay to just slap the first idea that comes into you're head into code. I should probably have written at least a couple tests for it though.

The "database" manager is built with a singleton pattern, as you can see here:

```
const getDatabase = () => {
  if (!databaseExists) {
    databaseInstance = database();
    databaseExists = true;
  }
  return databaseInstance;
};
```

and what is returned is an object with all the various transactional methods that we want to perform as properties. For the various time-based operations, I tried out using [dayjs](https://day.js.org/), a very small datetime library. I've used various other packages in the past, including `moment.js` and `date-fns`. I couldn't tell you how feature-complete `dayjs` is in comparison, but it did everything I needed it to do.

Basically all the data is stored in a flat structure, keyed by user ID (which is their Discord user ID). The creation of a new user is done through this private method:

```
const _createNewUser = (user, points = 0, isTagged = false) => {
  users[user.id] = {
    username: user.username,
    displayName: user.displayName,
    firstAdded: dayjs(),
    bestStreak: 0,
    lastTagged: dayjs(),
    totalSurvivalTime: 0,
    survivalTimeLastUpdated: dayjs(),
    isTagged,
    points,
  };
};
```

Which is always utilized via a masking method, `getOrCreateUser`, which handles checking for the existence of a user before creating one, and also returns the user in either case.

```
const getOrCreateUser = (user, points = 0, isTagged = false) => {
  if (!(user.id in users)) {
    _createNewUser(user, points, isTagged);
  }
  return users[user.id];
};
```

Some things I'd like to do in the future on this project include:

- Moving to a real database
- Moving to a serverless model (right now the bot is just hosted on my computer haha)
- Migrating to TypeScript
- Writing tests

Here's the [repository for the bot](https://github.com/moromis/tag-bot).