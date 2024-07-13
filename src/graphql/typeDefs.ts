import Auth from "./auth";
import User from "./users";
import Blogs from "./blogs";
import Notifications from "./notifications";
import Comments from "./comments";
import Admin from "./admin";

const modules = [Auth, User, Blogs, Notifications, Comments, Admin];

const typeDefs = modules.map((module) => module.typeDefs);

export default typeDefs;
