import { AXIOS } from "@/lib/api/axios";
import { cookies } from "next/headers";


export async function getAuthStatus(): Promise<boolean> {

    const cookieStore = await cookies();

    const token = cookieStore.get("lillyToken")?.value;

    if(!token) return false;

    const response = await AXIOS.post<{ token: string }, { success: boolean, message: string }>("/auth/verify", { token });
    
    if(!response.success) return false;

    return true;


}