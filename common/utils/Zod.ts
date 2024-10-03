import { ZodError } from "zod";

export class ZodHelper {
    static getFieldError(error: ZodError): string {
        const firstError = error.errors[0]
        if(!firstError){
            return "Unknown Zod Error";
        }
        const path = firstError.path.join(".")
        return `${path}: ${firstError.message}`
    }
}