import mongoose from "mongoose";
import Entry from "../models/entry.js";

export const getEntries = async (req, res) => {
  const userId = req.userId;
  try {
    const entries = await Entry.find({ creator: userId });
    res.status(200).json(entries);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createEntry = async (req, res) => {
  const entry = req.body;
  const newEntry = new Entry({
    ...entry,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateEntry = async (req, res) => {
  const { id: _id } = req.params;
  const entry = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json({ message: "No entry with that id" });

  try {
    const updatedEntry = await Entry.findByIdAndUpdate(_id, entry, {
      new: true,
    });

    res.status(201).json(updatedEntry);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteEntry = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json({ message: "No entry with that id" });
  try {
    await Entry.findByIdAndRemove(_id);
    res.status(200).json({ message: "Entry deleted successfully!" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
