/*
    *IMPORTING NODE CLASSES
*/
const db = require('quick.db');

async function createUser(id) {
    try {
        if (!id) return;

        db.set(`user_${id}`, {
            id,
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

        let user = await db.get(`user_${id}`);
        return user;
    } catch (error) {
        throw Error(error);
    }
}

async function getUser(id) {
    try {
        if (!id) return;

        let user = await db.get(`user_${id}`) || await createUser(id);
        return user;
    } catch (error) {
        throw Error(error);
    }
}

async function saveData(id, data) {
    try {
        if (!(id || data)) return;
        
        await db.set(`user_${id}`, data);
        return;
    } catch (error) {
        throw Error(error);
    }
}

async function hasAgreedToRules(id) {
    try {
        let data = await getUser(id);
        if (!data) return;

        return data.agreedToRules;
    } catch (error) {
        throw Error(error);
    }
}

async function agreeToRules(id) {
    try {
        let data = await getUser(id);
        if (!data) return;

        data.agreedToRules = true;
        return saveData(id, data);
    } catch (error) {
        throw Error(error);
    }
}

async function getBalance(id) {
    try {
        let data = await getUser(id);
        if (!data) return;

        return data.balance;
    } catch (error) {
        throw Error(error);
    }
}

async function addBalance(id, balance) {
    try {
        if (isNaN(balance)) return;

        let data = await getUser(id);
        if (!data) return;

        data.balance = Math.abs(data.balance + Number(balance));
        return saveData(id, data);
    } catch (error) {
        throw Error(error);
    }
}

async function removeBalance(id, balance) {
    try {
        if (isNaN(balance)) return;

        let data = await getUser(id);
        if (!data) return;

        data.balance = Math.abs(data.balance - Number(balance));
        return saveData(id, data);
    } catch (error) {
        throw Error(error);
    }
}

async function setBalance(id, balance) {
    try {
        if (isNaN(balance)) return;

        let data = await getUser(id);
        if (!data) return;

        data.balance = Math.abs(Number(balance));
        return saveData(id, data);
    } catch (error) {
        throw Error(error);
    }
}

async function getTimeout(id, name) {
    try {
        if (!name) return;

        let data = await getUser(id);
        if (!data || !data.timeouts) return;

        return data.timeouts[name];
    } catch (error) {
        throw Error(error);
    }
}

async function setTimeout(id, name, time) {
    try {
        if (!(name || time)) return;

        let data = await getUser(id);
        if (!data || !data.timeouts) return;

        data.timeouts[name] = time;
        return saveData(id, data);
    } catch (error) {
        throw Error(error);
    }
}

async function getVoteReminder(id) {
    try {
        let data = await getUser(id);
        if (!data) return;

        return data.votes.remind;
    } catch (error) {
        throw Error(error);
    }
}

async function setVoteReminder(id, state) {
    try {
        let data = await getUser(id);
        if (!data) return;

        data.votes.remind = state;
        return saveData(id, data);
    } catch (error) {
        throw Error(error);
    }
}

async function getTotalVotes(id) {
    try {
        let data = await getUser(id);
        if (!data) return;

        return data.votes.times.length;
    } catch (error) {
        throw Error(error);
    }
}

async function getVoteStreak(id) {
    try {
        let data = await getUser(id);
        if (!data) return;

        //? Getting Date and removing 2 days from it
        let timeNow = Math.round(Date.now() / 1000) - (48 * 60 * 60);
        let lastTime = data.votes.times[data.votes.times.length - 1];

        if (lastTime <= timeNow) {
            data.votes.streak = 0;
            saveData(id, data);
            
            return 0;
        }

        return data.votes.streak;
    } catch (error) {
        throw Error(error);
    }
}

async function hasVoted(id) {
    try {
        let data = await getUser(id);
        if (!data) return;

        //? Getting Date and removing 1 day from it
        let timeNow = ((Math.round(Date.now() / 1000)) - (24 * 60 * 60));
        let lastTime = data.votes.times[data.votes.times.length - 1];

        return lastTime > timeNow;
    } catch (error) {
        throw Error(error);
    }
}

async function vote(id) {
    try {
        let data = await getUser(id);
        if (!data) return;

        data.votes.time.push(Math.round(Date.now() / 1000));
        data.total++;
        data.streak++;
        data.reminded = false;

        return saveData(id, data);
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