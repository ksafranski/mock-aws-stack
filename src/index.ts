import 'dotenv/config';
import * as express from 'express';

console.log('AWS Environment variables:');
console.log(
  Object.keys(process.env)
    .map(key => {
      if (key.startsWith('AWS_')) return `${key}=${process.env[key]}`;
    })
    .filter(Boolean)
    .join('\n')
);

const app = express();

app.get('/ping', (req, res) => {
  res.send('Pong');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
