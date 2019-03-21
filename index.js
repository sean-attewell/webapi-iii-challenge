require('dotenv').config(); // heroku
const server = require('./server')

const PORT = process.env.PORT || 4000; // heroku

console.log(process.env.MY_LITTLE_SECRET_2) // heroku

//heroku
server.listen(PORT, () => {
  console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`);
});

// previously hardcoded port
// server.listen(4000, () => {
//   console.log('\n*** Server Running on http://localhost:4000 ***\n');
// });
