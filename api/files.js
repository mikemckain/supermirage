const axios = require("axios");
const cors = require("cors");

module.exports = cors(
  { origin: "https://supermirage.pics" },
  async function (req, res) {
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
  }
);
