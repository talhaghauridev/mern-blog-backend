import { IUser } from "../models/user.model";
import { UserType } from "../types";

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

const validateSocialLinks = (social_links: UserType["social_links"]) => {
  const socialLinksArray = Object.keys(
    social_links
  ) as (keyof IUser["social_links"])[];
  for (let i = 0; i < socialLinksArray.length; i++) {
    const link = social_links[socialLinksArray[i]];
    if (link && link.length > 0) {
      try {
        const { hostname } = new URL(link);
        if (
          !hostname.includes(`${socialLinksArray[i]}.com`) &&
          socialLinksArray[i] !== "website"
        ) {
          return {
            message: `${socialLinksArray[i]} link is invalid. You must enter a full link`,
          };
        }
      } catch (error) {
        return {
          message: `Invalid URL provided for ${socialLinksArray[i]}. Please enter a valid URL.`,
        };
      }
    }
  }
  return null;
};

const isHttpsUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
};
export {
  EMAIL_REGEX,
  isHttpsUrl,
  mergeResolvers,
  PASSWORD_REGEX,
  validateSocialLinks,
};
