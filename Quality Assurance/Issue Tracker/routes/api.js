'use strict';

const mongoose = require('mongoose');

// Define your issue schema
const IssueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: '' },
  status_text: { type: String, default: '' },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  open: { type: Boolean, default: true },
  project: { type: String, required: true } // Add the project field
});

const Issue = mongoose.model('Issue', IssueSchema);

module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(async function (req, res) {
      const project = req.params.project;
      const filters = req.query; // Get filters from query parameters
      try {
        const issues = await Issue.find({ project, ...filters });
        res.json(issues);
      } catch (error) {
        console.error('Error fetching issues:', error); // Log the error
        res.status(500).json({ error: 'could not fetch issues' });
      }
    })
    
    .post(async function (req, res) {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const newIssue = new Issue({
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        project, // Make sure the project field is set
      });

      try {
        const savedIssue = await newIssue.save();
        res.json({ ...savedIssue._doc, created_on: savedIssue.created_on, updated_on: savedIssue.updated_on });
      } catch (error) {
        console.error('Error creating issue:', error); // Log the error
        res.status(500).json({ error: 'could not create issue' });
      }
    })
    
    .put(async function (req, res) {
      const project = req.params.project;
      const { _id, ...updateFields } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      try {
        const updatedIssue = await Issue.findByIdAndUpdate(_id, { ...updateFields, updated_on: Date.now() }, { new: true });
        if (!updatedIssue) {
          return res.json({ error: 'could not update', _id });
        }
        res.json({ result: 'successfully updated', _id });
      } catch (error) {
        console.error('Error updating issue:', error); // Log the error
        res.json({ error: 'could not update', _id });
      }
    })
    
    .delete(async function (req, res) {
      const project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      try {
        const deletedIssue = await Issue.findByIdAndDelete(_id);
        if (!deletedIssue) {
          return res.json({ error: 'could not delete', _id });
        }
        res.json({ result: 'successfully deleted', _id });
      } catch (error) {
        console.error('Error deleting issue:', error); // Log the error
        res.json({ error: 'could not delete', _id });
      }
    });
};
