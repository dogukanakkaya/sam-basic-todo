import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { nanoid } from 'nanoid';
import { EMAIL_QUEUE_URL, REGION, TODO_TABLE_NAME } from './config';
import { Todo, handleError } from './helper';

const dynamoDBClient = new DynamoDBClient({ region: REGION });
const sqsClient = new SQSClient({ region: REGION });

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) throw Error();

        const todo = await Todo.parseAsync(JSON.parse(event.body));
        const id = nanoid();

        await dynamoDBClient.send(new PutItemCommand({
            TableName: TODO_TABLE_NAME,
            Item: {
                id: { S: id },
                title: { S: todo.title },
                description: { S: todo.description },
                assignee: { S: todo.description }
            }
        }));

        await sqsClient.send(new SendMessageCommand({
            QueueUrl: EMAIL_QUEUE_URL,
            MessageBody: JSON.stringify({ todo }),
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ id, ...todo }),
        };
    } catch (err: any) {
        return handleError(err);
    }
};
