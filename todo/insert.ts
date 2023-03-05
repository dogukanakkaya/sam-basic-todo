import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { nanoid } from 'nanoid';
import { z } from 'zod';

const config = {
    REGION: 'us-east-1',
    TODO_TABLE_NAME: process.env.TODO_TABLE_NAME as string,
    EMAIL_QUEUE_URL: process.env.EMAIL_QUEUE_URL as string
} as const;

const dynamoDBClient = new DynamoDBClient({ region: config.REGION });
const sqsClient = new SQSClient({ region: config.REGION });

const Todo = z.object({
    title: z.string().max(25),
    description: z.string(),
    assignee: z.string().email()
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) throw Error();

        const todo = await Todo.parseAsync(JSON.parse(event.body));
        const id = nanoid();

        await dynamoDBClient.send(new PutItemCommand({
            TableName: config.TODO_TABLE_NAME,
            Item: {
                id: { S: id },
                title: { S: todo.title },
                description: { S: todo.description },
                assignee: { S: todo.description }
            }
        }));

        const x = await sqsClient.send(new SendMessageCommand({
            QueueUrl: config.EMAIL_QUEUE_URL,
            MessageBody: JSON.stringify({ todo }),
        }));
        console.log("message sent", x.MessageId);

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
