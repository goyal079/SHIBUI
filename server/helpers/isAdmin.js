import User from "../models/User.js";
const isAdmin = async (id) => {
  const user = await User.findById(id);
  return user.isAdmin;
};
export default isAdmin;
