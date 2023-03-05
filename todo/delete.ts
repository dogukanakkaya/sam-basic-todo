import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { z } from 'zod';
import { REGION, TODO_TABLE_NAME } from './config';
import { handleError } from './helper';

const dynamoDBClient = new DynamoDBClient({ region: REGION });

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = z.string().parse(event.pathParameters?.id);

        await dynamoDBClient.send(new DeleteItemCommand({
            TableName: TODO_TABLE_NAME,
            Key: {
                id: { S: id }
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ id }),
        };
    } catch (err) {
        return handleError(err);
    }
};
