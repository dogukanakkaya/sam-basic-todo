import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { nanoid } from 'nanoid';
import { EMAIL_QUEUE_URL, TODO_TABLE_NAME } from './config';
import { Todo, dynamoDBClient, handleError, sqsClient } from './helper';

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
                assignee: { S: todo.assignee }
            }
        }));

        await sqsClient.send(new SendMessageCommand({
            QueueUrl: EMAIL_QUEUE_URL,
            MessageBody: JSON.stringify({ id, ...todo }),
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ id, ...todo }),
        };
    } catch (err: any) {
        return handleError(err);
    }
};
