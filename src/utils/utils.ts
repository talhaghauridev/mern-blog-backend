const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

type ResolverFn = (parent: any, args: any, context: any, info: any) => any;

type ResolverMap = {
  [field: string]: ResolverFn;
};

export type Resolvers = {
  Query?: ResolverMap;
  Mutation?: ResolverMap;
  [key: string]: any;
};

export interface ResolverModule {
  resolvers: Resolvers;
}
export type ResolverType = "queries" | "mutations" | "extraResolvers";

const mergeResolvers = (
  resolversArray: ResolverModule[],
  resolverType: ResolverType
): ResolverMap => {
  return resolversArray.reduce((acc, { resolvers }) => {
    if (resolvers[resolverType]) {
      return { ...acc, ...resolvers[resolverType] };
    }
    return acc;
  }, {} as ResolverMap);
};

export { EMAIL_REGEX, PASSWORD_REGEX, mergeResolvers };
