import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../config/db.config.js';
import {  insertUserSql } from '../models/user.sql.js';
import { getUserByEmail } from '../models/user.sql.js'; // 이메일로 사용자 조회 쿼리


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

// 로그인
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 이메일로 사용자 조회
        const [users] = await db.query(getUserByEmail, [email]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: '사용자 이름 또는 비밀번호가 올바르지 않습니다.',
                data: {}
            });
        }

        // 비밀번호 비교
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: '사용자 이름 또는 비밀번호가 올바르지 않습니다.',
                data: {}
            });
        }

        // JWT 생성
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

        // 사용자 정보와 JWT를 포함한 응답 반환
        res.status(200).json({
            status: 200,
            success: true,
            message: '로그인 성공',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    start_vegan: user.start_vegan,
                    signupDate: user.signupDate // 추가 필드
                },
                token // JWT 토큰
            }
        });

    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: '내부 서버 오류입니다.',
            data: {}
        });
    }
};
