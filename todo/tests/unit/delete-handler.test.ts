import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler as createLambdaHandler } from '../../create';
import { lambdaHandler } from '../../delete';
import { defaultEvent } from '../helper';

describe('Unit test for delete handler', function () {
    let id = '';
    it('create todo for delete test', async () => {
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
        const result: APIGatewayProxyResult = await createLambdaHandler(event);

        expect(result.statusCode).toEqual(200);

        const { id: _id } = JSON.parse(result.body);
        id = _id;
    });

    it('verifies successful response of delete lambda', async () => {
        const event: APIGatewayProxyEvent = {
            ...defaultEvent,
            httpMethod: 'delete',
            pathParameters: { id },
            requestContext: {
                ...defaultEvent.requestContext,
                httpMethod: 'delete'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toMatchObject({ id });
    });

    it('verifies unsuccessful response of create lambda', async () => {
        const event: APIGatewayProxyEvent = {
            ...defaultEvent,
            httpMethod: 'delete',
            requestContext: {
                ...defaultEvent.requestContext,
                httpMethod: 'delete'
            }
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(422);
        expect(JSON.parse(result.body)).toMatchObject([{
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            message: 'Required'
        }]);
    });
});
