require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
