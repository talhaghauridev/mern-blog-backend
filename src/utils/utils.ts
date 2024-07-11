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

const isBase64Image = (imageData: string) => {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
};

const isHttpsUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
};

const extractFields = (info: any, parentPath = ""): string[] => {
  let fields: string[] = [];
  if (!info?.fieldNodes?.[0]?.selectionSet?.selections) {
    return fields;
  }

  const selections = info.fieldNodes[0].selectionSet.selections;
  selections.forEach((selection: any) => {
    if (selection.kind === "Field") {
      const fieldName = selection.name.value;
      const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;

      if (selection.selectionSet) {
        fields = fields.concat(
          extractFields({ fieldNodes: [selection] }, fullPath)
        );
      } else {
        fields.push(fullPath);
      }
    }
  });

  return fields;
};
export {
  EMAIL_REGEX,
  isHttpsUrl,
  mergeResolvers,
  PASSWORD_REGEX,
  validateSocialLinks,
  isBase64Image,
  extractFields,
};
