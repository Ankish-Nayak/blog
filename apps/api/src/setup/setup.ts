import fs from "fs";
import path from "path";
import { IPost, IReactions, Post, User, run } from "../models";
import mongoose from "mongoose";

interface Ires {
  users: {
    id: number;
    username: string;
    name: string;
    email: string;
  }[];
  posts: {
    title: string;
    body: string;
    userId: number;
    date: string;
    reactions: IReactions;
  }[];
}
export const setup = async () => {
  fs.readFile(
    path.join(__dirname, "../../data/db.json"),
    {
      encoding: "utf8",
    },
    async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // inserting many users
        const res: Ires = JSON.parse(data);

        const users = res.users.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        });
        // printing all the users
        //console.log("users", users);
        // printig all the posts

        const posts = res.posts.map(
          (post): Omit<IPost, "createdAt" | "updatedAt"> => {
            return {
              title: post.title,
              content: post.body,
              // @ts-ignore
              userId: post.userId,
              reactions: {
                thumbsUp: 0,
                wow: 0,
                rocket: 0,
                heart: 0,
                coffee: 0,
              },
            };
          },
        );

        const extractObjectId = async (): Promise<IPost> => {
          return new Promise(async (res1, rej) => {
            const promises = users.map(async (user) => {
              return new Promise(async (res) => {
                const newUser = await User.find({ name: user.name });
                res(newUser);
              });
            });
            const res = await Promise.all(promises);

            fs.writeFile(
              path.join(__dirname, "../../data/users.json"),
              JSON.stringify(res),
              "utf8",
              (err) => {
                if (err) {
                  console.log("failed to write users");
                  rej(false);
                } else {
                  res.forEach((user) => {
                    // @ts-ignore
                    console.log(user[0]._id.toString());
                  });
                  const newPosts = posts.map((post) => {
                    // @ts-ignore
                    const { name } = users.find(
                      (user) => user.id.toString() === post.userId.toString(),
                    );
                    const existingUser = res.find(
                      // @ts-ignore
                      (user) => user[0].name === name,
                    );
                    return {
                      ...post,
                      // @ts-ignore
                      userId: existingUser[0]._id,
                    };
                  });
                  // @ts-ignore
                  res1(newPosts);
                  console.log("done writing users");
                }
              },
            );

            // console.log(newPosts);
          });
        };
        //console.log("posts", posts);
        const connected = await run();
        if (connected) {
          // const userInsert = await User.insertMany(users);
          // console.log(userInsert);
          // const postInsert = await Post.create({
          //   ...posts[0],
          // });
          //console.log(postInsert);

          const newPosts: IPost = await extractObjectId();
          const res = await Post.insertMany(newPosts);
          console.log(res);
          mongoose.disconnect();
          process.exit();
        } else {
          console.log("not connected");
        }
      }
    },
  );
};

setup();
