import Auth from "./auth";
import Blogs from "./blogs";
import User from "./users";

const modules = [Auth, User, Blogs];

const typeDefs = modules.map((module) => module.typeDefs);

export default typeDefs;
