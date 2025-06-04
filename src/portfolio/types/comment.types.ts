export interface CommentResponse {
  id: string;
  content: string;
  portfolioId: string;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    fullnameTh: string;
    fullnameEn: string | null;
    email: string;
    image: string | null;
    userType: string;
  };
  replies?: CommentResponse[];
}

export interface GetAllCommentsResponse {
  data: CommentResponse[];
  message: string;
}

export interface CreateCommentResponse {
  data: CommentResponse;
  message: string;
}

export interface UpdateCommentResponse {
  data: CommentResponse;
  message: string;
}
export interface DeleteCommentResponse {
  message: string;
}
