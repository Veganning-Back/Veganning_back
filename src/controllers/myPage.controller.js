// myPage.controller.js

import { status } from '../../config/response.status.js';
import { getmyPageData } from '../services/myPage.service.js';
import { response } from '../../config/response.js';
import db from '../../config/db.config.js';

export const myPageTest = (req, res) => {
    //res.send(response(status.SUCCESS, getmyPageData()));
    res.send('myPageTest is working!');
};


export const myPageHandler = async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };