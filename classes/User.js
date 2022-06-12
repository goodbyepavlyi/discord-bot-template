/*
    *IMPORTING NODE CLASSES
*/
const { Snowflake } = require('discord.js');
const db = require('quick.db');

/**
 * @param {Snowflake} userId 
 */
async function createUser(userId) {
    try {
        if (!userId) return;

        db.set(`user_${userId}`, {
            id: userId,
            agreedToRules: false,
            balance: 0,
            timeouts: {},
            votes: {
                times: [],
                streak: 0,
                remind: true,
                reminded: false,
            },
        });

        let user = await db.get(`user_${userId}`);
        return user;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function getUser(userId) {
    try {
        if (!userId) return;

        let user = await db.get(`user_${userId}`) || await createUser(userId);
        return user;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 * @param {object} data 
 */
async function saveData(userId, data) {
    try {
        if (!(userId || data)) return;
        
        await db.set(`user_${userId}`, data);
        return;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function hasAgreedToRules(userId) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        return data.agreedToRules;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function agreeToRules(userId) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        data.agreedToRules = true;
        return saveData(userId, data);
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function getBalance(userId) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        return data.balance;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 * @param {number} balance
 */
async function addBalance(userId, balance) {
    try {
        if (isNaN(balance)) return;

        let data = await getUser(userId);
        if (!data) return;

        data.balance = Math.abs(data.balance + Number(balance));
        return saveData(userId, data);
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 * @param {number} balance
 */
async function removeBalance(userId, balance) {
    try {
        if (isNaN(balance)) return;

        let data = await getUser(userId);
        if (!data) return;

        data.balance = Math.abs(data.balance - Number(balance));
        return saveData(userId, data);
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 * @param {number} balance
 */
async function setBalance(userId, balance) {
    try {
        if (isNaN(balance)) return;

        let data = await getUser(userId);
        if (!data) return;

        data.balance = Math.abs(Number(balance));
        return saveData(userId, data);
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 * @param {string} name
 */
async function getTimeout(userId, name) {
    try {
        if (!name) return;

        let data = await getUser(userId);
        if (!data || !data.timeouts) return;

        return data.timeouts[name];
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 * @param {string} name
 * @param {number} time
 */
async function setTimeout(userId, name, time) {
    try {
        if (!(name || time)) return;

        let data = await getUser(userId);
        if (!data || !data.timeouts) return;

        data.timeouts[name] = time;
        return saveData(userId, data);
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function getVoteReminder(userId) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        return data.votes.remind;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 * @param {boolean} state
 */
async function setVoteReminder(userId, state) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        data.votes.remind = state;
        return saveData(userId, data);
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function getTotalVotes(userId) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        return data.votes.times.length;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function getVoteStreak(userId) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        //? Getting Date and removing 2 days from it
        let timeNow = Math.round(Date.now() / 1000) - (48 * 60 * 60);
        let lastTime = data.votes.times[data.votes.times.length - 1];

        if (lastTime <= timeNow) {
            data.votes.streak = 0;
            saveData(userId, data);
            
            return 0;
        }

        return data.votes.streak;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function hasVoted(userId) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        //? Getting Date and removing 1 day from it
        let timeNow = ((Math.round(Date.now() / 1000)) - (24 * 60 * 60));
        let lastTime = data.votes.times[data.votes.times.length - 1];

        return lastTime > timeNow;
    } catch (error) {
        throw Error(error);
    }
}

/**
 * @param {Snowflake} userId 
 */
async function vote(userId) {
    try {
        let data = await getUser(userId);
        if (!data) return;

        data.votes.time.push(Math.round(Date.now() / 1000));
        data.total++;
        data.streak++;
        data.reminded = false;

        return saveData(userId, data);
    } catch (error) {
        throw Error(error);
    }
}

module.exports = {
    getUser,

    hasAgreedToRules,
    agreeToRules,

    getBalance,
    addBalance,
    removeBalance,
    setBalance,

    getTimeout,
    setTimeout,

    getVoteReminder,
    setVoteReminder,
    getTotalVotes,
    getVoteStreak,
    hasVoted,
    vote,
}