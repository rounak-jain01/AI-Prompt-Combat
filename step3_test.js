import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 5,
  duration: '30s',
};

export default function () {
  http.get('https://kaggle-koders-backend.onrender.com/');
  sleep(1);
}