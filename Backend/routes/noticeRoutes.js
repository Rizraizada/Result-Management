const express = require('express');
const noticeController = require('../controllers/noticeController');

const router = express.Router();

// Simplify the routes
router.get('/', noticeController.getAllNotices);         // GET /api/notices
router.get('/page', noticeController.getNoticesByPage);  // GET /api/notices/page
router.get('/search', noticeController.searchNotices);   // GET /api/notices/search
router.post('/', noticeController.addNotice);            // POST /api/notices
router.put('/:id', noticeController.updateNotice);       // PUT /api/notices/:id
router.delete('/:id', noticeController.deleteNotice);    // DELETE /api/notices/:id
router.get('/:id', noticeController.getNoticeById); // GET /api/notices/:id



module.exports = router;
