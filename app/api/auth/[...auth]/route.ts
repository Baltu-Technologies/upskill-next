import { auth } from "@/auth";

export async function GET(request: Request) {
    return auth.handler(request);
}

export async function POST(request: Request) {
    return auth.handler(request);
} 