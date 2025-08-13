import {email, z} from "zod";

export const AuthInput=z.object({
  email : z.email(),
  password : z.string()
})
export const SignUpInput=z.object({
  email:z.email()
})

