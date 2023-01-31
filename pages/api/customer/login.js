import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export default async function loginAPI(req, res) {
  const credentials = req.body.credentials;

  const credString = Buffer.from(
    `${credentials.email}:${credentials.password}`
  ).toString("base64");

  try {
    const data = await axios.post(
      `${publicRuntimeConfig.API_BASE_URL}/api/auth/token`,
      {},
      {
        headers: {
          Authorization: `Basic ${credString}`,
          "Accept-Encoding": "gzip",
        },
      }
    );

    res.status(200).json(data.data);
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
