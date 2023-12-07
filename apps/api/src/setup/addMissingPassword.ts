import { User } from "models";

const updatePasswords = async () => {
  try {
    const result = await User.updateMany(
      { password: { $exists: false } },
      { $set: { password: "12345678" } },
    );
    console.log(`${result.nModified} users udpated Successfully`);
  } catch (e) {
    console.log("Error updating password: ", e);
  }
};
export default updatePasswords;
