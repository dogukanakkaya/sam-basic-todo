import { SQSEvent } from 'aws-lambda';
import { EMAIL_QUEUE_URL, REGION } from './config';
import { Todo, sqsClient } from './helper';
import { DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: REGION }); // Replace with the appropriate region

export const lambdaHandler = async (event: SQSEvent): Promise<void> => {
    try {
        for (const message of event.Records) {
            const todo = JSON.parse(message.body) as Todo;

            await sesClient.send(new SendEmailCommand({
                Destination: {
                    ToAddresses: [todo.assignee]
                },
                Message: {
                    Body: {
                        Html: {
                            Data: `
                                <h1>${todo.title}</h1>
                                <p>${todo.description}</p>
                            `
                        }
                    },
                    Subject: {
                        Data: "You are assigned to a new todo"
                    }
                },
                Source: "doguakkaya27@hotmail.com"
            }));

            await sqsClient.send(new DeleteMessageCommand({ QueueUrl: EMAIL_QUEUE_URL, ReceiptHandle: message.receiptHandle }));
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
