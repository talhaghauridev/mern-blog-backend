import { GraphQLError } from "graphql";

const ApolloError = (
  errorMessage: string,
  errorType: { errorCode: string; errorStatus: number }
) => {
  throw new GraphQLError(errorMessage, {
    extensions: {
      code: errorType.errorCode,
      http: {
        status: errorType.errorStatus,
      },
    },
  });
};

export default ApolloError;
