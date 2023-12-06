import jwt from "jsonwebtoken";
const currentTimestamp = Math.floor(Date.now() / 1000);
export const refreshLoginSession = async (
  logoutIoken: string,
  secret: string,
  loginSessions: string[],
) => {
  return loginSessions.filter((token) => {
    if (token === logoutIoken) {
      return false;
    }
    try {
      const decodedToken = jwt.verify(token, secret) as {
        exp: number;
      };
      return decodedToken.exp > currentTimestamp;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  });
};
