import UserModel from '../models/users.js';
import WordsModel from '../models/word.js';
import csv from 'csv-parser';
import fs from 'fs';




const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, 'username email age role').exec()
    res.json({ message: 'Users retrieved successfully', users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error retrieving users' })
  }
}

const insertWords = async  (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const wordsData = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      wordsData.push({ Words: row.Words });
    })
    .on('end', async () => {
      try {
        const result = await WordsModel.insertMany(wordsData, { ordered: false });
        res.send({ message: ` ${result.length} Words Inserted successfully` });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error adding words' });
      }
    })
    .on('error', (error) => {
      console.error(error);
      res.status(500).send({ message: 'Error adding words' });
    });
};

const getWords = async (req, res) => {
  try {
    const words = await WordsModel.find({}).exec()
    res.json({ message: 'Words retrieved successfully', words })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error retrieving words' })
  }
}

const updateWords = async (req, res) => {
  try {
    const { _id, newWord } = req.body;
    if (!_id ||!newWord) {
      return res.status(400).json({ message: 'Both _id and newWord are required' });
    }

    const word = await WordsModel.findByIdAndUpdate(_id, { $set: { Words: newWord } }, { new: true });
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json({ message: 'Word updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating word' });
  }
};

const deleteWords = async (req, res) => {
  try {
    const wordIds = req.body.words;
    await WordsModel.deleteMany({ _id: { $in: wordIds } }); // Delete selected records
    res.json({ message: 'Selected words deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting selected words' });
  }
};

const deleteAllWords = async (req, res) => {
  try {
    await WordsModel.deleteMany({}); // Delete all records
    res.json({ message: 'All words deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting all words' });
  }
};

const addWord = async (req, res) => {
  try {
    const { text } = req.body;
    await WordsModel.create({ Words: text });
    res.status(201).json({ message: `Word added successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding word' });
  }
};

export{getUsers,insertWords,getWords,addWord,updateWords,deleteWords,deleteAllWords}