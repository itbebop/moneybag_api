import express from 'express';
import { internalIpV4, internalIpV6  } from 'internal-ip';
import dotenv from 'dotenv';
import cors from 'cors';
import Response from './domain/response.js';
import logger from './util/logger.js';

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();
// 모든 요청을 할 수 있음
app.use(cors({ origin: '*' }));
app.use(express.json());
// server에 접속이 되면 message를 받음
app.get('/', (req, res) =>  res.send( new Response(200, 'OK', 'MoneyBag API, v1.0.0 - All Systems Go') ));
(async () => {
    // 내부 IPv4 주소 가져오기
    const ipv4 = await internalIpV4();
    // console.log('내부 IPv4 주소:', ipv4); // 예: '192.168.1.100'
    
    // 내부 IPv6 주소 가져오기
    // const ipv6 = await internalIpV6();
    // console.log('내부 IPv6 주소:', ipv6); // 예: 'fe80::1'
    app.listen(PORT, () => logger.info(`Server running on: ${ipv4}:${PORT}`));
})();
// console.log(process.env);