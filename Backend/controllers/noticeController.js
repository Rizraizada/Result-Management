const Notice = require('../models/noticeModel');

const noticeController = {
  
  getAllNotices: (req, res) => {
    Notice.getAllNotices((err, notices) => {
      if (err) {
        return res.status(500).json({ error: 'Error retrieving notices' });
      }
      res.json(notices);
    });
  },

  getNoticesByPage: (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    Notice.getNoticesByPage(page, limit, (err, notices) => {
      if (err) {
        return res.status(500).json({ error: 'Error retrieving notices' });
      }
      res.json(notices);
    });
  },

  searchNotices: (req, res) => {
    const searchTerm = req.query.search;
    Notice.searchNotices(searchTerm, (err, notices) => {
      if (err) {
        return res.status(500).json({ error: 'Error searching notices' });
      }
      res.json(notices);
    });
  },
  getNoticeById: (req, res) => {
    const { id } = req.params;
    Notice.getNoticeById(id, (err, notice) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(notice);
    });
  },
  

  addNotice: (req, res) => {
    const { title, date, content, badge } = req.body;
    Notice.addNotice({ title, date, content, badge }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error adding notice' });
      }
      res.json({ message: 'Notice added successfully', id: result.insertId });
    });
  },

  updateNotice: (req, res) => {
    const { id } = req.params;
    const { title, date, content, badge } = req.body;
    Notice.updateNotice(id, { title, date, content, badge }, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating notice' });
      }
      res.json({ message: 'Notice updated successfully' });
    });
  },

  deleteNotice: (req, res) => {
    const { id } = req.params;
    Notice.deleteNotice(id, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting notice' });
      }
      res.json({ message: 'Notice deleted successfully' });
    });
  }
};

module.exports = noticeController;
