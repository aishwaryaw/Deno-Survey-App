import {Application} from './depts.ts';
import {router} from './router.ts';
import "https://deno.land/x/dotenv/load.ts";
import { staticFileMiddleware } from './Middlewares/StaticMiddleware.ts';

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }) => {
    console.log(
      `Listening on: ${secure ? "https://" : "http://"}${hostname ??
        "localhost"}:${port}`,
    );
  });


// Hello World!
// app.use((ctx) => {
//   ctx.response.body = "Hello World!";
// });
app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

// register some middleware
app.use(staticFileMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen( { port:8000 });