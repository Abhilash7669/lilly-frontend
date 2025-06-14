import { AXIOS_SERVER } from "@/lib/api/server/axios.server";
import { cookies } from "next/headers";


export async function getAuthStatus(): Promise<boolean> {

    const cookieStore = await cookies();

    const token = cookieStore.get("lillyToken")?.value;

    if(!token) return false;

    const response = await AXIOS_SERVER.post<{ token: string }, { success: boolean, message: string }>("/auth/verify", { token });
    
    if(!response || !response.success) return false;

    return true;


}