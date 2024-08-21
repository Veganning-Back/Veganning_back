// 영업 중인지 확인하는 함수
export const isStoreOpen = (openTime, closeTime) => {
    const now = new Date();
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), openHour, openMinute);
    const closeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closeHour, closeMinute);

    return now >= openDate && now <= closeDate;
}

// 요일에 따라 적절한 열 이름 선택
export const getOpenCloseColumns = (day) => {
    switch(day) {
        case 0: return { open: 'sun_open', close: 'sun_close' };
        case 1: return { open: 'mon_open', close: 'mon_close' };
        case 2: return { open: 'tue_open', close: 'tue_close' };
        case 3: return { open: 'wed_open', close: 'wed_close' };
        case 4: return { open: 'thu_open', close: 'thu_close' };
        case 5: return { open: 'fri_open', close: 'fri_close' };
        case 6: return { open: 'sat_open', close: 'sat_close' };
        default: return { open: 'mon_open', close: 'mon_close' };
    }
}

//d+Day 계산
export const calculateDplusDay = (dateString) => {
    const startDate = new Date(dateString);
    const today = new Date();
    const timeDifference = today - startDate;
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return dayDifference;
};

//240805 형태로 변환
export const formatDate = (date) => {
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return yy + mm + dd;
};

//2024.08.12 (월) 형태로 변환
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

export const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = daysOfWeek[date.getDay()]; // 요일 가져오기

    return `${year}.${month}.${day} (${dayOfWeek})`;
};