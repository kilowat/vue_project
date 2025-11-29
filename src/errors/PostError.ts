import { AppError } from "./AppError";

export class PostError extends AppError {
    getMessage(): string {
        return "User frendly error message";
    }
}