import { AppError } from "./AppError";

export class PostError extends AppError {
    getMessage(): string {
        return "Post error";
    }
}