const reload = require("reload");
const app = require("./server");

const startServer = async () => {
  await reload(app);
};

startServer();
