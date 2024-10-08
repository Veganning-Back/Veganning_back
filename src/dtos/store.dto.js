import { formatDateWithDay } from "../models/module.js";

//(3.4 / 3.4.2 / 3.4.3)
export const hotStoreListDTO = (storeData) => {
    const hotStores = [];
    const count = Math.min(storeData.length);

    for (let i = 0; i < count; i++) {
        hotStores.push({
            "id": storeData[i].id,
            "name": storeData[i].name,
            "address": storeData[i].address,
            "open": storeData[i].open,
            "rating": storeData[i].rating,
            "isOpen": storeData[i].isOpen,   //open테이블 조인해서 요일판별후 해당구간에 시간
            "image": storeData[i].image ? Buffer.from(storeData[i].image).toString('base64') : null
        });
    }
//"image": data.image ? Buffer.from(data.image).toString('base64') : null,
    return { data: hotStores };
};




export const showStoreDTO = (data) => {
    try {
        console.log("Data received in DTO function:", data);

        const result = {
            data: {
                "name": data.name,
                "avg_rate": data.avg,
                "type": data.type,
                "isHot": data.isHot,
                "address": data.address,
                "open": data.open,
                "image": data.image ? Buffer.from(data.image).toString('base64') : null,
                "link": data.link,
                "contact": data.contact,
                "photo": data.photo.length > 0 ? data.photo.map(item => ({
                    base64: item.image ? Buffer.from(item.image).toString('base64') : null
                })) : [],
                menu: data.menu.length > 0 ? data.menu.map(item => ({
                    name: item.name,
                    price: item.price
                })) : [],
                review_count: data.review_count
            }
        };

        console.log("Result in DTO function:", result);
        return result;
    } catch (error) {
        console.error("Error in showStoreDTO function:", error);
        throw error;
    }
};




export const showStoreRateDTO = async (rateData) => {
    try {
        
        return { "data": rateData };

    } 
    catch (error) {
        console.log("DTO 파일이 아예 실행이 안되고있음:", error);
        throw error;
    }
};


//식당리뷰등록
//(3.7.3)
export const createReviewDTO = (data) => {
    const result = {
        "id": data.id,
        "storeId": data.store_id,
        "userId": data.user_id,
        "image": data.image,
        "rating": data.rating,
        "body": data.body,
        "createdAt": data.created_at
    };
    
    return result;
};




//식당 리뷰리스트
//(3.6.10 / 3.7 / 3.7.6)
export const storeReviewDTO = (reviewData) => {
    return reviewData.map(review => ({
        name: review.name, // 작성자 이름
        rate: review.rate, // 리뷰 평점
        created_at: formatDateWithDay(review.created_at), // 작성 일자를 'YYYY.MM.DD (요일)' 형식으로 변환
        body: review.body // 리뷰 내용
    }));
};


//식당 사진리스트
//(3.8)
export const showStoreImageDTO = (imageData) => {

    const body = imageData.length > 0 ? imageData.map(image => ({
        base64: image.image ? Buffer.from(image.image).toString('base64') : null
    })) : [];
    
    

    return body;
};

