import { z } from "zod";
export const signUpTypes = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
});

export const loginTypes = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateProfileTypes = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const addReactionType = z.object({
  postId: z.string(),
  clickedBy: z.string(),
  reactionType: z.enum(["thumbsUp", "heart", "wow", "rocket", "coffee"]),
});

export const createPostTypes = z.object({
  title: z.string().min(1).max(20),
  content: z.string().min(1).max(1000),
});

export const updatePostTypes = z.object({
  title: z.string().min(1).max(20),
  content: z.string().min(1).max(1000),
});

export type addReactionParams = z.infer<typeof addReactionType>;
export type signUpParams = z.infer<typeof signUpTypes>;
export type loginParams = z.infer<typeof loginTypes>;
export type UpdateProfileParams = z.infer<typeof updateProfileTypes>;
export type createPostParams = z.infer<typeof createPostTypes>;
export type updatePostParams = z.infer<typeof updatePostTypes>;
