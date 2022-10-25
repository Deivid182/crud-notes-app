const router = require('express').Router()
const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res) => {
  res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated, async(req, res) => {
  const {title, description} = req.body
  //Validating fields from the form-notes
  const errors = []

  if(!title) {
    errors.push({ text: 'Please insert a Title' })
  }

  if(!description) {
    errors.push({ text: 'Please insert a Description' })
  }

  if(errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      title,
      description
    })
  } else {
      const newNote = new Note({ title, description })
      newNote.user = req.user.email
      await newNote.save()
      req.flash('success_msg', 'Note added successfully')
      res.redirect('/notes')
  }
})


//showing notes in all-notes
router.get('/notes', isAuthenticated, async (req, res) => {
  const notes = await Note.find({user: req.user.email}).lean().sort({date: 'desc'})
  res.render('notes/all-notes', { notes })
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {

  const note = await Note.findById(req.params.id).lean()
  res.render('notes/edit-note', { note })
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
  const {title, description} = req.body
  await Note.findByIdAndUpdate(req.params._id, { title, description })
  req.flash('success_msg', 'Note updated successfully')
  res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  req.flash('success_msg', 'Note deleted successfully')
  res.redirect('/notes')
})

module.exports = router