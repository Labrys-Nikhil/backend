// src/services/tagService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

// Add a new tag
const addTag = async (data) => {
    try {
        return await prisma.tag.create({
            data,
        });
    } catch (error) {
        logger.error("Error creating tag:", { error });
        throw new Error("Error creating tag");
    }
};

// Get all tags
const getAllTags = async () => {
    try {
        return await prisma.tag.findMany();
    } catch (error) {
        logger.error("Error retrieving tags:", { error });
        throw new Error("Error retrieving tags");
    }
};

// Get tag by ID
const getTagById = async (id) => {
    try {
        return await prisma.tag.findUnique({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error("Error retrieving tag:", { error });
        throw new Error("Error retrieving tag");
    }
};

// Update tag by ID
const updateTag = async (id, data) => {
    try {
        return await prisma.tag.update({
            where: { id: parseInt(id) },
            data,
        });
    } catch (error) {
        logger.error("Error updating tag:", { error });
        throw new Error("Error updating tag");
    }
};

// Delete tag by ID
const deleteTag = async (id) => {
    try {
        return await prisma.tag.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        logger.error("Error deleting tag:", { error });
        throw new Error("Error deleting tag");
    }
};

module.exports = {
    addTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
};
