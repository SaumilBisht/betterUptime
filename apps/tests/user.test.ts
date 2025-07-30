import {describe,it,expect} from "bun:test"
import { BACKEND_URL } from "./config"
import axios from "axios"

const USERNAME=Math.random().toString()
describe("Signup endpoints",async()=>{

  it("Isnt able to signup with incorrect inputs",async()=>{

    try{
      await axios.post(`${BACKEND_URL}/user/signup`,{
        email:"test1",
        password:"testPass"
      })
  
      expect(false,"Control shoulnt reach here");
  
    }
    catch(e){
      console.log(e);
    }
  })

  it("Is able to signup with correct inputs",async()=>{


    try{
      const res= await axios.post(`${BACKEND_URL}/user/signup`,{
        username:USERNAME,
        password:"testPass"
      })
  
      expect(res.status).toBe(200);
      expect(res.data.id).toBeDefined();
    }
    catch(e){
      console.log(e)
    }
  

  })
  
})

describe("SignIn endpoints",async()=>{

  it("Isnt able to signin with incorrect inputs",async()=>{

    try{
      await axios.post(`${BACKEND_URL}/user/signin`,{
        email:"test1",
        password:"testPass"
      })
  
      expect(false,"Control shoulnt reach here");
  
    }
    catch(e){
      //console.log(e);
    }
  })

  it("Is able to signin with correct inputs",async()=>{


    try{
      const res= await axios.post(`${BACKEND_URL}/user/signin`,{
        username:USERNAME,
        password:"testPass"
      })
  
      expect(res.status).toBe(200);
      expect(res.data.token).toBeDefined();
    }
    catch(e){
      //console.log(e)
    }
  

  })
  
})