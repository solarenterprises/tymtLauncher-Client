export interface IFeedback {
  _id: string;
  author?: {
    _id: string;
    nickName: string;
    sxpAddress: string;
  };
  star: number;
  title: string;
  feedback: string;
  createdAt: string;
}

export interface IResFetchReviewsByGameId {
  msg: string;
  averageStar: number;
  feedbacks: Array<IFeedback>;
  total: number;
  page: string;
  pageSize: string;
}

export interface IReqAddReviews {
  author: string; // 6601b44c609740cfa3cebcee
  isAnonymous: boolean;
  game_id: string;
  title: string;
  feedback: string;
  star: number;
  isDeleted: boolean;
}
