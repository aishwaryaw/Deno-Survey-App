import { RouterContext } from '../depts.ts';
import {User} from '../models/User.ts';

import {hashSync, 
    compareSync,
    makeJwt,
    setExpiration,
    Jose,
    Payload
} from '../depts.ts';


const header: Jose = {
    alg: "HS256",
    typ: "JWT",
  };

export class AuthController {
  
    async register(ctx:RouterContext){
       
        const result = await ctx.request.body();
        if (result.type === "json") {
            const { name, email, password } = await result.value; // an object of parsed JSON    
            let user = await User.findOne({email});
            if(user){
                ctx.response.status = 422;
                ctx.response.body = {
                    message : user
                }
                return;
            }
            const hashedPassword = hashSync(password);
            user = new User({name, email, password:hashedPassword});
            await user.save();
        }
       
    }
    async login(ctx:RouterContext) {
        const result = await ctx.request.body();
        if(result.type == "json"){
            const {email, password } = await result.value;
            if (!email || !password) {
                ctx.response.status = 422;
                ctx.response.body = { message: "Please provide email and password" };
                return;
              }

            let user= await User.findOne({email});
            if(!user){
                ctx.response.status = 422;
                ctx.response.body = {message : "Incorrect email"}
                return;
            }
            if(!compareSync(password, user.password)){
                ctx.response.status = 422;
                ctx.response.body = {message : "Incorrect password"}
                return;
            }

            const payload : Payload = {
                iss : user.email,
                exp : setExpiration(Date.now() + parseInt(Deno.env.get("JWT_EXP_DURATION") || "0")),
            };

            const jwt = await makeJwt(
                {key : Deno.env.get("JWT_SECRET_KEY") || "", payload, header}
            );
            // console.log(payload, jwt);

            ctx.response.body = {
                id : user.id,
                name : user.name,
                email : user.email,
                jwt : jwt
            }

        }
    }


}

export default new AuthController();