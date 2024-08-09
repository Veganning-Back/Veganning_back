import bcrypt from 'bcrypt';
import db from '../../config/db.config.js';
import {  insertUserSql } from '../models/user.sql.js';  


export const registerUser = async (req, res) => {
    const { email, password, name, start_vegan } = req.body;

    // 필수 필드 검증
    if (!email || !password || !name || !start_vegan) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'All fields are required',
            data: {}
        });
    }

    try {
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 데이터베이스에 저장
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(insertUserSql, [email, hashedPassword, name, start_vegan]);

            await connection.commit();

            res.status(201).json({
                status: 201,
                success: true,
                message: 'User registered successfully',
                data: {}
            });
        } catch (error) {
            await connection.rollback();
            console.error('Database error:', error);
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Failed to register user',
                data: {}
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed to hash password',
            data: {}
        });
    }
};