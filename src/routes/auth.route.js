// import express from "express";
// import asyncHandler from "express-async-handler";

// export const authRouter = express.Router({mergeParams: true});

// authRouter.post("/login", asyncHandler((req, res, next) => {
//     const key = process.env.SECRET_KEY;
//     const nickname = "JY";
//     const profile = "images";
//     let token = "";
//     token = jwt.sign(
//       {
//         type: "JWT",
//         nickname: nickname,
//         profile: profile,
//       },
//       key,
//       {
//         expiresIn: "15m", // 15분후 만료
//         issuer: "토큰발급자",
//       }
//     );
//     return res.status(200).json({
//       code: 200,
//       message: "token is created",
//       token: token,
//     });
//   }));


//   // 토큰 검증 엔드포인트
// authRouter.get("/payload", asyncHandler(auth, (req, res) => {
//     const nickname = req.decoded.nickname;
//     const profile = req.decoded.profile;
//     return res.status(200).json({
//       code: 200,
//       message: "토큰이 정상입니다.",
//       data: {
//         nickname: nickname,
//         profile: profile,
//       },
//     });
//   }));
  

// authRouter.post("/join", asyncHandler(async (req, res) => {
//     const { email, password, name, start_vegan } = req.body;
    
//     // 데이터베이스에 사용자 정보를 저장하는 로직 추가
//     // 예: const newUser = await User.create({ email, password, name, start_vegan });

//     return res.status(201).json({
//       code: 201,
//       message: "User created successfully",
//       data: {
//         email,
//         name,
//         start_vegan
//       },
//     });
// }));

