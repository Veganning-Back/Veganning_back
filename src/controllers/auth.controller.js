import { joinUserData } from "../services/"
import { joinUserService } from "../services/auth.service";


export const joinUser = async (req, res) => {
    try{
        const { email, password, name, start_vegan } = req.body;

        //회원가입 결과
        const result = await joinUserService(email, password, name, start_vegan);
    

        //가입 성공
        if(result === "success"){

        }
        //기존회원
        else if(result === "exist"){

        }
        //그 외
        else{
        
        }

    }
    catch{

    }
};