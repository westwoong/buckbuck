import * as express from 'express';

export interface UserIdRequest extends express.Request {
    user: {
        userId: number;
    }
}