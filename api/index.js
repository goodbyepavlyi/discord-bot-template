const { request, response } = require(`express`);

module.exports = [{
    path: `/`,
    method: `get`,

    /**
     * @param {request} req 
     * @param {response} res 
     */
    run: async (req, res) => {
        return res.status(200).send({
            status: 200,
            message: `OK`,
            content: `Hello world!`,
        });
    }
}];