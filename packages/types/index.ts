export interface IUser {
  _id: string;
  name: string;
  email?: string;
  posts: string[];
}
export interface IReactions {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}

export interface IPost {
  title: string;
  _id: string;
  content: string;
  userId: string;
  reactions: IReactions;
  createdAt: Date;
  updatedAt: Date;
}

export interface IgetPosts {
  posts: IPost[];
  message: string;
}
export interface IgetPost {
  post: IPost;
}

export interface IupdatePost {
  _id: string;
  message: string;
}

export interface IcreatePost {
  _id: string;
  message: string;
}

export interface IdeletePost {
  _id: string;
  message: string;
}

export interface IgetUsers {
  users: IUser[];
}

export interface IgetUser {
  user: IUser;
}

export interface IgetPostsByUserId {
  posts: IPost[];
}

export interface IaddReactions {
  id: string;
  message: string;
}

export * from "./src/index";
