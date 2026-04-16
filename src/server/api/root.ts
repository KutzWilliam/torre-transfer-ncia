import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { viagemRouter } from "./routers/viagem";
import { adminRouter } from "./routers/admin";
import { ocorrenciaRouter } from "./routers/ocorrencia";

export const appRouter = createTRPCRouter({
  post: postRouter,
  viagem: viagemRouter,
  admin: adminRouter,
  ocorrencia: ocorrenciaRouter,
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
