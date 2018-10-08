import { generateAccessToken } from "../app";
const createJwtCookie = (userId: string) => {
  return `jwt=${generateAccessToken(userId)}`;
};

export default createJwtCookie;
