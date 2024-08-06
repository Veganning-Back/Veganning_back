// myPage.service.js

import { myPageResponseDTO } from "../dtos/myPage.response.dto.js";

export const getmyPageData = () => {
    return myPageResponseDTO("This is myPage! >.0");
}