import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '20s', target: 20 },   // 20 users
    { duration: '20s', target: 50 },   // 50 users
    { duration: '20s', target: 100 },  // 100 users
  ],
};

const BASE_URL = 'https://kaggle-koders-backend.onrender.com';
const TOKEN = 'tBzMV9U7saeMXPYa15glO9SQF392';

export default function () {
  const headers = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  http.get(`${BASE_URL}/api/user-status`, headers);
  http.get(`${BASE_URL}/api/leaderboard`);
  sleep(1);
}