import { APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { REGION, TODO_TABLE_NAME } from './config';
import { handleError } from './helper';

const dynamoDBClient = new DynamoDBClient({ region: REGION });

export const lambdaHandler = async (): Promise<APIGatewayProxyResult> => {
    try {
        const { Items } = await dynamoDBClient.send(new ScanCommand({
            TableName: TODO_TABLE_NAME
        }));

        const todos = Items?.map((item) => {
            return {
                id: item.id.S,
                title: item.title.S,
                description: item.description.S,
                assignee: item.assignee.S,
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ todos }),
        };
    } catch (err) {
        return handleError(err);
    }
};
