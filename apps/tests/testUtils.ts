import axios from "axios"
import { BACKEND_URL } from "./config"

//function for signing up and in for a user.
export async function createUser(): Promise<{
    id: string,
    jwt: string
}> 
{
    const USER_NAME = Math.random().toString();

    const res = await axios.post(`${BACKEND_URL}/user/signup`, 
    {
        username: USER_NAME,
        password: "123123123"
    })

    const signinRes = await axios.post(`${BACKEND_URL}/user/signin`, {
        username: USER_NAME,
        password: "123123123"
    })

    return {
        id: res.data.id,
        jwt: signinRes.data.token
    }
}

//id(user): 81ecdf8e-2138-45f5-b826-bd553592a8fb
// token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MWVjZGY4ZS0yMTM4LTQ1ZjUtYjgyNi1iZDU1MzU5MmE4ZmIiLCJpYXQiOjE3NTQzOTYzOTF9.8UZnEgV69yJt_t9BQ_1YnraiA-2B-lTvy4T9inmKvro

//website id: 8e00ed16-0dc9-4abb-9ed7-ff61e724db8a
// india id: 9a0511a5-731b-4892-8d70-4108baa29362
//us id: 3b6ee783-3a33-47e8-86e4-3b5d6dd0336a