const express = require('express');
const router = express.Router();
const ProjectLog = require('../models/ProjectLog');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// POST or UPDATE a project log
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { projectId, date, entries } = req.body;

    if (!projectId || !date || !Array.isArray(entries)) {
      return res.status(400).json({ error: 'Project ID, date, and entries are required.' });
    }

    // Convert date string to Date object
    const logDate = new Date(date);

    // Upsert: Update if exists, otherwise create new
    const updatedLog = await ProjectLog.findOneAndUpdate(
      { projectId, date: logDate },
      { $set: { entries } },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET project log for a specific project and date
router.get('/:projectId', async (req, res) => {

  try {
    const { projectId } = req.params;
    const { date } = req.query;
    const logs = await ProjectLog.find({ projectId, date });
    if (!logs.length) {
      return res.status(404).json({ message: 'No logs found' });
    }
    res.json({ entries: logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
