// myPage.controller.js

import { status } from '../../config/response.status.js';
import { getmyPageData } from '../services/myPage.service.js';
import { response } from '../../config/response.js';
import db from '../../config/db.config.js';
import { getUserDataById } from '../services/myPage.service.js';

export const myPageTest = (req, res) => {
    //res.send(response(status.SUCCESS, getmyPageData()));
    res.send('myPageTest is working!');
};


  export const myPageHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const userData = await getUserDataById(id);
        if (!userData) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'User not found',
                data: {}
            });
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'User data retrieved successfully',
            data: userData
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Server error',
            data: {}
        });
    }
};

export const updateUser = async (req, res) => {
  const { id } = req.params; // 사용자 ID
  const { name, type, start_vegan } = req.body; // 요청 본문에서 데이터 추출

  // 필수 필드 검증
  if (!name || !type || !start_vegan) {
      return res.status(400).json({
          status: 400,
          success: false,
          message: 'Invalid input data',
          data: {}
      });
  }

  try {
      // 데이터베이스에서 사용자 정보 업데이트
      const result = await db.query(
          'UPDATE user SET name = ?, type = ?, start_vegan = ? WHERE id = ?',
          [name, type, start_vegan, id]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({
              status: 404,
              success: false,
              message: 'User not found',
              data: {}
          });
      }

      res.status(200).json({
          status: 200,
          success: true,
          message: 'User information updated successfully',
          data: {}
      });
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
          status: 500,
          success: false,
          message: 'Server error',
          data: {}
      });
  }
};