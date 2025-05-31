
export const ENV = {
    BASEURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/lilly",
    NODE_ENV: process.env.NODE_ENV || "development"
};