import axios, { AxiosResponse } from "axios";
import { tymt_backend_url } from "../../configs/index";
import tymtStorage from "../Storage";
import { ISaltToken } from "../../types/accountTypes";
import { IReqAddReviews } from "../../types/ReviewAPITypes";

class ReviewAPI {
  static async fetchReviewsByGameId(gameId: string, page: number, pageSize: number): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.get(`${tymt_backend_url}/reviews/game/${gameId}?page=${page}&pageSize=${pageSize}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }

  static async addReviews(body: IReqAddReviews): Promise<AxiosResponse<any, any>> {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    return await axios.post(`${tymt_backend_url}/reviews`, body, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
  }
}

export default ReviewAPI;
