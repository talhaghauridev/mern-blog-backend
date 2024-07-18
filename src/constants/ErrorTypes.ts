import { ApolloServerErrorCode } from "@apollo/server/errors";

export const ErrorTypes = {
  BAD_USER_INPUT: {
    errorCode: ApolloServerErrorCode.BAD_USER_INPUT,
    errorStatus: 400,
  },
  BAD_REQUEST: {
    errorCode: ApolloServerErrorCode.BAD_REQUEST,
    errorStatus: 400,
  },
  NOT_FOUND: {
    errorCode: "NOT_FOUND",
    errorStatus: 404,
  },
  UNAUTHENTICATED: {
    errorCode: "UNAUTHENTICATED",
    errorStatus: 401,
  },
  VALIDATION_ERROR: {
    errorCode: ApolloServerErrorCode.BAD_USER_INPUT,
    errorStatus: 422,
  },
  ALREADY_EXISTS: {
    errorCode: "ALREADY_EXISTS",
    errorStatus: 400,
  },
  INTERNAL_SERVER_ERROR: {
    errorCode: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    errorStatus: 500,
  },

  UNAUTHORIZED: {
    errorCode: "UNAUTHORIZED",
    errorStatus: 403,
  },
  TOO_MANY_REQUESTS: {
    errorCode: "TOO_MANY_REQUESTS",
    errorStatus: 429,
  },
};
