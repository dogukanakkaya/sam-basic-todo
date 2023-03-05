import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../fetch';
import { defaultEvent } from '../helper';

describe('Unit test for fetch handler', function () {
    it('verifies successful response of fetch lambda', async () => {
        const event: APIGatewayProxyEvent = {
            ...defaultEvent
        };
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        const body = JSON.parse(result.body);

        expect(result.statusCode).toEqual(200);
        expect(body.todos).toBeDefined();
        expect(Array.isArray(body.todos)).toBe(true);
    });
});
