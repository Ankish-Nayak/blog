import { Dispatch, SetStateAction } from "react";
import { createPostTypes } from "types";

export const dataValidation = async ({
  title,
  content,
  setTitleError,
  setContentError,
}: {
  title: string;
  content: string;
  setTitleError: Dispatch<SetStateAction<string | null>>;
  setContentError: Dispatch<SetStateAction<string | null>>;
}) => {
  return new Promise<boolean>((res, rej) => {
    const data = {
      title,
      content,
    };
    const parsedData = createPostTypes.safeParse(data);
    if (!parsedData.success) {
      console.log(parsedData.error.message);
      parsedData.error.errors.map((error) => {
        ["title", "content"].forEach((s) => {
          if (error.path.includes(s)) {
            switch (s) {
              case "title": {
                setTitleError(error.message);
                break;
              }
              case "content": {
                setContentError(error.message);
                break;
              }
            }
          }
        });
      });
      rej(false);
    } else {
      res(true);
    }
  });
};
