import { APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

export const handleError = (err: unknown): APIGatewayProxyResult => {
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

export const Todo = z.object({
    title: z.string().max(25),
    description: z.string(),
    assignee: z.string().email()
});
export type Todo = z.infer<typeof Todo> & { id: string };