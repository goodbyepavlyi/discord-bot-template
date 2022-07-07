const path = require(`path`);
const { readdirSync, statSync } = require(`fs`);

function walk(dir) {
    const results = [];

    readdirSync(dir).forEach(dirItem => {
        const stat = statSync(path.join(dir, dirItem));

        if (stat.isFile()) return results.push(path.join(dir, dirItem));
        if (stat.isDirectory()) walk(path.join(dir, dirItem)).forEach(walkItem => results.push(walkItem));
    });

    return results;
};

module.exports = {
    walk
};