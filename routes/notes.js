const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');


//Route 1 : get all notes of user Using GET 
router.get('/getallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error Occured");
  }
})

//Route 2 : add new  note of user Using POST
router.post('/addnote', fetchuser, [
  body('title', 'Enter a title').isLength({ min: 2 }),
  body('description', 'Description too short').isLength({ min: 3 })
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try {
    const { title, description, tag } = req.body;
    const note = new Notes({
      title, description, tag, user: req.user.id
    })

    const savedNote = await note.save();
    res.json(savedNote);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error Occured");
  }
})


//Route 3 : update note of user Using PUT
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error Occured");
  }

})



//Route 4 : Delete note of user Using Delete
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Error Occured");
  }


})


module.exports = router;