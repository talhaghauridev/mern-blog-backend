import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm//express4";
import { BaseContext } from "@apollo/server";

export const context = ({ req, res }: ExpressContextFunctionArgument) => {
  return {
    // return a BaseContext object
    req,
    res,
    // add other properties if needed
  } as BaseContext;
};
