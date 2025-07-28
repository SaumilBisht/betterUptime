import {describe,it,expect} from "bun:test"
import axios from "axios"

let BASE_URL="http://localhost:3001"
describe("Website gets Created",()=>{
  it("Website not created if url not present",async()=>{

    try{
      axios.post(`${BASE_URL}/website`,({

      }))

      expect(false,"Website created when it shouldnt")
    }
    catch(e){

    }
    
  })

  it("Website created if url not present",async()=>{

    const response=await axios.post(`${BASE_URL}/website`,({
      url:"http://google.com"
    }))

    expect(response.data.id).not.toBeNull();
    
    
  })
})