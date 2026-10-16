import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { viagemRouter } from "./routers/viagem";
import { adminRouter } from "./routers/admin";
import { ocorrenciaRouter } from "./routers/ocorrencia";
import { manifestoRouter } from "./routers/manifesto";
import { regionalRouter } from "./routers/regional";
import { seguradoraRouter } from "./routers/seguradora";
import { contaRouter } from "./routers/conta";

export const appRouter = createTRPCRouter({
  post: postRouter,
  viagem: viagemRouter,
  admin: adminRouter,
  ocorrencia: ocorrenciaRouter,
  manifesto: manifestoRouter,
  regional: regionalRouter,
  seguradora: seguradoraRouter,
  conta: contaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
