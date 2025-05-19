const cardService = require("../services/cardService");

//authorization to be done with user role and access management

const createCard = async (req, res) => {

    const { title, deviceId, projectId, pageName, output, devEUI, displayFormula, displayUnit, displayFormula2, displayUnit2 } = req.body;

    if (!title || !deviceId || !projectId || !pageName || !output || !devEUI) {
        return res.status(400).json({ message: 'Title, deviceId, ProjectId, pageName, output, devEUI.' });
    }

    try {

        const card = await cardService.createCard(
            title, deviceId, Number(projectId), pageName, output, devEUI,displayFormula, displayUnit,displayFormula2, displayUnit2
        );

        if(!card){
            return res.status(500).json({message:"Card title should be unique"})
        }

        res.status(201).json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const updateCard = async (req, res) => {
    const { data, cardId } = req.body;

    if (!cardId || !data) {
        return res.status(400).json({ message: 'CardId and data is required' });
    }

    //check

    try {
        const card = await cardService.updateCard(
            { data, cardId }
        );

        if(!card){
            return res.status(500).json({"message":"Card title must be unique"});
        }
        
        res.status(201).json(card);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const getAllCardByProjectID = async (req, res) => {
    const { projectId, pageName } = req.params;

    if (!projectId || !pageName) {
        return res.status(400).json({ message: 'projectId and pageName is required' });
    }

    //check

    try {
        const cards = await cardService.getAllCardByProjectID(Number(projectId), pageName);
        res.status(201).json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const deleteCardByCardId = async (req, res) => {
    const { cardId} = req.params;

    if (!cardId ) {
        res.status(400).json({ message: "CardId adn projectId is required" });
    }

    //check

    try {

        await cardService.deleteCard(Number(cardId));
        return res.status(200).json({message:"Card deleted Successfully"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCard,
    updateCard,
    getAllCardByProjectID,
    deleteCardByCardId
}
