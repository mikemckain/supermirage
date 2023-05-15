const axios = require("axios");

module.exports = async function (req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    // Pre-flight request. Reply successfully:
    res.status(200).end();
    return;
  }

  async function getB2Authorization() {
    const response = await axios({
      method: "get",
      url: "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      auth: {
        username: process.env.B2_USERNAME,
        password: process.env.B2_PASSWORD,
      },
    });

    return response.data;
  }

  const auth = await getB2Authorization();

  const response = await axios({
    method: "post",
    url: `${auth.apiUrl}/b2api/v2/b2_list_file_names`,
    headers: {
      Authorization: auth.authorizationToken,
    },
    data: {
      bucketId: process.env.B2_BUCKET_ID,
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
};
