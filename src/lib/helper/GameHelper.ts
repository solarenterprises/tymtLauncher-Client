import { IGame } from "../../types/GameTypes";
import { decrypt } from "../api/Encrypt";

export const decryptGameURL = async (_data: IGame, _secret: string) => {
  try {
    if (!_data || !_secret) return null;
    let data = _data;
    if (data?.imageUrl) data.imageUrl = await decrypt(data.imageUrl, _secret);
    if (data?.link) data.link = await decrypt(data.link, _secret);
    if (data?.projectMeta?.image) data.projectMeta.image = await decrypt(data.projectMeta.image, _secret);
    if (data?.projectMeta?.gallery?.length) {
      for (let i = 0; i < data.projectMeta.gallery.length; i++) {
        data.projectMeta.gallery[i].src = await decrypt(data.projectMeta.gallery[i].src, _secret);
      }
    }
    if (data?.projectMeta?.meta_uri) data.projectMeta.meta_uri = await decrypt(data.projectMeta.meta_uri, _secret);
    if (data?.projectMeta?.networks?.length) {
      for (let i = 0; i < data.projectMeta.networks.length; i++) {
        if (data.projectMeta.networks[i]?.icon) data.projectMeta.networks[i].icon = await decrypt(data.projectMeta.networks[i].icon, _secret);
        if (data.projectMeta.networks[i]?.marketplace_urls?.length) {
          for (let j = 0; j < data.projectMeta.networks[i].marketplace_urls.length; j++) {
            if (data.projectMeta.networks[i].marketplace_urls[j]) {
              data.projectMeta.networks[i].marketplace_urls[j] = await decrypt(data.projectMeta.networks[i].marketplace_urls[j], _secret);
            }
          }
        }
      }
    }
    if (data?.projectMeta?.discord_url) data.projectMeta.discord_url = await decrypt(data.projectMeta.discord_url, _secret);
    if (data?.projectMeta?.twitter_url) data.projectMeta.twitter_url = await decrypt(data.projectMeta.twitter_url, _secret);
    if (data?.projectMeta?.youtube_url) data.projectMeta.youtube_url = await decrypt(data.projectMeta.youtube_url, _secret);
    if (data?.projectMeta?.external_url) data.projectMeta.external_url = await decrypt(data.projectMeta.external_url, _secret);
    if (data?.projectMeta?.main_capsule) data.projectMeta.main_capsule = await decrypt(data.projectMeta.main_capsule, _secret);
    if (data?.releaseMeta?.meta_uri) data.releaseMeta.meta_uri = await decrypt(data.releaseMeta.meta_uri, _secret);
    if (data?.releaseMeta?.platforms)
      Object.entries(data.releaseMeta.platforms).forEach(async ([platform, platformData]) => {
        if (platformData?.external_url) data.releaseMeta.platforms[platform].external_url = await decrypt(platformData.external_url, _secret);
      });
    if (data?.releaseMeta?.external_url) data.releaseMeta.external_url = await decrypt(data.releaseMeta.external_url, _secret);
    return data;
  } catch (err) {
    console.log("Failed to encryptDataURL:", err);
  }
};
