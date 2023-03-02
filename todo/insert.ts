import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { nanoid } from 'nanoid';
import { z } from 'zod';

const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });

const Todo = z.object({
    title: z.string().max(25),
    description: z.string()
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) throw Error();
        const todo = await Todo.parseAsync(JSON.parse(event.body));
        const id = nanoid();

        const params = {
            TableName: 'TodoTable',
            Item: {
                id: { S: id },
                title: { S: todo.title },
                description: { S: todo.description }
            }
        };

        await dynamoDBClient.send(new PutItemCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({ id, ...todo }),
        };
    } catch (err: any) {
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
};
