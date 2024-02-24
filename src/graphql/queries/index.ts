// src/schema.ts
import blogQueries from "./blogQueries";
import commentQueries from "./commentQueries";
import userQueries from "./userQueries";

const typeDefs = [userQueries,blogQueries,commentQueries];

export default typeDefs;
