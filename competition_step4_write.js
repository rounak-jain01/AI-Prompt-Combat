import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '15s', target: 10 },   // warmup
    { duration: '20s', target: 30 },   // load
    { duration: '20s', target: 50 },   // stress
  ],
};

const BASE_URL = 'https://kaggle-koders-backend.onrender.com';
const TOKEN = 'tBzMV9U7saeMXPYa15glO9SQF392';

export default function () {
  const headers = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  const payload = JSON.stringify({
    averageScore: Math.random() * 100,
    totalPairs: 5,
    breakdown: [],
    isCheating: false,
  });

  http.post(`${BASE_URL}/api/submit-round`, payload, headers);
  sleep(1);
}