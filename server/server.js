require("dotenv").config();
const app = require("./app");

const port = process.env.SERVER_PORT;

app.listen(port, () => console.log(`Listning on port ${port}`));
