import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { REGION } from "./config";
import { SQSClient } from "@aws-sdk/client-sqs";

export const dynamoDBClient = new DynamoDBClient({ region: REGION });
export const sqsClient = new SQSClient({ region: REGION });

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

export const Todo = z.object({
    title: z.string().max(25),
    description: z.string(),
    assignee: z.string().email()
});
export type Todo = z.infer<typeof Todo> & { id: string };