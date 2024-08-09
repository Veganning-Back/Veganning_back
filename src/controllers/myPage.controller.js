// myPage.controller.js

import { status } from '../../config/response.status.js';
import { getmyPageData } from '../services/myPage.service.js';
import { response } from '../../config/response.js';
import db from '../../config/db.config.js';
import { getUserDataById } from '../services/myPage.service.js';
import { getUserSave_Res } from '../models/user.sql.js';  // SQL 쿼리 가져오기
import { getUserSave_Rec } from '../models/user.sql.js';  // SQL 쿼리 가져오기

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
    const { vegan_level, prefer_ingredients = [], dislike_ingredients = [] } = req.body; // 요청 본문에서 데이터 추출

    // 필수 필드 검증
    if (!vegan_level) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'Invalid input data',
            data: {}
        });
    }

    const connection = await db.getConnection(); // 커넥션 가져오기
    try {
        await connection.beginTransaction(); // 트랜잭션 시작

        // 사용자 정보 업데이트
        const result = await connection.query(
            'UPDATE user SET type = ? WHERE id = ?',
            [vegan_level, id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback(); // 롤백
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'User not found',
                data: {}
            });
        }

        if (prefer_ingredients.length > 0) {
            // 기존의 모든 prefer_user 레코드를 삭제합니다.
            await connection.query(
                'DELETE FROM prefer_user WHERE userId = ?',
                [id]
            );
        
            // 요청 body에 포함된 prefer_ingredients만 삽입합니다.
            await connection.query(
                'INSERT INTO prefer_user (id, tagId, userId) SELECT NULL, id, ? FROM ingredient_tag WHERE name IN (?)',
                [id, prefer_ingredients]
            );
        }
        
        if (dislike_ingredients.length > 0) {
            // 기존의 모든 dislike_user 레코드를 삭제합니다.
            await connection.query(
                'DELETE FROM dislike_user WHERE userId = ?',
                [id]
            );
        
            // 요청 body에 포함된 dislike_ingredients만 삽입합니다.
            await connection.query(
                'INSERT INTO dislike_user (id, tagId, userId) SELECT NULL, id, ? FROM ingredient_tag WHERE name IN (?)',
                [id, dislike_ingredients]
            );
        }
        


        await connection.commit(); // 트랜잭션 커밋

        res.status(200).json({
            status: 200,
            success: true,
            message: 'User information updated successfully',
            data: {}
        });
    } catch (error) {
        await connection.rollback(); // 오류 발생 시 롤백
        console.error('Database error:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Server error',
            data: {}
        });
    } finally {
        connection.release(); // 커넥션 해제
    }
};

// 사용자가 저장한 식단 정보를 가져오는 함수
export const savening_Recipe = async (req, res) => {
    const userId = req.params.id;  // URL에서 사용자 ID를 가져옴
    try {
        // SQL 쿼리를 사용하여 데이터베이스에서 정보 조회
        const [recipes] = await db.query(getUserSave_Rec, [userId]);
        // 식단 개수 계산
        const recipeCount = recipes.length;

        // JSON 응답으로 식단 목록과 개수를 클라이언트에 반환
        res.json({
            count: recipeCount,
            recipes: recipes
        });
        // 조회된 정보를 JSON으로 클라이언트에 응답
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ error: 'Failed to fetch saved recipes' });
    }
};


// 사용자가 저장한 식당 정보를 가져오는 함수
export const savening_Restaurant = async (req, res) => {
    const userId = req.params.id;  // URL에서 사용자 ID를 가져옴

    try {
        // SQL 쿼리를 사용하여 데이터베이스에서 정보 조회
        const [restaurants] = await db.query(getUserSave_Res, [userId]);

        // 식당 개수 계산
        const restaurantCount = restaurants.length;

        // JSON 응답으로 식당 목록과 개수를 클라이언트에 반환
        res.json({
            count: restaurantCount,
            restaurants: restaurants
        });
    } catch (error) {
        console.error('Error fetching saved restaurants:', error);
        res.status(500).json({ error: 'Failed to fetch saved restaurants' });
    }
};
