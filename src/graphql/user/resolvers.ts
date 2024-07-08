const queries = {
  hello: (a: any, arg: any) => {
    return "Hello World";
  },
  a: () => {
    return true;
  },
};

const mutations = {};

const extraResolvers = {};

export const resolvers = { queries, mutations, extraResolvers };
