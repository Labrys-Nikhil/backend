const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCard = async (title, deviceId, projectId, pageName, output, devEUI, displayFormula, displayUnit, displayFormula2, displayUnit2) => {
    try{

        const card = await prisma.card.findFirst({where:{title:title, pageName:pageName, projectId:projectId}});

        if(card){
            return null;
        }

        return await prisma.card.create({
            data:{
                title,
                deviceId,
                devEUI,
                pageName,
                projectId,
                output,
                displayFormula,
                displayUnit,
                displayFormulaSecondary:displayFormula2,
                displayUnitSecondary:displayUnit2
            }
        });

    }catch(error){
        throw new Error('Failed to create card ' + error.message);
    }
}

const updateCard = async ({data, cardId}) => {
    try{

        //get the card with the title in the project USING THE PROJECT ID

        const card = await prisma.card.findFirst({where:{title:data?.title, projectId: data?.projectId}});

        if(card && card.id != cardId){
            return null;
        }

        return await prisma.card.update({
            where:{
                id:cardId
            },
            data
        });

    }catch(error){
        throw new Error('Failed to create card ' + error.message);
    }
}

const getAllCardByProjectID = async (projectId, pageName) => {
    try{

        return await prisma.card.findMany({
            where:{
                projectId:projectId,
                pageName:pageName
            },
        });

    } catch(error){
        throw new Error('Failed to create card ' + error.message);
    }
}

const deleteCard = async (cardId) => {
    try{
        return await prisma.card.delete({
            where:{
                id:cardId
            }
        });

    } catch(error){
        throw new Error('Failed to create card ' + error.message);
    }
}


module.exports = {
    createCard,
    updateCard,
    getAllCardByProjectID,
    deleteCard
}
