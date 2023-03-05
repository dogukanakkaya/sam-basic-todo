import { APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

export const handleError = (err: unknown): APIGatewayProxyResult => {
    if (err instanceof z.ZodError) {
        return {
            statusCode: 422,
            body: JSON.stringify(err.issues),
        };
    }

    return {
        statusCode: 500,
        body: JSON.stringify(err),
    };
}