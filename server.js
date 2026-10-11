const app = require('./src/app');

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Practical 9 Caching Server running on port ${PORT}`);
  console.log(` Student: Ghoniya Dhyey (24CS024) | ITUE301 AWDF`);
  console.log(` In-memory Caching: Active (node-cache TTL 60s)`);
  console.log(`====================================================`);
});