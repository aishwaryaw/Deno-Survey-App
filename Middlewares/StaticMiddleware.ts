import {Context, send} from '../depts.ts';
import { fileExists } from '../helpers.ts';

export const staticFileMiddleware = async (ctx: Context, next:Function) =>{

    const file = `${Deno.cwd()}/assets${ctx.request.url.pathname}`;
    if(await fileExists(file)){
        await send(ctx , ctx.request.url.pathname, {
                root : `${Deno.cwd()}/assets`
            });
    }
    else{
        await next();
    }

};

