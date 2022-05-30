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

router.get('/commands', auth, async (req, res) => {
    let categories = [];

    client.commands.forEach(command => {
        if (categories.includes(command.id)) return;
        categories.push(command.id);
    });

    let commands = Array.from(client.commands.values());

    res.json({
        status: 200,
        categories,
        commands
    });
});

module.exports = router;