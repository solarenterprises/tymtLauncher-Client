import axios from "axios";

export const deleteFile = async (params) => {
  const baseUrl = "https://api.bytescale.com";
  const path = `/v2/accounts/${params.accountId}/files`;
  const entries = (obj) =>
    Object.entries(obj).filter(([, val]) => (val ?? null) !== null);
  const query = entries(params.querystring ?? {})
    .flatMap(([k, v]) => (Array.isArray(v) ? v.map((v2) => [k, v2]) : [[k, v]]))
    .map((kv) => kv.join("="))
    .join("&");
  //   const response = await fetch(
  //     `${baseUrl}${path}${query.length > 0 ? "?" : ""}${query}`,
  //     {
  //       method: "DELETE",
  //       headers: new Headers({
  //         Authorization: `Bearer ${params.apiKey}`,
  //       }),
  //     }
  //   );
  const response = await axios.delete(
    `${baseUrl}${path}${query.length > 0 ? "?" : ""}${query}`,
    {
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (Math.floor(response.status / 100) !== 2) {
    const result = await response.data.json();
    throw new Error(`Bytescale API Error: ${JSON.stringify(result)}`);
  }
};
