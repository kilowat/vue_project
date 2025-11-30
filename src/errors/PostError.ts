import { AppError } from "./AppError";
export type PostErrorName = 'FETCH_POST' | 'CREATE_POST';

export class PostError extends AppError<PostErrorName> {

    getMessage(): string {
        switch (this.name) {
            case 'FETCH_POST': return "Fetch post data error";
            case 'CREATE_POST': return "Create post data error";
            default: return "Post uknown Error";
        }

    }
}