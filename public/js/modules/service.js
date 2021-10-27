import { apiConfig } from "./config.js";
const checkUserSession = () => {
  try {
    const userRes = fetch(`${apiConfig.apiBaseUrl}/api/users/auth`);
    const userData = await(await userRes).json();
    return userData;
  } catch (err) {
    console.log(err);
    return null;
  }
};
export { checkUserSession };
