import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '20s', target: 50 },   // 50 users
    { duration: '20s', target: 100 },  // 100 users
    { duration: '20s', target: 200 },  // 200 users
  ],
};

const BASE_URL = 'https://kaggle-koders-backend.onrender.com';

export default function () {
  http.get(`${BASE_URL}/`);
  http.get(`${BASE_URL}/api/leaderboard`);
  sleep(1);
}