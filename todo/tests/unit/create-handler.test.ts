import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../create';
import { defaultEvent } from '../helper';

describe('Unit test for create handler', function () {
    it('verifies successful response of create lambda', async () => {
        const body = {
            title: 'Do something',
            description: 'something great needs to be done',
            assignee: 'doguakkaya27@hotmail.com'
        };

        const event: APIGatewayProxyEvent = {
            ...defaultEvent,
            httpMethod: 'post',
            body: JSON.stringify(body),
            requestContext: {
                ...defaultEvent.requestContext,
                httpMethod: 'post'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        const { id, ...rest } = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(rest).toMatchObject(body);
    });

    it('verifies unsuccessful response of create lambda', async () => {
        const body = {
            description: 'something great needs to be done',
            assignee: 'doguakkaya27@hotmail.com'
        };

        const event: APIGatewayProxyEvent = {
            ...defaultEvent,
            httpMethod: 'post',
            body: JSON.stringify(body),
            requestContext: {
                ...defaultEvent.requestContext,
                httpMethod: 'post'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(422);
        expect(JSON.parse(result.body)).toMatchObject([{
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['title'],
            message: 'Required'
        }]);
    });
});
