import jwt from "jsonwebtoken";
export const refreshLoginSession = async (
  token: string,
  secret: string,
  loginSessions: string[],
): Promise<string[]> => {
  return loginSessions.filter(async (session) => {
    if (session === token) {
      return false;
    }
    const promisefy = () => {
      return new Promise<boolean>((res) => {
        jwt.verify(session, secret, (err, _) => {
          if (err) {
            return res(false);
          }
          return res(true);
        });
      });
    };
    return await promisefy();
  });
};
