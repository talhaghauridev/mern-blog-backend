import { ErrorTypes } from "../../constants/ErrorTypes";
import ApolloError from "../../utils/ApolloError";

const queries = {
  hello: (a: any, arg: any) => {
    return "Hello World";
  },
  a: () => {
    return ApolloError("sadas", ErrorTypes.UNAUTHENTICATED);
    return true;
  },
};

const mutations = {};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
