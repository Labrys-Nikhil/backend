// src/controllers/tagController.js

const tagService = require('../services/tagService');

// Create a new tag
const createTag = async (req, res) => {
    try {
        const newTag = await tagService.addTag(req.body);
        res.status(201).json({ success: true, data: newTag });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating tag', error: error.message });
    }
};

// Get all tags
const getAllTags = async (req, res) => {
    try {
        const tags = await tagService.getAllTags();
        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving tags', error: error.message });
    }
};

// Get tag by ID
const getTagById = async (req, res) => {
    try {
        const tag = await tagService.getTagById(req.params.id);
        if (tag) {
            res.status(200).json({ success: true, data: tag });
        } else {
            res.status(404).json({ success: false, message: 'Tag not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving tag', error: error.message });
    }
};

// Update tag by ID
const updateTag = async (req, res) => {
    try {
        const updatedTag = await tagService.updateTag(req.params.id, req.body);
        if (updatedTag) {
            res.status(200).json({ success: true, data: updatedTag });
        } else {
            res.status(404).json({ success: false, message: 'Tag not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating tag', error: error.message });
    }
};

// Delete tag by ID
const deleteTag = async (req, res) => {
    try {
        const deletedTag = await tagService.deleteTag(req.params.id);
        if (deletedTag) {
            res.status(204).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Tag not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting tag', error: error.message });
    }
};

module.exports = {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
};
