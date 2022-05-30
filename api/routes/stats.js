/*
    *IMPORTING NODE CLASSES
*/
const { Router } = require('express');
const router = Router();

/*
    *IMPORTING FILES
*/
const client = require('../../app');
const auth = require('../middleware/auth.js');

router.get('/stats', auth, async (req, res) => {
    let servers = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

    res.json({
        status: 200,
        servers,
        members
    });
});

module.exports = router;