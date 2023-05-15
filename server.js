const axios = require("axios");
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());

async function getB2Authorization() {
  const response = await axios({
    method: "get",
    url: "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
    auth: {
      username: "d10d74c2b91c",
      password: "004cc658e1373921407ee331a63f467e3af3d81ba7",
    },
  });

  return response.data;
}

app.get("/files", async (req, res) => {
  const auth = await getB2Authorization();

  const response = await axios({
    method: "post",
    url: `${auth.apiUrl}/b2api/v2/b2_list_file_names`,
    headers: {
      Authorization: auth.authorizationToken,
    },
    data: {
      bucketId: "9d2130cdf7a41c728b89011c",
      maxFileCount: 100, // Change this to the maximum number of files you want to fetch
    },
  });

  const files = response.data.files.map((file) => {
    return {
      ...file,
      url: `${auth.downloadUrl}/file/supermirage/${file.fileName}`,
    };
  });

  res.json(files);
});

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
