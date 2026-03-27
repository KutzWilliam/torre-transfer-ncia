
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Base
 * 
 */
export type Base = $Result.DefaultSelection<Prisma.$BasePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Veiculo
 * 
 */
export type Veiculo = $Result.DefaultSelection<Prisma.$VeiculoPayload>
/**
 * Model Viagem
 * 
 */
export type Viagem = $Result.DefaultSelection<Prisma.$ViagemPayload>
/**
 * Model JustificativaAtraso
 * 
 */
export type JustificativaAtraso = $Result.DefaultSelection<Prisma.$JustificativaAtrasoPayload>
/**
 * Model Telemetria
 * 
 */
export type Telemetria = $Result.DefaultSelection<Prisma.$TelemetriaPayload>
/**
 * Model RotaPadrao
 * 
 */
export type RotaPadrao = $Result.DefaultSelection<Prisma.$RotaPadraoPayload>
/**
 * Model ParadaPadrao
 * 
 */
export type ParadaPadrao = $Result.DefaultSelection<Prisma.$ParadaPadraoPayload>
/**
 * Model ParadaViagem
 * 
 */
export type ParadaViagem = $Result.DefaultSelection<Prisma.$ParadaViagemPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE',
  OPERADOR: 'OPERADOR'
};

export type Role = (typeof Role)[keyof typeof Role]


export const StatusViagem: {
  PROGRAMADA: 'PROGRAMADA',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  FINALIZADA: 'FINALIZADA',
  CANCELADA: 'CANCELADA'
};

export type StatusViagem = (typeof StatusViagem)[keyof typeof StatusViagem]


export const TipoAtraso: {
  SAIDA_BASE: 'SAIDA_BASE',
  TEMPO_PARADA_EXCEDIDO: 'TEMPO_PARADA_EXCEDIDO',
  DESLOCAMENTO_ROTA: 'DESLOCAMENTO_ROTA'
};

export type TipoAtraso = (typeof TipoAtraso)[keyof typeof TipoAtraso]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type StatusViagem = $Enums.StatusViagem

export const StatusViagem: typeof $Enums.StatusViagem

export type TipoAtraso = $Enums.TipoAtraso

export const TipoAtraso: typeof $Enums.TipoAtraso

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Bases
 * const bases = await prisma.base.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Bases
   * const bases = await prisma.base.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.base`: Exposes CRUD operations for the **Base** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bases
    * const bases = await prisma.base.findMany()
    * ```
    */
  get base(): Prisma.BaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.veiculo`: Exposes CRUD operations for the **Veiculo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Veiculos
    * const veiculos = await prisma.veiculo.findMany()
    * ```
    */
  get veiculo(): Prisma.VeiculoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.viagem`: Exposes CRUD operations for the **Viagem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Viagems
    * const viagems = await prisma.viagem.findMany()
    * ```
    */
  get viagem(): Prisma.ViagemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.justificativaAtraso`: Exposes CRUD operations for the **JustificativaAtraso** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JustificativaAtrasos
    * const justificativaAtrasos = await prisma.justificativaAtraso.findMany()
    * ```
    */
  get justificativaAtraso(): Prisma.JustificativaAtrasoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.telemetria`: Exposes CRUD operations for the **Telemetria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Telemetrias
    * const telemetrias = await prisma.telemetria.findMany()
    * ```
    */
  get telemetria(): Prisma.TelemetriaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rotaPadrao`: Exposes CRUD operations for the **RotaPadrao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RotaPadraos
    * const rotaPadraos = await prisma.rotaPadrao.findMany()
    * ```
    */
  get rotaPadrao(): Prisma.RotaPadraoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paradaPadrao`: Exposes CRUD operations for the **ParadaPadrao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ParadaPadraos
    * const paradaPadraos = await prisma.paradaPadrao.findMany()
    * ```
    */
  get paradaPadrao(): Prisma.ParadaPadraoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paradaViagem`: Exposes CRUD operations for the **ParadaViagem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ParadaViagems
    * const paradaViagems = await prisma.paradaViagem.findMany()
    * ```
    */
  get paradaViagem(): Prisma.ParadaViagemDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Base: 'Base',
    User: 'User',
    Veiculo: 'Veiculo',
    Viagem: 'Viagem',
    JustificativaAtraso: 'JustificativaAtraso',
    Telemetria: 'Telemetria',
    RotaPadrao: 'RotaPadrao',
    ParadaPadrao: 'ParadaPadrao',
    ParadaViagem: 'ParadaViagem'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "base" | "user" | "veiculo" | "viagem" | "justificativaAtraso" | "telemetria" | "rotaPadrao" | "paradaPadrao" | "paradaViagem"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Base: {
        payload: Prisma.$BasePayload<ExtArgs>
        fields: Prisma.BaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>
          }
          findFirst: {
            args: Prisma.BaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>
          }
          findMany: {
            args: Prisma.BaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>[]
          }
          create: {
            args: Prisma.BaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>
          }
          createMany: {
            args: Prisma.BaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>[]
          }
          delete: {
            args: Prisma.BaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>
          }
          update: {
            args: Prisma.BaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>
          }
          deleteMany: {
            args: Prisma.BaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>[]
          }
          upsert: {
            args: Prisma.BaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BasePayload>
          }
          aggregate: {
            args: Prisma.BaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBase>
          }
          groupBy: {
            args: Prisma.BaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<BaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.BaseCountArgs<ExtArgs>
            result: $Utils.Optional<BaseCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Veiculo: {
        payload: Prisma.$VeiculoPayload<ExtArgs>
        fields: Prisma.VeiculoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VeiculoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VeiculoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>
          }
          findFirst: {
            args: Prisma.VeiculoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VeiculoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>
          }
          findMany: {
            args: Prisma.VeiculoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>[]
          }
          create: {
            args: Prisma.VeiculoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>
          }
          createMany: {
            args: Prisma.VeiculoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VeiculoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>[]
          }
          delete: {
            args: Prisma.VeiculoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>
          }
          update: {
            args: Prisma.VeiculoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>
          }
          deleteMany: {
            args: Prisma.VeiculoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VeiculoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VeiculoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>[]
          }
          upsert: {
            args: Prisma.VeiculoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VeiculoPayload>
          }
          aggregate: {
            args: Prisma.VeiculoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVeiculo>
          }
          groupBy: {
            args: Prisma.VeiculoGroupByArgs<ExtArgs>
            result: $Utils.Optional<VeiculoGroupByOutputType>[]
          }
          count: {
            args: Prisma.VeiculoCountArgs<ExtArgs>
            result: $Utils.Optional<VeiculoCountAggregateOutputType> | number
          }
        }
      }
      Viagem: {
        payload: Prisma.$ViagemPayload<ExtArgs>
        fields: Prisma.ViagemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ViagemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ViagemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>
          }
          findFirst: {
            args: Prisma.ViagemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ViagemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>
          }
          findMany: {
            args: Prisma.ViagemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>[]
          }
          create: {
            args: Prisma.ViagemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>
          }
          createMany: {
            args: Prisma.ViagemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ViagemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>[]
          }
          delete: {
            args: Prisma.ViagemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>
          }
          update: {
            args: Prisma.ViagemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>
          }
          deleteMany: {
            args: Prisma.ViagemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ViagemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ViagemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>[]
          }
          upsert: {
            args: Prisma.ViagemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ViagemPayload>
          }
          aggregate: {
            args: Prisma.ViagemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateViagem>
          }
          groupBy: {
            args: Prisma.ViagemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ViagemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ViagemCountArgs<ExtArgs>
            result: $Utils.Optional<ViagemCountAggregateOutputType> | number
          }
        }
      }
      JustificativaAtraso: {
        payload: Prisma.$JustificativaAtrasoPayload<ExtArgs>
        fields: Prisma.JustificativaAtrasoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JustificativaAtrasoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JustificativaAtrasoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>
          }
          findFirst: {
            args: Prisma.JustificativaAtrasoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JustificativaAtrasoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>
          }
          findMany: {
            args: Prisma.JustificativaAtrasoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>[]
          }
          create: {
            args: Prisma.JustificativaAtrasoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>
          }
          createMany: {
            args: Prisma.JustificativaAtrasoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JustificativaAtrasoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>[]
          }
          delete: {
            args: Prisma.JustificativaAtrasoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>
          }
          update: {
            args: Prisma.JustificativaAtrasoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>
          }
          deleteMany: {
            args: Prisma.JustificativaAtrasoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JustificativaAtrasoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JustificativaAtrasoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>[]
          }
          upsert: {
            args: Prisma.JustificativaAtrasoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JustificativaAtrasoPayload>
          }
          aggregate: {
            args: Prisma.JustificativaAtrasoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJustificativaAtraso>
          }
          groupBy: {
            args: Prisma.JustificativaAtrasoGroupByArgs<ExtArgs>
            result: $Utils.Optional<JustificativaAtrasoGroupByOutputType>[]
          }
          count: {
            args: Prisma.JustificativaAtrasoCountArgs<ExtArgs>
            result: $Utils.Optional<JustificativaAtrasoCountAggregateOutputType> | number
          }
        }
      }
      Telemetria: {
        payload: Prisma.$TelemetriaPayload<ExtArgs>
        fields: Prisma.TelemetriaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TelemetriaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TelemetriaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>
          }
          findFirst: {
            args: Prisma.TelemetriaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TelemetriaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>
          }
          findMany: {
            args: Prisma.TelemetriaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>[]
          }
          create: {
            args: Prisma.TelemetriaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>
          }
          createMany: {
            args: Prisma.TelemetriaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TelemetriaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>[]
          }
          delete: {
            args: Prisma.TelemetriaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>
          }
          update: {
            args: Prisma.TelemetriaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>
          }
          deleteMany: {
            args: Prisma.TelemetriaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TelemetriaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TelemetriaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>[]
          }
          upsert: {
            args: Prisma.TelemetriaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TelemetriaPayload>
          }
          aggregate: {
            args: Prisma.TelemetriaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTelemetria>
          }
          groupBy: {
            args: Prisma.TelemetriaGroupByArgs<ExtArgs>
            result: $Utils.Optional<TelemetriaGroupByOutputType>[]
          }
          count: {
            args: Prisma.TelemetriaCountArgs<ExtArgs>
            result: $Utils.Optional<TelemetriaCountAggregateOutputType> | number
          }
        }
      }
      RotaPadrao: {
        payload: Prisma.$RotaPadraoPayload<ExtArgs>
        fields: Prisma.RotaPadraoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RotaPadraoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RotaPadraoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>
          }
          findFirst: {
            args: Prisma.RotaPadraoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RotaPadraoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>
          }
          findMany: {
            args: Prisma.RotaPadraoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>[]
          }
          create: {
            args: Prisma.RotaPadraoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>
          }
          createMany: {
            args: Prisma.RotaPadraoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RotaPadraoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>[]
          }
          delete: {
            args: Prisma.RotaPadraoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>
          }
          update: {
            args: Prisma.RotaPadraoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>
          }
          deleteMany: {
            args: Prisma.RotaPadraoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RotaPadraoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RotaPadraoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>[]
          }
          upsert: {
            args: Prisma.RotaPadraoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RotaPadraoPayload>
          }
          aggregate: {
            args: Prisma.RotaPadraoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRotaPadrao>
          }
          groupBy: {
            args: Prisma.RotaPadraoGroupByArgs<ExtArgs>
            result: $Utils.Optional<RotaPadraoGroupByOutputType>[]
          }
          count: {
            args: Prisma.RotaPadraoCountArgs<ExtArgs>
            result: $Utils.Optional<RotaPadraoCountAggregateOutputType> | number
          }
        }
      }
      ParadaPadrao: {
        payload: Prisma.$ParadaPadraoPayload<ExtArgs>
        fields: Prisma.ParadaPadraoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParadaPadraoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParadaPadraoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>
          }
          findFirst: {
            args: Prisma.ParadaPadraoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParadaPadraoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>
          }
          findMany: {
            args: Prisma.ParadaPadraoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>[]
          }
          create: {
            args: Prisma.ParadaPadraoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>
          }
          createMany: {
            args: Prisma.ParadaPadraoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParadaPadraoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>[]
          }
          delete: {
            args: Prisma.ParadaPadraoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>
          }
          update: {
            args: Prisma.ParadaPadraoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>
          }
          deleteMany: {
            args: Prisma.ParadaPadraoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParadaPadraoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ParadaPadraoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>[]
          }
          upsert: {
            args: Prisma.ParadaPadraoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaPadraoPayload>
          }
          aggregate: {
            args: Prisma.ParadaPadraoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParadaPadrao>
          }
          groupBy: {
            args: Prisma.ParadaPadraoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParadaPadraoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParadaPadraoCountArgs<ExtArgs>
            result: $Utils.Optional<ParadaPadraoCountAggregateOutputType> | number
          }
        }
      }
      ParadaViagem: {
        payload: Prisma.$ParadaViagemPayload<ExtArgs>
        fields: Prisma.ParadaViagemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParadaViagemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParadaViagemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>
          }
          findFirst: {
            args: Prisma.ParadaViagemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParadaViagemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>
          }
          findMany: {
            args: Prisma.ParadaViagemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>[]
          }
          create: {
            args: Prisma.ParadaViagemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>
          }
          createMany: {
            args: Prisma.ParadaViagemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParadaViagemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>[]
          }
          delete: {
            args: Prisma.ParadaViagemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>
          }
          update: {
            args: Prisma.ParadaViagemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>
          }
          deleteMany: {
            args: Prisma.ParadaViagemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParadaViagemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ParadaViagemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>[]
          }
          upsert: {
            args: Prisma.ParadaViagemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParadaViagemPayload>
          }
          aggregate: {
            args: Prisma.ParadaViagemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParadaViagem>
          }
          groupBy: {
            args: Prisma.ParadaViagemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParadaViagemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParadaViagemCountArgs<ExtArgs>
            result: $Utils.Optional<ParadaViagemCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    base?: BaseOmit
    user?: UserOmit
    veiculo?: VeiculoOmit
    viagem?: ViagemOmit
    justificativaAtraso?: JustificativaAtrasoOmit
    telemetria?: TelemetriaOmit
    rotaPadrao?: RotaPadraoOmit
    paradaPadrao?: ParadaPadraoOmit
    paradaViagem?: ParadaViagemOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type BaseCountOutputType
   */

  export type BaseCountOutputType = {
    usuarios: number
    viagensOrigem: number
    viagensDestino: number
    justificativas: number
    paradasPadrao: number
    paradasViagem: number
  }

  export type BaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | BaseCountOutputTypeCountUsuariosArgs
    viagensOrigem?: boolean | BaseCountOutputTypeCountViagensOrigemArgs
    viagensDestino?: boolean | BaseCountOutputTypeCountViagensDestinoArgs
    justificativas?: boolean | BaseCountOutputTypeCountJustificativasArgs
    paradasPadrao?: boolean | BaseCountOutputTypeCountParadasPadraoArgs
    paradasViagem?: boolean | BaseCountOutputTypeCountParadasViagemArgs
  }

  // Custom InputTypes
  /**
   * BaseCountOutputType without action
   */
  export type BaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BaseCountOutputType
     */
    select?: BaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BaseCountOutputType without action
   */
  export type BaseCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * BaseCountOutputType without action
   */
  export type BaseCountOutputTypeCountViagensOrigemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ViagemWhereInput
  }

  /**
   * BaseCountOutputType without action
   */
  export type BaseCountOutputTypeCountViagensDestinoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ViagemWhereInput
  }

  /**
   * BaseCountOutputType without action
   */
  export type BaseCountOutputTypeCountJustificativasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JustificativaAtrasoWhereInput
  }

  /**
   * BaseCountOutputType without action
   */
  export type BaseCountOutputTypeCountParadasPadraoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParadaPadraoWhereInput
  }

  /**
   * BaseCountOutputType without action
   */
  export type BaseCountOutputTypeCountParadasViagemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParadaViagemWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    justificativas: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    justificativas?: boolean | UserCountOutputTypeCountJustificativasArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountJustificativasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JustificativaAtrasoWhereInput
  }


  /**
   * Count Type VeiculoCountOutputType
   */

  export type VeiculoCountOutputType = {
    viagens: number
    telemetrias: number
  }

  export type VeiculoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viagens?: boolean | VeiculoCountOutputTypeCountViagensArgs
    telemetrias?: boolean | VeiculoCountOutputTypeCountTelemetriasArgs
  }

  // Custom InputTypes
  /**
   * VeiculoCountOutputType without action
   */
  export type VeiculoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VeiculoCountOutputType
     */
    select?: VeiculoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VeiculoCountOutputType without action
   */
  export type VeiculoCountOutputTypeCountViagensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ViagemWhereInput
  }

  /**
   * VeiculoCountOutputType without action
   */
  export type VeiculoCountOutputTypeCountTelemetriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TelemetriaWhereInput
  }


  /**
   * Count Type ViagemCountOutputType
   */

  export type ViagemCountOutputType = {
    paradasViagem: number
    justificativas: number
    telemetrias: number
  }

  export type ViagemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paradasViagem?: boolean | ViagemCountOutputTypeCountParadasViagemArgs
    justificativas?: boolean | ViagemCountOutputTypeCountJustificativasArgs
    telemetrias?: boolean | ViagemCountOutputTypeCountTelemetriasArgs
  }

  // Custom InputTypes
  /**
   * ViagemCountOutputType without action
   */
  export type ViagemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ViagemCountOutputType
     */
    select?: ViagemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ViagemCountOutputType without action
   */
  export type ViagemCountOutputTypeCountParadasViagemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParadaViagemWhereInput
  }

  /**
   * ViagemCountOutputType without action
   */
  export type ViagemCountOutputTypeCountJustificativasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JustificativaAtrasoWhereInput
  }

  /**
   * ViagemCountOutputType without action
   */
  export type ViagemCountOutputTypeCountTelemetriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TelemetriaWhereInput
  }


  /**
   * Count Type RotaPadraoCountOutputType
   */

  export type RotaPadraoCountOutputType = {
    paradas: number
    viagens: number
  }

  export type RotaPadraoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paradas?: boolean | RotaPadraoCountOutputTypeCountParadasArgs
    viagens?: boolean | RotaPadraoCountOutputTypeCountViagensArgs
  }

  // Custom InputTypes
  /**
   * RotaPadraoCountOutputType without action
   */
  export type RotaPadraoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadraoCountOutputType
     */
    select?: RotaPadraoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RotaPadraoCountOutputType without action
   */
  export type RotaPadraoCountOutputTypeCountParadasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParadaPadraoWhereInput
  }

  /**
   * RotaPadraoCountOutputType without action
   */
  export type RotaPadraoCountOutputTypeCountViagensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ViagemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Base
   */

  export type AggregateBase = {
    _count: BaseCountAggregateOutputType | null
    _avg: BaseAvgAggregateOutputType | null
    _sum: BaseSumAggregateOutputType | null
    _min: BaseMinAggregateOutputType | null
    _max: BaseMaxAggregateOutputType | null
  }

  export type BaseAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    raioMetros: number | null
  }

  export type BaseSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    raioMetros: number | null
  }

  export type BaseMinAggregateOutputType = {
    id: string | null
    nome: string | null
    cidade: string | null
    latitude: number | null
    longitude: number | null
    raioMetros: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BaseMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    cidade: string | null
    latitude: number | null
    longitude: number | null
    raioMetros: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BaseCountAggregateOutputType = {
    id: number
    nome: number
    cidade: number
    latitude: number
    longitude: number
    raioMetros: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BaseAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    raioMetros?: true
  }

  export type BaseSumAggregateInputType = {
    latitude?: true
    longitude?: true
    raioMetros?: true
  }

  export type BaseMinAggregateInputType = {
    id?: true
    nome?: true
    cidade?: true
    latitude?: true
    longitude?: true
    raioMetros?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BaseMaxAggregateInputType = {
    id?: true
    nome?: true
    cidade?: true
    latitude?: true
    longitude?: true
    raioMetros?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BaseCountAggregateInputType = {
    id?: true
    nome?: true
    cidade?: true
    latitude?: true
    longitude?: true
    raioMetros?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Base to aggregate.
     */
    where?: BaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bases to fetch.
     */
    orderBy?: BaseOrderByWithRelationInput | BaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bases
    **/
    _count?: true | BaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BaseMaxAggregateInputType
  }

  export type GetBaseAggregateType<T extends BaseAggregateArgs> = {
        [P in keyof T & keyof AggregateBase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBase[P]>
      : GetScalarType<T[P], AggregateBase[P]>
  }




  export type BaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BaseWhereInput
    orderBy?: BaseOrderByWithAggregationInput | BaseOrderByWithAggregationInput[]
    by: BaseScalarFieldEnum[] | BaseScalarFieldEnum
    having?: BaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BaseCountAggregateInputType | true
    _avg?: BaseAvgAggregateInputType
    _sum?: BaseSumAggregateInputType
    _min?: BaseMinAggregateInputType
    _max?: BaseMaxAggregateInputType
  }

  export type BaseGroupByOutputType = {
    id: string
    nome: string
    cidade: string
    latitude: number | null
    longitude: number | null
    raioMetros: number
    createdAt: Date
    updatedAt: Date
    _count: BaseCountAggregateOutputType | null
    _avg: BaseAvgAggregateOutputType | null
    _sum: BaseSumAggregateOutputType | null
    _min: BaseMinAggregateOutputType | null
    _max: BaseMaxAggregateOutputType | null
  }

  type GetBaseGroupByPayload<T extends BaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BaseGroupByOutputType[P]>
            : GetScalarType<T[P], BaseGroupByOutputType[P]>
        }
      >
    >


  export type BaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cidade?: boolean
    latitude?: boolean
    longitude?: boolean
    raioMetros?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    usuarios?: boolean | Base$usuariosArgs<ExtArgs>
    viagensOrigem?: boolean | Base$viagensOrigemArgs<ExtArgs>
    viagensDestino?: boolean | Base$viagensDestinoArgs<ExtArgs>
    justificativas?: boolean | Base$justificativasArgs<ExtArgs>
    paradasPadrao?: boolean | Base$paradasPadraoArgs<ExtArgs>
    paradasViagem?: boolean | Base$paradasViagemArgs<ExtArgs>
    _count?: boolean | BaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["base"]>

  export type BaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cidade?: boolean
    latitude?: boolean
    longitude?: boolean
    raioMetros?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["base"]>

  export type BaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cidade?: boolean
    latitude?: boolean
    longitude?: boolean
    raioMetros?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["base"]>

  export type BaseSelectScalar = {
    id?: boolean
    nome?: boolean
    cidade?: boolean
    latitude?: boolean
    longitude?: boolean
    raioMetros?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "cidade" | "latitude" | "longitude" | "raioMetros" | "createdAt" | "updatedAt", ExtArgs["result"]["base"]>
  export type BaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | Base$usuariosArgs<ExtArgs>
    viagensOrigem?: boolean | Base$viagensOrigemArgs<ExtArgs>
    viagensDestino?: boolean | Base$viagensDestinoArgs<ExtArgs>
    justificativas?: boolean | Base$justificativasArgs<ExtArgs>
    paradasPadrao?: boolean | Base$paradasPadraoArgs<ExtArgs>
    paradasViagem?: boolean | Base$paradasViagemArgs<ExtArgs>
    _count?: boolean | BaseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Base"
    objects: {
      usuarios: Prisma.$UserPayload<ExtArgs>[]
      viagensOrigem: Prisma.$ViagemPayload<ExtArgs>[]
      viagensDestino: Prisma.$ViagemPayload<ExtArgs>[]
      justificativas: Prisma.$JustificativaAtrasoPayload<ExtArgs>[]
      paradasPadrao: Prisma.$ParadaPadraoPayload<ExtArgs>[]
      paradasViagem: Prisma.$ParadaViagemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      cidade: string
      latitude: number | null
      longitude: number | null
      raioMetros: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["base"]>
    composites: {}
  }

  type BaseGetPayload<S extends boolean | null | undefined | BaseDefaultArgs> = $Result.GetResult<Prisma.$BasePayload, S>

  type BaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BaseCountAggregateInputType | true
    }

  export interface BaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Base'], meta: { name: 'Base' } }
    /**
     * Find zero or one Base that matches the filter.
     * @param {BaseFindUniqueArgs} args - Arguments to find a Base
     * @example
     * // Get one Base
     * const base = await prisma.base.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BaseFindUniqueArgs>(args: SelectSubset<T, BaseFindUniqueArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Base that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BaseFindUniqueOrThrowArgs} args - Arguments to find a Base
     * @example
     * // Get one Base
     * const base = await prisma.base.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BaseFindUniqueOrThrowArgs>(args: SelectSubset<T, BaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Base that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BaseFindFirstArgs} args - Arguments to find a Base
     * @example
     * // Get one Base
     * const base = await prisma.base.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BaseFindFirstArgs>(args?: SelectSubset<T, BaseFindFirstArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Base that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BaseFindFirstOrThrowArgs} args - Arguments to find a Base
     * @example
     * // Get one Base
     * const base = await prisma.base.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BaseFindFirstOrThrowArgs>(args?: SelectSubset<T, BaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bases
     * const bases = await prisma.base.findMany()
     * 
     * // Get first 10 Bases
     * const bases = await prisma.base.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const baseWithIdOnly = await prisma.base.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BaseFindManyArgs>(args?: SelectSubset<T, BaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Base.
     * @param {BaseCreateArgs} args - Arguments to create a Base.
     * @example
     * // Create one Base
     * const Base = await prisma.base.create({
     *   data: {
     *     // ... data to create a Base
     *   }
     * })
     * 
     */
    create<T extends BaseCreateArgs>(args: SelectSubset<T, BaseCreateArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bases.
     * @param {BaseCreateManyArgs} args - Arguments to create many Bases.
     * @example
     * // Create many Bases
     * const base = await prisma.base.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BaseCreateManyArgs>(args?: SelectSubset<T, BaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bases and returns the data saved in the database.
     * @param {BaseCreateManyAndReturnArgs} args - Arguments to create many Bases.
     * @example
     * // Create many Bases
     * const base = await prisma.base.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bases and only return the `id`
     * const baseWithIdOnly = await prisma.base.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BaseCreateManyAndReturnArgs>(args?: SelectSubset<T, BaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Base.
     * @param {BaseDeleteArgs} args - Arguments to delete one Base.
     * @example
     * // Delete one Base
     * const Base = await prisma.base.delete({
     *   where: {
     *     // ... filter to delete one Base
     *   }
     * })
     * 
     */
    delete<T extends BaseDeleteArgs>(args: SelectSubset<T, BaseDeleteArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Base.
     * @param {BaseUpdateArgs} args - Arguments to update one Base.
     * @example
     * // Update one Base
     * const base = await prisma.base.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BaseUpdateArgs>(args: SelectSubset<T, BaseUpdateArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bases.
     * @param {BaseDeleteManyArgs} args - Arguments to filter Bases to delete.
     * @example
     * // Delete a few Bases
     * const { count } = await prisma.base.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BaseDeleteManyArgs>(args?: SelectSubset<T, BaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bases
     * const base = await prisma.base.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BaseUpdateManyArgs>(args: SelectSubset<T, BaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bases and returns the data updated in the database.
     * @param {BaseUpdateManyAndReturnArgs} args - Arguments to update many Bases.
     * @example
     * // Update many Bases
     * const base = await prisma.base.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bases and only return the `id`
     * const baseWithIdOnly = await prisma.base.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BaseUpdateManyAndReturnArgs>(args: SelectSubset<T, BaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Base.
     * @param {BaseUpsertArgs} args - Arguments to update or create a Base.
     * @example
     * // Update or create a Base
     * const base = await prisma.base.upsert({
     *   create: {
     *     // ... data to create a Base
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Base we want to update
     *   }
     * })
     */
    upsert<T extends BaseUpsertArgs>(args: SelectSubset<T, BaseUpsertArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BaseCountArgs} args - Arguments to filter Bases to count.
     * @example
     * // Count the number of Bases
     * const count = await prisma.base.count({
     *   where: {
     *     // ... the filter for the Bases we want to count
     *   }
     * })
    **/
    count<T extends BaseCountArgs>(
      args?: Subset<T, BaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Base.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BaseAggregateArgs>(args: Subset<T, BaseAggregateArgs>): Prisma.PrismaPromise<GetBaseAggregateType<T>>

    /**
     * Group by Base.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BaseGroupByArgs['orderBy'] }
        : { orderBy?: BaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Base model
   */
  readonly fields: BaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Base.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuarios<T extends Base$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, Base$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    viagensOrigem<T extends Base$viagensOrigemArgs<ExtArgs> = {}>(args?: Subset<T, Base$viagensOrigemArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    viagensDestino<T extends Base$viagensDestinoArgs<ExtArgs> = {}>(args?: Subset<T, Base$viagensDestinoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    justificativas<T extends Base$justificativasArgs<ExtArgs> = {}>(args?: Subset<T, Base$justificativasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    paradasPadrao<T extends Base$paradasPadraoArgs<ExtArgs> = {}>(args?: Subset<T, Base$paradasPadraoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    paradasViagem<T extends Base$paradasViagemArgs<ExtArgs> = {}>(args?: Subset<T, Base$paradasViagemArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Base model
   */
  interface BaseFieldRefs {
    readonly id: FieldRef<"Base", 'String'>
    readonly nome: FieldRef<"Base", 'String'>
    readonly cidade: FieldRef<"Base", 'String'>
    readonly latitude: FieldRef<"Base", 'Float'>
    readonly longitude: FieldRef<"Base", 'Float'>
    readonly raioMetros: FieldRef<"Base", 'Int'>
    readonly createdAt: FieldRef<"Base", 'DateTime'>
    readonly updatedAt: FieldRef<"Base", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Base findUnique
   */
  export type BaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * Filter, which Base to fetch.
     */
    where: BaseWhereUniqueInput
  }

  /**
   * Base findUniqueOrThrow
   */
  export type BaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * Filter, which Base to fetch.
     */
    where: BaseWhereUniqueInput
  }

  /**
   * Base findFirst
   */
  export type BaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * Filter, which Base to fetch.
     */
    where?: BaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bases to fetch.
     */
    orderBy?: BaseOrderByWithRelationInput | BaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bases.
     */
    cursor?: BaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bases.
     */
    distinct?: BaseScalarFieldEnum | BaseScalarFieldEnum[]
  }

  /**
   * Base findFirstOrThrow
   */
  export type BaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * Filter, which Base to fetch.
     */
    where?: BaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bases to fetch.
     */
    orderBy?: BaseOrderByWithRelationInput | BaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bases.
     */
    cursor?: BaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bases.
     */
    distinct?: BaseScalarFieldEnum | BaseScalarFieldEnum[]
  }

  /**
   * Base findMany
   */
  export type BaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * Filter, which Bases to fetch.
     */
    where?: BaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bases to fetch.
     */
    orderBy?: BaseOrderByWithRelationInput | BaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bases.
     */
    cursor?: BaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bases.
     */
    skip?: number
    distinct?: BaseScalarFieldEnum | BaseScalarFieldEnum[]
  }

  /**
   * Base create
   */
  export type BaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Base.
     */
    data: XOR<BaseCreateInput, BaseUncheckedCreateInput>
  }

  /**
   * Base createMany
   */
  export type BaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bases.
     */
    data: BaseCreateManyInput | BaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Base createManyAndReturn
   */
  export type BaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * The data used to create many Bases.
     */
    data: BaseCreateManyInput | BaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Base update
   */
  export type BaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Base.
     */
    data: XOR<BaseUpdateInput, BaseUncheckedUpdateInput>
    /**
     * Choose, which Base to update.
     */
    where: BaseWhereUniqueInput
  }

  /**
   * Base updateMany
   */
  export type BaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bases.
     */
    data: XOR<BaseUpdateManyMutationInput, BaseUncheckedUpdateManyInput>
    /**
     * Filter which Bases to update
     */
    where?: BaseWhereInput
    /**
     * Limit how many Bases to update.
     */
    limit?: number
  }

  /**
   * Base updateManyAndReturn
   */
  export type BaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * The data used to update Bases.
     */
    data: XOR<BaseUpdateManyMutationInput, BaseUncheckedUpdateManyInput>
    /**
     * Filter which Bases to update
     */
    where?: BaseWhereInput
    /**
     * Limit how many Bases to update.
     */
    limit?: number
  }

  /**
   * Base upsert
   */
  export type BaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Base to update in case it exists.
     */
    where: BaseWhereUniqueInput
    /**
     * In case the Base found by the `where` argument doesn't exist, create a new Base with this data.
     */
    create: XOR<BaseCreateInput, BaseUncheckedCreateInput>
    /**
     * In case the Base was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BaseUpdateInput, BaseUncheckedUpdateInput>
  }

  /**
   * Base delete
   */
  export type BaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    /**
     * Filter which Base to delete.
     */
    where: BaseWhereUniqueInput
  }

  /**
   * Base deleteMany
   */
  export type BaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bases to delete
     */
    where?: BaseWhereInput
    /**
     * Limit how many Bases to delete.
     */
    limit?: number
  }

  /**
   * Base.usuarios
   */
  export type Base$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Base.viagensOrigem
   */
  export type Base$viagensOrigemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    where?: ViagemWhereInput
    orderBy?: ViagemOrderByWithRelationInput | ViagemOrderByWithRelationInput[]
    cursor?: ViagemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ViagemScalarFieldEnum | ViagemScalarFieldEnum[]
  }

  /**
   * Base.viagensDestino
   */
  export type Base$viagensDestinoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    where?: ViagemWhereInput
    orderBy?: ViagemOrderByWithRelationInput | ViagemOrderByWithRelationInput[]
    cursor?: ViagemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ViagemScalarFieldEnum | ViagemScalarFieldEnum[]
  }

  /**
   * Base.justificativas
   */
  export type Base$justificativasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    where?: JustificativaAtrasoWhereInput
    orderBy?: JustificativaAtrasoOrderByWithRelationInput | JustificativaAtrasoOrderByWithRelationInput[]
    cursor?: JustificativaAtrasoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JustificativaAtrasoScalarFieldEnum | JustificativaAtrasoScalarFieldEnum[]
  }

  /**
   * Base.paradasPadrao
   */
  export type Base$paradasPadraoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    where?: ParadaPadraoWhereInput
    orderBy?: ParadaPadraoOrderByWithRelationInput | ParadaPadraoOrderByWithRelationInput[]
    cursor?: ParadaPadraoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParadaPadraoScalarFieldEnum | ParadaPadraoScalarFieldEnum[]
  }

  /**
   * Base.paradasViagem
   */
  export type Base$paradasViagemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    where?: ParadaViagemWhereInput
    orderBy?: ParadaViagemOrderByWithRelationInput | ParadaViagemOrderByWithRelationInput[]
    cursor?: ParadaViagemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParadaViagemScalarFieldEnum | ParadaViagemScalarFieldEnum[]
  }

  /**
   * Base without action
   */
  export type BaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    senhaHash: string | null
    role: $Enums.Role | null
    baseId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    senhaHash: string | null
    role: $Enums.Role | null
    baseId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    senhaHash: number
    role: number
    baseId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    senhaHash?: true
    role?: true
    baseId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    senhaHash?: true
    role?: true
    baseId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    senhaHash?: true
    role?: true
    baseId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string
    emailVerified: Date | null
    image: string | null
    senhaHash: string
    role: $Enums.Role
    baseId: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    senhaHash?: boolean
    role?: boolean
    baseId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    base?: boolean | User$baseArgs<ExtArgs>
    justificativas?: boolean | User$justificativasArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    senhaHash?: boolean
    role?: boolean
    baseId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    base?: boolean | User$baseArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    senhaHash?: boolean
    role?: boolean
    baseId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    base?: boolean | User$baseArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    senhaHash?: boolean
    role?: boolean
    baseId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "senhaHash" | "role" | "baseId" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    base?: boolean | User$baseArgs<ExtArgs>
    justificativas?: boolean | User$justificativasArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    base?: boolean | User$baseArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    base?: boolean | User$baseArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      base: Prisma.$BasePayload<ExtArgs> | null
      justificativas: Prisma.$JustificativaAtrasoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string
      emailVerified: Date | null
      image: string | null
      senhaHash: string
      role: $Enums.Role
      baseId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    base<T extends User$baseArgs<ExtArgs> = {}>(args?: Subset<T, User$baseArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    justificativas<T extends User$justificativasArgs<ExtArgs> = {}>(args?: Subset<T, User$justificativasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly senhaHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly baseId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.base
   */
  export type User$baseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    where?: BaseWhereInput
  }

  /**
   * User.justificativas
   */
  export type User$justificativasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    where?: JustificativaAtrasoWhereInput
    orderBy?: JustificativaAtrasoOrderByWithRelationInput | JustificativaAtrasoOrderByWithRelationInput[]
    cursor?: JustificativaAtrasoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JustificativaAtrasoScalarFieldEnum | JustificativaAtrasoScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Veiculo
   */

  export type AggregateVeiculo = {
    _count: VeiculoCountAggregateOutputType | null
    _min: VeiculoMinAggregateOutputType | null
    _max: VeiculoMaxAggregateOutputType | null
  }

  export type VeiculoMinAggregateOutputType = {
    id: string | null
    placa: string | null
    descricao: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VeiculoMaxAggregateOutputType = {
    id: string | null
    placa: string | null
    descricao: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VeiculoCountAggregateOutputType = {
    id: number
    placa: number
    descricao: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VeiculoMinAggregateInputType = {
    id?: true
    placa?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VeiculoMaxAggregateInputType = {
    id?: true
    placa?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VeiculoCountAggregateInputType = {
    id?: true
    placa?: true
    descricao?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VeiculoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Veiculo to aggregate.
     */
    where?: VeiculoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Veiculos to fetch.
     */
    orderBy?: VeiculoOrderByWithRelationInput | VeiculoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VeiculoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Veiculos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Veiculos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Veiculos
    **/
    _count?: true | VeiculoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VeiculoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VeiculoMaxAggregateInputType
  }

  export type GetVeiculoAggregateType<T extends VeiculoAggregateArgs> = {
        [P in keyof T & keyof AggregateVeiculo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVeiculo[P]>
      : GetScalarType<T[P], AggregateVeiculo[P]>
  }




  export type VeiculoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VeiculoWhereInput
    orderBy?: VeiculoOrderByWithAggregationInput | VeiculoOrderByWithAggregationInput[]
    by: VeiculoScalarFieldEnum[] | VeiculoScalarFieldEnum
    having?: VeiculoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VeiculoCountAggregateInputType | true
    _min?: VeiculoMinAggregateInputType
    _max?: VeiculoMaxAggregateInputType
  }

  export type VeiculoGroupByOutputType = {
    id: string
    placa: string
    descricao: string | null
    createdAt: Date
    updatedAt: Date
    _count: VeiculoCountAggregateOutputType | null
    _min: VeiculoMinAggregateOutputType | null
    _max: VeiculoMaxAggregateOutputType | null
  }

  type GetVeiculoGroupByPayload<T extends VeiculoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VeiculoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VeiculoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VeiculoGroupByOutputType[P]>
            : GetScalarType<T[P], VeiculoGroupByOutputType[P]>
        }
      >
    >


  export type VeiculoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    placa?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    viagens?: boolean | Veiculo$viagensArgs<ExtArgs>
    telemetrias?: boolean | Veiculo$telemetriasArgs<ExtArgs>
    _count?: boolean | VeiculoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["veiculo"]>

  export type VeiculoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    placa?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["veiculo"]>

  export type VeiculoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    placa?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["veiculo"]>

  export type VeiculoSelectScalar = {
    id?: boolean
    placa?: boolean
    descricao?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VeiculoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "placa" | "descricao" | "createdAt" | "updatedAt", ExtArgs["result"]["veiculo"]>
  export type VeiculoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viagens?: boolean | Veiculo$viagensArgs<ExtArgs>
    telemetrias?: boolean | Veiculo$telemetriasArgs<ExtArgs>
    _count?: boolean | VeiculoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VeiculoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VeiculoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VeiculoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Veiculo"
    objects: {
      viagens: Prisma.$ViagemPayload<ExtArgs>[]
      telemetrias: Prisma.$TelemetriaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      placa: string
      descricao: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["veiculo"]>
    composites: {}
  }

  type VeiculoGetPayload<S extends boolean | null | undefined | VeiculoDefaultArgs> = $Result.GetResult<Prisma.$VeiculoPayload, S>

  type VeiculoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VeiculoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VeiculoCountAggregateInputType | true
    }

  export interface VeiculoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Veiculo'], meta: { name: 'Veiculo' } }
    /**
     * Find zero or one Veiculo that matches the filter.
     * @param {VeiculoFindUniqueArgs} args - Arguments to find a Veiculo
     * @example
     * // Get one Veiculo
     * const veiculo = await prisma.veiculo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VeiculoFindUniqueArgs>(args: SelectSubset<T, VeiculoFindUniqueArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Veiculo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VeiculoFindUniqueOrThrowArgs} args - Arguments to find a Veiculo
     * @example
     * // Get one Veiculo
     * const veiculo = await prisma.veiculo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VeiculoFindUniqueOrThrowArgs>(args: SelectSubset<T, VeiculoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Veiculo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VeiculoFindFirstArgs} args - Arguments to find a Veiculo
     * @example
     * // Get one Veiculo
     * const veiculo = await prisma.veiculo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VeiculoFindFirstArgs>(args?: SelectSubset<T, VeiculoFindFirstArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Veiculo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VeiculoFindFirstOrThrowArgs} args - Arguments to find a Veiculo
     * @example
     * // Get one Veiculo
     * const veiculo = await prisma.veiculo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VeiculoFindFirstOrThrowArgs>(args?: SelectSubset<T, VeiculoFindFirstOrThrowArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Veiculos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VeiculoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Veiculos
     * const veiculos = await prisma.veiculo.findMany()
     * 
     * // Get first 10 Veiculos
     * const veiculos = await prisma.veiculo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const veiculoWithIdOnly = await prisma.veiculo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VeiculoFindManyArgs>(args?: SelectSubset<T, VeiculoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Veiculo.
     * @param {VeiculoCreateArgs} args - Arguments to create a Veiculo.
     * @example
     * // Create one Veiculo
     * const Veiculo = await prisma.veiculo.create({
     *   data: {
     *     // ... data to create a Veiculo
     *   }
     * })
     * 
     */
    create<T extends VeiculoCreateArgs>(args: SelectSubset<T, VeiculoCreateArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Veiculos.
     * @param {VeiculoCreateManyArgs} args - Arguments to create many Veiculos.
     * @example
     * // Create many Veiculos
     * const veiculo = await prisma.veiculo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VeiculoCreateManyArgs>(args?: SelectSubset<T, VeiculoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Veiculos and returns the data saved in the database.
     * @param {VeiculoCreateManyAndReturnArgs} args - Arguments to create many Veiculos.
     * @example
     * // Create many Veiculos
     * const veiculo = await prisma.veiculo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Veiculos and only return the `id`
     * const veiculoWithIdOnly = await prisma.veiculo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VeiculoCreateManyAndReturnArgs>(args?: SelectSubset<T, VeiculoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Veiculo.
     * @param {VeiculoDeleteArgs} args - Arguments to delete one Veiculo.
     * @example
     * // Delete one Veiculo
     * const Veiculo = await prisma.veiculo.delete({
     *   where: {
     *     // ... filter to delete one Veiculo
     *   }
     * })
     * 
     */
    delete<T extends VeiculoDeleteArgs>(args: SelectSubset<T, VeiculoDeleteArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Veiculo.
     * @param {VeiculoUpdateArgs} args - Arguments to update one Veiculo.
     * @example
     * // Update one Veiculo
     * const veiculo = await prisma.veiculo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VeiculoUpdateArgs>(args: SelectSubset<T, VeiculoUpdateArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Veiculos.
     * @param {VeiculoDeleteManyArgs} args - Arguments to filter Veiculos to delete.
     * @example
     * // Delete a few Veiculos
     * const { count } = await prisma.veiculo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VeiculoDeleteManyArgs>(args?: SelectSubset<T, VeiculoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Veiculos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VeiculoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Veiculos
     * const veiculo = await prisma.veiculo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VeiculoUpdateManyArgs>(args: SelectSubset<T, VeiculoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Veiculos and returns the data updated in the database.
     * @param {VeiculoUpdateManyAndReturnArgs} args - Arguments to update many Veiculos.
     * @example
     * // Update many Veiculos
     * const veiculo = await prisma.veiculo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Veiculos and only return the `id`
     * const veiculoWithIdOnly = await prisma.veiculo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VeiculoUpdateManyAndReturnArgs>(args: SelectSubset<T, VeiculoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Veiculo.
     * @param {VeiculoUpsertArgs} args - Arguments to update or create a Veiculo.
     * @example
     * // Update or create a Veiculo
     * const veiculo = await prisma.veiculo.upsert({
     *   create: {
     *     // ... data to create a Veiculo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Veiculo we want to update
     *   }
     * })
     */
    upsert<T extends VeiculoUpsertArgs>(args: SelectSubset<T, VeiculoUpsertArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Veiculos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VeiculoCountArgs} args - Arguments to filter Veiculos to count.
     * @example
     * // Count the number of Veiculos
     * const count = await prisma.veiculo.count({
     *   where: {
     *     // ... the filter for the Veiculos we want to count
     *   }
     * })
    **/
    count<T extends VeiculoCountArgs>(
      args?: Subset<T, VeiculoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VeiculoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Veiculo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VeiculoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VeiculoAggregateArgs>(args: Subset<T, VeiculoAggregateArgs>): Prisma.PrismaPromise<GetVeiculoAggregateType<T>>

    /**
     * Group by Veiculo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VeiculoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VeiculoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VeiculoGroupByArgs['orderBy'] }
        : { orderBy?: VeiculoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VeiculoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVeiculoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Veiculo model
   */
  readonly fields: VeiculoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Veiculo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VeiculoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    viagens<T extends Veiculo$viagensArgs<ExtArgs> = {}>(args?: Subset<T, Veiculo$viagensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    telemetrias<T extends Veiculo$telemetriasArgs<ExtArgs> = {}>(args?: Subset<T, Veiculo$telemetriasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Veiculo model
   */
  interface VeiculoFieldRefs {
    readonly id: FieldRef<"Veiculo", 'String'>
    readonly placa: FieldRef<"Veiculo", 'String'>
    readonly descricao: FieldRef<"Veiculo", 'String'>
    readonly createdAt: FieldRef<"Veiculo", 'DateTime'>
    readonly updatedAt: FieldRef<"Veiculo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Veiculo findUnique
   */
  export type VeiculoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * Filter, which Veiculo to fetch.
     */
    where: VeiculoWhereUniqueInput
  }

  /**
   * Veiculo findUniqueOrThrow
   */
  export type VeiculoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * Filter, which Veiculo to fetch.
     */
    where: VeiculoWhereUniqueInput
  }

  /**
   * Veiculo findFirst
   */
  export type VeiculoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * Filter, which Veiculo to fetch.
     */
    where?: VeiculoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Veiculos to fetch.
     */
    orderBy?: VeiculoOrderByWithRelationInput | VeiculoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Veiculos.
     */
    cursor?: VeiculoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Veiculos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Veiculos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Veiculos.
     */
    distinct?: VeiculoScalarFieldEnum | VeiculoScalarFieldEnum[]
  }

  /**
   * Veiculo findFirstOrThrow
   */
  export type VeiculoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * Filter, which Veiculo to fetch.
     */
    where?: VeiculoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Veiculos to fetch.
     */
    orderBy?: VeiculoOrderByWithRelationInput | VeiculoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Veiculos.
     */
    cursor?: VeiculoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Veiculos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Veiculos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Veiculos.
     */
    distinct?: VeiculoScalarFieldEnum | VeiculoScalarFieldEnum[]
  }

  /**
   * Veiculo findMany
   */
  export type VeiculoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * Filter, which Veiculos to fetch.
     */
    where?: VeiculoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Veiculos to fetch.
     */
    orderBy?: VeiculoOrderByWithRelationInput | VeiculoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Veiculos.
     */
    cursor?: VeiculoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Veiculos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Veiculos.
     */
    skip?: number
    distinct?: VeiculoScalarFieldEnum | VeiculoScalarFieldEnum[]
  }

  /**
   * Veiculo create
   */
  export type VeiculoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * The data needed to create a Veiculo.
     */
    data: XOR<VeiculoCreateInput, VeiculoUncheckedCreateInput>
  }

  /**
   * Veiculo createMany
   */
  export type VeiculoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Veiculos.
     */
    data: VeiculoCreateManyInput | VeiculoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Veiculo createManyAndReturn
   */
  export type VeiculoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * The data used to create many Veiculos.
     */
    data: VeiculoCreateManyInput | VeiculoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Veiculo update
   */
  export type VeiculoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * The data needed to update a Veiculo.
     */
    data: XOR<VeiculoUpdateInput, VeiculoUncheckedUpdateInput>
    /**
     * Choose, which Veiculo to update.
     */
    where: VeiculoWhereUniqueInput
  }

  /**
   * Veiculo updateMany
   */
  export type VeiculoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Veiculos.
     */
    data: XOR<VeiculoUpdateManyMutationInput, VeiculoUncheckedUpdateManyInput>
    /**
     * Filter which Veiculos to update
     */
    where?: VeiculoWhereInput
    /**
     * Limit how many Veiculos to update.
     */
    limit?: number
  }

  /**
   * Veiculo updateManyAndReturn
   */
  export type VeiculoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * The data used to update Veiculos.
     */
    data: XOR<VeiculoUpdateManyMutationInput, VeiculoUncheckedUpdateManyInput>
    /**
     * Filter which Veiculos to update
     */
    where?: VeiculoWhereInput
    /**
     * Limit how many Veiculos to update.
     */
    limit?: number
  }

  /**
   * Veiculo upsert
   */
  export type VeiculoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * The filter to search for the Veiculo to update in case it exists.
     */
    where: VeiculoWhereUniqueInput
    /**
     * In case the Veiculo found by the `where` argument doesn't exist, create a new Veiculo with this data.
     */
    create: XOR<VeiculoCreateInput, VeiculoUncheckedCreateInput>
    /**
     * In case the Veiculo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VeiculoUpdateInput, VeiculoUncheckedUpdateInput>
  }

  /**
   * Veiculo delete
   */
  export type VeiculoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
    /**
     * Filter which Veiculo to delete.
     */
    where: VeiculoWhereUniqueInput
  }

  /**
   * Veiculo deleteMany
   */
  export type VeiculoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Veiculos to delete
     */
    where?: VeiculoWhereInput
    /**
     * Limit how many Veiculos to delete.
     */
    limit?: number
  }

  /**
   * Veiculo.viagens
   */
  export type Veiculo$viagensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    where?: ViagemWhereInput
    orderBy?: ViagemOrderByWithRelationInput | ViagemOrderByWithRelationInput[]
    cursor?: ViagemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ViagemScalarFieldEnum | ViagemScalarFieldEnum[]
  }

  /**
   * Veiculo.telemetrias
   */
  export type Veiculo$telemetriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    where?: TelemetriaWhereInput
    orderBy?: TelemetriaOrderByWithRelationInput | TelemetriaOrderByWithRelationInput[]
    cursor?: TelemetriaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TelemetriaScalarFieldEnum | TelemetriaScalarFieldEnum[]
  }

  /**
   * Veiculo without action
   */
  export type VeiculoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Veiculo
     */
    select?: VeiculoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Veiculo
     */
    omit?: VeiculoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VeiculoInclude<ExtArgs> | null
  }


  /**
   * Model Viagem
   */

  export type AggregateViagem = {
    _count: ViagemCountAggregateOutputType | null
    _min: ViagemMinAggregateOutputType | null
    _max: ViagemMaxAggregateOutputType | null
  }

  export type ViagemMinAggregateOutputType = {
    id: string | null
    motorista: string | null
    rotaDescricao: string | null
    veiculoId: string | null
    baseOrigemId: string | null
    baseDestinoId: string | null
    status: $Enums.StatusViagem | null
    prevInicioReal: Date | null
    prevFimReal: Date | null
    dataInicioEfetivo: Date | null
    dataFimEfetivo: Date | null
    rotaPadraoId: string | null
    novaPrevisaoSaida: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ViagemMaxAggregateOutputType = {
    id: string | null
    motorista: string | null
    rotaDescricao: string | null
    veiculoId: string | null
    baseOrigemId: string | null
    baseDestinoId: string | null
    status: $Enums.StatusViagem | null
    prevInicioReal: Date | null
    prevFimReal: Date | null
    dataInicioEfetivo: Date | null
    dataFimEfetivo: Date | null
    rotaPadraoId: string | null
    novaPrevisaoSaida: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ViagemCountAggregateOutputType = {
    id: number
    motorista: number
    rotaDescricao: number
    veiculoId: number
    baseOrigemId: number
    baseDestinoId: number
    status: number
    prevInicioReal: number
    prevFimReal: number
    dataInicioEfetivo: number
    dataFimEfetivo: number
    rotaPadraoId: number
    novaPrevisaoSaida: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ViagemMinAggregateInputType = {
    id?: true
    motorista?: true
    rotaDescricao?: true
    veiculoId?: true
    baseOrigemId?: true
    baseDestinoId?: true
    status?: true
    prevInicioReal?: true
    prevFimReal?: true
    dataInicioEfetivo?: true
    dataFimEfetivo?: true
    rotaPadraoId?: true
    novaPrevisaoSaida?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ViagemMaxAggregateInputType = {
    id?: true
    motorista?: true
    rotaDescricao?: true
    veiculoId?: true
    baseOrigemId?: true
    baseDestinoId?: true
    status?: true
    prevInicioReal?: true
    prevFimReal?: true
    dataInicioEfetivo?: true
    dataFimEfetivo?: true
    rotaPadraoId?: true
    novaPrevisaoSaida?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ViagemCountAggregateInputType = {
    id?: true
    motorista?: true
    rotaDescricao?: true
    veiculoId?: true
    baseOrigemId?: true
    baseDestinoId?: true
    status?: true
    prevInicioReal?: true
    prevFimReal?: true
    dataInicioEfetivo?: true
    dataFimEfetivo?: true
    rotaPadraoId?: true
    novaPrevisaoSaida?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ViagemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Viagem to aggregate.
     */
    where?: ViagemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Viagems to fetch.
     */
    orderBy?: ViagemOrderByWithRelationInput | ViagemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ViagemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Viagems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Viagems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Viagems
    **/
    _count?: true | ViagemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ViagemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ViagemMaxAggregateInputType
  }

  export type GetViagemAggregateType<T extends ViagemAggregateArgs> = {
        [P in keyof T & keyof AggregateViagem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateViagem[P]>
      : GetScalarType<T[P], AggregateViagem[P]>
  }




  export type ViagemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ViagemWhereInput
    orderBy?: ViagemOrderByWithAggregationInput | ViagemOrderByWithAggregationInput[]
    by: ViagemScalarFieldEnum[] | ViagemScalarFieldEnum
    having?: ViagemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ViagemCountAggregateInputType | true
    _min?: ViagemMinAggregateInputType
    _max?: ViagemMaxAggregateInputType
  }

  export type ViagemGroupByOutputType = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    baseDestinoId: string
    status: $Enums.StatusViagem
    prevInicioReal: Date
    prevFimReal: Date
    dataInicioEfetivo: Date | null
    dataFimEfetivo: Date | null
    rotaPadraoId: string | null
    novaPrevisaoSaida: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ViagemCountAggregateOutputType | null
    _min: ViagemMinAggregateOutputType | null
    _max: ViagemMaxAggregateOutputType | null
  }

  type GetViagemGroupByPayload<T extends ViagemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ViagemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ViagemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ViagemGroupByOutputType[P]>
            : GetScalarType<T[P], ViagemGroupByOutputType[P]>
        }
      >
    >


  export type ViagemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motorista?: boolean
    rotaDescricao?: boolean
    veiculoId?: boolean
    baseOrigemId?: boolean
    baseDestinoId?: boolean
    status?: boolean
    prevInicioReal?: boolean
    prevFimReal?: boolean
    dataInicioEfetivo?: boolean
    dataFimEfetivo?: boolean
    rotaPadraoId?: boolean
    novaPrevisaoSaida?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    baseOrigem?: boolean | BaseDefaultArgs<ExtArgs>
    baseDestino?: boolean | BaseDefaultArgs<ExtArgs>
    rotaPadrao?: boolean | Viagem$rotaPadraoArgs<ExtArgs>
    paradasViagem?: boolean | Viagem$paradasViagemArgs<ExtArgs>
    justificativas?: boolean | Viagem$justificativasArgs<ExtArgs>
    telemetrias?: boolean | Viagem$telemetriasArgs<ExtArgs>
    _count?: boolean | ViagemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["viagem"]>

  export type ViagemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motorista?: boolean
    rotaDescricao?: boolean
    veiculoId?: boolean
    baseOrigemId?: boolean
    baseDestinoId?: boolean
    status?: boolean
    prevInicioReal?: boolean
    prevFimReal?: boolean
    dataInicioEfetivo?: boolean
    dataFimEfetivo?: boolean
    rotaPadraoId?: boolean
    novaPrevisaoSaida?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    baseOrigem?: boolean | BaseDefaultArgs<ExtArgs>
    baseDestino?: boolean | BaseDefaultArgs<ExtArgs>
    rotaPadrao?: boolean | Viagem$rotaPadraoArgs<ExtArgs>
  }, ExtArgs["result"]["viagem"]>

  export type ViagemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motorista?: boolean
    rotaDescricao?: boolean
    veiculoId?: boolean
    baseOrigemId?: boolean
    baseDestinoId?: boolean
    status?: boolean
    prevInicioReal?: boolean
    prevFimReal?: boolean
    dataInicioEfetivo?: boolean
    dataFimEfetivo?: boolean
    rotaPadraoId?: boolean
    novaPrevisaoSaida?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    baseOrigem?: boolean | BaseDefaultArgs<ExtArgs>
    baseDestino?: boolean | BaseDefaultArgs<ExtArgs>
    rotaPadrao?: boolean | Viagem$rotaPadraoArgs<ExtArgs>
  }, ExtArgs["result"]["viagem"]>

  export type ViagemSelectScalar = {
    id?: boolean
    motorista?: boolean
    rotaDescricao?: boolean
    veiculoId?: boolean
    baseOrigemId?: boolean
    baseDestinoId?: boolean
    status?: boolean
    prevInicioReal?: boolean
    prevFimReal?: boolean
    dataInicioEfetivo?: boolean
    dataFimEfetivo?: boolean
    rotaPadraoId?: boolean
    novaPrevisaoSaida?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ViagemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "motorista" | "rotaDescricao" | "veiculoId" | "baseOrigemId" | "baseDestinoId" | "status" | "prevInicioReal" | "prevFimReal" | "dataInicioEfetivo" | "dataFimEfetivo" | "rotaPadraoId" | "novaPrevisaoSaida" | "createdAt" | "updatedAt", ExtArgs["result"]["viagem"]>
  export type ViagemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    baseOrigem?: boolean | BaseDefaultArgs<ExtArgs>
    baseDestino?: boolean | BaseDefaultArgs<ExtArgs>
    rotaPadrao?: boolean | Viagem$rotaPadraoArgs<ExtArgs>
    paradasViagem?: boolean | Viagem$paradasViagemArgs<ExtArgs>
    justificativas?: boolean | Viagem$justificativasArgs<ExtArgs>
    telemetrias?: boolean | Viagem$telemetriasArgs<ExtArgs>
    _count?: boolean | ViagemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ViagemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    baseOrigem?: boolean | BaseDefaultArgs<ExtArgs>
    baseDestino?: boolean | BaseDefaultArgs<ExtArgs>
    rotaPadrao?: boolean | Viagem$rotaPadraoArgs<ExtArgs>
  }
  export type ViagemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    baseOrigem?: boolean | BaseDefaultArgs<ExtArgs>
    baseDestino?: boolean | BaseDefaultArgs<ExtArgs>
    rotaPadrao?: boolean | Viagem$rotaPadraoArgs<ExtArgs>
  }

  export type $ViagemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Viagem"
    objects: {
      veiculo: Prisma.$VeiculoPayload<ExtArgs>
      baseOrigem: Prisma.$BasePayload<ExtArgs>
      baseDestino: Prisma.$BasePayload<ExtArgs>
      rotaPadrao: Prisma.$RotaPadraoPayload<ExtArgs> | null
      paradasViagem: Prisma.$ParadaViagemPayload<ExtArgs>[]
      justificativas: Prisma.$JustificativaAtrasoPayload<ExtArgs>[]
      telemetrias: Prisma.$TelemetriaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      motorista: string
      rotaDescricao: string
      veiculoId: string
      baseOrigemId: string
      baseDestinoId: string
      status: $Enums.StatusViagem
      prevInicioReal: Date
      prevFimReal: Date
      dataInicioEfetivo: Date | null
      dataFimEfetivo: Date | null
      rotaPadraoId: string | null
      novaPrevisaoSaida: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["viagem"]>
    composites: {}
  }

  type ViagemGetPayload<S extends boolean | null | undefined | ViagemDefaultArgs> = $Result.GetResult<Prisma.$ViagemPayload, S>

  type ViagemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ViagemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ViagemCountAggregateInputType | true
    }

  export interface ViagemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Viagem'], meta: { name: 'Viagem' } }
    /**
     * Find zero or one Viagem that matches the filter.
     * @param {ViagemFindUniqueArgs} args - Arguments to find a Viagem
     * @example
     * // Get one Viagem
     * const viagem = await prisma.viagem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ViagemFindUniqueArgs>(args: SelectSubset<T, ViagemFindUniqueArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Viagem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ViagemFindUniqueOrThrowArgs} args - Arguments to find a Viagem
     * @example
     * // Get one Viagem
     * const viagem = await prisma.viagem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ViagemFindUniqueOrThrowArgs>(args: SelectSubset<T, ViagemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Viagem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViagemFindFirstArgs} args - Arguments to find a Viagem
     * @example
     * // Get one Viagem
     * const viagem = await prisma.viagem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ViagemFindFirstArgs>(args?: SelectSubset<T, ViagemFindFirstArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Viagem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViagemFindFirstOrThrowArgs} args - Arguments to find a Viagem
     * @example
     * // Get one Viagem
     * const viagem = await prisma.viagem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ViagemFindFirstOrThrowArgs>(args?: SelectSubset<T, ViagemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Viagems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViagemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Viagems
     * const viagems = await prisma.viagem.findMany()
     * 
     * // Get first 10 Viagems
     * const viagems = await prisma.viagem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const viagemWithIdOnly = await prisma.viagem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ViagemFindManyArgs>(args?: SelectSubset<T, ViagemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Viagem.
     * @param {ViagemCreateArgs} args - Arguments to create a Viagem.
     * @example
     * // Create one Viagem
     * const Viagem = await prisma.viagem.create({
     *   data: {
     *     // ... data to create a Viagem
     *   }
     * })
     * 
     */
    create<T extends ViagemCreateArgs>(args: SelectSubset<T, ViagemCreateArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Viagems.
     * @param {ViagemCreateManyArgs} args - Arguments to create many Viagems.
     * @example
     * // Create many Viagems
     * const viagem = await prisma.viagem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ViagemCreateManyArgs>(args?: SelectSubset<T, ViagemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Viagems and returns the data saved in the database.
     * @param {ViagemCreateManyAndReturnArgs} args - Arguments to create many Viagems.
     * @example
     * // Create many Viagems
     * const viagem = await prisma.viagem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Viagems and only return the `id`
     * const viagemWithIdOnly = await prisma.viagem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ViagemCreateManyAndReturnArgs>(args?: SelectSubset<T, ViagemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Viagem.
     * @param {ViagemDeleteArgs} args - Arguments to delete one Viagem.
     * @example
     * // Delete one Viagem
     * const Viagem = await prisma.viagem.delete({
     *   where: {
     *     // ... filter to delete one Viagem
     *   }
     * })
     * 
     */
    delete<T extends ViagemDeleteArgs>(args: SelectSubset<T, ViagemDeleteArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Viagem.
     * @param {ViagemUpdateArgs} args - Arguments to update one Viagem.
     * @example
     * // Update one Viagem
     * const viagem = await prisma.viagem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ViagemUpdateArgs>(args: SelectSubset<T, ViagemUpdateArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Viagems.
     * @param {ViagemDeleteManyArgs} args - Arguments to filter Viagems to delete.
     * @example
     * // Delete a few Viagems
     * const { count } = await prisma.viagem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ViagemDeleteManyArgs>(args?: SelectSubset<T, ViagemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Viagems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViagemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Viagems
     * const viagem = await prisma.viagem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ViagemUpdateManyArgs>(args: SelectSubset<T, ViagemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Viagems and returns the data updated in the database.
     * @param {ViagemUpdateManyAndReturnArgs} args - Arguments to update many Viagems.
     * @example
     * // Update many Viagems
     * const viagem = await prisma.viagem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Viagems and only return the `id`
     * const viagemWithIdOnly = await prisma.viagem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ViagemUpdateManyAndReturnArgs>(args: SelectSubset<T, ViagemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Viagem.
     * @param {ViagemUpsertArgs} args - Arguments to update or create a Viagem.
     * @example
     * // Update or create a Viagem
     * const viagem = await prisma.viagem.upsert({
     *   create: {
     *     // ... data to create a Viagem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Viagem we want to update
     *   }
     * })
     */
    upsert<T extends ViagemUpsertArgs>(args: SelectSubset<T, ViagemUpsertArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Viagems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViagemCountArgs} args - Arguments to filter Viagems to count.
     * @example
     * // Count the number of Viagems
     * const count = await prisma.viagem.count({
     *   where: {
     *     // ... the filter for the Viagems we want to count
     *   }
     * })
    **/
    count<T extends ViagemCountArgs>(
      args?: Subset<T, ViagemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ViagemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Viagem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViagemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ViagemAggregateArgs>(args: Subset<T, ViagemAggregateArgs>): Prisma.PrismaPromise<GetViagemAggregateType<T>>

    /**
     * Group by Viagem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ViagemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ViagemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ViagemGroupByArgs['orderBy'] }
        : { orderBy?: ViagemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ViagemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetViagemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Viagem model
   */
  readonly fields: ViagemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Viagem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ViagemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    veiculo<T extends VeiculoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VeiculoDefaultArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    baseOrigem<T extends BaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BaseDefaultArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    baseDestino<T extends BaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BaseDefaultArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    rotaPadrao<T extends Viagem$rotaPadraoArgs<ExtArgs> = {}>(args?: Subset<T, Viagem$rotaPadraoArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    paradasViagem<T extends Viagem$paradasViagemArgs<ExtArgs> = {}>(args?: Subset<T, Viagem$paradasViagemArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    justificativas<T extends Viagem$justificativasArgs<ExtArgs> = {}>(args?: Subset<T, Viagem$justificativasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    telemetrias<T extends Viagem$telemetriasArgs<ExtArgs> = {}>(args?: Subset<T, Viagem$telemetriasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Viagem model
   */
  interface ViagemFieldRefs {
    readonly id: FieldRef<"Viagem", 'String'>
    readonly motorista: FieldRef<"Viagem", 'String'>
    readonly rotaDescricao: FieldRef<"Viagem", 'String'>
    readonly veiculoId: FieldRef<"Viagem", 'String'>
    readonly baseOrigemId: FieldRef<"Viagem", 'String'>
    readonly baseDestinoId: FieldRef<"Viagem", 'String'>
    readonly status: FieldRef<"Viagem", 'StatusViagem'>
    readonly prevInicioReal: FieldRef<"Viagem", 'DateTime'>
    readonly prevFimReal: FieldRef<"Viagem", 'DateTime'>
    readonly dataInicioEfetivo: FieldRef<"Viagem", 'DateTime'>
    readonly dataFimEfetivo: FieldRef<"Viagem", 'DateTime'>
    readonly rotaPadraoId: FieldRef<"Viagem", 'String'>
    readonly novaPrevisaoSaida: FieldRef<"Viagem", 'DateTime'>
    readonly createdAt: FieldRef<"Viagem", 'DateTime'>
    readonly updatedAt: FieldRef<"Viagem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Viagem findUnique
   */
  export type ViagemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * Filter, which Viagem to fetch.
     */
    where: ViagemWhereUniqueInput
  }

  /**
   * Viagem findUniqueOrThrow
   */
  export type ViagemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * Filter, which Viagem to fetch.
     */
    where: ViagemWhereUniqueInput
  }

  /**
   * Viagem findFirst
   */
  export type ViagemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * Filter, which Viagem to fetch.
     */
    where?: ViagemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Viagems to fetch.
     */
    orderBy?: ViagemOrderByWithRelationInput | ViagemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Viagems.
     */
    cursor?: ViagemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Viagems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Viagems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Viagems.
     */
    distinct?: ViagemScalarFieldEnum | ViagemScalarFieldEnum[]
  }

  /**
   * Viagem findFirstOrThrow
   */
  export type ViagemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * Filter, which Viagem to fetch.
     */
    where?: ViagemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Viagems to fetch.
     */
    orderBy?: ViagemOrderByWithRelationInput | ViagemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Viagems.
     */
    cursor?: ViagemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Viagems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Viagems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Viagems.
     */
    distinct?: ViagemScalarFieldEnum | ViagemScalarFieldEnum[]
  }

  /**
   * Viagem findMany
   */
  export type ViagemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * Filter, which Viagems to fetch.
     */
    where?: ViagemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Viagems to fetch.
     */
    orderBy?: ViagemOrderByWithRelationInput | ViagemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Viagems.
     */
    cursor?: ViagemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Viagems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Viagems.
     */
    skip?: number
    distinct?: ViagemScalarFieldEnum | ViagemScalarFieldEnum[]
  }

  /**
   * Viagem create
   */
  export type ViagemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * The data needed to create a Viagem.
     */
    data: XOR<ViagemCreateInput, ViagemUncheckedCreateInput>
  }

  /**
   * Viagem createMany
   */
  export type ViagemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Viagems.
     */
    data: ViagemCreateManyInput | ViagemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Viagem createManyAndReturn
   */
  export type ViagemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * The data used to create many Viagems.
     */
    data: ViagemCreateManyInput | ViagemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Viagem update
   */
  export type ViagemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * The data needed to update a Viagem.
     */
    data: XOR<ViagemUpdateInput, ViagemUncheckedUpdateInput>
    /**
     * Choose, which Viagem to update.
     */
    where: ViagemWhereUniqueInput
  }

  /**
   * Viagem updateMany
   */
  export type ViagemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Viagems.
     */
    data: XOR<ViagemUpdateManyMutationInput, ViagemUncheckedUpdateManyInput>
    /**
     * Filter which Viagems to update
     */
    where?: ViagemWhereInput
    /**
     * Limit how many Viagems to update.
     */
    limit?: number
  }

  /**
   * Viagem updateManyAndReturn
   */
  export type ViagemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * The data used to update Viagems.
     */
    data: XOR<ViagemUpdateManyMutationInput, ViagemUncheckedUpdateManyInput>
    /**
     * Filter which Viagems to update
     */
    where?: ViagemWhereInput
    /**
     * Limit how many Viagems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Viagem upsert
   */
  export type ViagemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * The filter to search for the Viagem to update in case it exists.
     */
    where: ViagemWhereUniqueInput
    /**
     * In case the Viagem found by the `where` argument doesn't exist, create a new Viagem with this data.
     */
    create: XOR<ViagemCreateInput, ViagemUncheckedCreateInput>
    /**
     * In case the Viagem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ViagemUpdateInput, ViagemUncheckedUpdateInput>
  }

  /**
   * Viagem delete
   */
  export type ViagemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    /**
     * Filter which Viagem to delete.
     */
    where: ViagemWhereUniqueInput
  }

  /**
   * Viagem deleteMany
   */
  export type ViagemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Viagems to delete
     */
    where?: ViagemWhereInput
    /**
     * Limit how many Viagems to delete.
     */
    limit?: number
  }

  /**
   * Viagem.rotaPadrao
   */
  export type Viagem$rotaPadraoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    where?: RotaPadraoWhereInput
  }

  /**
   * Viagem.paradasViagem
   */
  export type Viagem$paradasViagemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    where?: ParadaViagemWhereInput
    orderBy?: ParadaViagemOrderByWithRelationInput | ParadaViagemOrderByWithRelationInput[]
    cursor?: ParadaViagemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParadaViagemScalarFieldEnum | ParadaViagemScalarFieldEnum[]
  }

  /**
   * Viagem.justificativas
   */
  export type Viagem$justificativasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    where?: JustificativaAtrasoWhereInput
    orderBy?: JustificativaAtrasoOrderByWithRelationInput | JustificativaAtrasoOrderByWithRelationInput[]
    cursor?: JustificativaAtrasoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JustificativaAtrasoScalarFieldEnum | JustificativaAtrasoScalarFieldEnum[]
  }

  /**
   * Viagem.telemetrias
   */
  export type Viagem$telemetriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    where?: TelemetriaWhereInput
    orderBy?: TelemetriaOrderByWithRelationInput | TelemetriaOrderByWithRelationInput[]
    cursor?: TelemetriaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TelemetriaScalarFieldEnum | TelemetriaScalarFieldEnum[]
  }

  /**
   * Viagem without action
   */
  export type ViagemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
  }


  /**
   * Model JustificativaAtraso
   */

  export type AggregateJustificativaAtraso = {
    _count: JustificativaAtrasoCountAggregateOutputType | null
    _avg: JustificativaAtrasoAvgAggregateOutputType | null
    _sum: JustificativaAtrasoSumAggregateOutputType | null
    _min: JustificativaAtrasoMinAggregateOutputType | null
    _max: JustificativaAtrasoMaxAggregateOutputType | null
  }

  export type JustificativaAtrasoAvgAggregateOutputType = {
    tempoAtrasoMinutos: number | null
  }

  export type JustificativaAtrasoSumAggregateOutputType = {
    tempoAtrasoMinutos: number | null
  }

  export type JustificativaAtrasoMinAggregateOutputType = {
    id: string | null
    viagemId: string | null
    tipoAtraso: $Enums.TipoAtraso | null
    motivo: string | null
    usuarioId: string | null
    baseId: string | null
    tempoAtrasoMinutos: number | null
    createdAt: Date | null
  }

  export type JustificativaAtrasoMaxAggregateOutputType = {
    id: string | null
    viagemId: string | null
    tipoAtraso: $Enums.TipoAtraso | null
    motivo: string | null
    usuarioId: string | null
    baseId: string | null
    tempoAtrasoMinutos: number | null
    createdAt: Date | null
  }

  export type JustificativaAtrasoCountAggregateOutputType = {
    id: number
    viagemId: number
    tipoAtraso: number
    motivo: number
    usuarioId: number
    baseId: number
    tempoAtrasoMinutos: number
    createdAt: number
    _all: number
  }


  export type JustificativaAtrasoAvgAggregateInputType = {
    tempoAtrasoMinutos?: true
  }

  export type JustificativaAtrasoSumAggregateInputType = {
    tempoAtrasoMinutos?: true
  }

  export type JustificativaAtrasoMinAggregateInputType = {
    id?: true
    viagemId?: true
    tipoAtraso?: true
    motivo?: true
    usuarioId?: true
    baseId?: true
    tempoAtrasoMinutos?: true
    createdAt?: true
  }

  export type JustificativaAtrasoMaxAggregateInputType = {
    id?: true
    viagemId?: true
    tipoAtraso?: true
    motivo?: true
    usuarioId?: true
    baseId?: true
    tempoAtrasoMinutos?: true
    createdAt?: true
  }

  export type JustificativaAtrasoCountAggregateInputType = {
    id?: true
    viagemId?: true
    tipoAtraso?: true
    motivo?: true
    usuarioId?: true
    baseId?: true
    tempoAtrasoMinutos?: true
    createdAt?: true
    _all?: true
  }

  export type JustificativaAtrasoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JustificativaAtraso to aggregate.
     */
    where?: JustificativaAtrasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JustificativaAtrasos to fetch.
     */
    orderBy?: JustificativaAtrasoOrderByWithRelationInput | JustificativaAtrasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JustificativaAtrasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JustificativaAtrasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JustificativaAtrasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JustificativaAtrasos
    **/
    _count?: true | JustificativaAtrasoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: JustificativaAtrasoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: JustificativaAtrasoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JustificativaAtrasoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JustificativaAtrasoMaxAggregateInputType
  }

  export type GetJustificativaAtrasoAggregateType<T extends JustificativaAtrasoAggregateArgs> = {
        [P in keyof T & keyof AggregateJustificativaAtraso]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJustificativaAtraso[P]>
      : GetScalarType<T[P], AggregateJustificativaAtraso[P]>
  }




  export type JustificativaAtrasoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JustificativaAtrasoWhereInput
    orderBy?: JustificativaAtrasoOrderByWithAggregationInput | JustificativaAtrasoOrderByWithAggregationInput[]
    by: JustificativaAtrasoScalarFieldEnum[] | JustificativaAtrasoScalarFieldEnum
    having?: JustificativaAtrasoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JustificativaAtrasoCountAggregateInputType | true
    _avg?: JustificativaAtrasoAvgAggregateInputType
    _sum?: JustificativaAtrasoSumAggregateInputType
    _min?: JustificativaAtrasoMinAggregateInputType
    _max?: JustificativaAtrasoMaxAggregateInputType
  }

  export type JustificativaAtrasoGroupByOutputType = {
    id: string
    viagemId: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    usuarioId: string
    baseId: string | null
    tempoAtrasoMinutos: number
    createdAt: Date
    _count: JustificativaAtrasoCountAggregateOutputType | null
    _avg: JustificativaAtrasoAvgAggregateOutputType | null
    _sum: JustificativaAtrasoSumAggregateOutputType | null
    _min: JustificativaAtrasoMinAggregateOutputType | null
    _max: JustificativaAtrasoMaxAggregateOutputType | null
  }

  type GetJustificativaAtrasoGroupByPayload<T extends JustificativaAtrasoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JustificativaAtrasoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JustificativaAtrasoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JustificativaAtrasoGroupByOutputType[P]>
            : GetScalarType<T[P], JustificativaAtrasoGroupByOutputType[P]>
        }
      >
    >


  export type JustificativaAtrasoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viagemId?: boolean
    tipoAtraso?: boolean
    motivo?: boolean
    usuarioId?: boolean
    baseId?: boolean
    tempoAtrasoMinutos?: boolean
    createdAt?: boolean
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    base?: boolean | JustificativaAtraso$baseArgs<ExtArgs>
  }, ExtArgs["result"]["justificativaAtraso"]>

  export type JustificativaAtrasoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viagemId?: boolean
    tipoAtraso?: boolean
    motivo?: boolean
    usuarioId?: boolean
    baseId?: boolean
    tempoAtrasoMinutos?: boolean
    createdAt?: boolean
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    base?: boolean | JustificativaAtraso$baseArgs<ExtArgs>
  }, ExtArgs["result"]["justificativaAtraso"]>

  export type JustificativaAtrasoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viagemId?: boolean
    tipoAtraso?: boolean
    motivo?: boolean
    usuarioId?: boolean
    baseId?: boolean
    tempoAtrasoMinutos?: boolean
    createdAt?: boolean
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    base?: boolean | JustificativaAtraso$baseArgs<ExtArgs>
  }, ExtArgs["result"]["justificativaAtraso"]>

  export type JustificativaAtrasoSelectScalar = {
    id?: boolean
    viagemId?: boolean
    tipoAtraso?: boolean
    motivo?: boolean
    usuarioId?: boolean
    baseId?: boolean
    tempoAtrasoMinutos?: boolean
    createdAt?: boolean
  }

  export type JustificativaAtrasoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "viagemId" | "tipoAtraso" | "motivo" | "usuarioId" | "baseId" | "tempoAtrasoMinutos" | "createdAt", ExtArgs["result"]["justificativaAtraso"]>
  export type JustificativaAtrasoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    base?: boolean | JustificativaAtraso$baseArgs<ExtArgs>
  }
  export type JustificativaAtrasoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    base?: boolean | JustificativaAtraso$baseArgs<ExtArgs>
  }
  export type JustificativaAtrasoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    usuario?: boolean | UserDefaultArgs<ExtArgs>
    base?: boolean | JustificativaAtraso$baseArgs<ExtArgs>
  }

  export type $JustificativaAtrasoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JustificativaAtraso"
    objects: {
      viagem: Prisma.$ViagemPayload<ExtArgs>
      usuario: Prisma.$UserPayload<ExtArgs>
      base: Prisma.$BasePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      viagemId: string
      tipoAtraso: $Enums.TipoAtraso
      motivo: string
      usuarioId: string
      baseId: string | null
      tempoAtrasoMinutos: number
      createdAt: Date
    }, ExtArgs["result"]["justificativaAtraso"]>
    composites: {}
  }

  type JustificativaAtrasoGetPayload<S extends boolean | null | undefined | JustificativaAtrasoDefaultArgs> = $Result.GetResult<Prisma.$JustificativaAtrasoPayload, S>

  type JustificativaAtrasoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JustificativaAtrasoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JustificativaAtrasoCountAggregateInputType | true
    }

  export interface JustificativaAtrasoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JustificativaAtraso'], meta: { name: 'JustificativaAtraso' } }
    /**
     * Find zero or one JustificativaAtraso that matches the filter.
     * @param {JustificativaAtrasoFindUniqueArgs} args - Arguments to find a JustificativaAtraso
     * @example
     * // Get one JustificativaAtraso
     * const justificativaAtraso = await prisma.justificativaAtraso.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JustificativaAtrasoFindUniqueArgs>(args: SelectSubset<T, JustificativaAtrasoFindUniqueArgs<ExtArgs>>): Prisma__JustificativaAtrasoClient<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JustificativaAtraso that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JustificativaAtrasoFindUniqueOrThrowArgs} args - Arguments to find a JustificativaAtraso
     * @example
     * // Get one JustificativaAtraso
     * const justificativaAtraso = await prisma.justificativaAtraso.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JustificativaAtrasoFindUniqueOrThrowArgs>(args: SelectSubset<T, JustificativaAtrasoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JustificativaAtrasoClient<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JustificativaAtraso that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JustificativaAtrasoFindFirstArgs} args - Arguments to find a JustificativaAtraso
     * @example
     * // Get one JustificativaAtraso
     * const justificativaAtraso = await prisma.justificativaAtraso.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JustificativaAtrasoFindFirstArgs>(args?: SelectSubset<T, JustificativaAtrasoFindFirstArgs<ExtArgs>>): Prisma__JustificativaAtrasoClient<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JustificativaAtraso that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JustificativaAtrasoFindFirstOrThrowArgs} args - Arguments to find a JustificativaAtraso
     * @example
     * // Get one JustificativaAtraso
     * const justificativaAtraso = await prisma.justificativaAtraso.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JustificativaAtrasoFindFirstOrThrowArgs>(args?: SelectSubset<T, JustificativaAtrasoFindFirstOrThrowArgs<ExtArgs>>): Prisma__JustificativaAtrasoClient<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JustificativaAtrasos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JustificativaAtrasoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JustificativaAtrasos
     * const justificativaAtrasos = await prisma.justificativaAtraso.findMany()
     * 
     * // Get first 10 JustificativaAtrasos
     * const justificativaAtrasos = await prisma.justificativaAtraso.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const justificativaAtrasoWithIdOnly = await prisma.justificativaAtraso.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JustificativaAtrasoFindManyArgs>(args?: SelectSubset<T, JustificativaAtrasoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JustificativaAtraso.
     * @param {JustificativaAtrasoCreateArgs} args - Arguments to create a JustificativaAtraso.
     * @example
     * // Create one JustificativaAtraso
     * const JustificativaAtraso = await prisma.justificativaAtraso.create({
     *   data: {
     *     // ... data to create a JustificativaAtraso
     *   }
     * })
     * 
     */
    create<T extends JustificativaAtrasoCreateArgs>(args: SelectSubset<T, JustificativaAtrasoCreateArgs<ExtArgs>>): Prisma__JustificativaAtrasoClient<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JustificativaAtrasos.
     * @param {JustificativaAtrasoCreateManyArgs} args - Arguments to create many JustificativaAtrasos.
     * @example
     * // Create many JustificativaAtrasos
     * const justificativaAtraso = await prisma.justificativaAtraso.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JustificativaAtrasoCreateManyArgs>(args?: SelectSubset<T, JustificativaAtrasoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JustificativaAtrasos and returns the data saved in the database.
     * @param {JustificativaAtrasoCreateManyAndReturnArgs} args - Arguments to create many JustificativaAtrasos.
     * @example
     * // Create many JustificativaAtrasos
     * const justificativaAtraso = await prisma.justificativaAtraso.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JustificativaAtrasos and only return the `id`
     * const justificativaAtrasoWithIdOnly = await prisma.justificativaAtraso.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JustificativaAtrasoCreateManyAndReturnArgs>(args?: SelectSubset<T, JustificativaAtrasoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JustificativaAtraso.
     * @param {JustificativaAtrasoDeleteArgs} args - Arguments to delete one JustificativaAtraso.
     * @example
     * // Delete one JustificativaAtraso
     * const JustificativaAtraso = await prisma.justificativaAtraso.delete({
     *   where: {
     *     // ... filter to delete one JustificativaAtraso
     *   }
     * })
     * 
     */
    delete<T extends JustificativaAtrasoDeleteArgs>(args: SelectSubset<T, JustificativaAtrasoDeleteArgs<ExtArgs>>): Prisma__JustificativaAtrasoClient<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JustificativaAtraso.
     * @param {JustificativaAtrasoUpdateArgs} args - Arguments to update one JustificativaAtraso.
     * @example
     * // Update one JustificativaAtraso
     * const justificativaAtraso = await prisma.justificativaAtraso.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JustificativaAtrasoUpdateArgs>(args: SelectSubset<T, JustificativaAtrasoUpdateArgs<ExtArgs>>): Prisma__JustificativaAtrasoClient<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JustificativaAtrasos.
     * @param {JustificativaAtrasoDeleteManyArgs} args - Arguments to filter JustificativaAtrasos to delete.
     * @example
     * // Delete a few JustificativaAtrasos
     * const { count } = await prisma.justificativaAtraso.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JustificativaAtrasoDeleteManyArgs>(args?: SelectSubset<T, JustificativaAtrasoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JustificativaAtrasos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JustificativaAtrasoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JustificativaAtrasos
     * const justificativaAtraso = await prisma.justificativaAtraso.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JustificativaAtrasoUpdateManyArgs>(args: SelectSubset<T, JustificativaAtrasoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JustificativaAtrasos and returns the data updated in the database.
     * @param {JustificativaAtrasoUpdateManyAndReturnArgs} args - Arguments to update many JustificativaAtrasos.
     * @example
     * // Update many JustificativaAtrasos
     * const justificativaAtraso = await prisma.justificativaAtraso.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JustificativaAtrasos and only return the `id`
     * const justificativaAtrasoWithIdOnly = await prisma.justificativaAtraso.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JustificativaAtrasoUpdateManyAndReturnArgs>(args: SelectSubset<T, JustificativaAtrasoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JustificativaAtraso.
     * @param {JustificativaAtrasoUpsertArgs} args - Arguments to update or create a JustificativaAtraso.
     * @example
     * // Update or create a JustificativaAtraso
     * const justificativaAtraso = await prisma.justificativaAtraso.upsert({
     *   create: {
     *     // ... data to create a JustificativaAtraso
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JustificativaAtraso we want to update
     *   }
     * })
     */
    upsert<T extends JustificativaAtrasoUpsertArgs>(args: SelectSubset<T, JustificativaAtrasoUpsertArgs<ExtArgs>>): Prisma__JustificativaAtrasoClient<$Result.GetResult<Prisma.$JustificativaAtrasoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JustificativaAtrasos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JustificativaAtrasoCountArgs} args - Arguments to filter JustificativaAtrasos to count.
     * @example
     * // Count the number of JustificativaAtrasos
     * const count = await prisma.justificativaAtraso.count({
     *   where: {
     *     // ... the filter for the JustificativaAtrasos we want to count
     *   }
     * })
    **/
    count<T extends JustificativaAtrasoCountArgs>(
      args?: Subset<T, JustificativaAtrasoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JustificativaAtrasoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JustificativaAtraso.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JustificativaAtrasoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JustificativaAtrasoAggregateArgs>(args: Subset<T, JustificativaAtrasoAggregateArgs>): Prisma.PrismaPromise<GetJustificativaAtrasoAggregateType<T>>

    /**
     * Group by JustificativaAtraso.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JustificativaAtrasoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JustificativaAtrasoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JustificativaAtrasoGroupByArgs['orderBy'] }
        : { orderBy?: JustificativaAtrasoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JustificativaAtrasoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJustificativaAtrasoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JustificativaAtraso model
   */
  readonly fields: JustificativaAtrasoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JustificativaAtraso.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JustificativaAtrasoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    viagem<T extends ViagemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ViagemDefaultArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    usuario<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    base<T extends JustificativaAtraso$baseArgs<ExtArgs> = {}>(args?: Subset<T, JustificativaAtraso$baseArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JustificativaAtraso model
   */
  interface JustificativaAtrasoFieldRefs {
    readonly id: FieldRef<"JustificativaAtraso", 'String'>
    readonly viagemId: FieldRef<"JustificativaAtraso", 'String'>
    readonly tipoAtraso: FieldRef<"JustificativaAtraso", 'TipoAtraso'>
    readonly motivo: FieldRef<"JustificativaAtraso", 'String'>
    readonly usuarioId: FieldRef<"JustificativaAtraso", 'String'>
    readonly baseId: FieldRef<"JustificativaAtraso", 'String'>
    readonly tempoAtrasoMinutos: FieldRef<"JustificativaAtraso", 'Int'>
    readonly createdAt: FieldRef<"JustificativaAtraso", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JustificativaAtraso findUnique
   */
  export type JustificativaAtrasoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * Filter, which JustificativaAtraso to fetch.
     */
    where: JustificativaAtrasoWhereUniqueInput
  }

  /**
   * JustificativaAtraso findUniqueOrThrow
   */
  export type JustificativaAtrasoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * Filter, which JustificativaAtraso to fetch.
     */
    where: JustificativaAtrasoWhereUniqueInput
  }

  /**
   * JustificativaAtraso findFirst
   */
  export type JustificativaAtrasoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * Filter, which JustificativaAtraso to fetch.
     */
    where?: JustificativaAtrasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JustificativaAtrasos to fetch.
     */
    orderBy?: JustificativaAtrasoOrderByWithRelationInput | JustificativaAtrasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JustificativaAtrasos.
     */
    cursor?: JustificativaAtrasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JustificativaAtrasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JustificativaAtrasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JustificativaAtrasos.
     */
    distinct?: JustificativaAtrasoScalarFieldEnum | JustificativaAtrasoScalarFieldEnum[]
  }

  /**
   * JustificativaAtraso findFirstOrThrow
   */
  export type JustificativaAtrasoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * Filter, which JustificativaAtraso to fetch.
     */
    where?: JustificativaAtrasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JustificativaAtrasos to fetch.
     */
    orderBy?: JustificativaAtrasoOrderByWithRelationInput | JustificativaAtrasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JustificativaAtrasos.
     */
    cursor?: JustificativaAtrasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JustificativaAtrasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JustificativaAtrasos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JustificativaAtrasos.
     */
    distinct?: JustificativaAtrasoScalarFieldEnum | JustificativaAtrasoScalarFieldEnum[]
  }

  /**
   * JustificativaAtraso findMany
   */
  export type JustificativaAtrasoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * Filter, which JustificativaAtrasos to fetch.
     */
    where?: JustificativaAtrasoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JustificativaAtrasos to fetch.
     */
    orderBy?: JustificativaAtrasoOrderByWithRelationInput | JustificativaAtrasoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JustificativaAtrasos.
     */
    cursor?: JustificativaAtrasoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JustificativaAtrasos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JustificativaAtrasos.
     */
    skip?: number
    distinct?: JustificativaAtrasoScalarFieldEnum | JustificativaAtrasoScalarFieldEnum[]
  }

  /**
   * JustificativaAtraso create
   */
  export type JustificativaAtrasoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * The data needed to create a JustificativaAtraso.
     */
    data: XOR<JustificativaAtrasoCreateInput, JustificativaAtrasoUncheckedCreateInput>
  }

  /**
   * JustificativaAtraso createMany
   */
  export type JustificativaAtrasoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JustificativaAtrasos.
     */
    data: JustificativaAtrasoCreateManyInput | JustificativaAtrasoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JustificativaAtraso createManyAndReturn
   */
  export type JustificativaAtrasoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * The data used to create many JustificativaAtrasos.
     */
    data: JustificativaAtrasoCreateManyInput | JustificativaAtrasoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JustificativaAtraso update
   */
  export type JustificativaAtrasoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * The data needed to update a JustificativaAtraso.
     */
    data: XOR<JustificativaAtrasoUpdateInput, JustificativaAtrasoUncheckedUpdateInput>
    /**
     * Choose, which JustificativaAtraso to update.
     */
    where: JustificativaAtrasoWhereUniqueInput
  }

  /**
   * JustificativaAtraso updateMany
   */
  export type JustificativaAtrasoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JustificativaAtrasos.
     */
    data: XOR<JustificativaAtrasoUpdateManyMutationInput, JustificativaAtrasoUncheckedUpdateManyInput>
    /**
     * Filter which JustificativaAtrasos to update
     */
    where?: JustificativaAtrasoWhereInput
    /**
     * Limit how many JustificativaAtrasos to update.
     */
    limit?: number
  }

  /**
   * JustificativaAtraso updateManyAndReturn
   */
  export type JustificativaAtrasoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * The data used to update JustificativaAtrasos.
     */
    data: XOR<JustificativaAtrasoUpdateManyMutationInput, JustificativaAtrasoUncheckedUpdateManyInput>
    /**
     * Filter which JustificativaAtrasos to update
     */
    where?: JustificativaAtrasoWhereInput
    /**
     * Limit how many JustificativaAtrasos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * JustificativaAtraso upsert
   */
  export type JustificativaAtrasoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * The filter to search for the JustificativaAtraso to update in case it exists.
     */
    where: JustificativaAtrasoWhereUniqueInput
    /**
     * In case the JustificativaAtraso found by the `where` argument doesn't exist, create a new JustificativaAtraso with this data.
     */
    create: XOR<JustificativaAtrasoCreateInput, JustificativaAtrasoUncheckedCreateInput>
    /**
     * In case the JustificativaAtraso was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JustificativaAtrasoUpdateInput, JustificativaAtrasoUncheckedUpdateInput>
  }

  /**
   * JustificativaAtraso delete
   */
  export type JustificativaAtrasoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
    /**
     * Filter which JustificativaAtraso to delete.
     */
    where: JustificativaAtrasoWhereUniqueInput
  }

  /**
   * JustificativaAtraso deleteMany
   */
  export type JustificativaAtrasoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JustificativaAtrasos to delete
     */
    where?: JustificativaAtrasoWhereInput
    /**
     * Limit how many JustificativaAtrasos to delete.
     */
    limit?: number
  }

  /**
   * JustificativaAtraso.base
   */
  export type JustificativaAtraso$baseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Base
     */
    select?: BaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Base
     */
    omit?: BaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BaseInclude<ExtArgs> | null
    where?: BaseWhereInput
  }

  /**
   * JustificativaAtraso without action
   */
  export type JustificativaAtrasoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JustificativaAtraso
     */
    select?: JustificativaAtrasoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JustificativaAtraso
     */
    omit?: JustificativaAtrasoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JustificativaAtrasoInclude<ExtArgs> | null
  }


  /**
   * Model Telemetria
   */

  export type AggregateTelemetria = {
    _count: TelemetriaCountAggregateOutputType | null
    _avg: TelemetriaAvgAggregateOutputType | null
    _sum: TelemetriaSumAggregateOutputType | null
    _min: TelemetriaMinAggregateOutputType | null
    _max: TelemetriaMaxAggregateOutputType | null
  }

  export type TelemetriaAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    velocidade: number | null
  }

  export type TelemetriaSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
    velocidade: number | null
  }

  export type TelemetriaMinAggregateOutputType = {
    id: string | null
    veiculoId: string | null
    viagemId: string | null
    latitude: number | null
    longitude: number | null
    ignicao: boolean | null
    velocidade: number | null
    dataHoraUtc: Date | null
    dataHoraLocal: Date | null
    createdAt: Date | null
  }

  export type TelemetriaMaxAggregateOutputType = {
    id: string | null
    veiculoId: string | null
    viagemId: string | null
    latitude: number | null
    longitude: number | null
    ignicao: boolean | null
    velocidade: number | null
    dataHoraUtc: Date | null
    dataHoraLocal: Date | null
    createdAt: Date | null
  }

  export type TelemetriaCountAggregateOutputType = {
    id: number
    veiculoId: number
    viagemId: number
    latitude: number
    longitude: number
    ignicao: number
    velocidade: number
    dataHoraUtc: number
    dataHoraLocal: number
    createdAt: number
    _all: number
  }


  export type TelemetriaAvgAggregateInputType = {
    latitude?: true
    longitude?: true
    velocidade?: true
  }

  export type TelemetriaSumAggregateInputType = {
    latitude?: true
    longitude?: true
    velocidade?: true
  }

  export type TelemetriaMinAggregateInputType = {
    id?: true
    veiculoId?: true
    viagemId?: true
    latitude?: true
    longitude?: true
    ignicao?: true
    velocidade?: true
    dataHoraUtc?: true
    dataHoraLocal?: true
    createdAt?: true
  }

  export type TelemetriaMaxAggregateInputType = {
    id?: true
    veiculoId?: true
    viagemId?: true
    latitude?: true
    longitude?: true
    ignicao?: true
    velocidade?: true
    dataHoraUtc?: true
    dataHoraLocal?: true
    createdAt?: true
  }

  export type TelemetriaCountAggregateInputType = {
    id?: true
    veiculoId?: true
    viagemId?: true
    latitude?: true
    longitude?: true
    ignicao?: true
    velocidade?: true
    dataHoraUtc?: true
    dataHoraLocal?: true
    createdAt?: true
    _all?: true
  }

  export type TelemetriaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Telemetria to aggregate.
     */
    where?: TelemetriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Telemetrias to fetch.
     */
    orderBy?: TelemetriaOrderByWithRelationInput | TelemetriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TelemetriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Telemetrias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Telemetrias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Telemetrias
    **/
    _count?: true | TelemetriaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TelemetriaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TelemetriaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TelemetriaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TelemetriaMaxAggregateInputType
  }

  export type GetTelemetriaAggregateType<T extends TelemetriaAggregateArgs> = {
        [P in keyof T & keyof AggregateTelemetria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTelemetria[P]>
      : GetScalarType<T[P], AggregateTelemetria[P]>
  }




  export type TelemetriaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TelemetriaWhereInput
    orderBy?: TelemetriaOrderByWithAggregationInput | TelemetriaOrderByWithAggregationInput[]
    by: TelemetriaScalarFieldEnum[] | TelemetriaScalarFieldEnum
    having?: TelemetriaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TelemetriaCountAggregateInputType | true
    _avg?: TelemetriaAvgAggregateInputType
    _sum?: TelemetriaSumAggregateInputType
    _min?: TelemetriaMinAggregateInputType
    _max?: TelemetriaMaxAggregateInputType
  }

  export type TelemetriaGroupByOutputType = {
    id: string
    veiculoId: string
    viagemId: string | null
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade: number | null
    dataHoraUtc: Date
    dataHoraLocal: Date
    createdAt: Date
    _count: TelemetriaCountAggregateOutputType | null
    _avg: TelemetriaAvgAggregateOutputType | null
    _sum: TelemetriaSumAggregateOutputType | null
    _min: TelemetriaMinAggregateOutputType | null
    _max: TelemetriaMaxAggregateOutputType | null
  }

  type GetTelemetriaGroupByPayload<T extends TelemetriaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TelemetriaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TelemetriaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TelemetriaGroupByOutputType[P]>
            : GetScalarType<T[P], TelemetriaGroupByOutputType[P]>
        }
      >
    >


  export type TelemetriaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    veiculoId?: boolean
    viagemId?: boolean
    latitude?: boolean
    longitude?: boolean
    ignicao?: boolean
    velocidade?: boolean
    dataHoraUtc?: boolean
    dataHoraLocal?: boolean
    createdAt?: boolean
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    viagem?: boolean | Telemetria$viagemArgs<ExtArgs>
  }, ExtArgs["result"]["telemetria"]>

  export type TelemetriaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    veiculoId?: boolean
    viagemId?: boolean
    latitude?: boolean
    longitude?: boolean
    ignicao?: boolean
    velocidade?: boolean
    dataHoraUtc?: boolean
    dataHoraLocal?: boolean
    createdAt?: boolean
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    viagem?: boolean | Telemetria$viagemArgs<ExtArgs>
  }, ExtArgs["result"]["telemetria"]>

  export type TelemetriaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    veiculoId?: boolean
    viagemId?: boolean
    latitude?: boolean
    longitude?: boolean
    ignicao?: boolean
    velocidade?: boolean
    dataHoraUtc?: boolean
    dataHoraLocal?: boolean
    createdAt?: boolean
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    viagem?: boolean | Telemetria$viagemArgs<ExtArgs>
  }, ExtArgs["result"]["telemetria"]>

  export type TelemetriaSelectScalar = {
    id?: boolean
    veiculoId?: boolean
    viagemId?: boolean
    latitude?: boolean
    longitude?: boolean
    ignicao?: boolean
    velocidade?: boolean
    dataHoraUtc?: boolean
    dataHoraLocal?: boolean
    createdAt?: boolean
  }

  export type TelemetriaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "veiculoId" | "viagemId" | "latitude" | "longitude" | "ignicao" | "velocidade" | "dataHoraUtc" | "dataHoraLocal" | "createdAt", ExtArgs["result"]["telemetria"]>
  export type TelemetriaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    viagem?: boolean | Telemetria$viagemArgs<ExtArgs>
  }
  export type TelemetriaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    viagem?: boolean | Telemetria$viagemArgs<ExtArgs>
  }
  export type TelemetriaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    veiculo?: boolean | VeiculoDefaultArgs<ExtArgs>
    viagem?: boolean | Telemetria$viagemArgs<ExtArgs>
  }

  export type $TelemetriaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Telemetria"
    objects: {
      veiculo: Prisma.$VeiculoPayload<ExtArgs>
      viagem: Prisma.$ViagemPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      veiculoId: string
      viagemId: string | null
      latitude: number
      longitude: number
      ignicao: boolean
      velocidade: number | null
      dataHoraUtc: Date
      dataHoraLocal: Date
      createdAt: Date
    }, ExtArgs["result"]["telemetria"]>
    composites: {}
  }

  type TelemetriaGetPayload<S extends boolean | null | undefined | TelemetriaDefaultArgs> = $Result.GetResult<Prisma.$TelemetriaPayload, S>

  type TelemetriaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TelemetriaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TelemetriaCountAggregateInputType | true
    }

  export interface TelemetriaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Telemetria'], meta: { name: 'Telemetria' } }
    /**
     * Find zero or one Telemetria that matches the filter.
     * @param {TelemetriaFindUniqueArgs} args - Arguments to find a Telemetria
     * @example
     * // Get one Telemetria
     * const telemetria = await prisma.telemetria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TelemetriaFindUniqueArgs>(args: SelectSubset<T, TelemetriaFindUniqueArgs<ExtArgs>>): Prisma__TelemetriaClient<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Telemetria that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TelemetriaFindUniqueOrThrowArgs} args - Arguments to find a Telemetria
     * @example
     * // Get one Telemetria
     * const telemetria = await prisma.telemetria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TelemetriaFindUniqueOrThrowArgs>(args: SelectSubset<T, TelemetriaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TelemetriaClient<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Telemetria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetriaFindFirstArgs} args - Arguments to find a Telemetria
     * @example
     * // Get one Telemetria
     * const telemetria = await prisma.telemetria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TelemetriaFindFirstArgs>(args?: SelectSubset<T, TelemetriaFindFirstArgs<ExtArgs>>): Prisma__TelemetriaClient<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Telemetria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetriaFindFirstOrThrowArgs} args - Arguments to find a Telemetria
     * @example
     * // Get one Telemetria
     * const telemetria = await prisma.telemetria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TelemetriaFindFirstOrThrowArgs>(args?: SelectSubset<T, TelemetriaFindFirstOrThrowArgs<ExtArgs>>): Prisma__TelemetriaClient<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Telemetrias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetriaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Telemetrias
     * const telemetrias = await prisma.telemetria.findMany()
     * 
     * // Get first 10 Telemetrias
     * const telemetrias = await prisma.telemetria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const telemetriaWithIdOnly = await prisma.telemetria.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TelemetriaFindManyArgs>(args?: SelectSubset<T, TelemetriaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Telemetria.
     * @param {TelemetriaCreateArgs} args - Arguments to create a Telemetria.
     * @example
     * // Create one Telemetria
     * const Telemetria = await prisma.telemetria.create({
     *   data: {
     *     // ... data to create a Telemetria
     *   }
     * })
     * 
     */
    create<T extends TelemetriaCreateArgs>(args: SelectSubset<T, TelemetriaCreateArgs<ExtArgs>>): Prisma__TelemetriaClient<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Telemetrias.
     * @param {TelemetriaCreateManyArgs} args - Arguments to create many Telemetrias.
     * @example
     * // Create many Telemetrias
     * const telemetria = await prisma.telemetria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TelemetriaCreateManyArgs>(args?: SelectSubset<T, TelemetriaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Telemetrias and returns the data saved in the database.
     * @param {TelemetriaCreateManyAndReturnArgs} args - Arguments to create many Telemetrias.
     * @example
     * // Create many Telemetrias
     * const telemetria = await prisma.telemetria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Telemetrias and only return the `id`
     * const telemetriaWithIdOnly = await prisma.telemetria.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TelemetriaCreateManyAndReturnArgs>(args?: SelectSubset<T, TelemetriaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Telemetria.
     * @param {TelemetriaDeleteArgs} args - Arguments to delete one Telemetria.
     * @example
     * // Delete one Telemetria
     * const Telemetria = await prisma.telemetria.delete({
     *   where: {
     *     // ... filter to delete one Telemetria
     *   }
     * })
     * 
     */
    delete<T extends TelemetriaDeleteArgs>(args: SelectSubset<T, TelemetriaDeleteArgs<ExtArgs>>): Prisma__TelemetriaClient<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Telemetria.
     * @param {TelemetriaUpdateArgs} args - Arguments to update one Telemetria.
     * @example
     * // Update one Telemetria
     * const telemetria = await prisma.telemetria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TelemetriaUpdateArgs>(args: SelectSubset<T, TelemetriaUpdateArgs<ExtArgs>>): Prisma__TelemetriaClient<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Telemetrias.
     * @param {TelemetriaDeleteManyArgs} args - Arguments to filter Telemetrias to delete.
     * @example
     * // Delete a few Telemetrias
     * const { count } = await prisma.telemetria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TelemetriaDeleteManyArgs>(args?: SelectSubset<T, TelemetriaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Telemetrias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetriaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Telemetrias
     * const telemetria = await prisma.telemetria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TelemetriaUpdateManyArgs>(args: SelectSubset<T, TelemetriaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Telemetrias and returns the data updated in the database.
     * @param {TelemetriaUpdateManyAndReturnArgs} args - Arguments to update many Telemetrias.
     * @example
     * // Update many Telemetrias
     * const telemetria = await prisma.telemetria.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Telemetrias and only return the `id`
     * const telemetriaWithIdOnly = await prisma.telemetria.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TelemetriaUpdateManyAndReturnArgs>(args: SelectSubset<T, TelemetriaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Telemetria.
     * @param {TelemetriaUpsertArgs} args - Arguments to update or create a Telemetria.
     * @example
     * // Update or create a Telemetria
     * const telemetria = await prisma.telemetria.upsert({
     *   create: {
     *     // ... data to create a Telemetria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Telemetria we want to update
     *   }
     * })
     */
    upsert<T extends TelemetriaUpsertArgs>(args: SelectSubset<T, TelemetriaUpsertArgs<ExtArgs>>): Prisma__TelemetriaClient<$Result.GetResult<Prisma.$TelemetriaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Telemetrias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetriaCountArgs} args - Arguments to filter Telemetrias to count.
     * @example
     * // Count the number of Telemetrias
     * const count = await prisma.telemetria.count({
     *   where: {
     *     // ... the filter for the Telemetrias we want to count
     *   }
     * })
    **/
    count<T extends TelemetriaCountArgs>(
      args?: Subset<T, TelemetriaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TelemetriaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Telemetria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetriaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TelemetriaAggregateArgs>(args: Subset<T, TelemetriaAggregateArgs>): Prisma.PrismaPromise<GetTelemetriaAggregateType<T>>

    /**
     * Group by Telemetria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TelemetriaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TelemetriaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TelemetriaGroupByArgs['orderBy'] }
        : { orderBy?: TelemetriaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TelemetriaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTelemetriaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Telemetria model
   */
  readonly fields: TelemetriaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Telemetria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TelemetriaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    veiculo<T extends VeiculoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VeiculoDefaultArgs<ExtArgs>>): Prisma__VeiculoClient<$Result.GetResult<Prisma.$VeiculoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    viagem<T extends Telemetria$viagemArgs<ExtArgs> = {}>(args?: Subset<T, Telemetria$viagemArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Telemetria model
   */
  interface TelemetriaFieldRefs {
    readonly id: FieldRef<"Telemetria", 'String'>
    readonly veiculoId: FieldRef<"Telemetria", 'String'>
    readonly viagemId: FieldRef<"Telemetria", 'String'>
    readonly latitude: FieldRef<"Telemetria", 'Float'>
    readonly longitude: FieldRef<"Telemetria", 'Float'>
    readonly ignicao: FieldRef<"Telemetria", 'Boolean'>
    readonly velocidade: FieldRef<"Telemetria", 'Int'>
    readonly dataHoraUtc: FieldRef<"Telemetria", 'DateTime'>
    readonly dataHoraLocal: FieldRef<"Telemetria", 'DateTime'>
    readonly createdAt: FieldRef<"Telemetria", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Telemetria findUnique
   */
  export type TelemetriaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * Filter, which Telemetria to fetch.
     */
    where: TelemetriaWhereUniqueInput
  }

  /**
   * Telemetria findUniqueOrThrow
   */
  export type TelemetriaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * Filter, which Telemetria to fetch.
     */
    where: TelemetriaWhereUniqueInput
  }

  /**
   * Telemetria findFirst
   */
  export type TelemetriaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * Filter, which Telemetria to fetch.
     */
    where?: TelemetriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Telemetrias to fetch.
     */
    orderBy?: TelemetriaOrderByWithRelationInput | TelemetriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Telemetrias.
     */
    cursor?: TelemetriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Telemetrias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Telemetrias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Telemetrias.
     */
    distinct?: TelemetriaScalarFieldEnum | TelemetriaScalarFieldEnum[]
  }

  /**
   * Telemetria findFirstOrThrow
   */
  export type TelemetriaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * Filter, which Telemetria to fetch.
     */
    where?: TelemetriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Telemetrias to fetch.
     */
    orderBy?: TelemetriaOrderByWithRelationInput | TelemetriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Telemetrias.
     */
    cursor?: TelemetriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Telemetrias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Telemetrias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Telemetrias.
     */
    distinct?: TelemetriaScalarFieldEnum | TelemetriaScalarFieldEnum[]
  }

  /**
   * Telemetria findMany
   */
  export type TelemetriaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * Filter, which Telemetrias to fetch.
     */
    where?: TelemetriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Telemetrias to fetch.
     */
    orderBy?: TelemetriaOrderByWithRelationInput | TelemetriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Telemetrias.
     */
    cursor?: TelemetriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Telemetrias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Telemetrias.
     */
    skip?: number
    distinct?: TelemetriaScalarFieldEnum | TelemetriaScalarFieldEnum[]
  }

  /**
   * Telemetria create
   */
  export type TelemetriaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * The data needed to create a Telemetria.
     */
    data: XOR<TelemetriaCreateInput, TelemetriaUncheckedCreateInput>
  }

  /**
   * Telemetria createMany
   */
  export type TelemetriaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Telemetrias.
     */
    data: TelemetriaCreateManyInput | TelemetriaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Telemetria createManyAndReturn
   */
  export type TelemetriaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * The data used to create many Telemetrias.
     */
    data: TelemetriaCreateManyInput | TelemetriaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Telemetria update
   */
  export type TelemetriaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * The data needed to update a Telemetria.
     */
    data: XOR<TelemetriaUpdateInput, TelemetriaUncheckedUpdateInput>
    /**
     * Choose, which Telemetria to update.
     */
    where: TelemetriaWhereUniqueInput
  }

  /**
   * Telemetria updateMany
   */
  export type TelemetriaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Telemetrias.
     */
    data: XOR<TelemetriaUpdateManyMutationInput, TelemetriaUncheckedUpdateManyInput>
    /**
     * Filter which Telemetrias to update
     */
    where?: TelemetriaWhereInput
    /**
     * Limit how many Telemetrias to update.
     */
    limit?: number
  }

  /**
   * Telemetria updateManyAndReturn
   */
  export type TelemetriaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * The data used to update Telemetrias.
     */
    data: XOR<TelemetriaUpdateManyMutationInput, TelemetriaUncheckedUpdateManyInput>
    /**
     * Filter which Telemetrias to update
     */
    where?: TelemetriaWhereInput
    /**
     * Limit how many Telemetrias to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Telemetria upsert
   */
  export type TelemetriaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * The filter to search for the Telemetria to update in case it exists.
     */
    where: TelemetriaWhereUniqueInput
    /**
     * In case the Telemetria found by the `where` argument doesn't exist, create a new Telemetria with this data.
     */
    create: XOR<TelemetriaCreateInput, TelemetriaUncheckedCreateInput>
    /**
     * In case the Telemetria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TelemetriaUpdateInput, TelemetriaUncheckedUpdateInput>
  }

  /**
   * Telemetria delete
   */
  export type TelemetriaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
    /**
     * Filter which Telemetria to delete.
     */
    where: TelemetriaWhereUniqueInput
  }

  /**
   * Telemetria deleteMany
   */
  export type TelemetriaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Telemetrias to delete
     */
    where?: TelemetriaWhereInput
    /**
     * Limit how many Telemetrias to delete.
     */
    limit?: number
  }

  /**
   * Telemetria.viagem
   */
  export type Telemetria$viagemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    where?: ViagemWhereInput
  }

  /**
   * Telemetria without action
   */
  export type TelemetriaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Telemetria
     */
    select?: TelemetriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Telemetria
     */
    omit?: TelemetriaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TelemetriaInclude<ExtArgs> | null
  }


  /**
   * Model RotaPadrao
   */

  export type AggregateRotaPadrao = {
    _count: RotaPadraoCountAggregateOutputType | null
    _min: RotaPadraoMinAggregateOutputType | null
    _max: RotaPadraoMaxAggregateOutputType | null
  }

  export type RotaPadraoMinAggregateOutputType = {
    id: string | null
    nome: string | null
  }

  export type RotaPadraoMaxAggregateOutputType = {
    id: string | null
    nome: string | null
  }

  export type RotaPadraoCountAggregateOutputType = {
    id: number
    nome: number
    _all: number
  }


  export type RotaPadraoMinAggregateInputType = {
    id?: true
    nome?: true
  }

  export type RotaPadraoMaxAggregateInputType = {
    id?: true
    nome?: true
  }

  export type RotaPadraoCountAggregateInputType = {
    id?: true
    nome?: true
    _all?: true
  }

  export type RotaPadraoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RotaPadrao to aggregate.
     */
    where?: RotaPadraoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RotaPadraos to fetch.
     */
    orderBy?: RotaPadraoOrderByWithRelationInput | RotaPadraoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RotaPadraoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RotaPadraos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RotaPadraos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RotaPadraos
    **/
    _count?: true | RotaPadraoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RotaPadraoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RotaPadraoMaxAggregateInputType
  }

  export type GetRotaPadraoAggregateType<T extends RotaPadraoAggregateArgs> = {
        [P in keyof T & keyof AggregateRotaPadrao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRotaPadrao[P]>
      : GetScalarType<T[P], AggregateRotaPadrao[P]>
  }




  export type RotaPadraoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RotaPadraoWhereInput
    orderBy?: RotaPadraoOrderByWithAggregationInput | RotaPadraoOrderByWithAggregationInput[]
    by: RotaPadraoScalarFieldEnum[] | RotaPadraoScalarFieldEnum
    having?: RotaPadraoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RotaPadraoCountAggregateInputType | true
    _min?: RotaPadraoMinAggregateInputType
    _max?: RotaPadraoMaxAggregateInputType
  }

  export type RotaPadraoGroupByOutputType = {
    id: string
    nome: string
    _count: RotaPadraoCountAggregateOutputType | null
    _min: RotaPadraoMinAggregateOutputType | null
    _max: RotaPadraoMaxAggregateOutputType | null
  }

  type GetRotaPadraoGroupByPayload<T extends RotaPadraoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RotaPadraoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RotaPadraoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RotaPadraoGroupByOutputType[P]>
            : GetScalarType<T[P], RotaPadraoGroupByOutputType[P]>
        }
      >
    >


  export type RotaPadraoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    paradas?: boolean | RotaPadrao$paradasArgs<ExtArgs>
    viagens?: boolean | RotaPadrao$viagensArgs<ExtArgs>
    _count?: boolean | RotaPadraoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rotaPadrao"]>

  export type RotaPadraoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
  }, ExtArgs["result"]["rotaPadrao"]>

  export type RotaPadraoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
  }, ExtArgs["result"]["rotaPadrao"]>

  export type RotaPadraoSelectScalar = {
    id?: boolean
    nome?: boolean
  }

  export type RotaPadraoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome", ExtArgs["result"]["rotaPadrao"]>
  export type RotaPadraoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paradas?: boolean | RotaPadrao$paradasArgs<ExtArgs>
    viagens?: boolean | RotaPadrao$viagensArgs<ExtArgs>
    _count?: boolean | RotaPadraoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RotaPadraoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RotaPadraoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RotaPadraoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RotaPadrao"
    objects: {
      paradas: Prisma.$ParadaPadraoPayload<ExtArgs>[]
      viagens: Prisma.$ViagemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
    }, ExtArgs["result"]["rotaPadrao"]>
    composites: {}
  }

  type RotaPadraoGetPayload<S extends boolean | null | undefined | RotaPadraoDefaultArgs> = $Result.GetResult<Prisma.$RotaPadraoPayload, S>

  type RotaPadraoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RotaPadraoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RotaPadraoCountAggregateInputType | true
    }

  export interface RotaPadraoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RotaPadrao'], meta: { name: 'RotaPadrao' } }
    /**
     * Find zero or one RotaPadrao that matches the filter.
     * @param {RotaPadraoFindUniqueArgs} args - Arguments to find a RotaPadrao
     * @example
     * // Get one RotaPadrao
     * const rotaPadrao = await prisma.rotaPadrao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RotaPadraoFindUniqueArgs>(args: SelectSubset<T, RotaPadraoFindUniqueArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RotaPadrao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RotaPadraoFindUniqueOrThrowArgs} args - Arguments to find a RotaPadrao
     * @example
     * // Get one RotaPadrao
     * const rotaPadrao = await prisma.rotaPadrao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RotaPadraoFindUniqueOrThrowArgs>(args: SelectSubset<T, RotaPadraoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RotaPadrao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RotaPadraoFindFirstArgs} args - Arguments to find a RotaPadrao
     * @example
     * // Get one RotaPadrao
     * const rotaPadrao = await prisma.rotaPadrao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RotaPadraoFindFirstArgs>(args?: SelectSubset<T, RotaPadraoFindFirstArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RotaPadrao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RotaPadraoFindFirstOrThrowArgs} args - Arguments to find a RotaPadrao
     * @example
     * // Get one RotaPadrao
     * const rotaPadrao = await prisma.rotaPadrao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RotaPadraoFindFirstOrThrowArgs>(args?: SelectSubset<T, RotaPadraoFindFirstOrThrowArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RotaPadraos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RotaPadraoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RotaPadraos
     * const rotaPadraos = await prisma.rotaPadrao.findMany()
     * 
     * // Get first 10 RotaPadraos
     * const rotaPadraos = await prisma.rotaPadrao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rotaPadraoWithIdOnly = await prisma.rotaPadrao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RotaPadraoFindManyArgs>(args?: SelectSubset<T, RotaPadraoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RotaPadrao.
     * @param {RotaPadraoCreateArgs} args - Arguments to create a RotaPadrao.
     * @example
     * // Create one RotaPadrao
     * const RotaPadrao = await prisma.rotaPadrao.create({
     *   data: {
     *     // ... data to create a RotaPadrao
     *   }
     * })
     * 
     */
    create<T extends RotaPadraoCreateArgs>(args: SelectSubset<T, RotaPadraoCreateArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RotaPadraos.
     * @param {RotaPadraoCreateManyArgs} args - Arguments to create many RotaPadraos.
     * @example
     * // Create many RotaPadraos
     * const rotaPadrao = await prisma.rotaPadrao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RotaPadraoCreateManyArgs>(args?: SelectSubset<T, RotaPadraoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RotaPadraos and returns the data saved in the database.
     * @param {RotaPadraoCreateManyAndReturnArgs} args - Arguments to create many RotaPadraos.
     * @example
     * // Create many RotaPadraos
     * const rotaPadrao = await prisma.rotaPadrao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RotaPadraos and only return the `id`
     * const rotaPadraoWithIdOnly = await prisma.rotaPadrao.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RotaPadraoCreateManyAndReturnArgs>(args?: SelectSubset<T, RotaPadraoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RotaPadrao.
     * @param {RotaPadraoDeleteArgs} args - Arguments to delete one RotaPadrao.
     * @example
     * // Delete one RotaPadrao
     * const RotaPadrao = await prisma.rotaPadrao.delete({
     *   where: {
     *     // ... filter to delete one RotaPadrao
     *   }
     * })
     * 
     */
    delete<T extends RotaPadraoDeleteArgs>(args: SelectSubset<T, RotaPadraoDeleteArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RotaPadrao.
     * @param {RotaPadraoUpdateArgs} args - Arguments to update one RotaPadrao.
     * @example
     * // Update one RotaPadrao
     * const rotaPadrao = await prisma.rotaPadrao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RotaPadraoUpdateArgs>(args: SelectSubset<T, RotaPadraoUpdateArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RotaPadraos.
     * @param {RotaPadraoDeleteManyArgs} args - Arguments to filter RotaPadraos to delete.
     * @example
     * // Delete a few RotaPadraos
     * const { count } = await prisma.rotaPadrao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RotaPadraoDeleteManyArgs>(args?: SelectSubset<T, RotaPadraoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RotaPadraos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RotaPadraoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RotaPadraos
     * const rotaPadrao = await prisma.rotaPadrao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RotaPadraoUpdateManyArgs>(args: SelectSubset<T, RotaPadraoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RotaPadraos and returns the data updated in the database.
     * @param {RotaPadraoUpdateManyAndReturnArgs} args - Arguments to update many RotaPadraos.
     * @example
     * // Update many RotaPadraos
     * const rotaPadrao = await prisma.rotaPadrao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RotaPadraos and only return the `id`
     * const rotaPadraoWithIdOnly = await prisma.rotaPadrao.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RotaPadraoUpdateManyAndReturnArgs>(args: SelectSubset<T, RotaPadraoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RotaPadrao.
     * @param {RotaPadraoUpsertArgs} args - Arguments to update or create a RotaPadrao.
     * @example
     * // Update or create a RotaPadrao
     * const rotaPadrao = await prisma.rotaPadrao.upsert({
     *   create: {
     *     // ... data to create a RotaPadrao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RotaPadrao we want to update
     *   }
     * })
     */
    upsert<T extends RotaPadraoUpsertArgs>(args: SelectSubset<T, RotaPadraoUpsertArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RotaPadraos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RotaPadraoCountArgs} args - Arguments to filter RotaPadraos to count.
     * @example
     * // Count the number of RotaPadraos
     * const count = await prisma.rotaPadrao.count({
     *   where: {
     *     // ... the filter for the RotaPadraos we want to count
     *   }
     * })
    **/
    count<T extends RotaPadraoCountArgs>(
      args?: Subset<T, RotaPadraoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RotaPadraoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RotaPadrao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RotaPadraoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RotaPadraoAggregateArgs>(args: Subset<T, RotaPadraoAggregateArgs>): Prisma.PrismaPromise<GetRotaPadraoAggregateType<T>>

    /**
     * Group by RotaPadrao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RotaPadraoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RotaPadraoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RotaPadraoGroupByArgs['orderBy'] }
        : { orderBy?: RotaPadraoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RotaPadraoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRotaPadraoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RotaPadrao model
   */
  readonly fields: RotaPadraoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RotaPadrao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RotaPadraoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    paradas<T extends RotaPadrao$paradasArgs<ExtArgs> = {}>(args?: Subset<T, RotaPadrao$paradasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    viagens<T extends RotaPadrao$viagensArgs<ExtArgs> = {}>(args?: Subset<T, RotaPadrao$viagensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RotaPadrao model
   */
  interface RotaPadraoFieldRefs {
    readonly id: FieldRef<"RotaPadrao", 'String'>
    readonly nome: FieldRef<"RotaPadrao", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RotaPadrao findUnique
   */
  export type RotaPadraoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which RotaPadrao to fetch.
     */
    where: RotaPadraoWhereUniqueInput
  }

  /**
   * RotaPadrao findUniqueOrThrow
   */
  export type RotaPadraoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which RotaPadrao to fetch.
     */
    where: RotaPadraoWhereUniqueInput
  }

  /**
   * RotaPadrao findFirst
   */
  export type RotaPadraoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which RotaPadrao to fetch.
     */
    where?: RotaPadraoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RotaPadraos to fetch.
     */
    orderBy?: RotaPadraoOrderByWithRelationInput | RotaPadraoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RotaPadraos.
     */
    cursor?: RotaPadraoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RotaPadraos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RotaPadraos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RotaPadraos.
     */
    distinct?: RotaPadraoScalarFieldEnum | RotaPadraoScalarFieldEnum[]
  }

  /**
   * RotaPadrao findFirstOrThrow
   */
  export type RotaPadraoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which RotaPadrao to fetch.
     */
    where?: RotaPadraoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RotaPadraos to fetch.
     */
    orderBy?: RotaPadraoOrderByWithRelationInput | RotaPadraoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RotaPadraos.
     */
    cursor?: RotaPadraoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RotaPadraos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RotaPadraos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RotaPadraos.
     */
    distinct?: RotaPadraoScalarFieldEnum | RotaPadraoScalarFieldEnum[]
  }

  /**
   * RotaPadrao findMany
   */
  export type RotaPadraoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which RotaPadraos to fetch.
     */
    where?: RotaPadraoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RotaPadraos to fetch.
     */
    orderBy?: RotaPadraoOrderByWithRelationInput | RotaPadraoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RotaPadraos.
     */
    cursor?: RotaPadraoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RotaPadraos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RotaPadraos.
     */
    skip?: number
    distinct?: RotaPadraoScalarFieldEnum | RotaPadraoScalarFieldEnum[]
  }

  /**
   * RotaPadrao create
   */
  export type RotaPadraoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * The data needed to create a RotaPadrao.
     */
    data: XOR<RotaPadraoCreateInput, RotaPadraoUncheckedCreateInput>
  }

  /**
   * RotaPadrao createMany
   */
  export type RotaPadraoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RotaPadraos.
     */
    data: RotaPadraoCreateManyInput | RotaPadraoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RotaPadrao createManyAndReturn
   */
  export type RotaPadraoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * The data used to create many RotaPadraos.
     */
    data: RotaPadraoCreateManyInput | RotaPadraoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RotaPadrao update
   */
  export type RotaPadraoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * The data needed to update a RotaPadrao.
     */
    data: XOR<RotaPadraoUpdateInput, RotaPadraoUncheckedUpdateInput>
    /**
     * Choose, which RotaPadrao to update.
     */
    where: RotaPadraoWhereUniqueInput
  }

  /**
   * RotaPadrao updateMany
   */
  export type RotaPadraoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RotaPadraos.
     */
    data: XOR<RotaPadraoUpdateManyMutationInput, RotaPadraoUncheckedUpdateManyInput>
    /**
     * Filter which RotaPadraos to update
     */
    where?: RotaPadraoWhereInput
    /**
     * Limit how many RotaPadraos to update.
     */
    limit?: number
  }

  /**
   * RotaPadrao updateManyAndReturn
   */
  export type RotaPadraoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * The data used to update RotaPadraos.
     */
    data: XOR<RotaPadraoUpdateManyMutationInput, RotaPadraoUncheckedUpdateManyInput>
    /**
     * Filter which RotaPadraos to update
     */
    where?: RotaPadraoWhereInput
    /**
     * Limit how many RotaPadraos to update.
     */
    limit?: number
  }

  /**
   * RotaPadrao upsert
   */
  export type RotaPadraoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * The filter to search for the RotaPadrao to update in case it exists.
     */
    where: RotaPadraoWhereUniqueInput
    /**
     * In case the RotaPadrao found by the `where` argument doesn't exist, create a new RotaPadrao with this data.
     */
    create: XOR<RotaPadraoCreateInput, RotaPadraoUncheckedCreateInput>
    /**
     * In case the RotaPadrao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RotaPadraoUpdateInput, RotaPadraoUncheckedUpdateInput>
  }

  /**
   * RotaPadrao delete
   */
  export type RotaPadraoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
    /**
     * Filter which RotaPadrao to delete.
     */
    where: RotaPadraoWhereUniqueInput
  }

  /**
   * RotaPadrao deleteMany
   */
  export type RotaPadraoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RotaPadraos to delete
     */
    where?: RotaPadraoWhereInput
    /**
     * Limit how many RotaPadraos to delete.
     */
    limit?: number
  }

  /**
   * RotaPadrao.paradas
   */
  export type RotaPadrao$paradasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    where?: ParadaPadraoWhereInput
    orderBy?: ParadaPadraoOrderByWithRelationInput | ParadaPadraoOrderByWithRelationInput[]
    cursor?: ParadaPadraoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParadaPadraoScalarFieldEnum | ParadaPadraoScalarFieldEnum[]
  }

  /**
   * RotaPadrao.viagens
   */
  export type RotaPadrao$viagensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Viagem
     */
    select?: ViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Viagem
     */
    omit?: ViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ViagemInclude<ExtArgs> | null
    where?: ViagemWhereInput
    orderBy?: ViagemOrderByWithRelationInput | ViagemOrderByWithRelationInput[]
    cursor?: ViagemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ViagemScalarFieldEnum | ViagemScalarFieldEnum[]
  }

  /**
   * RotaPadrao without action
   */
  export type RotaPadraoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RotaPadrao
     */
    select?: RotaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RotaPadrao
     */
    omit?: RotaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RotaPadraoInclude<ExtArgs> | null
  }


  /**
   * Model ParadaPadrao
   */

  export type AggregateParadaPadrao = {
    _count: ParadaPadraoCountAggregateOutputType | null
    _avg: ParadaPadraoAvgAggregateOutputType | null
    _sum: ParadaPadraoSumAggregateOutputType | null
    _min: ParadaPadraoMinAggregateOutputType | null
    _max: ParadaPadraoMaxAggregateOutputType | null
  }

  export type ParadaPadraoAvgAggregateOutputType = {
    ordem: number | null
  }

  export type ParadaPadraoSumAggregateOutputType = {
    ordem: number | null
  }

  export type ParadaPadraoMinAggregateOutputType = {
    id: string | null
    rotaId: string | null
    baseId: string | null
    ordem: number | null
    prevChegada: string | null
    prevSaida: string | null
  }

  export type ParadaPadraoMaxAggregateOutputType = {
    id: string | null
    rotaId: string | null
    baseId: string | null
    ordem: number | null
    prevChegada: string | null
    prevSaida: string | null
  }

  export type ParadaPadraoCountAggregateOutputType = {
    id: number
    rotaId: number
    baseId: number
    ordem: number
    prevChegada: number
    prevSaida: number
    _all: number
  }


  export type ParadaPadraoAvgAggregateInputType = {
    ordem?: true
  }

  export type ParadaPadraoSumAggregateInputType = {
    ordem?: true
  }

  export type ParadaPadraoMinAggregateInputType = {
    id?: true
    rotaId?: true
    baseId?: true
    ordem?: true
    prevChegada?: true
    prevSaida?: true
  }

  export type ParadaPadraoMaxAggregateInputType = {
    id?: true
    rotaId?: true
    baseId?: true
    ordem?: true
    prevChegada?: true
    prevSaida?: true
  }

  export type ParadaPadraoCountAggregateInputType = {
    id?: true
    rotaId?: true
    baseId?: true
    ordem?: true
    prevChegada?: true
    prevSaida?: true
    _all?: true
  }

  export type ParadaPadraoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParadaPadrao to aggregate.
     */
    where?: ParadaPadraoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParadaPadraos to fetch.
     */
    orderBy?: ParadaPadraoOrderByWithRelationInput | ParadaPadraoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParadaPadraoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParadaPadraos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParadaPadraos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ParadaPadraos
    **/
    _count?: true | ParadaPadraoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ParadaPadraoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ParadaPadraoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParadaPadraoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParadaPadraoMaxAggregateInputType
  }

  export type GetParadaPadraoAggregateType<T extends ParadaPadraoAggregateArgs> = {
        [P in keyof T & keyof AggregateParadaPadrao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParadaPadrao[P]>
      : GetScalarType<T[P], AggregateParadaPadrao[P]>
  }




  export type ParadaPadraoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParadaPadraoWhereInput
    orderBy?: ParadaPadraoOrderByWithAggregationInput | ParadaPadraoOrderByWithAggregationInput[]
    by: ParadaPadraoScalarFieldEnum[] | ParadaPadraoScalarFieldEnum
    having?: ParadaPadraoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParadaPadraoCountAggregateInputType | true
    _avg?: ParadaPadraoAvgAggregateInputType
    _sum?: ParadaPadraoSumAggregateInputType
    _min?: ParadaPadraoMinAggregateInputType
    _max?: ParadaPadraoMaxAggregateInputType
  }

  export type ParadaPadraoGroupByOutputType = {
    id: string
    rotaId: string
    baseId: string
    ordem: number
    prevChegada: string | null
    prevSaida: string | null
    _count: ParadaPadraoCountAggregateOutputType | null
    _avg: ParadaPadraoAvgAggregateOutputType | null
    _sum: ParadaPadraoSumAggregateOutputType | null
    _min: ParadaPadraoMinAggregateOutputType | null
    _max: ParadaPadraoMaxAggregateOutputType | null
  }

  type GetParadaPadraoGroupByPayload<T extends ParadaPadraoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParadaPadraoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParadaPadraoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParadaPadraoGroupByOutputType[P]>
            : GetScalarType<T[P], ParadaPadraoGroupByOutputType[P]>
        }
      >
    >


  export type ParadaPadraoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rotaId?: boolean
    baseId?: boolean
    ordem?: boolean
    prevChegada?: boolean
    prevSaida?: boolean
    rota?: boolean | RotaPadraoDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paradaPadrao"]>

  export type ParadaPadraoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rotaId?: boolean
    baseId?: boolean
    ordem?: boolean
    prevChegada?: boolean
    prevSaida?: boolean
    rota?: boolean | RotaPadraoDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paradaPadrao"]>

  export type ParadaPadraoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rotaId?: boolean
    baseId?: boolean
    ordem?: boolean
    prevChegada?: boolean
    prevSaida?: boolean
    rota?: boolean | RotaPadraoDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paradaPadrao"]>

  export type ParadaPadraoSelectScalar = {
    id?: boolean
    rotaId?: boolean
    baseId?: boolean
    ordem?: boolean
    prevChegada?: boolean
    prevSaida?: boolean
  }

  export type ParadaPadraoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rotaId" | "baseId" | "ordem" | "prevChegada" | "prevSaida", ExtArgs["result"]["paradaPadrao"]>
  export type ParadaPadraoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rota?: boolean | RotaPadraoDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }
  export type ParadaPadraoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rota?: boolean | RotaPadraoDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }
  export type ParadaPadraoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rota?: boolean | RotaPadraoDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }

  export type $ParadaPadraoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ParadaPadrao"
    objects: {
      rota: Prisma.$RotaPadraoPayload<ExtArgs>
      base: Prisma.$BasePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rotaId: string
      baseId: string
      ordem: number
      prevChegada: string | null
      prevSaida: string | null
    }, ExtArgs["result"]["paradaPadrao"]>
    composites: {}
  }

  type ParadaPadraoGetPayload<S extends boolean | null | undefined | ParadaPadraoDefaultArgs> = $Result.GetResult<Prisma.$ParadaPadraoPayload, S>

  type ParadaPadraoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ParadaPadraoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ParadaPadraoCountAggregateInputType | true
    }

  export interface ParadaPadraoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ParadaPadrao'], meta: { name: 'ParadaPadrao' } }
    /**
     * Find zero or one ParadaPadrao that matches the filter.
     * @param {ParadaPadraoFindUniqueArgs} args - Arguments to find a ParadaPadrao
     * @example
     * // Get one ParadaPadrao
     * const paradaPadrao = await prisma.paradaPadrao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParadaPadraoFindUniqueArgs>(args: SelectSubset<T, ParadaPadraoFindUniqueArgs<ExtArgs>>): Prisma__ParadaPadraoClient<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ParadaPadrao that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ParadaPadraoFindUniqueOrThrowArgs} args - Arguments to find a ParadaPadrao
     * @example
     * // Get one ParadaPadrao
     * const paradaPadrao = await prisma.paradaPadrao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParadaPadraoFindUniqueOrThrowArgs>(args: SelectSubset<T, ParadaPadraoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParadaPadraoClient<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParadaPadrao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaPadraoFindFirstArgs} args - Arguments to find a ParadaPadrao
     * @example
     * // Get one ParadaPadrao
     * const paradaPadrao = await prisma.paradaPadrao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParadaPadraoFindFirstArgs>(args?: SelectSubset<T, ParadaPadraoFindFirstArgs<ExtArgs>>): Prisma__ParadaPadraoClient<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParadaPadrao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaPadraoFindFirstOrThrowArgs} args - Arguments to find a ParadaPadrao
     * @example
     * // Get one ParadaPadrao
     * const paradaPadrao = await prisma.paradaPadrao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParadaPadraoFindFirstOrThrowArgs>(args?: SelectSubset<T, ParadaPadraoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParadaPadraoClient<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ParadaPadraos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaPadraoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ParadaPadraos
     * const paradaPadraos = await prisma.paradaPadrao.findMany()
     * 
     * // Get first 10 ParadaPadraos
     * const paradaPadraos = await prisma.paradaPadrao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paradaPadraoWithIdOnly = await prisma.paradaPadrao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParadaPadraoFindManyArgs>(args?: SelectSubset<T, ParadaPadraoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ParadaPadrao.
     * @param {ParadaPadraoCreateArgs} args - Arguments to create a ParadaPadrao.
     * @example
     * // Create one ParadaPadrao
     * const ParadaPadrao = await prisma.paradaPadrao.create({
     *   data: {
     *     // ... data to create a ParadaPadrao
     *   }
     * })
     * 
     */
    create<T extends ParadaPadraoCreateArgs>(args: SelectSubset<T, ParadaPadraoCreateArgs<ExtArgs>>): Prisma__ParadaPadraoClient<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ParadaPadraos.
     * @param {ParadaPadraoCreateManyArgs} args - Arguments to create many ParadaPadraos.
     * @example
     * // Create many ParadaPadraos
     * const paradaPadrao = await prisma.paradaPadrao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParadaPadraoCreateManyArgs>(args?: SelectSubset<T, ParadaPadraoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ParadaPadraos and returns the data saved in the database.
     * @param {ParadaPadraoCreateManyAndReturnArgs} args - Arguments to create many ParadaPadraos.
     * @example
     * // Create many ParadaPadraos
     * const paradaPadrao = await prisma.paradaPadrao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ParadaPadraos and only return the `id`
     * const paradaPadraoWithIdOnly = await prisma.paradaPadrao.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParadaPadraoCreateManyAndReturnArgs>(args?: SelectSubset<T, ParadaPadraoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ParadaPadrao.
     * @param {ParadaPadraoDeleteArgs} args - Arguments to delete one ParadaPadrao.
     * @example
     * // Delete one ParadaPadrao
     * const ParadaPadrao = await prisma.paradaPadrao.delete({
     *   where: {
     *     // ... filter to delete one ParadaPadrao
     *   }
     * })
     * 
     */
    delete<T extends ParadaPadraoDeleteArgs>(args: SelectSubset<T, ParadaPadraoDeleteArgs<ExtArgs>>): Prisma__ParadaPadraoClient<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ParadaPadrao.
     * @param {ParadaPadraoUpdateArgs} args - Arguments to update one ParadaPadrao.
     * @example
     * // Update one ParadaPadrao
     * const paradaPadrao = await prisma.paradaPadrao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParadaPadraoUpdateArgs>(args: SelectSubset<T, ParadaPadraoUpdateArgs<ExtArgs>>): Prisma__ParadaPadraoClient<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ParadaPadraos.
     * @param {ParadaPadraoDeleteManyArgs} args - Arguments to filter ParadaPadraos to delete.
     * @example
     * // Delete a few ParadaPadraos
     * const { count } = await prisma.paradaPadrao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParadaPadraoDeleteManyArgs>(args?: SelectSubset<T, ParadaPadraoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParadaPadraos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaPadraoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ParadaPadraos
     * const paradaPadrao = await prisma.paradaPadrao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParadaPadraoUpdateManyArgs>(args: SelectSubset<T, ParadaPadraoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParadaPadraos and returns the data updated in the database.
     * @param {ParadaPadraoUpdateManyAndReturnArgs} args - Arguments to update many ParadaPadraos.
     * @example
     * // Update many ParadaPadraos
     * const paradaPadrao = await prisma.paradaPadrao.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ParadaPadraos and only return the `id`
     * const paradaPadraoWithIdOnly = await prisma.paradaPadrao.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ParadaPadraoUpdateManyAndReturnArgs>(args: SelectSubset<T, ParadaPadraoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ParadaPadrao.
     * @param {ParadaPadraoUpsertArgs} args - Arguments to update or create a ParadaPadrao.
     * @example
     * // Update or create a ParadaPadrao
     * const paradaPadrao = await prisma.paradaPadrao.upsert({
     *   create: {
     *     // ... data to create a ParadaPadrao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ParadaPadrao we want to update
     *   }
     * })
     */
    upsert<T extends ParadaPadraoUpsertArgs>(args: SelectSubset<T, ParadaPadraoUpsertArgs<ExtArgs>>): Prisma__ParadaPadraoClient<$Result.GetResult<Prisma.$ParadaPadraoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ParadaPadraos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaPadraoCountArgs} args - Arguments to filter ParadaPadraos to count.
     * @example
     * // Count the number of ParadaPadraos
     * const count = await prisma.paradaPadrao.count({
     *   where: {
     *     // ... the filter for the ParadaPadraos we want to count
     *   }
     * })
    **/
    count<T extends ParadaPadraoCountArgs>(
      args?: Subset<T, ParadaPadraoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParadaPadraoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ParadaPadrao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaPadraoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParadaPadraoAggregateArgs>(args: Subset<T, ParadaPadraoAggregateArgs>): Prisma.PrismaPromise<GetParadaPadraoAggregateType<T>>

    /**
     * Group by ParadaPadrao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaPadraoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParadaPadraoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParadaPadraoGroupByArgs['orderBy'] }
        : { orderBy?: ParadaPadraoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParadaPadraoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParadaPadraoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ParadaPadrao model
   */
  readonly fields: ParadaPadraoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ParadaPadrao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParadaPadraoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rota<T extends RotaPadraoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RotaPadraoDefaultArgs<ExtArgs>>): Prisma__RotaPadraoClient<$Result.GetResult<Prisma.$RotaPadraoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    base<T extends BaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BaseDefaultArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ParadaPadrao model
   */
  interface ParadaPadraoFieldRefs {
    readonly id: FieldRef<"ParadaPadrao", 'String'>
    readonly rotaId: FieldRef<"ParadaPadrao", 'String'>
    readonly baseId: FieldRef<"ParadaPadrao", 'String'>
    readonly ordem: FieldRef<"ParadaPadrao", 'Int'>
    readonly prevChegada: FieldRef<"ParadaPadrao", 'String'>
    readonly prevSaida: FieldRef<"ParadaPadrao", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ParadaPadrao findUnique
   */
  export type ParadaPadraoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which ParadaPadrao to fetch.
     */
    where: ParadaPadraoWhereUniqueInput
  }

  /**
   * ParadaPadrao findUniqueOrThrow
   */
  export type ParadaPadraoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which ParadaPadrao to fetch.
     */
    where: ParadaPadraoWhereUniqueInput
  }

  /**
   * ParadaPadrao findFirst
   */
  export type ParadaPadraoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which ParadaPadrao to fetch.
     */
    where?: ParadaPadraoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParadaPadraos to fetch.
     */
    orderBy?: ParadaPadraoOrderByWithRelationInput | ParadaPadraoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParadaPadraos.
     */
    cursor?: ParadaPadraoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParadaPadraos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParadaPadraos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParadaPadraos.
     */
    distinct?: ParadaPadraoScalarFieldEnum | ParadaPadraoScalarFieldEnum[]
  }

  /**
   * ParadaPadrao findFirstOrThrow
   */
  export type ParadaPadraoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which ParadaPadrao to fetch.
     */
    where?: ParadaPadraoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParadaPadraos to fetch.
     */
    orderBy?: ParadaPadraoOrderByWithRelationInput | ParadaPadraoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParadaPadraos.
     */
    cursor?: ParadaPadraoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParadaPadraos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParadaPadraos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParadaPadraos.
     */
    distinct?: ParadaPadraoScalarFieldEnum | ParadaPadraoScalarFieldEnum[]
  }

  /**
   * ParadaPadrao findMany
   */
  export type ParadaPadraoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * Filter, which ParadaPadraos to fetch.
     */
    where?: ParadaPadraoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParadaPadraos to fetch.
     */
    orderBy?: ParadaPadraoOrderByWithRelationInput | ParadaPadraoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ParadaPadraos.
     */
    cursor?: ParadaPadraoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParadaPadraos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParadaPadraos.
     */
    skip?: number
    distinct?: ParadaPadraoScalarFieldEnum | ParadaPadraoScalarFieldEnum[]
  }

  /**
   * ParadaPadrao create
   */
  export type ParadaPadraoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * The data needed to create a ParadaPadrao.
     */
    data: XOR<ParadaPadraoCreateInput, ParadaPadraoUncheckedCreateInput>
  }

  /**
   * ParadaPadrao createMany
   */
  export type ParadaPadraoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ParadaPadraos.
     */
    data: ParadaPadraoCreateManyInput | ParadaPadraoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ParadaPadrao createManyAndReturn
   */
  export type ParadaPadraoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * The data used to create many ParadaPadraos.
     */
    data: ParadaPadraoCreateManyInput | ParadaPadraoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParadaPadrao update
   */
  export type ParadaPadraoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * The data needed to update a ParadaPadrao.
     */
    data: XOR<ParadaPadraoUpdateInput, ParadaPadraoUncheckedUpdateInput>
    /**
     * Choose, which ParadaPadrao to update.
     */
    where: ParadaPadraoWhereUniqueInput
  }

  /**
   * ParadaPadrao updateMany
   */
  export type ParadaPadraoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ParadaPadraos.
     */
    data: XOR<ParadaPadraoUpdateManyMutationInput, ParadaPadraoUncheckedUpdateManyInput>
    /**
     * Filter which ParadaPadraos to update
     */
    where?: ParadaPadraoWhereInput
    /**
     * Limit how many ParadaPadraos to update.
     */
    limit?: number
  }

  /**
   * ParadaPadrao updateManyAndReturn
   */
  export type ParadaPadraoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * The data used to update ParadaPadraos.
     */
    data: XOR<ParadaPadraoUpdateManyMutationInput, ParadaPadraoUncheckedUpdateManyInput>
    /**
     * Filter which ParadaPadraos to update
     */
    where?: ParadaPadraoWhereInput
    /**
     * Limit how many ParadaPadraos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParadaPadrao upsert
   */
  export type ParadaPadraoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * The filter to search for the ParadaPadrao to update in case it exists.
     */
    where: ParadaPadraoWhereUniqueInput
    /**
     * In case the ParadaPadrao found by the `where` argument doesn't exist, create a new ParadaPadrao with this data.
     */
    create: XOR<ParadaPadraoCreateInput, ParadaPadraoUncheckedCreateInput>
    /**
     * In case the ParadaPadrao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParadaPadraoUpdateInput, ParadaPadraoUncheckedUpdateInput>
  }

  /**
   * ParadaPadrao delete
   */
  export type ParadaPadraoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
    /**
     * Filter which ParadaPadrao to delete.
     */
    where: ParadaPadraoWhereUniqueInput
  }

  /**
   * ParadaPadrao deleteMany
   */
  export type ParadaPadraoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParadaPadraos to delete
     */
    where?: ParadaPadraoWhereInput
    /**
     * Limit how many ParadaPadraos to delete.
     */
    limit?: number
  }

  /**
   * ParadaPadrao without action
   */
  export type ParadaPadraoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaPadrao
     */
    select?: ParadaPadraoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaPadrao
     */
    omit?: ParadaPadraoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaPadraoInclude<ExtArgs> | null
  }


  /**
   * Model ParadaViagem
   */

  export type AggregateParadaViagem = {
    _count: ParadaViagemCountAggregateOutputType | null
    _avg: ParadaViagemAvgAggregateOutputType | null
    _sum: ParadaViagemSumAggregateOutputType | null
    _min: ParadaViagemMinAggregateOutputType | null
    _max: ParadaViagemMaxAggregateOutputType | null
  }

  export type ParadaViagemAvgAggregateOutputType = {
    ordem: number | null
  }

  export type ParadaViagemSumAggregateOutputType = {
    ordem: number | null
  }

  export type ParadaViagemMinAggregateOutputType = {
    id: string | null
    viagemId: string | null
    baseId: string | null
    ordem: number | null
    prevChegada: Date | null
    prevSaida: Date | null
    dataChegadaEfetiva: Date | null
    dataSaidaEfetiva: Date | null
  }

  export type ParadaViagemMaxAggregateOutputType = {
    id: string | null
    viagemId: string | null
    baseId: string | null
    ordem: number | null
    prevChegada: Date | null
    prevSaida: Date | null
    dataChegadaEfetiva: Date | null
    dataSaidaEfetiva: Date | null
  }

  export type ParadaViagemCountAggregateOutputType = {
    id: number
    viagemId: number
    baseId: number
    ordem: number
    prevChegada: number
    prevSaida: number
    dataChegadaEfetiva: number
    dataSaidaEfetiva: number
    _all: number
  }


  export type ParadaViagemAvgAggregateInputType = {
    ordem?: true
  }

  export type ParadaViagemSumAggregateInputType = {
    ordem?: true
  }

  export type ParadaViagemMinAggregateInputType = {
    id?: true
    viagemId?: true
    baseId?: true
    ordem?: true
    prevChegada?: true
    prevSaida?: true
    dataChegadaEfetiva?: true
    dataSaidaEfetiva?: true
  }

  export type ParadaViagemMaxAggregateInputType = {
    id?: true
    viagemId?: true
    baseId?: true
    ordem?: true
    prevChegada?: true
    prevSaida?: true
    dataChegadaEfetiva?: true
    dataSaidaEfetiva?: true
  }

  export type ParadaViagemCountAggregateInputType = {
    id?: true
    viagemId?: true
    baseId?: true
    ordem?: true
    prevChegada?: true
    prevSaida?: true
    dataChegadaEfetiva?: true
    dataSaidaEfetiva?: true
    _all?: true
  }

  export type ParadaViagemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParadaViagem to aggregate.
     */
    where?: ParadaViagemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParadaViagems to fetch.
     */
    orderBy?: ParadaViagemOrderByWithRelationInput | ParadaViagemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParadaViagemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParadaViagems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParadaViagems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ParadaViagems
    **/
    _count?: true | ParadaViagemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ParadaViagemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ParadaViagemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParadaViagemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParadaViagemMaxAggregateInputType
  }

  export type GetParadaViagemAggregateType<T extends ParadaViagemAggregateArgs> = {
        [P in keyof T & keyof AggregateParadaViagem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParadaViagem[P]>
      : GetScalarType<T[P], AggregateParadaViagem[P]>
  }




  export type ParadaViagemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParadaViagemWhereInput
    orderBy?: ParadaViagemOrderByWithAggregationInput | ParadaViagemOrderByWithAggregationInput[]
    by: ParadaViagemScalarFieldEnum[] | ParadaViagemScalarFieldEnum
    having?: ParadaViagemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParadaViagemCountAggregateInputType | true
    _avg?: ParadaViagemAvgAggregateInputType
    _sum?: ParadaViagemSumAggregateInputType
    _min?: ParadaViagemMinAggregateInputType
    _max?: ParadaViagemMaxAggregateInputType
  }

  export type ParadaViagemGroupByOutputType = {
    id: string
    viagemId: string
    baseId: string
    ordem: number
    prevChegada: Date | null
    prevSaida: Date | null
    dataChegadaEfetiva: Date | null
    dataSaidaEfetiva: Date | null
    _count: ParadaViagemCountAggregateOutputType | null
    _avg: ParadaViagemAvgAggregateOutputType | null
    _sum: ParadaViagemSumAggregateOutputType | null
    _min: ParadaViagemMinAggregateOutputType | null
    _max: ParadaViagemMaxAggregateOutputType | null
  }

  type GetParadaViagemGroupByPayload<T extends ParadaViagemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParadaViagemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParadaViagemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParadaViagemGroupByOutputType[P]>
            : GetScalarType<T[P], ParadaViagemGroupByOutputType[P]>
        }
      >
    >


  export type ParadaViagemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viagemId?: boolean
    baseId?: boolean
    ordem?: boolean
    prevChegada?: boolean
    prevSaida?: boolean
    dataChegadaEfetiva?: boolean
    dataSaidaEfetiva?: boolean
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paradaViagem"]>

  export type ParadaViagemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viagemId?: boolean
    baseId?: boolean
    ordem?: boolean
    prevChegada?: boolean
    prevSaida?: boolean
    dataChegadaEfetiva?: boolean
    dataSaidaEfetiva?: boolean
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paradaViagem"]>

  export type ParadaViagemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    viagemId?: boolean
    baseId?: boolean
    ordem?: boolean
    prevChegada?: boolean
    prevSaida?: boolean
    dataChegadaEfetiva?: boolean
    dataSaidaEfetiva?: boolean
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paradaViagem"]>

  export type ParadaViagemSelectScalar = {
    id?: boolean
    viagemId?: boolean
    baseId?: boolean
    ordem?: boolean
    prevChegada?: boolean
    prevSaida?: boolean
    dataChegadaEfetiva?: boolean
    dataSaidaEfetiva?: boolean
  }

  export type ParadaViagemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "viagemId" | "baseId" | "ordem" | "prevChegada" | "prevSaida" | "dataChegadaEfetiva" | "dataSaidaEfetiva", ExtArgs["result"]["paradaViagem"]>
  export type ParadaViagemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }
  export type ParadaViagemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }
  export type ParadaViagemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    viagem?: boolean | ViagemDefaultArgs<ExtArgs>
    base?: boolean | BaseDefaultArgs<ExtArgs>
  }

  export type $ParadaViagemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ParadaViagem"
    objects: {
      viagem: Prisma.$ViagemPayload<ExtArgs>
      base: Prisma.$BasePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      viagemId: string
      baseId: string
      ordem: number
      prevChegada: Date | null
      prevSaida: Date | null
      dataChegadaEfetiva: Date | null
      dataSaidaEfetiva: Date | null
    }, ExtArgs["result"]["paradaViagem"]>
    composites: {}
  }

  type ParadaViagemGetPayload<S extends boolean | null | undefined | ParadaViagemDefaultArgs> = $Result.GetResult<Prisma.$ParadaViagemPayload, S>

  type ParadaViagemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ParadaViagemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ParadaViagemCountAggregateInputType | true
    }

  export interface ParadaViagemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ParadaViagem'], meta: { name: 'ParadaViagem' } }
    /**
     * Find zero or one ParadaViagem that matches the filter.
     * @param {ParadaViagemFindUniqueArgs} args - Arguments to find a ParadaViagem
     * @example
     * // Get one ParadaViagem
     * const paradaViagem = await prisma.paradaViagem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParadaViagemFindUniqueArgs>(args: SelectSubset<T, ParadaViagemFindUniqueArgs<ExtArgs>>): Prisma__ParadaViagemClient<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ParadaViagem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ParadaViagemFindUniqueOrThrowArgs} args - Arguments to find a ParadaViagem
     * @example
     * // Get one ParadaViagem
     * const paradaViagem = await prisma.paradaViagem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParadaViagemFindUniqueOrThrowArgs>(args: SelectSubset<T, ParadaViagemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParadaViagemClient<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParadaViagem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaViagemFindFirstArgs} args - Arguments to find a ParadaViagem
     * @example
     * // Get one ParadaViagem
     * const paradaViagem = await prisma.paradaViagem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParadaViagemFindFirstArgs>(args?: SelectSubset<T, ParadaViagemFindFirstArgs<ExtArgs>>): Prisma__ParadaViagemClient<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ParadaViagem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaViagemFindFirstOrThrowArgs} args - Arguments to find a ParadaViagem
     * @example
     * // Get one ParadaViagem
     * const paradaViagem = await prisma.paradaViagem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParadaViagemFindFirstOrThrowArgs>(args?: SelectSubset<T, ParadaViagemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParadaViagemClient<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ParadaViagems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaViagemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ParadaViagems
     * const paradaViagems = await prisma.paradaViagem.findMany()
     * 
     * // Get first 10 ParadaViagems
     * const paradaViagems = await prisma.paradaViagem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paradaViagemWithIdOnly = await prisma.paradaViagem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParadaViagemFindManyArgs>(args?: SelectSubset<T, ParadaViagemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ParadaViagem.
     * @param {ParadaViagemCreateArgs} args - Arguments to create a ParadaViagem.
     * @example
     * // Create one ParadaViagem
     * const ParadaViagem = await prisma.paradaViagem.create({
     *   data: {
     *     // ... data to create a ParadaViagem
     *   }
     * })
     * 
     */
    create<T extends ParadaViagemCreateArgs>(args: SelectSubset<T, ParadaViagemCreateArgs<ExtArgs>>): Prisma__ParadaViagemClient<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ParadaViagems.
     * @param {ParadaViagemCreateManyArgs} args - Arguments to create many ParadaViagems.
     * @example
     * // Create many ParadaViagems
     * const paradaViagem = await prisma.paradaViagem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParadaViagemCreateManyArgs>(args?: SelectSubset<T, ParadaViagemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ParadaViagems and returns the data saved in the database.
     * @param {ParadaViagemCreateManyAndReturnArgs} args - Arguments to create many ParadaViagems.
     * @example
     * // Create many ParadaViagems
     * const paradaViagem = await prisma.paradaViagem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ParadaViagems and only return the `id`
     * const paradaViagemWithIdOnly = await prisma.paradaViagem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParadaViagemCreateManyAndReturnArgs>(args?: SelectSubset<T, ParadaViagemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ParadaViagem.
     * @param {ParadaViagemDeleteArgs} args - Arguments to delete one ParadaViagem.
     * @example
     * // Delete one ParadaViagem
     * const ParadaViagem = await prisma.paradaViagem.delete({
     *   where: {
     *     // ... filter to delete one ParadaViagem
     *   }
     * })
     * 
     */
    delete<T extends ParadaViagemDeleteArgs>(args: SelectSubset<T, ParadaViagemDeleteArgs<ExtArgs>>): Prisma__ParadaViagemClient<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ParadaViagem.
     * @param {ParadaViagemUpdateArgs} args - Arguments to update one ParadaViagem.
     * @example
     * // Update one ParadaViagem
     * const paradaViagem = await prisma.paradaViagem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParadaViagemUpdateArgs>(args: SelectSubset<T, ParadaViagemUpdateArgs<ExtArgs>>): Prisma__ParadaViagemClient<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ParadaViagems.
     * @param {ParadaViagemDeleteManyArgs} args - Arguments to filter ParadaViagems to delete.
     * @example
     * // Delete a few ParadaViagems
     * const { count } = await prisma.paradaViagem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParadaViagemDeleteManyArgs>(args?: SelectSubset<T, ParadaViagemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParadaViagems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaViagemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ParadaViagems
     * const paradaViagem = await prisma.paradaViagem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParadaViagemUpdateManyArgs>(args: SelectSubset<T, ParadaViagemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParadaViagems and returns the data updated in the database.
     * @param {ParadaViagemUpdateManyAndReturnArgs} args - Arguments to update many ParadaViagems.
     * @example
     * // Update many ParadaViagems
     * const paradaViagem = await prisma.paradaViagem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ParadaViagems and only return the `id`
     * const paradaViagemWithIdOnly = await prisma.paradaViagem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ParadaViagemUpdateManyAndReturnArgs>(args: SelectSubset<T, ParadaViagemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ParadaViagem.
     * @param {ParadaViagemUpsertArgs} args - Arguments to update or create a ParadaViagem.
     * @example
     * // Update or create a ParadaViagem
     * const paradaViagem = await prisma.paradaViagem.upsert({
     *   create: {
     *     // ... data to create a ParadaViagem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ParadaViagem we want to update
     *   }
     * })
     */
    upsert<T extends ParadaViagemUpsertArgs>(args: SelectSubset<T, ParadaViagemUpsertArgs<ExtArgs>>): Prisma__ParadaViagemClient<$Result.GetResult<Prisma.$ParadaViagemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ParadaViagems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaViagemCountArgs} args - Arguments to filter ParadaViagems to count.
     * @example
     * // Count the number of ParadaViagems
     * const count = await prisma.paradaViagem.count({
     *   where: {
     *     // ... the filter for the ParadaViagems we want to count
     *   }
     * })
    **/
    count<T extends ParadaViagemCountArgs>(
      args?: Subset<T, ParadaViagemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParadaViagemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ParadaViagem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaViagemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParadaViagemAggregateArgs>(args: Subset<T, ParadaViagemAggregateArgs>): Prisma.PrismaPromise<GetParadaViagemAggregateType<T>>

    /**
     * Group by ParadaViagem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParadaViagemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParadaViagemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParadaViagemGroupByArgs['orderBy'] }
        : { orderBy?: ParadaViagemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParadaViagemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParadaViagemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ParadaViagem model
   */
  readonly fields: ParadaViagemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ParadaViagem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParadaViagemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    viagem<T extends ViagemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ViagemDefaultArgs<ExtArgs>>): Prisma__ViagemClient<$Result.GetResult<Prisma.$ViagemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    base<T extends BaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BaseDefaultArgs<ExtArgs>>): Prisma__BaseClient<$Result.GetResult<Prisma.$BasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ParadaViagem model
   */
  interface ParadaViagemFieldRefs {
    readonly id: FieldRef<"ParadaViagem", 'String'>
    readonly viagemId: FieldRef<"ParadaViagem", 'String'>
    readonly baseId: FieldRef<"ParadaViagem", 'String'>
    readonly ordem: FieldRef<"ParadaViagem", 'Int'>
    readonly prevChegada: FieldRef<"ParadaViagem", 'DateTime'>
    readonly prevSaida: FieldRef<"ParadaViagem", 'DateTime'>
    readonly dataChegadaEfetiva: FieldRef<"ParadaViagem", 'DateTime'>
    readonly dataSaidaEfetiva: FieldRef<"ParadaViagem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ParadaViagem findUnique
   */
  export type ParadaViagemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * Filter, which ParadaViagem to fetch.
     */
    where: ParadaViagemWhereUniqueInput
  }

  /**
   * ParadaViagem findUniqueOrThrow
   */
  export type ParadaViagemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * Filter, which ParadaViagem to fetch.
     */
    where: ParadaViagemWhereUniqueInput
  }

  /**
   * ParadaViagem findFirst
   */
  export type ParadaViagemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * Filter, which ParadaViagem to fetch.
     */
    where?: ParadaViagemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParadaViagems to fetch.
     */
    orderBy?: ParadaViagemOrderByWithRelationInput | ParadaViagemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParadaViagems.
     */
    cursor?: ParadaViagemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParadaViagems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParadaViagems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParadaViagems.
     */
    distinct?: ParadaViagemScalarFieldEnum | ParadaViagemScalarFieldEnum[]
  }

  /**
   * ParadaViagem findFirstOrThrow
   */
  export type ParadaViagemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * Filter, which ParadaViagem to fetch.
     */
    where?: ParadaViagemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParadaViagems to fetch.
     */
    orderBy?: ParadaViagemOrderByWithRelationInput | ParadaViagemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParadaViagems.
     */
    cursor?: ParadaViagemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParadaViagems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParadaViagems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParadaViagems.
     */
    distinct?: ParadaViagemScalarFieldEnum | ParadaViagemScalarFieldEnum[]
  }

  /**
   * ParadaViagem findMany
   */
  export type ParadaViagemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * Filter, which ParadaViagems to fetch.
     */
    where?: ParadaViagemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParadaViagems to fetch.
     */
    orderBy?: ParadaViagemOrderByWithRelationInput | ParadaViagemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ParadaViagems.
     */
    cursor?: ParadaViagemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParadaViagems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParadaViagems.
     */
    skip?: number
    distinct?: ParadaViagemScalarFieldEnum | ParadaViagemScalarFieldEnum[]
  }

  /**
   * ParadaViagem create
   */
  export type ParadaViagemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * The data needed to create a ParadaViagem.
     */
    data: XOR<ParadaViagemCreateInput, ParadaViagemUncheckedCreateInput>
  }

  /**
   * ParadaViagem createMany
   */
  export type ParadaViagemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ParadaViagems.
     */
    data: ParadaViagemCreateManyInput | ParadaViagemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ParadaViagem createManyAndReturn
   */
  export type ParadaViagemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * The data used to create many ParadaViagems.
     */
    data: ParadaViagemCreateManyInput | ParadaViagemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParadaViagem update
   */
  export type ParadaViagemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * The data needed to update a ParadaViagem.
     */
    data: XOR<ParadaViagemUpdateInput, ParadaViagemUncheckedUpdateInput>
    /**
     * Choose, which ParadaViagem to update.
     */
    where: ParadaViagemWhereUniqueInput
  }

  /**
   * ParadaViagem updateMany
   */
  export type ParadaViagemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ParadaViagems.
     */
    data: XOR<ParadaViagemUpdateManyMutationInput, ParadaViagemUncheckedUpdateManyInput>
    /**
     * Filter which ParadaViagems to update
     */
    where?: ParadaViagemWhereInput
    /**
     * Limit how many ParadaViagems to update.
     */
    limit?: number
  }

  /**
   * ParadaViagem updateManyAndReturn
   */
  export type ParadaViagemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * The data used to update ParadaViagems.
     */
    data: XOR<ParadaViagemUpdateManyMutationInput, ParadaViagemUncheckedUpdateManyInput>
    /**
     * Filter which ParadaViagems to update
     */
    where?: ParadaViagemWhereInput
    /**
     * Limit how many ParadaViagems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParadaViagem upsert
   */
  export type ParadaViagemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * The filter to search for the ParadaViagem to update in case it exists.
     */
    where: ParadaViagemWhereUniqueInput
    /**
     * In case the ParadaViagem found by the `where` argument doesn't exist, create a new ParadaViagem with this data.
     */
    create: XOR<ParadaViagemCreateInput, ParadaViagemUncheckedCreateInput>
    /**
     * In case the ParadaViagem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParadaViagemUpdateInput, ParadaViagemUncheckedUpdateInput>
  }

  /**
   * ParadaViagem delete
   */
  export type ParadaViagemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
    /**
     * Filter which ParadaViagem to delete.
     */
    where: ParadaViagemWhereUniqueInput
  }

  /**
   * ParadaViagem deleteMany
   */
  export type ParadaViagemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParadaViagems to delete
     */
    where?: ParadaViagemWhereInput
    /**
     * Limit how many ParadaViagems to delete.
     */
    limit?: number
  }

  /**
   * ParadaViagem without action
   */
  export type ParadaViagemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParadaViagem
     */
    select?: ParadaViagemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ParadaViagem
     */
    omit?: ParadaViagemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParadaViagemInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const BaseScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    cidade: 'cidade',
    latitude: 'latitude',
    longitude: 'longitude',
    raioMetros: 'raioMetros',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BaseScalarFieldEnum = (typeof BaseScalarFieldEnum)[keyof typeof BaseScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    senhaHash: 'senhaHash',
    role: 'role',
    baseId: 'baseId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VeiculoScalarFieldEnum: {
    id: 'id',
    placa: 'placa',
    descricao: 'descricao',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VeiculoScalarFieldEnum = (typeof VeiculoScalarFieldEnum)[keyof typeof VeiculoScalarFieldEnum]


  export const ViagemScalarFieldEnum: {
    id: 'id',
    motorista: 'motorista',
    rotaDescricao: 'rotaDescricao',
    veiculoId: 'veiculoId',
    baseOrigemId: 'baseOrigemId',
    baseDestinoId: 'baseDestinoId',
    status: 'status',
    prevInicioReal: 'prevInicioReal',
    prevFimReal: 'prevFimReal',
    dataInicioEfetivo: 'dataInicioEfetivo',
    dataFimEfetivo: 'dataFimEfetivo',
    rotaPadraoId: 'rotaPadraoId',
    novaPrevisaoSaida: 'novaPrevisaoSaida',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ViagemScalarFieldEnum = (typeof ViagemScalarFieldEnum)[keyof typeof ViagemScalarFieldEnum]


  export const JustificativaAtrasoScalarFieldEnum: {
    id: 'id',
    viagemId: 'viagemId',
    tipoAtraso: 'tipoAtraso',
    motivo: 'motivo',
    usuarioId: 'usuarioId',
    baseId: 'baseId',
    tempoAtrasoMinutos: 'tempoAtrasoMinutos',
    createdAt: 'createdAt'
  };

  export type JustificativaAtrasoScalarFieldEnum = (typeof JustificativaAtrasoScalarFieldEnum)[keyof typeof JustificativaAtrasoScalarFieldEnum]


  export const TelemetriaScalarFieldEnum: {
    id: 'id',
    veiculoId: 'veiculoId',
    viagemId: 'viagemId',
    latitude: 'latitude',
    longitude: 'longitude',
    ignicao: 'ignicao',
    velocidade: 'velocidade',
    dataHoraUtc: 'dataHoraUtc',
    dataHoraLocal: 'dataHoraLocal',
    createdAt: 'createdAt'
  };

  export type TelemetriaScalarFieldEnum = (typeof TelemetriaScalarFieldEnum)[keyof typeof TelemetriaScalarFieldEnum]


  export const RotaPadraoScalarFieldEnum: {
    id: 'id',
    nome: 'nome'
  };

  export type RotaPadraoScalarFieldEnum = (typeof RotaPadraoScalarFieldEnum)[keyof typeof RotaPadraoScalarFieldEnum]


  export const ParadaPadraoScalarFieldEnum: {
    id: 'id',
    rotaId: 'rotaId',
    baseId: 'baseId',
    ordem: 'ordem',
    prevChegada: 'prevChegada',
    prevSaida: 'prevSaida'
  };

  export type ParadaPadraoScalarFieldEnum = (typeof ParadaPadraoScalarFieldEnum)[keyof typeof ParadaPadraoScalarFieldEnum]


  export const ParadaViagemScalarFieldEnum: {
    id: 'id',
    viagemId: 'viagemId',
    baseId: 'baseId',
    ordem: 'ordem',
    prevChegada: 'prevChegada',
    prevSaida: 'prevSaida',
    dataChegadaEfetiva: 'dataChegadaEfetiva',
    dataSaidaEfetiva: 'dataSaidaEfetiva'
  };

  export type ParadaViagemScalarFieldEnum = (typeof ParadaViagemScalarFieldEnum)[keyof typeof ParadaViagemScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'StatusViagem'
   */
  export type EnumStatusViagemFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusViagem'>
    


  /**
   * Reference to a field of type 'StatusViagem[]'
   */
  export type ListEnumStatusViagemFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusViagem[]'>
    


  /**
   * Reference to a field of type 'TipoAtraso'
   */
  export type EnumTipoAtrasoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoAtraso'>
    


  /**
   * Reference to a field of type 'TipoAtraso[]'
   */
  export type ListEnumTipoAtrasoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoAtraso[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type BaseWhereInput = {
    AND?: BaseWhereInput | BaseWhereInput[]
    OR?: BaseWhereInput[]
    NOT?: BaseWhereInput | BaseWhereInput[]
    id?: StringFilter<"Base"> | string
    nome?: StringFilter<"Base"> | string
    cidade?: StringFilter<"Base"> | string
    latitude?: FloatNullableFilter<"Base"> | number | null
    longitude?: FloatNullableFilter<"Base"> | number | null
    raioMetros?: IntFilter<"Base"> | number
    createdAt?: DateTimeFilter<"Base"> | Date | string
    updatedAt?: DateTimeFilter<"Base"> | Date | string
    usuarios?: UserListRelationFilter
    viagensOrigem?: ViagemListRelationFilter
    viagensDestino?: ViagemListRelationFilter
    justificativas?: JustificativaAtrasoListRelationFilter
    paradasPadrao?: ParadaPadraoListRelationFilter
    paradasViagem?: ParadaViagemListRelationFilter
  }

  export type BaseOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    raioMetros?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    usuarios?: UserOrderByRelationAggregateInput
    viagensOrigem?: ViagemOrderByRelationAggregateInput
    viagensDestino?: ViagemOrderByRelationAggregateInput
    justificativas?: JustificativaAtrasoOrderByRelationAggregateInput
    paradasPadrao?: ParadaPadraoOrderByRelationAggregateInput
    paradasViagem?: ParadaViagemOrderByRelationAggregateInput
  }

  export type BaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nome?: string
    AND?: BaseWhereInput | BaseWhereInput[]
    OR?: BaseWhereInput[]
    NOT?: BaseWhereInput | BaseWhereInput[]
    cidade?: StringFilter<"Base"> | string
    latitude?: FloatNullableFilter<"Base"> | number | null
    longitude?: FloatNullableFilter<"Base"> | number | null
    raioMetros?: IntFilter<"Base"> | number
    createdAt?: DateTimeFilter<"Base"> | Date | string
    updatedAt?: DateTimeFilter<"Base"> | Date | string
    usuarios?: UserListRelationFilter
    viagensOrigem?: ViagemListRelationFilter
    viagensDestino?: ViagemListRelationFilter
    justificativas?: JustificativaAtrasoListRelationFilter
    paradasPadrao?: ParadaPadraoListRelationFilter
    paradasViagem?: ParadaViagemListRelationFilter
  }, "id" | "nome">

  export type BaseOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    raioMetros?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BaseCountOrderByAggregateInput
    _avg?: BaseAvgOrderByAggregateInput
    _max?: BaseMaxOrderByAggregateInput
    _min?: BaseMinOrderByAggregateInput
    _sum?: BaseSumOrderByAggregateInput
  }

  export type BaseScalarWhereWithAggregatesInput = {
    AND?: BaseScalarWhereWithAggregatesInput | BaseScalarWhereWithAggregatesInput[]
    OR?: BaseScalarWhereWithAggregatesInput[]
    NOT?: BaseScalarWhereWithAggregatesInput | BaseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Base"> | string
    nome?: StringWithAggregatesFilter<"Base"> | string
    cidade?: StringWithAggregatesFilter<"Base"> | string
    latitude?: FloatNullableWithAggregatesFilter<"Base"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"Base"> | number | null
    raioMetros?: IntWithAggregatesFilter<"Base"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Base"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Base"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    senhaHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    baseId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    base?: XOR<BaseNullableScalarRelationFilter, BaseWhereInput> | null
    justificativas?: JustificativaAtrasoListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    baseId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    base?: BaseOrderByWithRelationInput
    justificativas?: JustificativaAtrasoOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    senhaHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    baseId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    base?: XOR<BaseNullableScalarRelationFilter, BaseWhereInput> | null
    justificativas?: JustificativaAtrasoListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    baseId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    senhaHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    baseId?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type VeiculoWhereInput = {
    AND?: VeiculoWhereInput | VeiculoWhereInput[]
    OR?: VeiculoWhereInput[]
    NOT?: VeiculoWhereInput | VeiculoWhereInput[]
    id?: StringFilter<"Veiculo"> | string
    placa?: StringFilter<"Veiculo"> | string
    descricao?: StringNullableFilter<"Veiculo"> | string | null
    createdAt?: DateTimeFilter<"Veiculo"> | Date | string
    updatedAt?: DateTimeFilter<"Veiculo"> | Date | string
    viagens?: ViagemListRelationFilter
    telemetrias?: TelemetriaListRelationFilter
  }

  export type VeiculoOrderByWithRelationInput = {
    id?: SortOrder
    placa?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    viagens?: ViagemOrderByRelationAggregateInput
    telemetrias?: TelemetriaOrderByRelationAggregateInput
  }

  export type VeiculoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    placa?: string
    AND?: VeiculoWhereInput | VeiculoWhereInput[]
    OR?: VeiculoWhereInput[]
    NOT?: VeiculoWhereInput | VeiculoWhereInput[]
    descricao?: StringNullableFilter<"Veiculo"> | string | null
    createdAt?: DateTimeFilter<"Veiculo"> | Date | string
    updatedAt?: DateTimeFilter<"Veiculo"> | Date | string
    viagens?: ViagemListRelationFilter
    telemetrias?: TelemetriaListRelationFilter
  }, "id" | "placa">

  export type VeiculoOrderByWithAggregationInput = {
    id?: SortOrder
    placa?: SortOrder
    descricao?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VeiculoCountOrderByAggregateInput
    _max?: VeiculoMaxOrderByAggregateInput
    _min?: VeiculoMinOrderByAggregateInput
  }

  export type VeiculoScalarWhereWithAggregatesInput = {
    AND?: VeiculoScalarWhereWithAggregatesInput | VeiculoScalarWhereWithAggregatesInput[]
    OR?: VeiculoScalarWhereWithAggregatesInput[]
    NOT?: VeiculoScalarWhereWithAggregatesInput | VeiculoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Veiculo"> | string
    placa?: StringWithAggregatesFilter<"Veiculo"> | string
    descricao?: StringNullableWithAggregatesFilter<"Veiculo"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Veiculo"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Veiculo"> | Date | string
  }

  export type ViagemWhereInput = {
    AND?: ViagemWhereInput | ViagemWhereInput[]
    OR?: ViagemWhereInput[]
    NOT?: ViagemWhereInput | ViagemWhereInput[]
    id?: StringFilter<"Viagem"> | string
    motorista?: StringFilter<"Viagem"> | string
    rotaDescricao?: StringFilter<"Viagem"> | string
    veiculoId?: StringFilter<"Viagem"> | string
    baseOrigemId?: StringFilter<"Viagem"> | string
    baseDestinoId?: StringFilter<"Viagem"> | string
    status?: EnumStatusViagemFilter<"Viagem"> | $Enums.StatusViagem
    prevInicioReal?: DateTimeFilter<"Viagem"> | Date | string
    prevFimReal?: DateTimeFilter<"Viagem"> | Date | string
    dataInicioEfetivo?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    dataFimEfetivo?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    rotaPadraoId?: StringNullableFilter<"Viagem"> | string | null
    novaPrevisaoSaida?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    createdAt?: DateTimeFilter<"Viagem"> | Date | string
    updatedAt?: DateTimeFilter<"Viagem"> | Date | string
    veiculo?: XOR<VeiculoScalarRelationFilter, VeiculoWhereInput>
    baseOrigem?: XOR<BaseScalarRelationFilter, BaseWhereInput>
    baseDestino?: XOR<BaseScalarRelationFilter, BaseWhereInput>
    rotaPadrao?: XOR<RotaPadraoNullableScalarRelationFilter, RotaPadraoWhereInput> | null
    paradasViagem?: ParadaViagemListRelationFilter
    justificativas?: JustificativaAtrasoListRelationFilter
    telemetrias?: TelemetriaListRelationFilter
  }

  export type ViagemOrderByWithRelationInput = {
    id?: SortOrder
    motorista?: SortOrder
    rotaDescricao?: SortOrder
    veiculoId?: SortOrder
    baseOrigemId?: SortOrder
    baseDestinoId?: SortOrder
    status?: SortOrder
    prevInicioReal?: SortOrder
    prevFimReal?: SortOrder
    dataInicioEfetivo?: SortOrderInput | SortOrder
    dataFimEfetivo?: SortOrderInput | SortOrder
    rotaPadraoId?: SortOrderInput | SortOrder
    novaPrevisaoSaida?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    veiculo?: VeiculoOrderByWithRelationInput
    baseOrigem?: BaseOrderByWithRelationInput
    baseDestino?: BaseOrderByWithRelationInput
    rotaPadrao?: RotaPadraoOrderByWithRelationInput
    paradasViagem?: ParadaViagemOrderByRelationAggregateInput
    justificativas?: JustificativaAtrasoOrderByRelationAggregateInput
    telemetrias?: TelemetriaOrderByRelationAggregateInput
  }

  export type ViagemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ViagemWhereInput | ViagemWhereInput[]
    OR?: ViagemWhereInput[]
    NOT?: ViagemWhereInput | ViagemWhereInput[]
    motorista?: StringFilter<"Viagem"> | string
    rotaDescricao?: StringFilter<"Viagem"> | string
    veiculoId?: StringFilter<"Viagem"> | string
    baseOrigemId?: StringFilter<"Viagem"> | string
    baseDestinoId?: StringFilter<"Viagem"> | string
    status?: EnumStatusViagemFilter<"Viagem"> | $Enums.StatusViagem
    prevInicioReal?: DateTimeFilter<"Viagem"> | Date | string
    prevFimReal?: DateTimeFilter<"Viagem"> | Date | string
    dataInicioEfetivo?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    dataFimEfetivo?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    rotaPadraoId?: StringNullableFilter<"Viagem"> | string | null
    novaPrevisaoSaida?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    createdAt?: DateTimeFilter<"Viagem"> | Date | string
    updatedAt?: DateTimeFilter<"Viagem"> | Date | string
    veiculo?: XOR<VeiculoScalarRelationFilter, VeiculoWhereInput>
    baseOrigem?: XOR<BaseScalarRelationFilter, BaseWhereInput>
    baseDestino?: XOR<BaseScalarRelationFilter, BaseWhereInput>
    rotaPadrao?: XOR<RotaPadraoNullableScalarRelationFilter, RotaPadraoWhereInput> | null
    paradasViagem?: ParadaViagemListRelationFilter
    justificativas?: JustificativaAtrasoListRelationFilter
    telemetrias?: TelemetriaListRelationFilter
  }, "id">

  export type ViagemOrderByWithAggregationInput = {
    id?: SortOrder
    motorista?: SortOrder
    rotaDescricao?: SortOrder
    veiculoId?: SortOrder
    baseOrigemId?: SortOrder
    baseDestinoId?: SortOrder
    status?: SortOrder
    prevInicioReal?: SortOrder
    prevFimReal?: SortOrder
    dataInicioEfetivo?: SortOrderInput | SortOrder
    dataFimEfetivo?: SortOrderInput | SortOrder
    rotaPadraoId?: SortOrderInput | SortOrder
    novaPrevisaoSaida?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ViagemCountOrderByAggregateInput
    _max?: ViagemMaxOrderByAggregateInput
    _min?: ViagemMinOrderByAggregateInput
  }

  export type ViagemScalarWhereWithAggregatesInput = {
    AND?: ViagemScalarWhereWithAggregatesInput | ViagemScalarWhereWithAggregatesInput[]
    OR?: ViagemScalarWhereWithAggregatesInput[]
    NOT?: ViagemScalarWhereWithAggregatesInput | ViagemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Viagem"> | string
    motorista?: StringWithAggregatesFilter<"Viagem"> | string
    rotaDescricao?: StringWithAggregatesFilter<"Viagem"> | string
    veiculoId?: StringWithAggregatesFilter<"Viagem"> | string
    baseOrigemId?: StringWithAggregatesFilter<"Viagem"> | string
    baseDestinoId?: StringWithAggregatesFilter<"Viagem"> | string
    status?: EnumStatusViagemWithAggregatesFilter<"Viagem"> | $Enums.StatusViagem
    prevInicioReal?: DateTimeWithAggregatesFilter<"Viagem"> | Date | string
    prevFimReal?: DateTimeWithAggregatesFilter<"Viagem"> | Date | string
    dataInicioEfetivo?: DateTimeNullableWithAggregatesFilter<"Viagem"> | Date | string | null
    dataFimEfetivo?: DateTimeNullableWithAggregatesFilter<"Viagem"> | Date | string | null
    rotaPadraoId?: StringNullableWithAggregatesFilter<"Viagem"> | string | null
    novaPrevisaoSaida?: DateTimeNullableWithAggregatesFilter<"Viagem"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Viagem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Viagem"> | Date | string
  }

  export type JustificativaAtrasoWhereInput = {
    AND?: JustificativaAtrasoWhereInput | JustificativaAtrasoWhereInput[]
    OR?: JustificativaAtrasoWhereInput[]
    NOT?: JustificativaAtrasoWhereInput | JustificativaAtrasoWhereInput[]
    id?: StringFilter<"JustificativaAtraso"> | string
    viagemId?: StringFilter<"JustificativaAtraso"> | string
    tipoAtraso?: EnumTipoAtrasoFilter<"JustificativaAtraso"> | $Enums.TipoAtraso
    motivo?: StringFilter<"JustificativaAtraso"> | string
    usuarioId?: StringFilter<"JustificativaAtraso"> | string
    baseId?: StringNullableFilter<"JustificativaAtraso"> | string | null
    tempoAtrasoMinutos?: IntFilter<"JustificativaAtraso"> | number
    createdAt?: DateTimeFilter<"JustificativaAtraso"> | Date | string
    viagem?: XOR<ViagemScalarRelationFilter, ViagemWhereInput>
    usuario?: XOR<UserScalarRelationFilter, UserWhereInput>
    base?: XOR<BaseNullableScalarRelationFilter, BaseWhereInput> | null
  }

  export type JustificativaAtrasoOrderByWithRelationInput = {
    id?: SortOrder
    viagemId?: SortOrder
    tipoAtraso?: SortOrder
    motivo?: SortOrder
    usuarioId?: SortOrder
    baseId?: SortOrderInput | SortOrder
    tempoAtrasoMinutos?: SortOrder
    createdAt?: SortOrder
    viagem?: ViagemOrderByWithRelationInput
    usuario?: UserOrderByWithRelationInput
    base?: BaseOrderByWithRelationInput
  }

  export type JustificativaAtrasoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JustificativaAtrasoWhereInput | JustificativaAtrasoWhereInput[]
    OR?: JustificativaAtrasoWhereInput[]
    NOT?: JustificativaAtrasoWhereInput | JustificativaAtrasoWhereInput[]
    viagemId?: StringFilter<"JustificativaAtraso"> | string
    tipoAtraso?: EnumTipoAtrasoFilter<"JustificativaAtraso"> | $Enums.TipoAtraso
    motivo?: StringFilter<"JustificativaAtraso"> | string
    usuarioId?: StringFilter<"JustificativaAtraso"> | string
    baseId?: StringNullableFilter<"JustificativaAtraso"> | string | null
    tempoAtrasoMinutos?: IntFilter<"JustificativaAtraso"> | number
    createdAt?: DateTimeFilter<"JustificativaAtraso"> | Date | string
    viagem?: XOR<ViagemScalarRelationFilter, ViagemWhereInput>
    usuario?: XOR<UserScalarRelationFilter, UserWhereInput>
    base?: XOR<BaseNullableScalarRelationFilter, BaseWhereInput> | null
  }, "id">

  export type JustificativaAtrasoOrderByWithAggregationInput = {
    id?: SortOrder
    viagemId?: SortOrder
    tipoAtraso?: SortOrder
    motivo?: SortOrder
    usuarioId?: SortOrder
    baseId?: SortOrderInput | SortOrder
    tempoAtrasoMinutos?: SortOrder
    createdAt?: SortOrder
    _count?: JustificativaAtrasoCountOrderByAggregateInput
    _avg?: JustificativaAtrasoAvgOrderByAggregateInput
    _max?: JustificativaAtrasoMaxOrderByAggregateInput
    _min?: JustificativaAtrasoMinOrderByAggregateInput
    _sum?: JustificativaAtrasoSumOrderByAggregateInput
  }

  export type JustificativaAtrasoScalarWhereWithAggregatesInput = {
    AND?: JustificativaAtrasoScalarWhereWithAggregatesInput | JustificativaAtrasoScalarWhereWithAggregatesInput[]
    OR?: JustificativaAtrasoScalarWhereWithAggregatesInput[]
    NOT?: JustificativaAtrasoScalarWhereWithAggregatesInput | JustificativaAtrasoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"JustificativaAtraso"> | string
    viagemId?: StringWithAggregatesFilter<"JustificativaAtraso"> | string
    tipoAtraso?: EnumTipoAtrasoWithAggregatesFilter<"JustificativaAtraso"> | $Enums.TipoAtraso
    motivo?: StringWithAggregatesFilter<"JustificativaAtraso"> | string
    usuarioId?: StringWithAggregatesFilter<"JustificativaAtraso"> | string
    baseId?: StringNullableWithAggregatesFilter<"JustificativaAtraso"> | string | null
    tempoAtrasoMinutos?: IntWithAggregatesFilter<"JustificativaAtraso"> | number
    createdAt?: DateTimeWithAggregatesFilter<"JustificativaAtraso"> | Date | string
  }

  export type TelemetriaWhereInput = {
    AND?: TelemetriaWhereInput | TelemetriaWhereInput[]
    OR?: TelemetriaWhereInput[]
    NOT?: TelemetriaWhereInput | TelemetriaWhereInput[]
    id?: StringFilter<"Telemetria"> | string
    veiculoId?: StringFilter<"Telemetria"> | string
    viagemId?: StringNullableFilter<"Telemetria"> | string | null
    latitude?: FloatFilter<"Telemetria"> | number
    longitude?: FloatFilter<"Telemetria"> | number
    ignicao?: BoolFilter<"Telemetria"> | boolean
    velocidade?: IntNullableFilter<"Telemetria"> | number | null
    dataHoraUtc?: DateTimeFilter<"Telemetria"> | Date | string
    dataHoraLocal?: DateTimeFilter<"Telemetria"> | Date | string
    createdAt?: DateTimeFilter<"Telemetria"> | Date | string
    veiculo?: XOR<VeiculoScalarRelationFilter, VeiculoWhereInput>
    viagem?: XOR<ViagemNullableScalarRelationFilter, ViagemWhereInput> | null
  }

  export type TelemetriaOrderByWithRelationInput = {
    id?: SortOrder
    veiculoId?: SortOrder
    viagemId?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    ignicao?: SortOrder
    velocidade?: SortOrderInput | SortOrder
    dataHoraUtc?: SortOrder
    dataHoraLocal?: SortOrder
    createdAt?: SortOrder
    veiculo?: VeiculoOrderByWithRelationInput
    viagem?: ViagemOrderByWithRelationInput
  }

  export type TelemetriaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TelemetriaWhereInput | TelemetriaWhereInput[]
    OR?: TelemetriaWhereInput[]
    NOT?: TelemetriaWhereInput | TelemetriaWhereInput[]
    veiculoId?: StringFilter<"Telemetria"> | string
    viagemId?: StringNullableFilter<"Telemetria"> | string | null
    latitude?: FloatFilter<"Telemetria"> | number
    longitude?: FloatFilter<"Telemetria"> | number
    ignicao?: BoolFilter<"Telemetria"> | boolean
    velocidade?: IntNullableFilter<"Telemetria"> | number | null
    dataHoraUtc?: DateTimeFilter<"Telemetria"> | Date | string
    dataHoraLocal?: DateTimeFilter<"Telemetria"> | Date | string
    createdAt?: DateTimeFilter<"Telemetria"> | Date | string
    veiculo?: XOR<VeiculoScalarRelationFilter, VeiculoWhereInput>
    viagem?: XOR<ViagemNullableScalarRelationFilter, ViagemWhereInput> | null
  }, "id">

  export type TelemetriaOrderByWithAggregationInput = {
    id?: SortOrder
    veiculoId?: SortOrder
    viagemId?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    ignicao?: SortOrder
    velocidade?: SortOrderInput | SortOrder
    dataHoraUtc?: SortOrder
    dataHoraLocal?: SortOrder
    createdAt?: SortOrder
    _count?: TelemetriaCountOrderByAggregateInput
    _avg?: TelemetriaAvgOrderByAggregateInput
    _max?: TelemetriaMaxOrderByAggregateInput
    _min?: TelemetriaMinOrderByAggregateInput
    _sum?: TelemetriaSumOrderByAggregateInput
  }

  export type TelemetriaScalarWhereWithAggregatesInput = {
    AND?: TelemetriaScalarWhereWithAggregatesInput | TelemetriaScalarWhereWithAggregatesInput[]
    OR?: TelemetriaScalarWhereWithAggregatesInput[]
    NOT?: TelemetriaScalarWhereWithAggregatesInput | TelemetriaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Telemetria"> | string
    veiculoId?: StringWithAggregatesFilter<"Telemetria"> | string
    viagemId?: StringNullableWithAggregatesFilter<"Telemetria"> | string | null
    latitude?: FloatWithAggregatesFilter<"Telemetria"> | number
    longitude?: FloatWithAggregatesFilter<"Telemetria"> | number
    ignicao?: BoolWithAggregatesFilter<"Telemetria"> | boolean
    velocidade?: IntNullableWithAggregatesFilter<"Telemetria"> | number | null
    dataHoraUtc?: DateTimeWithAggregatesFilter<"Telemetria"> | Date | string
    dataHoraLocal?: DateTimeWithAggregatesFilter<"Telemetria"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Telemetria"> | Date | string
  }

  export type RotaPadraoWhereInput = {
    AND?: RotaPadraoWhereInput | RotaPadraoWhereInput[]
    OR?: RotaPadraoWhereInput[]
    NOT?: RotaPadraoWhereInput | RotaPadraoWhereInput[]
    id?: StringFilter<"RotaPadrao"> | string
    nome?: StringFilter<"RotaPadrao"> | string
    paradas?: ParadaPadraoListRelationFilter
    viagens?: ViagemListRelationFilter
  }

  export type RotaPadraoOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    paradas?: ParadaPadraoOrderByRelationAggregateInput
    viagens?: ViagemOrderByRelationAggregateInput
  }

  export type RotaPadraoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nome?: string
    AND?: RotaPadraoWhereInput | RotaPadraoWhereInput[]
    OR?: RotaPadraoWhereInput[]
    NOT?: RotaPadraoWhereInput | RotaPadraoWhereInput[]
    paradas?: ParadaPadraoListRelationFilter
    viagens?: ViagemListRelationFilter
  }, "id" | "nome">

  export type RotaPadraoOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    _count?: RotaPadraoCountOrderByAggregateInput
    _max?: RotaPadraoMaxOrderByAggregateInput
    _min?: RotaPadraoMinOrderByAggregateInput
  }

  export type RotaPadraoScalarWhereWithAggregatesInput = {
    AND?: RotaPadraoScalarWhereWithAggregatesInput | RotaPadraoScalarWhereWithAggregatesInput[]
    OR?: RotaPadraoScalarWhereWithAggregatesInput[]
    NOT?: RotaPadraoScalarWhereWithAggregatesInput | RotaPadraoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RotaPadrao"> | string
    nome?: StringWithAggregatesFilter<"RotaPadrao"> | string
  }

  export type ParadaPadraoWhereInput = {
    AND?: ParadaPadraoWhereInput | ParadaPadraoWhereInput[]
    OR?: ParadaPadraoWhereInput[]
    NOT?: ParadaPadraoWhereInput | ParadaPadraoWhereInput[]
    id?: StringFilter<"ParadaPadrao"> | string
    rotaId?: StringFilter<"ParadaPadrao"> | string
    baseId?: StringFilter<"ParadaPadrao"> | string
    ordem?: IntFilter<"ParadaPadrao"> | number
    prevChegada?: StringNullableFilter<"ParadaPadrao"> | string | null
    prevSaida?: StringNullableFilter<"ParadaPadrao"> | string | null
    rota?: XOR<RotaPadraoScalarRelationFilter, RotaPadraoWhereInput>
    base?: XOR<BaseScalarRelationFilter, BaseWhereInput>
  }

  export type ParadaPadraoOrderByWithRelationInput = {
    id?: SortOrder
    rotaId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrderInput | SortOrder
    prevSaida?: SortOrderInput | SortOrder
    rota?: RotaPadraoOrderByWithRelationInput
    base?: BaseOrderByWithRelationInput
  }

  export type ParadaPadraoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ParadaPadraoWhereInput | ParadaPadraoWhereInput[]
    OR?: ParadaPadraoWhereInput[]
    NOT?: ParadaPadraoWhereInput | ParadaPadraoWhereInput[]
    rotaId?: StringFilter<"ParadaPadrao"> | string
    baseId?: StringFilter<"ParadaPadrao"> | string
    ordem?: IntFilter<"ParadaPadrao"> | number
    prevChegada?: StringNullableFilter<"ParadaPadrao"> | string | null
    prevSaida?: StringNullableFilter<"ParadaPadrao"> | string | null
    rota?: XOR<RotaPadraoScalarRelationFilter, RotaPadraoWhereInput>
    base?: XOR<BaseScalarRelationFilter, BaseWhereInput>
  }, "id">

  export type ParadaPadraoOrderByWithAggregationInput = {
    id?: SortOrder
    rotaId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrderInput | SortOrder
    prevSaida?: SortOrderInput | SortOrder
    _count?: ParadaPadraoCountOrderByAggregateInput
    _avg?: ParadaPadraoAvgOrderByAggregateInput
    _max?: ParadaPadraoMaxOrderByAggregateInput
    _min?: ParadaPadraoMinOrderByAggregateInput
    _sum?: ParadaPadraoSumOrderByAggregateInput
  }

  export type ParadaPadraoScalarWhereWithAggregatesInput = {
    AND?: ParadaPadraoScalarWhereWithAggregatesInput | ParadaPadraoScalarWhereWithAggregatesInput[]
    OR?: ParadaPadraoScalarWhereWithAggregatesInput[]
    NOT?: ParadaPadraoScalarWhereWithAggregatesInput | ParadaPadraoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ParadaPadrao"> | string
    rotaId?: StringWithAggregatesFilter<"ParadaPadrao"> | string
    baseId?: StringWithAggregatesFilter<"ParadaPadrao"> | string
    ordem?: IntWithAggregatesFilter<"ParadaPadrao"> | number
    prevChegada?: StringNullableWithAggregatesFilter<"ParadaPadrao"> | string | null
    prevSaida?: StringNullableWithAggregatesFilter<"ParadaPadrao"> | string | null
  }

  export type ParadaViagemWhereInput = {
    AND?: ParadaViagemWhereInput | ParadaViagemWhereInput[]
    OR?: ParadaViagemWhereInput[]
    NOT?: ParadaViagemWhereInput | ParadaViagemWhereInput[]
    id?: StringFilter<"ParadaViagem"> | string
    viagemId?: StringFilter<"ParadaViagem"> | string
    baseId?: StringFilter<"ParadaViagem"> | string
    ordem?: IntFilter<"ParadaViagem"> | number
    prevChegada?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    prevSaida?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    dataChegadaEfetiva?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    dataSaidaEfetiva?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    viagem?: XOR<ViagemScalarRelationFilter, ViagemWhereInput>
    base?: XOR<BaseScalarRelationFilter, BaseWhereInput>
  }

  export type ParadaViagemOrderByWithRelationInput = {
    id?: SortOrder
    viagemId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrderInput | SortOrder
    prevSaida?: SortOrderInput | SortOrder
    dataChegadaEfetiva?: SortOrderInput | SortOrder
    dataSaidaEfetiva?: SortOrderInput | SortOrder
    viagem?: ViagemOrderByWithRelationInput
    base?: BaseOrderByWithRelationInput
  }

  export type ParadaViagemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ParadaViagemWhereInput | ParadaViagemWhereInput[]
    OR?: ParadaViagemWhereInput[]
    NOT?: ParadaViagemWhereInput | ParadaViagemWhereInput[]
    viagemId?: StringFilter<"ParadaViagem"> | string
    baseId?: StringFilter<"ParadaViagem"> | string
    ordem?: IntFilter<"ParadaViagem"> | number
    prevChegada?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    prevSaida?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    dataChegadaEfetiva?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    dataSaidaEfetiva?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    viagem?: XOR<ViagemScalarRelationFilter, ViagemWhereInput>
    base?: XOR<BaseScalarRelationFilter, BaseWhereInput>
  }, "id">

  export type ParadaViagemOrderByWithAggregationInput = {
    id?: SortOrder
    viagemId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrderInput | SortOrder
    prevSaida?: SortOrderInput | SortOrder
    dataChegadaEfetiva?: SortOrderInput | SortOrder
    dataSaidaEfetiva?: SortOrderInput | SortOrder
    _count?: ParadaViagemCountOrderByAggregateInput
    _avg?: ParadaViagemAvgOrderByAggregateInput
    _max?: ParadaViagemMaxOrderByAggregateInput
    _min?: ParadaViagemMinOrderByAggregateInput
    _sum?: ParadaViagemSumOrderByAggregateInput
  }

  export type ParadaViagemScalarWhereWithAggregatesInput = {
    AND?: ParadaViagemScalarWhereWithAggregatesInput | ParadaViagemScalarWhereWithAggregatesInput[]
    OR?: ParadaViagemScalarWhereWithAggregatesInput[]
    NOT?: ParadaViagemScalarWhereWithAggregatesInput | ParadaViagemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ParadaViagem"> | string
    viagemId?: StringWithAggregatesFilter<"ParadaViagem"> | string
    baseId?: StringWithAggregatesFilter<"ParadaViagem"> | string
    ordem?: IntWithAggregatesFilter<"ParadaViagem"> | number
    prevChegada?: DateTimeNullableWithAggregatesFilter<"ParadaViagem"> | Date | string | null
    prevSaida?: DateTimeNullableWithAggregatesFilter<"ParadaViagem"> | Date | string | null
    dataChegadaEfetiva?: DateTimeNullableWithAggregatesFilter<"ParadaViagem"> | Date | string | null
    dataSaidaEfetiva?: DateTimeNullableWithAggregatesFilter<"ParadaViagem"> | Date | string | null
  }

  export type BaseCreateInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutBaseInput
  }

  export type BaseUncheckedCreateInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemUncheckedCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemUncheckedCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoUncheckedCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutBaseInput
  }

  export type BaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutBaseNestedInput
  }

  export type BaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUncheckedUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUncheckedUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUncheckedUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutBaseNestedInput
  }

  export type BaseCreateManyInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    senhaHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    base?: BaseCreateNestedOneWithoutUsuariosInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutUsuarioInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    senhaHash: string
    role?: $Enums.Role
    baseId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    base?: BaseUpdateOneWithoutUsuariosNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    senhaHash: string
    role?: $Enums.Role
    baseId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VeiculoCreateInput = {
    id: string
    placa: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    viagens?: ViagemCreateNestedManyWithoutVeiculoInput
    telemetrias?: TelemetriaCreateNestedManyWithoutVeiculoInput
  }

  export type VeiculoUncheckedCreateInput = {
    id: string
    placa: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    viagens?: ViagemUncheckedCreateNestedManyWithoutVeiculoInput
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutVeiculoInput
  }

  export type VeiculoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    placa?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagens?: ViagemUpdateManyWithoutVeiculoNestedInput
    telemetrias?: TelemetriaUpdateManyWithoutVeiculoNestedInput
  }

  export type VeiculoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    placa?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagens?: ViagemUncheckedUpdateManyWithoutVeiculoNestedInput
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutVeiculoNestedInput
  }

  export type VeiculoCreateManyInput = {
    id: string
    placa: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VeiculoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    placa?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VeiculoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    placa?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViagemCreateInput = {
    id: string
    motorista: string
    rotaDescricao: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutViagensInput
    baseOrigem: BaseCreateNestedOneWithoutViagensOrigemInput
    baseDestino: BaseCreateNestedOneWithoutViagensDestinoInput
    rotaPadrao?: RotaPadraoCreateNestedOneWithoutViagensInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaCreateNestedManyWithoutViagemInput
  }

  export type ViagemUncheckedCreateInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutViagemInput
  }

  export type ViagemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutViagensNestedInput
    baseOrigem?: BaseUpdateOneRequiredWithoutViagensOrigemNestedInput
    baseDestino?: BaseUpdateOneRequiredWithoutViagensDestinoNestedInput
    rotaPadrao?: RotaPadraoUpdateOneWithoutViagensNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutViagemNestedInput
  }

  export type ViagemCreateManyInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ViagemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViagemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JustificativaAtrasoCreateInput = {
    id?: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    tempoAtrasoMinutos: number
    createdAt?: Date | string
    viagem: ViagemCreateNestedOneWithoutJustificativasInput
    usuario: UserCreateNestedOneWithoutJustificativasInput
    base?: BaseCreateNestedOneWithoutJustificativasInput
  }

  export type JustificativaAtrasoUncheckedCreateInput = {
    id?: string
    viagemId: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    usuarioId: string
    baseId?: string | null
    tempoAtrasoMinutos: number
    createdAt?: Date | string
  }

  export type JustificativaAtrasoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagem?: ViagemUpdateOneRequiredWithoutJustificativasNestedInput
    usuario?: UserUpdateOneRequiredWithoutJustificativasNestedInput
    base?: BaseUpdateOneWithoutJustificativasNestedInput
  }

  export type JustificativaAtrasoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JustificativaAtrasoCreateManyInput = {
    id?: string
    viagemId: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    usuarioId: string
    baseId?: string | null
    tempoAtrasoMinutos: number
    createdAt?: Date | string
  }

  export type JustificativaAtrasoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JustificativaAtrasoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetriaCreateInput = {
    id?: string
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutTelemetriasInput
    viagem?: ViagemCreateNestedOneWithoutTelemetriasInput
  }

  export type TelemetriaUncheckedCreateInput = {
    id?: string
    veiculoId: string
    viagemId?: string | null
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
  }

  export type TelemetriaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutTelemetriasNestedInput
    viagem?: ViagemUpdateOneWithoutTelemetriasNestedInput
  }

  export type TelemetriaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    viagemId?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetriaCreateManyInput = {
    id?: string
    veiculoId: string
    viagemId?: string | null
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
  }

  export type TelemetriaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetriaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    viagemId?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RotaPadraoCreateInput = {
    id?: string
    nome: string
    paradas?: ParadaPadraoCreateNestedManyWithoutRotaInput
    viagens?: ViagemCreateNestedManyWithoutRotaPadraoInput
  }

  export type RotaPadraoUncheckedCreateInput = {
    id?: string
    nome: string
    paradas?: ParadaPadraoUncheckedCreateNestedManyWithoutRotaInput
    viagens?: ViagemUncheckedCreateNestedManyWithoutRotaPadraoInput
  }

  export type RotaPadraoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    paradas?: ParadaPadraoUpdateManyWithoutRotaNestedInput
    viagens?: ViagemUpdateManyWithoutRotaPadraoNestedInput
  }

  export type RotaPadraoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    paradas?: ParadaPadraoUncheckedUpdateManyWithoutRotaNestedInput
    viagens?: ViagemUncheckedUpdateManyWithoutRotaPadraoNestedInput
  }

  export type RotaPadraoCreateManyInput = {
    id?: string
    nome: string
  }

  export type RotaPadraoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
  }

  export type RotaPadraoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
  }

  export type ParadaPadraoCreateInput = {
    id?: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
    rota: RotaPadraoCreateNestedOneWithoutParadasInput
    base: BaseCreateNestedOneWithoutParadasPadraoInput
  }

  export type ParadaPadraoUncheckedCreateInput = {
    id?: string
    rotaId: string
    baseId: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
  }

  export type ParadaPadraoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
    rota?: RotaPadraoUpdateOneRequiredWithoutParadasNestedInput
    base?: BaseUpdateOneRequiredWithoutParadasPadraoNestedInput
  }

  export type ParadaPadraoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rotaId?: StringFieldUpdateOperationsInput | string
    baseId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ParadaPadraoCreateManyInput = {
    id?: string
    rotaId: string
    baseId: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
  }

  export type ParadaPadraoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ParadaPadraoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rotaId?: StringFieldUpdateOperationsInput | string
    baseId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ParadaViagemCreateInput = {
    id?: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
    viagem: ViagemCreateNestedOneWithoutParadasViagemInput
    base: BaseCreateNestedOneWithoutParadasViagemInput
  }

  export type ParadaViagemUncheckedCreateInput = {
    id?: string
    viagemId: string
    baseId: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
  }

  export type ParadaViagemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    viagem?: ViagemUpdateOneRequiredWithoutParadasViagemNestedInput
    base?: BaseUpdateOneRequiredWithoutParadasViagemNestedInput
  }

  export type ParadaViagemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    baseId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ParadaViagemCreateManyInput = {
    id?: string
    viagemId: string
    baseId: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
  }

  export type ParadaViagemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ParadaViagemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    baseId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type ViagemListRelationFilter = {
    every?: ViagemWhereInput
    some?: ViagemWhereInput
    none?: ViagemWhereInput
  }

  export type JustificativaAtrasoListRelationFilter = {
    every?: JustificativaAtrasoWhereInput
    some?: JustificativaAtrasoWhereInput
    none?: JustificativaAtrasoWhereInput
  }

  export type ParadaPadraoListRelationFilter = {
    every?: ParadaPadraoWhereInput
    some?: ParadaPadraoWhereInput
    none?: ParadaPadraoWhereInput
  }

  export type ParadaViagemListRelationFilter = {
    every?: ParadaViagemWhereInput
    some?: ParadaViagemWhereInput
    none?: ParadaViagemWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ViagemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JustificativaAtrasoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ParadaPadraoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ParadaViagemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BaseCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    raioMetros?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BaseAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    raioMetros?: SortOrder
  }

  export type BaseMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    raioMetros?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BaseMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cidade?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    raioMetros?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BaseSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    raioMetros?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BaseNullableScalarRelationFilter = {
    is?: BaseWhereInput | null
    isNot?: BaseWhereInput | null
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    baseId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    baseId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    baseId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type TelemetriaListRelationFilter = {
    every?: TelemetriaWhereInput
    some?: TelemetriaWhereInput
    none?: TelemetriaWhereInput
  }

  export type TelemetriaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VeiculoCountOrderByAggregateInput = {
    id?: SortOrder
    placa?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VeiculoMaxOrderByAggregateInput = {
    id?: SortOrder
    placa?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VeiculoMinOrderByAggregateInput = {
    id?: SortOrder
    placa?: SortOrder
    descricao?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumStatusViagemFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusViagem | EnumStatusViagemFieldRefInput<$PrismaModel>
    in?: $Enums.StatusViagem[] | ListEnumStatusViagemFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusViagem[] | ListEnumStatusViagemFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusViagemFilter<$PrismaModel> | $Enums.StatusViagem
  }

  export type VeiculoScalarRelationFilter = {
    is?: VeiculoWhereInput
    isNot?: VeiculoWhereInput
  }

  export type BaseScalarRelationFilter = {
    is?: BaseWhereInput
    isNot?: BaseWhereInput
  }

  export type RotaPadraoNullableScalarRelationFilter = {
    is?: RotaPadraoWhereInput | null
    isNot?: RotaPadraoWhereInput | null
  }

  export type ViagemCountOrderByAggregateInput = {
    id?: SortOrder
    motorista?: SortOrder
    rotaDescricao?: SortOrder
    veiculoId?: SortOrder
    baseOrigemId?: SortOrder
    baseDestinoId?: SortOrder
    status?: SortOrder
    prevInicioReal?: SortOrder
    prevFimReal?: SortOrder
    dataInicioEfetivo?: SortOrder
    dataFimEfetivo?: SortOrder
    rotaPadraoId?: SortOrder
    novaPrevisaoSaida?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ViagemMaxOrderByAggregateInput = {
    id?: SortOrder
    motorista?: SortOrder
    rotaDescricao?: SortOrder
    veiculoId?: SortOrder
    baseOrigemId?: SortOrder
    baseDestinoId?: SortOrder
    status?: SortOrder
    prevInicioReal?: SortOrder
    prevFimReal?: SortOrder
    dataInicioEfetivo?: SortOrder
    dataFimEfetivo?: SortOrder
    rotaPadraoId?: SortOrder
    novaPrevisaoSaida?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ViagemMinOrderByAggregateInput = {
    id?: SortOrder
    motorista?: SortOrder
    rotaDescricao?: SortOrder
    veiculoId?: SortOrder
    baseOrigemId?: SortOrder
    baseDestinoId?: SortOrder
    status?: SortOrder
    prevInicioReal?: SortOrder
    prevFimReal?: SortOrder
    dataInicioEfetivo?: SortOrder
    dataFimEfetivo?: SortOrder
    rotaPadraoId?: SortOrder
    novaPrevisaoSaida?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumStatusViagemWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusViagem | EnumStatusViagemFieldRefInput<$PrismaModel>
    in?: $Enums.StatusViagem[] | ListEnumStatusViagemFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusViagem[] | ListEnumStatusViagemFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusViagemWithAggregatesFilter<$PrismaModel> | $Enums.StatusViagem
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusViagemFilter<$PrismaModel>
    _max?: NestedEnumStatusViagemFilter<$PrismaModel>
  }

  export type EnumTipoAtrasoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoAtraso | EnumTipoAtrasoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoAtraso[] | ListEnumTipoAtrasoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoAtraso[] | ListEnumTipoAtrasoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoAtrasoFilter<$PrismaModel> | $Enums.TipoAtraso
  }

  export type ViagemScalarRelationFilter = {
    is?: ViagemWhereInput
    isNot?: ViagemWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type JustificativaAtrasoCountOrderByAggregateInput = {
    id?: SortOrder
    viagemId?: SortOrder
    tipoAtraso?: SortOrder
    motivo?: SortOrder
    usuarioId?: SortOrder
    baseId?: SortOrder
    tempoAtrasoMinutos?: SortOrder
    createdAt?: SortOrder
  }

  export type JustificativaAtrasoAvgOrderByAggregateInput = {
    tempoAtrasoMinutos?: SortOrder
  }

  export type JustificativaAtrasoMaxOrderByAggregateInput = {
    id?: SortOrder
    viagemId?: SortOrder
    tipoAtraso?: SortOrder
    motivo?: SortOrder
    usuarioId?: SortOrder
    baseId?: SortOrder
    tempoAtrasoMinutos?: SortOrder
    createdAt?: SortOrder
  }

  export type JustificativaAtrasoMinOrderByAggregateInput = {
    id?: SortOrder
    viagemId?: SortOrder
    tipoAtraso?: SortOrder
    motivo?: SortOrder
    usuarioId?: SortOrder
    baseId?: SortOrder
    tempoAtrasoMinutos?: SortOrder
    createdAt?: SortOrder
  }

  export type JustificativaAtrasoSumOrderByAggregateInput = {
    tempoAtrasoMinutos?: SortOrder
  }

  export type EnumTipoAtrasoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoAtraso | EnumTipoAtrasoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoAtraso[] | ListEnumTipoAtrasoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoAtraso[] | ListEnumTipoAtrasoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoAtrasoWithAggregatesFilter<$PrismaModel> | $Enums.TipoAtraso
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoAtrasoFilter<$PrismaModel>
    _max?: NestedEnumTipoAtrasoFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ViagemNullableScalarRelationFilter = {
    is?: ViagemWhereInput | null
    isNot?: ViagemWhereInput | null
  }

  export type TelemetriaCountOrderByAggregateInput = {
    id?: SortOrder
    veiculoId?: SortOrder
    viagemId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    ignicao?: SortOrder
    velocidade?: SortOrder
    dataHoraUtc?: SortOrder
    dataHoraLocal?: SortOrder
    createdAt?: SortOrder
  }

  export type TelemetriaAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    velocidade?: SortOrder
  }

  export type TelemetriaMaxOrderByAggregateInput = {
    id?: SortOrder
    veiculoId?: SortOrder
    viagemId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    ignicao?: SortOrder
    velocidade?: SortOrder
    dataHoraUtc?: SortOrder
    dataHoraLocal?: SortOrder
    createdAt?: SortOrder
  }

  export type TelemetriaMinOrderByAggregateInput = {
    id?: SortOrder
    veiculoId?: SortOrder
    viagemId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    ignicao?: SortOrder
    velocidade?: SortOrder
    dataHoraUtc?: SortOrder
    dataHoraLocal?: SortOrder
    createdAt?: SortOrder
  }

  export type TelemetriaSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
    velocidade?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type RotaPadraoCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
  }

  export type RotaPadraoMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
  }

  export type RotaPadraoMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
  }

  export type RotaPadraoScalarRelationFilter = {
    is?: RotaPadraoWhereInput
    isNot?: RotaPadraoWhereInput
  }

  export type ParadaPadraoCountOrderByAggregateInput = {
    id?: SortOrder
    rotaId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrder
    prevSaida?: SortOrder
  }

  export type ParadaPadraoAvgOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type ParadaPadraoMaxOrderByAggregateInput = {
    id?: SortOrder
    rotaId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrder
    prevSaida?: SortOrder
  }

  export type ParadaPadraoMinOrderByAggregateInput = {
    id?: SortOrder
    rotaId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrder
    prevSaida?: SortOrder
  }

  export type ParadaPadraoSumOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type ParadaViagemCountOrderByAggregateInput = {
    id?: SortOrder
    viagemId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrder
    prevSaida?: SortOrder
    dataChegadaEfetiva?: SortOrder
    dataSaidaEfetiva?: SortOrder
  }

  export type ParadaViagemAvgOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type ParadaViagemMaxOrderByAggregateInput = {
    id?: SortOrder
    viagemId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrder
    prevSaida?: SortOrder
    dataChegadaEfetiva?: SortOrder
    dataSaidaEfetiva?: SortOrder
  }

  export type ParadaViagemMinOrderByAggregateInput = {
    id?: SortOrder
    viagemId?: SortOrder
    baseId?: SortOrder
    ordem?: SortOrder
    prevChegada?: SortOrder
    prevSaida?: SortOrder
    dataChegadaEfetiva?: SortOrder
    dataSaidaEfetiva?: SortOrder
  }

  export type ParadaViagemSumOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type UserCreateNestedManyWithoutBaseInput = {
    create?: XOR<UserCreateWithoutBaseInput, UserUncheckedCreateWithoutBaseInput> | UserCreateWithoutBaseInput[] | UserUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBaseInput | UserCreateOrConnectWithoutBaseInput[]
    createMany?: UserCreateManyBaseInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ViagemCreateNestedManyWithoutBaseOrigemInput = {
    create?: XOR<ViagemCreateWithoutBaseOrigemInput, ViagemUncheckedCreateWithoutBaseOrigemInput> | ViagemCreateWithoutBaseOrigemInput[] | ViagemUncheckedCreateWithoutBaseOrigemInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutBaseOrigemInput | ViagemCreateOrConnectWithoutBaseOrigemInput[]
    createMany?: ViagemCreateManyBaseOrigemInputEnvelope
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
  }

  export type ViagemCreateNestedManyWithoutBaseDestinoInput = {
    create?: XOR<ViagemCreateWithoutBaseDestinoInput, ViagemUncheckedCreateWithoutBaseDestinoInput> | ViagemCreateWithoutBaseDestinoInput[] | ViagemUncheckedCreateWithoutBaseDestinoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutBaseDestinoInput | ViagemCreateOrConnectWithoutBaseDestinoInput[]
    createMany?: ViagemCreateManyBaseDestinoInputEnvelope
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
  }

  export type JustificativaAtrasoCreateNestedManyWithoutBaseInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutBaseInput, JustificativaAtrasoUncheckedCreateWithoutBaseInput> | JustificativaAtrasoCreateWithoutBaseInput[] | JustificativaAtrasoUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutBaseInput | JustificativaAtrasoCreateOrConnectWithoutBaseInput[]
    createMany?: JustificativaAtrasoCreateManyBaseInputEnvelope
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
  }

  export type ParadaPadraoCreateNestedManyWithoutBaseInput = {
    create?: XOR<ParadaPadraoCreateWithoutBaseInput, ParadaPadraoUncheckedCreateWithoutBaseInput> | ParadaPadraoCreateWithoutBaseInput[] | ParadaPadraoUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: ParadaPadraoCreateOrConnectWithoutBaseInput | ParadaPadraoCreateOrConnectWithoutBaseInput[]
    createMany?: ParadaPadraoCreateManyBaseInputEnvelope
    connect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
  }

  export type ParadaViagemCreateNestedManyWithoutBaseInput = {
    create?: XOR<ParadaViagemCreateWithoutBaseInput, ParadaViagemUncheckedCreateWithoutBaseInput> | ParadaViagemCreateWithoutBaseInput[] | ParadaViagemUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: ParadaViagemCreateOrConnectWithoutBaseInput | ParadaViagemCreateOrConnectWithoutBaseInput[]
    createMany?: ParadaViagemCreateManyBaseInputEnvelope
    connect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutBaseInput = {
    create?: XOR<UserCreateWithoutBaseInput, UserUncheckedCreateWithoutBaseInput> | UserCreateWithoutBaseInput[] | UserUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBaseInput | UserCreateOrConnectWithoutBaseInput[]
    createMany?: UserCreateManyBaseInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ViagemUncheckedCreateNestedManyWithoutBaseOrigemInput = {
    create?: XOR<ViagemCreateWithoutBaseOrigemInput, ViagemUncheckedCreateWithoutBaseOrigemInput> | ViagemCreateWithoutBaseOrigemInput[] | ViagemUncheckedCreateWithoutBaseOrigemInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutBaseOrigemInput | ViagemCreateOrConnectWithoutBaseOrigemInput[]
    createMany?: ViagemCreateManyBaseOrigemInputEnvelope
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
  }

  export type ViagemUncheckedCreateNestedManyWithoutBaseDestinoInput = {
    create?: XOR<ViagemCreateWithoutBaseDestinoInput, ViagemUncheckedCreateWithoutBaseDestinoInput> | ViagemCreateWithoutBaseDestinoInput[] | ViagemUncheckedCreateWithoutBaseDestinoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutBaseDestinoInput | ViagemCreateOrConnectWithoutBaseDestinoInput[]
    createMany?: ViagemCreateManyBaseDestinoInputEnvelope
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
  }

  export type JustificativaAtrasoUncheckedCreateNestedManyWithoutBaseInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutBaseInput, JustificativaAtrasoUncheckedCreateWithoutBaseInput> | JustificativaAtrasoCreateWithoutBaseInput[] | JustificativaAtrasoUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutBaseInput | JustificativaAtrasoCreateOrConnectWithoutBaseInput[]
    createMany?: JustificativaAtrasoCreateManyBaseInputEnvelope
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
  }

  export type ParadaPadraoUncheckedCreateNestedManyWithoutBaseInput = {
    create?: XOR<ParadaPadraoCreateWithoutBaseInput, ParadaPadraoUncheckedCreateWithoutBaseInput> | ParadaPadraoCreateWithoutBaseInput[] | ParadaPadraoUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: ParadaPadraoCreateOrConnectWithoutBaseInput | ParadaPadraoCreateOrConnectWithoutBaseInput[]
    createMany?: ParadaPadraoCreateManyBaseInputEnvelope
    connect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
  }

  export type ParadaViagemUncheckedCreateNestedManyWithoutBaseInput = {
    create?: XOR<ParadaViagemCreateWithoutBaseInput, ParadaViagemUncheckedCreateWithoutBaseInput> | ParadaViagemCreateWithoutBaseInput[] | ParadaViagemUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: ParadaViagemCreateOrConnectWithoutBaseInput | ParadaViagemCreateOrConnectWithoutBaseInput[]
    createMany?: ParadaViagemCreateManyBaseInputEnvelope
    connect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutBaseNestedInput = {
    create?: XOR<UserCreateWithoutBaseInput, UserUncheckedCreateWithoutBaseInput> | UserCreateWithoutBaseInput[] | UserUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBaseInput | UserCreateOrConnectWithoutBaseInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutBaseInput | UserUpsertWithWhereUniqueWithoutBaseInput[]
    createMany?: UserCreateManyBaseInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutBaseInput | UserUpdateWithWhereUniqueWithoutBaseInput[]
    updateMany?: UserUpdateManyWithWhereWithoutBaseInput | UserUpdateManyWithWhereWithoutBaseInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ViagemUpdateManyWithoutBaseOrigemNestedInput = {
    create?: XOR<ViagemCreateWithoutBaseOrigemInput, ViagemUncheckedCreateWithoutBaseOrigemInput> | ViagemCreateWithoutBaseOrigemInput[] | ViagemUncheckedCreateWithoutBaseOrigemInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutBaseOrigemInput | ViagemCreateOrConnectWithoutBaseOrigemInput[]
    upsert?: ViagemUpsertWithWhereUniqueWithoutBaseOrigemInput | ViagemUpsertWithWhereUniqueWithoutBaseOrigemInput[]
    createMany?: ViagemCreateManyBaseOrigemInputEnvelope
    set?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    disconnect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    delete?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    update?: ViagemUpdateWithWhereUniqueWithoutBaseOrigemInput | ViagemUpdateWithWhereUniqueWithoutBaseOrigemInput[]
    updateMany?: ViagemUpdateManyWithWhereWithoutBaseOrigemInput | ViagemUpdateManyWithWhereWithoutBaseOrigemInput[]
    deleteMany?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
  }

  export type ViagemUpdateManyWithoutBaseDestinoNestedInput = {
    create?: XOR<ViagemCreateWithoutBaseDestinoInput, ViagemUncheckedCreateWithoutBaseDestinoInput> | ViagemCreateWithoutBaseDestinoInput[] | ViagemUncheckedCreateWithoutBaseDestinoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutBaseDestinoInput | ViagemCreateOrConnectWithoutBaseDestinoInput[]
    upsert?: ViagemUpsertWithWhereUniqueWithoutBaseDestinoInput | ViagemUpsertWithWhereUniqueWithoutBaseDestinoInput[]
    createMany?: ViagemCreateManyBaseDestinoInputEnvelope
    set?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    disconnect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    delete?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    update?: ViagemUpdateWithWhereUniqueWithoutBaseDestinoInput | ViagemUpdateWithWhereUniqueWithoutBaseDestinoInput[]
    updateMany?: ViagemUpdateManyWithWhereWithoutBaseDestinoInput | ViagemUpdateManyWithWhereWithoutBaseDestinoInput[]
    deleteMany?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
  }

  export type JustificativaAtrasoUpdateManyWithoutBaseNestedInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutBaseInput, JustificativaAtrasoUncheckedCreateWithoutBaseInput> | JustificativaAtrasoCreateWithoutBaseInput[] | JustificativaAtrasoUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutBaseInput | JustificativaAtrasoCreateOrConnectWithoutBaseInput[]
    upsert?: JustificativaAtrasoUpsertWithWhereUniqueWithoutBaseInput | JustificativaAtrasoUpsertWithWhereUniqueWithoutBaseInput[]
    createMany?: JustificativaAtrasoCreateManyBaseInputEnvelope
    set?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    disconnect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    delete?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    update?: JustificativaAtrasoUpdateWithWhereUniqueWithoutBaseInput | JustificativaAtrasoUpdateWithWhereUniqueWithoutBaseInput[]
    updateMany?: JustificativaAtrasoUpdateManyWithWhereWithoutBaseInput | JustificativaAtrasoUpdateManyWithWhereWithoutBaseInput[]
    deleteMany?: JustificativaAtrasoScalarWhereInput | JustificativaAtrasoScalarWhereInput[]
  }

  export type ParadaPadraoUpdateManyWithoutBaseNestedInput = {
    create?: XOR<ParadaPadraoCreateWithoutBaseInput, ParadaPadraoUncheckedCreateWithoutBaseInput> | ParadaPadraoCreateWithoutBaseInput[] | ParadaPadraoUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: ParadaPadraoCreateOrConnectWithoutBaseInput | ParadaPadraoCreateOrConnectWithoutBaseInput[]
    upsert?: ParadaPadraoUpsertWithWhereUniqueWithoutBaseInput | ParadaPadraoUpsertWithWhereUniqueWithoutBaseInput[]
    createMany?: ParadaPadraoCreateManyBaseInputEnvelope
    set?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    disconnect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    delete?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    connect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    update?: ParadaPadraoUpdateWithWhereUniqueWithoutBaseInput | ParadaPadraoUpdateWithWhereUniqueWithoutBaseInput[]
    updateMany?: ParadaPadraoUpdateManyWithWhereWithoutBaseInput | ParadaPadraoUpdateManyWithWhereWithoutBaseInput[]
    deleteMany?: ParadaPadraoScalarWhereInput | ParadaPadraoScalarWhereInput[]
  }

  export type ParadaViagemUpdateManyWithoutBaseNestedInput = {
    create?: XOR<ParadaViagemCreateWithoutBaseInput, ParadaViagemUncheckedCreateWithoutBaseInput> | ParadaViagemCreateWithoutBaseInput[] | ParadaViagemUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: ParadaViagemCreateOrConnectWithoutBaseInput | ParadaViagemCreateOrConnectWithoutBaseInput[]
    upsert?: ParadaViagemUpsertWithWhereUniqueWithoutBaseInput | ParadaViagemUpsertWithWhereUniqueWithoutBaseInput[]
    createMany?: ParadaViagemCreateManyBaseInputEnvelope
    set?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    disconnect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    delete?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    connect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    update?: ParadaViagemUpdateWithWhereUniqueWithoutBaseInput | ParadaViagemUpdateWithWhereUniqueWithoutBaseInput[]
    updateMany?: ParadaViagemUpdateManyWithWhereWithoutBaseInput | ParadaViagemUpdateManyWithWhereWithoutBaseInput[]
    deleteMany?: ParadaViagemScalarWhereInput | ParadaViagemScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutBaseNestedInput = {
    create?: XOR<UserCreateWithoutBaseInput, UserUncheckedCreateWithoutBaseInput> | UserCreateWithoutBaseInput[] | UserUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBaseInput | UserCreateOrConnectWithoutBaseInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutBaseInput | UserUpsertWithWhereUniqueWithoutBaseInput[]
    createMany?: UserCreateManyBaseInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutBaseInput | UserUpdateWithWhereUniqueWithoutBaseInput[]
    updateMany?: UserUpdateManyWithWhereWithoutBaseInput | UserUpdateManyWithWhereWithoutBaseInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ViagemUncheckedUpdateManyWithoutBaseOrigemNestedInput = {
    create?: XOR<ViagemCreateWithoutBaseOrigemInput, ViagemUncheckedCreateWithoutBaseOrigemInput> | ViagemCreateWithoutBaseOrigemInput[] | ViagemUncheckedCreateWithoutBaseOrigemInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutBaseOrigemInput | ViagemCreateOrConnectWithoutBaseOrigemInput[]
    upsert?: ViagemUpsertWithWhereUniqueWithoutBaseOrigemInput | ViagemUpsertWithWhereUniqueWithoutBaseOrigemInput[]
    createMany?: ViagemCreateManyBaseOrigemInputEnvelope
    set?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    disconnect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    delete?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    update?: ViagemUpdateWithWhereUniqueWithoutBaseOrigemInput | ViagemUpdateWithWhereUniqueWithoutBaseOrigemInput[]
    updateMany?: ViagemUpdateManyWithWhereWithoutBaseOrigemInput | ViagemUpdateManyWithWhereWithoutBaseOrigemInput[]
    deleteMany?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
  }

  export type ViagemUncheckedUpdateManyWithoutBaseDestinoNestedInput = {
    create?: XOR<ViagemCreateWithoutBaseDestinoInput, ViagemUncheckedCreateWithoutBaseDestinoInput> | ViagemCreateWithoutBaseDestinoInput[] | ViagemUncheckedCreateWithoutBaseDestinoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutBaseDestinoInput | ViagemCreateOrConnectWithoutBaseDestinoInput[]
    upsert?: ViagemUpsertWithWhereUniqueWithoutBaseDestinoInput | ViagemUpsertWithWhereUniqueWithoutBaseDestinoInput[]
    createMany?: ViagemCreateManyBaseDestinoInputEnvelope
    set?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    disconnect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    delete?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    update?: ViagemUpdateWithWhereUniqueWithoutBaseDestinoInput | ViagemUpdateWithWhereUniqueWithoutBaseDestinoInput[]
    updateMany?: ViagemUpdateManyWithWhereWithoutBaseDestinoInput | ViagemUpdateManyWithWhereWithoutBaseDestinoInput[]
    deleteMany?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
  }

  export type JustificativaAtrasoUncheckedUpdateManyWithoutBaseNestedInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutBaseInput, JustificativaAtrasoUncheckedCreateWithoutBaseInput> | JustificativaAtrasoCreateWithoutBaseInput[] | JustificativaAtrasoUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutBaseInput | JustificativaAtrasoCreateOrConnectWithoutBaseInput[]
    upsert?: JustificativaAtrasoUpsertWithWhereUniqueWithoutBaseInput | JustificativaAtrasoUpsertWithWhereUniqueWithoutBaseInput[]
    createMany?: JustificativaAtrasoCreateManyBaseInputEnvelope
    set?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    disconnect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    delete?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    update?: JustificativaAtrasoUpdateWithWhereUniqueWithoutBaseInput | JustificativaAtrasoUpdateWithWhereUniqueWithoutBaseInput[]
    updateMany?: JustificativaAtrasoUpdateManyWithWhereWithoutBaseInput | JustificativaAtrasoUpdateManyWithWhereWithoutBaseInput[]
    deleteMany?: JustificativaAtrasoScalarWhereInput | JustificativaAtrasoScalarWhereInput[]
  }

  export type ParadaPadraoUncheckedUpdateManyWithoutBaseNestedInput = {
    create?: XOR<ParadaPadraoCreateWithoutBaseInput, ParadaPadraoUncheckedCreateWithoutBaseInput> | ParadaPadraoCreateWithoutBaseInput[] | ParadaPadraoUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: ParadaPadraoCreateOrConnectWithoutBaseInput | ParadaPadraoCreateOrConnectWithoutBaseInput[]
    upsert?: ParadaPadraoUpsertWithWhereUniqueWithoutBaseInput | ParadaPadraoUpsertWithWhereUniqueWithoutBaseInput[]
    createMany?: ParadaPadraoCreateManyBaseInputEnvelope
    set?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    disconnect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    delete?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    connect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    update?: ParadaPadraoUpdateWithWhereUniqueWithoutBaseInput | ParadaPadraoUpdateWithWhereUniqueWithoutBaseInput[]
    updateMany?: ParadaPadraoUpdateManyWithWhereWithoutBaseInput | ParadaPadraoUpdateManyWithWhereWithoutBaseInput[]
    deleteMany?: ParadaPadraoScalarWhereInput | ParadaPadraoScalarWhereInput[]
  }

  export type ParadaViagemUncheckedUpdateManyWithoutBaseNestedInput = {
    create?: XOR<ParadaViagemCreateWithoutBaseInput, ParadaViagemUncheckedCreateWithoutBaseInput> | ParadaViagemCreateWithoutBaseInput[] | ParadaViagemUncheckedCreateWithoutBaseInput[]
    connectOrCreate?: ParadaViagemCreateOrConnectWithoutBaseInput | ParadaViagemCreateOrConnectWithoutBaseInput[]
    upsert?: ParadaViagemUpsertWithWhereUniqueWithoutBaseInput | ParadaViagemUpsertWithWhereUniqueWithoutBaseInput[]
    createMany?: ParadaViagemCreateManyBaseInputEnvelope
    set?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    disconnect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    delete?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    connect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    update?: ParadaViagemUpdateWithWhereUniqueWithoutBaseInput | ParadaViagemUpdateWithWhereUniqueWithoutBaseInput[]
    updateMany?: ParadaViagemUpdateManyWithWhereWithoutBaseInput | ParadaViagemUpdateManyWithWhereWithoutBaseInput[]
    deleteMany?: ParadaViagemScalarWhereInput | ParadaViagemScalarWhereInput[]
  }

  export type BaseCreateNestedOneWithoutUsuariosInput = {
    create?: XOR<BaseCreateWithoutUsuariosInput, BaseUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: BaseCreateOrConnectWithoutUsuariosInput
    connect?: BaseWhereUniqueInput
  }

  export type JustificativaAtrasoCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutUsuarioInput, JustificativaAtrasoUncheckedCreateWithoutUsuarioInput> | JustificativaAtrasoCreateWithoutUsuarioInput[] | JustificativaAtrasoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutUsuarioInput | JustificativaAtrasoCreateOrConnectWithoutUsuarioInput[]
    createMany?: JustificativaAtrasoCreateManyUsuarioInputEnvelope
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
  }

  export type JustificativaAtrasoUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutUsuarioInput, JustificativaAtrasoUncheckedCreateWithoutUsuarioInput> | JustificativaAtrasoCreateWithoutUsuarioInput[] | JustificativaAtrasoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutUsuarioInput | JustificativaAtrasoCreateOrConnectWithoutUsuarioInput[]
    createMany?: JustificativaAtrasoCreateManyUsuarioInputEnvelope
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BaseUpdateOneWithoutUsuariosNestedInput = {
    create?: XOR<BaseCreateWithoutUsuariosInput, BaseUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: BaseCreateOrConnectWithoutUsuariosInput
    upsert?: BaseUpsertWithoutUsuariosInput
    disconnect?: BaseWhereInput | boolean
    delete?: BaseWhereInput | boolean
    connect?: BaseWhereUniqueInput
    update?: XOR<XOR<BaseUpdateToOneWithWhereWithoutUsuariosInput, BaseUpdateWithoutUsuariosInput>, BaseUncheckedUpdateWithoutUsuariosInput>
  }

  export type JustificativaAtrasoUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutUsuarioInput, JustificativaAtrasoUncheckedCreateWithoutUsuarioInput> | JustificativaAtrasoCreateWithoutUsuarioInput[] | JustificativaAtrasoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutUsuarioInput | JustificativaAtrasoCreateOrConnectWithoutUsuarioInput[]
    upsert?: JustificativaAtrasoUpsertWithWhereUniqueWithoutUsuarioInput | JustificativaAtrasoUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: JustificativaAtrasoCreateManyUsuarioInputEnvelope
    set?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    disconnect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    delete?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    update?: JustificativaAtrasoUpdateWithWhereUniqueWithoutUsuarioInput | JustificativaAtrasoUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: JustificativaAtrasoUpdateManyWithWhereWithoutUsuarioInput | JustificativaAtrasoUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: JustificativaAtrasoScalarWhereInput | JustificativaAtrasoScalarWhereInput[]
  }

  export type JustificativaAtrasoUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutUsuarioInput, JustificativaAtrasoUncheckedCreateWithoutUsuarioInput> | JustificativaAtrasoCreateWithoutUsuarioInput[] | JustificativaAtrasoUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutUsuarioInput | JustificativaAtrasoCreateOrConnectWithoutUsuarioInput[]
    upsert?: JustificativaAtrasoUpsertWithWhereUniqueWithoutUsuarioInput | JustificativaAtrasoUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: JustificativaAtrasoCreateManyUsuarioInputEnvelope
    set?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    disconnect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    delete?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    update?: JustificativaAtrasoUpdateWithWhereUniqueWithoutUsuarioInput | JustificativaAtrasoUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: JustificativaAtrasoUpdateManyWithWhereWithoutUsuarioInput | JustificativaAtrasoUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: JustificativaAtrasoScalarWhereInput | JustificativaAtrasoScalarWhereInput[]
  }

  export type ViagemCreateNestedManyWithoutVeiculoInput = {
    create?: XOR<ViagemCreateWithoutVeiculoInput, ViagemUncheckedCreateWithoutVeiculoInput> | ViagemCreateWithoutVeiculoInput[] | ViagemUncheckedCreateWithoutVeiculoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutVeiculoInput | ViagemCreateOrConnectWithoutVeiculoInput[]
    createMany?: ViagemCreateManyVeiculoInputEnvelope
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
  }

  export type TelemetriaCreateNestedManyWithoutVeiculoInput = {
    create?: XOR<TelemetriaCreateWithoutVeiculoInput, TelemetriaUncheckedCreateWithoutVeiculoInput> | TelemetriaCreateWithoutVeiculoInput[] | TelemetriaUncheckedCreateWithoutVeiculoInput[]
    connectOrCreate?: TelemetriaCreateOrConnectWithoutVeiculoInput | TelemetriaCreateOrConnectWithoutVeiculoInput[]
    createMany?: TelemetriaCreateManyVeiculoInputEnvelope
    connect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
  }

  export type ViagemUncheckedCreateNestedManyWithoutVeiculoInput = {
    create?: XOR<ViagemCreateWithoutVeiculoInput, ViagemUncheckedCreateWithoutVeiculoInput> | ViagemCreateWithoutVeiculoInput[] | ViagemUncheckedCreateWithoutVeiculoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutVeiculoInput | ViagemCreateOrConnectWithoutVeiculoInput[]
    createMany?: ViagemCreateManyVeiculoInputEnvelope
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
  }

  export type TelemetriaUncheckedCreateNestedManyWithoutVeiculoInput = {
    create?: XOR<TelemetriaCreateWithoutVeiculoInput, TelemetriaUncheckedCreateWithoutVeiculoInput> | TelemetriaCreateWithoutVeiculoInput[] | TelemetriaUncheckedCreateWithoutVeiculoInput[]
    connectOrCreate?: TelemetriaCreateOrConnectWithoutVeiculoInput | TelemetriaCreateOrConnectWithoutVeiculoInput[]
    createMany?: TelemetriaCreateManyVeiculoInputEnvelope
    connect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
  }

  export type ViagemUpdateManyWithoutVeiculoNestedInput = {
    create?: XOR<ViagemCreateWithoutVeiculoInput, ViagemUncheckedCreateWithoutVeiculoInput> | ViagemCreateWithoutVeiculoInput[] | ViagemUncheckedCreateWithoutVeiculoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutVeiculoInput | ViagemCreateOrConnectWithoutVeiculoInput[]
    upsert?: ViagemUpsertWithWhereUniqueWithoutVeiculoInput | ViagemUpsertWithWhereUniqueWithoutVeiculoInput[]
    createMany?: ViagemCreateManyVeiculoInputEnvelope
    set?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    disconnect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    delete?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    update?: ViagemUpdateWithWhereUniqueWithoutVeiculoInput | ViagemUpdateWithWhereUniqueWithoutVeiculoInput[]
    updateMany?: ViagemUpdateManyWithWhereWithoutVeiculoInput | ViagemUpdateManyWithWhereWithoutVeiculoInput[]
    deleteMany?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
  }

  export type TelemetriaUpdateManyWithoutVeiculoNestedInput = {
    create?: XOR<TelemetriaCreateWithoutVeiculoInput, TelemetriaUncheckedCreateWithoutVeiculoInput> | TelemetriaCreateWithoutVeiculoInput[] | TelemetriaUncheckedCreateWithoutVeiculoInput[]
    connectOrCreate?: TelemetriaCreateOrConnectWithoutVeiculoInput | TelemetriaCreateOrConnectWithoutVeiculoInput[]
    upsert?: TelemetriaUpsertWithWhereUniqueWithoutVeiculoInput | TelemetriaUpsertWithWhereUniqueWithoutVeiculoInput[]
    createMany?: TelemetriaCreateManyVeiculoInputEnvelope
    set?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    disconnect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    delete?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    connect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    update?: TelemetriaUpdateWithWhereUniqueWithoutVeiculoInput | TelemetriaUpdateWithWhereUniqueWithoutVeiculoInput[]
    updateMany?: TelemetriaUpdateManyWithWhereWithoutVeiculoInput | TelemetriaUpdateManyWithWhereWithoutVeiculoInput[]
    deleteMany?: TelemetriaScalarWhereInput | TelemetriaScalarWhereInput[]
  }

  export type ViagemUncheckedUpdateManyWithoutVeiculoNestedInput = {
    create?: XOR<ViagemCreateWithoutVeiculoInput, ViagemUncheckedCreateWithoutVeiculoInput> | ViagemCreateWithoutVeiculoInput[] | ViagemUncheckedCreateWithoutVeiculoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutVeiculoInput | ViagemCreateOrConnectWithoutVeiculoInput[]
    upsert?: ViagemUpsertWithWhereUniqueWithoutVeiculoInput | ViagemUpsertWithWhereUniqueWithoutVeiculoInput[]
    createMany?: ViagemCreateManyVeiculoInputEnvelope
    set?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    disconnect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    delete?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    update?: ViagemUpdateWithWhereUniqueWithoutVeiculoInput | ViagemUpdateWithWhereUniqueWithoutVeiculoInput[]
    updateMany?: ViagemUpdateManyWithWhereWithoutVeiculoInput | ViagemUpdateManyWithWhereWithoutVeiculoInput[]
    deleteMany?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
  }

  export type TelemetriaUncheckedUpdateManyWithoutVeiculoNestedInput = {
    create?: XOR<TelemetriaCreateWithoutVeiculoInput, TelemetriaUncheckedCreateWithoutVeiculoInput> | TelemetriaCreateWithoutVeiculoInput[] | TelemetriaUncheckedCreateWithoutVeiculoInput[]
    connectOrCreate?: TelemetriaCreateOrConnectWithoutVeiculoInput | TelemetriaCreateOrConnectWithoutVeiculoInput[]
    upsert?: TelemetriaUpsertWithWhereUniqueWithoutVeiculoInput | TelemetriaUpsertWithWhereUniqueWithoutVeiculoInput[]
    createMany?: TelemetriaCreateManyVeiculoInputEnvelope
    set?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    disconnect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    delete?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    connect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    update?: TelemetriaUpdateWithWhereUniqueWithoutVeiculoInput | TelemetriaUpdateWithWhereUniqueWithoutVeiculoInput[]
    updateMany?: TelemetriaUpdateManyWithWhereWithoutVeiculoInput | TelemetriaUpdateManyWithWhereWithoutVeiculoInput[]
    deleteMany?: TelemetriaScalarWhereInput | TelemetriaScalarWhereInput[]
  }

  export type VeiculoCreateNestedOneWithoutViagensInput = {
    create?: XOR<VeiculoCreateWithoutViagensInput, VeiculoUncheckedCreateWithoutViagensInput>
    connectOrCreate?: VeiculoCreateOrConnectWithoutViagensInput
    connect?: VeiculoWhereUniqueInput
  }

  export type BaseCreateNestedOneWithoutViagensOrigemInput = {
    create?: XOR<BaseCreateWithoutViagensOrigemInput, BaseUncheckedCreateWithoutViagensOrigemInput>
    connectOrCreate?: BaseCreateOrConnectWithoutViagensOrigemInput
    connect?: BaseWhereUniqueInput
  }

  export type BaseCreateNestedOneWithoutViagensDestinoInput = {
    create?: XOR<BaseCreateWithoutViagensDestinoInput, BaseUncheckedCreateWithoutViagensDestinoInput>
    connectOrCreate?: BaseCreateOrConnectWithoutViagensDestinoInput
    connect?: BaseWhereUniqueInput
  }

  export type RotaPadraoCreateNestedOneWithoutViagensInput = {
    create?: XOR<RotaPadraoCreateWithoutViagensInput, RotaPadraoUncheckedCreateWithoutViagensInput>
    connectOrCreate?: RotaPadraoCreateOrConnectWithoutViagensInput
    connect?: RotaPadraoWhereUniqueInput
  }

  export type ParadaViagemCreateNestedManyWithoutViagemInput = {
    create?: XOR<ParadaViagemCreateWithoutViagemInput, ParadaViagemUncheckedCreateWithoutViagemInput> | ParadaViagemCreateWithoutViagemInput[] | ParadaViagemUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: ParadaViagemCreateOrConnectWithoutViagemInput | ParadaViagemCreateOrConnectWithoutViagemInput[]
    createMany?: ParadaViagemCreateManyViagemInputEnvelope
    connect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
  }

  export type JustificativaAtrasoCreateNestedManyWithoutViagemInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutViagemInput, JustificativaAtrasoUncheckedCreateWithoutViagemInput> | JustificativaAtrasoCreateWithoutViagemInput[] | JustificativaAtrasoUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutViagemInput | JustificativaAtrasoCreateOrConnectWithoutViagemInput[]
    createMany?: JustificativaAtrasoCreateManyViagemInputEnvelope
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
  }

  export type TelemetriaCreateNestedManyWithoutViagemInput = {
    create?: XOR<TelemetriaCreateWithoutViagemInput, TelemetriaUncheckedCreateWithoutViagemInput> | TelemetriaCreateWithoutViagemInput[] | TelemetriaUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: TelemetriaCreateOrConnectWithoutViagemInput | TelemetriaCreateOrConnectWithoutViagemInput[]
    createMany?: TelemetriaCreateManyViagemInputEnvelope
    connect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
  }

  export type ParadaViagemUncheckedCreateNestedManyWithoutViagemInput = {
    create?: XOR<ParadaViagemCreateWithoutViagemInput, ParadaViagemUncheckedCreateWithoutViagemInput> | ParadaViagemCreateWithoutViagemInput[] | ParadaViagemUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: ParadaViagemCreateOrConnectWithoutViagemInput | ParadaViagemCreateOrConnectWithoutViagemInput[]
    createMany?: ParadaViagemCreateManyViagemInputEnvelope
    connect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
  }

  export type JustificativaAtrasoUncheckedCreateNestedManyWithoutViagemInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutViagemInput, JustificativaAtrasoUncheckedCreateWithoutViagemInput> | JustificativaAtrasoCreateWithoutViagemInput[] | JustificativaAtrasoUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutViagemInput | JustificativaAtrasoCreateOrConnectWithoutViagemInput[]
    createMany?: JustificativaAtrasoCreateManyViagemInputEnvelope
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
  }

  export type TelemetriaUncheckedCreateNestedManyWithoutViagemInput = {
    create?: XOR<TelemetriaCreateWithoutViagemInput, TelemetriaUncheckedCreateWithoutViagemInput> | TelemetriaCreateWithoutViagemInput[] | TelemetriaUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: TelemetriaCreateOrConnectWithoutViagemInput | TelemetriaCreateOrConnectWithoutViagemInput[]
    createMany?: TelemetriaCreateManyViagemInputEnvelope
    connect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
  }

  export type EnumStatusViagemFieldUpdateOperationsInput = {
    set?: $Enums.StatusViagem
  }

  export type VeiculoUpdateOneRequiredWithoutViagensNestedInput = {
    create?: XOR<VeiculoCreateWithoutViagensInput, VeiculoUncheckedCreateWithoutViagensInput>
    connectOrCreate?: VeiculoCreateOrConnectWithoutViagensInput
    upsert?: VeiculoUpsertWithoutViagensInput
    connect?: VeiculoWhereUniqueInput
    update?: XOR<XOR<VeiculoUpdateToOneWithWhereWithoutViagensInput, VeiculoUpdateWithoutViagensInput>, VeiculoUncheckedUpdateWithoutViagensInput>
  }

  export type BaseUpdateOneRequiredWithoutViagensOrigemNestedInput = {
    create?: XOR<BaseCreateWithoutViagensOrigemInput, BaseUncheckedCreateWithoutViagensOrigemInput>
    connectOrCreate?: BaseCreateOrConnectWithoutViagensOrigemInput
    upsert?: BaseUpsertWithoutViagensOrigemInput
    connect?: BaseWhereUniqueInput
    update?: XOR<XOR<BaseUpdateToOneWithWhereWithoutViagensOrigemInput, BaseUpdateWithoutViagensOrigemInput>, BaseUncheckedUpdateWithoutViagensOrigemInput>
  }

  export type BaseUpdateOneRequiredWithoutViagensDestinoNestedInput = {
    create?: XOR<BaseCreateWithoutViagensDestinoInput, BaseUncheckedCreateWithoutViagensDestinoInput>
    connectOrCreate?: BaseCreateOrConnectWithoutViagensDestinoInput
    upsert?: BaseUpsertWithoutViagensDestinoInput
    connect?: BaseWhereUniqueInput
    update?: XOR<XOR<BaseUpdateToOneWithWhereWithoutViagensDestinoInput, BaseUpdateWithoutViagensDestinoInput>, BaseUncheckedUpdateWithoutViagensDestinoInput>
  }

  export type RotaPadraoUpdateOneWithoutViagensNestedInput = {
    create?: XOR<RotaPadraoCreateWithoutViagensInput, RotaPadraoUncheckedCreateWithoutViagensInput>
    connectOrCreate?: RotaPadraoCreateOrConnectWithoutViagensInput
    upsert?: RotaPadraoUpsertWithoutViagensInput
    disconnect?: RotaPadraoWhereInput | boolean
    delete?: RotaPadraoWhereInput | boolean
    connect?: RotaPadraoWhereUniqueInput
    update?: XOR<XOR<RotaPadraoUpdateToOneWithWhereWithoutViagensInput, RotaPadraoUpdateWithoutViagensInput>, RotaPadraoUncheckedUpdateWithoutViagensInput>
  }

  export type ParadaViagemUpdateManyWithoutViagemNestedInput = {
    create?: XOR<ParadaViagemCreateWithoutViagemInput, ParadaViagemUncheckedCreateWithoutViagemInput> | ParadaViagemCreateWithoutViagemInput[] | ParadaViagemUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: ParadaViagemCreateOrConnectWithoutViagemInput | ParadaViagemCreateOrConnectWithoutViagemInput[]
    upsert?: ParadaViagemUpsertWithWhereUniqueWithoutViagemInput | ParadaViagemUpsertWithWhereUniqueWithoutViagemInput[]
    createMany?: ParadaViagemCreateManyViagemInputEnvelope
    set?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    disconnect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    delete?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    connect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    update?: ParadaViagemUpdateWithWhereUniqueWithoutViagemInput | ParadaViagemUpdateWithWhereUniqueWithoutViagemInput[]
    updateMany?: ParadaViagemUpdateManyWithWhereWithoutViagemInput | ParadaViagemUpdateManyWithWhereWithoutViagemInput[]
    deleteMany?: ParadaViagemScalarWhereInput | ParadaViagemScalarWhereInput[]
  }

  export type JustificativaAtrasoUpdateManyWithoutViagemNestedInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutViagemInput, JustificativaAtrasoUncheckedCreateWithoutViagemInput> | JustificativaAtrasoCreateWithoutViagemInput[] | JustificativaAtrasoUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutViagemInput | JustificativaAtrasoCreateOrConnectWithoutViagemInput[]
    upsert?: JustificativaAtrasoUpsertWithWhereUniqueWithoutViagemInput | JustificativaAtrasoUpsertWithWhereUniqueWithoutViagemInput[]
    createMany?: JustificativaAtrasoCreateManyViagemInputEnvelope
    set?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    disconnect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    delete?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    update?: JustificativaAtrasoUpdateWithWhereUniqueWithoutViagemInput | JustificativaAtrasoUpdateWithWhereUniqueWithoutViagemInput[]
    updateMany?: JustificativaAtrasoUpdateManyWithWhereWithoutViagemInput | JustificativaAtrasoUpdateManyWithWhereWithoutViagemInput[]
    deleteMany?: JustificativaAtrasoScalarWhereInput | JustificativaAtrasoScalarWhereInput[]
  }

  export type TelemetriaUpdateManyWithoutViagemNestedInput = {
    create?: XOR<TelemetriaCreateWithoutViagemInput, TelemetriaUncheckedCreateWithoutViagemInput> | TelemetriaCreateWithoutViagemInput[] | TelemetriaUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: TelemetriaCreateOrConnectWithoutViagemInput | TelemetriaCreateOrConnectWithoutViagemInput[]
    upsert?: TelemetriaUpsertWithWhereUniqueWithoutViagemInput | TelemetriaUpsertWithWhereUniqueWithoutViagemInput[]
    createMany?: TelemetriaCreateManyViagemInputEnvelope
    set?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    disconnect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    delete?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    connect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    update?: TelemetriaUpdateWithWhereUniqueWithoutViagemInput | TelemetriaUpdateWithWhereUniqueWithoutViagemInput[]
    updateMany?: TelemetriaUpdateManyWithWhereWithoutViagemInput | TelemetriaUpdateManyWithWhereWithoutViagemInput[]
    deleteMany?: TelemetriaScalarWhereInput | TelemetriaScalarWhereInput[]
  }

  export type ParadaViagemUncheckedUpdateManyWithoutViagemNestedInput = {
    create?: XOR<ParadaViagemCreateWithoutViagemInput, ParadaViagemUncheckedCreateWithoutViagemInput> | ParadaViagemCreateWithoutViagemInput[] | ParadaViagemUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: ParadaViagemCreateOrConnectWithoutViagemInput | ParadaViagemCreateOrConnectWithoutViagemInput[]
    upsert?: ParadaViagemUpsertWithWhereUniqueWithoutViagemInput | ParadaViagemUpsertWithWhereUniqueWithoutViagemInput[]
    createMany?: ParadaViagemCreateManyViagemInputEnvelope
    set?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    disconnect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    delete?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    connect?: ParadaViagemWhereUniqueInput | ParadaViagemWhereUniqueInput[]
    update?: ParadaViagemUpdateWithWhereUniqueWithoutViagemInput | ParadaViagemUpdateWithWhereUniqueWithoutViagemInput[]
    updateMany?: ParadaViagemUpdateManyWithWhereWithoutViagemInput | ParadaViagemUpdateManyWithWhereWithoutViagemInput[]
    deleteMany?: ParadaViagemScalarWhereInput | ParadaViagemScalarWhereInput[]
  }

  export type JustificativaAtrasoUncheckedUpdateManyWithoutViagemNestedInput = {
    create?: XOR<JustificativaAtrasoCreateWithoutViagemInput, JustificativaAtrasoUncheckedCreateWithoutViagemInput> | JustificativaAtrasoCreateWithoutViagemInput[] | JustificativaAtrasoUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: JustificativaAtrasoCreateOrConnectWithoutViagemInput | JustificativaAtrasoCreateOrConnectWithoutViagemInput[]
    upsert?: JustificativaAtrasoUpsertWithWhereUniqueWithoutViagemInput | JustificativaAtrasoUpsertWithWhereUniqueWithoutViagemInput[]
    createMany?: JustificativaAtrasoCreateManyViagemInputEnvelope
    set?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    disconnect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    delete?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    connect?: JustificativaAtrasoWhereUniqueInput | JustificativaAtrasoWhereUniqueInput[]
    update?: JustificativaAtrasoUpdateWithWhereUniqueWithoutViagemInput | JustificativaAtrasoUpdateWithWhereUniqueWithoutViagemInput[]
    updateMany?: JustificativaAtrasoUpdateManyWithWhereWithoutViagemInput | JustificativaAtrasoUpdateManyWithWhereWithoutViagemInput[]
    deleteMany?: JustificativaAtrasoScalarWhereInput | JustificativaAtrasoScalarWhereInput[]
  }

  export type TelemetriaUncheckedUpdateManyWithoutViagemNestedInput = {
    create?: XOR<TelemetriaCreateWithoutViagemInput, TelemetriaUncheckedCreateWithoutViagemInput> | TelemetriaCreateWithoutViagemInput[] | TelemetriaUncheckedCreateWithoutViagemInput[]
    connectOrCreate?: TelemetriaCreateOrConnectWithoutViagemInput | TelemetriaCreateOrConnectWithoutViagemInput[]
    upsert?: TelemetriaUpsertWithWhereUniqueWithoutViagemInput | TelemetriaUpsertWithWhereUniqueWithoutViagemInput[]
    createMany?: TelemetriaCreateManyViagemInputEnvelope
    set?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    disconnect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    delete?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    connect?: TelemetriaWhereUniqueInput | TelemetriaWhereUniqueInput[]
    update?: TelemetriaUpdateWithWhereUniqueWithoutViagemInput | TelemetriaUpdateWithWhereUniqueWithoutViagemInput[]
    updateMany?: TelemetriaUpdateManyWithWhereWithoutViagemInput | TelemetriaUpdateManyWithWhereWithoutViagemInput[]
    deleteMany?: TelemetriaScalarWhereInput | TelemetriaScalarWhereInput[]
  }

  export type ViagemCreateNestedOneWithoutJustificativasInput = {
    create?: XOR<ViagemCreateWithoutJustificativasInput, ViagemUncheckedCreateWithoutJustificativasInput>
    connectOrCreate?: ViagemCreateOrConnectWithoutJustificativasInput
    connect?: ViagemWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutJustificativasInput = {
    create?: XOR<UserCreateWithoutJustificativasInput, UserUncheckedCreateWithoutJustificativasInput>
    connectOrCreate?: UserCreateOrConnectWithoutJustificativasInput
    connect?: UserWhereUniqueInput
  }

  export type BaseCreateNestedOneWithoutJustificativasInput = {
    create?: XOR<BaseCreateWithoutJustificativasInput, BaseUncheckedCreateWithoutJustificativasInput>
    connectOrCreate?: BaseCreateOrConnectWithoutJustificativasInput
    connect?: BaseWhereUniqueInput
  }

  export type EnumTipoAtrasoFieldUpdateOperationsInput = {
    set?: $Enums.TipoAtraso
  }

  export type ViagemUpdateOneRequiredWithoutJustificativasNestedInput = {
    create?: XOR<ViagemCreateWithoutJustificativasInput, ViagemUncheckedCreateWithoutJustificativasInput>
    connectOrCreate?: ViagemCreateOrConnectWithoutJustificativasInput
    upsert?: ViagemUpsertWithoutJustificativasInput
    connect?: ViagemWhereUniqueInput
    update?: XOR<XOR<ViagemUpdateToOneWithWhereWithoutJustificativasInput, ViagemUpdateWithoutJustificativasInput>, ViagemUncheckedUpdateWithoutJustificativasInput>
  }

  export type UserUpdateOneRequiredWithoutJustificativasNestedInput = {
    create?: XOR<UserCreateWithoutJustificativasInput, UserUncheckedCreateWithoutJustificativasInput>
    connectOrCreate?: UserCreateOrConnectWithoutJustificativasInput
    upsert?: UserUpsertWithoutJustificativasInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutJustificativasInput, UserUpdateWithoutJustificativasInput>, UserUncheckedUpdateWithoutJustificativasInput>
  }

  export type BaseUpdateOneWithoutJustificativasNestedInput = {
    create?: XOR<BaseCreateWithoutJustificativasInput, BaseUncheckedCreateWithoutJustificativasInput>
    connectOrCreate?: BaseCreateOrConnectWithoutJustificativasInput
    upsert?: BaseUpsertWithoutJustificativasInput
    disconnect?: BaseWhereInput | boolean
    delete?: BaseWhereInput | boolean
    connect?: BaseWhereUniqueInput
    update?: XOR<XOR<BaseUpdateToOneWithWhereWithoutJustificativasInput, BaseUpdateWithoutJustificativasInput>, BaseUncheckedUpdateWithoutJustificativasInput>
  }

  export type VeiculoCreateNestedOneWithoutTelemetriasInput = {
    create?: XOR<VeiculoCreateWithoutTelemetriasInput, VeiculoUncheckedCreateWithoutTelemetriasInput>
    connectOrCreate?: VeiculoCreateOrConnectWithoutTelemetriasInput
    connect?: VeiculoWhereUniqueInput
  }

  export type ViagemCreateNestedOneWithoutTelemetriasInput = {
    create?: XOR<ViagemCreateWithoutTelemetriasInput, ViagemUncheckedCreateWithoutTelemetriasInput>
    connectOrCreate?: ViagemCreateOrConnectWithoutTelemetriasInput
    connect?: ViagemWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type VeiculoUpdateOneRequiredWithoutTelemetriasNestedInput = {
    create?: XOR<VeiculoCreateWithoutTelemetriasInput, VeiculoUncheckedCreateWithoutTelemetriasInput>
    connectOrCreate?: VeiculoCreateOrConnectWithoutTelemetriasInput
    upsert?: VeiculoUpsertWithoutTelemetriasInput
    connect?: VeiculoWhereUniqueInput
    update?: XOR<XOR<VeiculoUpdateToOneWithWhereWithoutTelemetriasInput, VeiculoUpdateWithoutTelemetriasInput>, VeiculoUncheckedUpdateWithoutTelemetriasInput>
  }

  export type ViagemUpdateOneWithoutTelemetriasNestedInput = {
    create?: XOR<ViagemCreateWithoutTelemetriasInput, ViagemUncheckedCreateWithoutTelemetriasInput>
    connectOrCreate?: ViagemCreateOrConnectWithoutTelemetriasInput
    upsert?: ViagemUpsertWithoutTelemetriasInput
    disconnect?: ViagemWhereInput | boolean
    delete?: ViagemWhereInput | boolean
    connect?: ViagemWhereUniqueInput
    update?: XOR<XOR<ViagemUpdateToOneWithWhereWithoutTelemetriasInput, ViagemUpdateWithoutTelemetriasInput>, ViagemUncheckedUpdateWithoutTelemetriasInput>
  }

  export type ParadaPadraoCreateNestedManyWithoutRotaInput = {
    create?: XOR<ParadaPadraoCreateWithoutRotaInput, ParadaPadraoUncheckedCreateWithoutRotaInput> | ParadaPadraoCreateWithoutRotaInput[] | ParadaPadraoUncheckedCreateWithoutRotaInput[]
    connectOrCreate?: ParadaPadraoCreateOrConnectWithoutRotaInput | ParadaPadraoCreateOrConnectWithoutRotaInput[]
    createMany?: ParadaPadraoCreateManyRotaInputEnvelope
    connect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
  }

  export type ViagemCreateNestedManyWithoutRotaPadraoInput = {
    create?: XOR<ViagemCreateWithoutRotaPadraoInput, ViagemUncheckedCreateWithoutRotaPadraoInput> | ViagemCreateWithoutRotaPadraoInput[] | ViagemUncheckedCreateWithoutRotaPadraoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutRotaPadraoInput | ViagemCreateOrConnectWithoutRotaPadraoInput[]
    createMany?: ViagemCreateManyRotaPadraoInputEnvelope
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
  }

  export type ParadaPadraoUncheckedCreateNestedManyWithoutRotaInput = {
    create?: XOR<ParadaPadraoCreateWithoutRotaInput, ParadaPadraoUncheckedCreateWithoutRotaInput> | ParadaPadraoCreateWithoutRotaInput[] | ParadaPadraoUncheckedCreateWithoutRotaInput[]
    connectOrCreate?: ParadaPadraoCreateOrConnectWithoutRotaInput | ParadaPadraoCreateOrConnectWithoutRotaInput[]
    createMany?: ParadaPadraoCreateManyRotaInputEnvelope
    connect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
  }

  export type ViagemUncheckedCreateNestedManyWithoutRotaPadraoInput = {
    create?: XOR<ViagemCreateWithoutRotaPadraoInput, ViagemUncheckedCreateWithoutRotaPadraoInput> | ViagemCreateWithoutRotaPadraoInput[] | ViagemUncheckedCreateWithoutRotaPadraoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutRotaPadraoInput | ViagemCreateOrConnectWithoutRotaPadraoInput[]
    createMany?: ViagemCreateManyRotaPadraoInputEnvelope
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
  }

  export type ParadaPadraoUpdateManyWithoutRotaNestedInput = {
    create?: XOR<ParadaPadraoCreateWithoutRotaInput, ParadaPadraoUncheckedCreateWithoutRotaInput> | ParadaPadraoCreateWithoutRotaInput[] | ParadaPadraoUncheckedCreateWithoutRotaInput[]
    connectOrCreate?: ParadaPadraoCreateOrConnectWithoutRotaInput | ParadaPadraoCreateOrConnectWithoutRotaInput[]
    upsert?: ParadaPadraoUpsertWithWhereUniqueWithoutRotaInput | ParadaPadraoUpsertWithWhereUniqueWithoutRotaInput[]
    createMany?: ParadaPadraoCreateManyRotaInputEnvelope
    set?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    disconnect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    delete?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    connect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    update?: ParadaPadraoUpdateWithWhereUniqueWithoutRotaInput | ParadaPadraoUpdateWithWhereUniqueWithoutRotaInput[]
    updateMany?: ParadaPadraoUpdateManyWithWhereWithoutRotaInput | ParadaPadraoUpdateManyWithWhereWithoutRotaInput[]
    deleteMany?: ParadaPadraoScalarWhereInput | ParadaPadraoScalarWhereInput[]
  }

  export type ViagemUpdateManyWithoutRotaPadraoNestedInput = {
    create?: XOR<ViagemCreateWithoutRotaPadraoInput, ViagemUncheckedCreateWithoutRotaPadraoInput> | ViagemCreateWithoutRotaPadraoInput[] | ViagemUncheckedCreateWithoutRotaPadraoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutRotaPadraoInput | ViagemCreateOrConnectWithoutRotaPadraoInput[]
    upsert?: ViagemUpsertWithWhereUniqueWithoutRotaPadraoInput | ViagemUpsertWithWhereUniqueWithoutRotaPadraoInput[]
    createMany?: ViagemCreateManyRotaPadraoInputEnvelope
    set?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    disconnect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    delete?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    update?: ViagemUpdateWithWhereUniqueWithoutRotaPadraoInput | ViagemUpdateWithWhereUniqueWithoutRotaPadraoInput[]
    updateMany?: ViagemUpdateManyWithWhereWithoutRotaPadraoInput | ViagemUpdateManyWithWhereWithoutRotaPadraoInput[]
    deleteMany?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
  }

  export type ParadaPadraoUncheckedUpdateManyWithoutRotaNestedInput = {
    create?: XOR<ParadaPadraoCreateWithoutRotaInput, ParadaPadraoUncheckedCreateWithoutRotaInput> | ParadaPadraoCreateWithoutRotaInput[] | ParadaPadraoUncheckedCreateWithoutRotaInput[]
    connectOrCreate?: ParadaPadraoCreateOrConnectWithoutRotaInput | ParadaPadraoCreateOrConnectWithoutRotaInput[]
    upsert?: ParadaPadraoUpsertWithWhereUniqueWithoutRotaInput | ParadaPadraoUpsertWithWhereUniqueWithoutRotaInput[]
    createMany?: ParadaPadraoCreateManyRotaInputEnvelope
    set?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    disconnect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    delete?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    connect?: ParadaPadraoWhereUniqueInput | ParadaPadraoWhereUniqueInput[]
    update?: ParadaPadraoUpdateWithWhereUniqueWithoutRotaInput | ParadaPadraoUpdateWithWhereUniqueWithoutRotaInput[]
    updateMany?: ParadaPadraoUpdateManyWithWhereWithoutRotaInput | ParadaPadraoUpdateManyWithWhereWithoutRotaInput[]
    deleteMany?: ParadaPadraoScalarWhereInput | ParadaPadraoScalarWhereInput[]
  }

  export type ViagemUncheckedUpdateManyWithoutRotaPadraoNestedInput = {
    create?: XOR<ViagemCreateWithoutRotaPadraoInput, ViagemUncheckedCreateWithoutRotaPadraoInput> | ViagemCreateWithoutRotaPadraoInput[] | ViagemUncheckedCreateWithoutRotaPadraoInput[]
    connectOrCreate?: ViagemCreateOrConnectWithoutRotaPadraoInput | ViagemCreateOrConnectWithoutRotaPadraoInput[]
    upsert?: ViagemUpsertWithWhereUniqueWithoutRotaPadraoInput | ViagemUpsertWithWhereUniqueWithoutRotaPadraoInput[]
    createMany?: ViagemCreateManyRotaPadraoInputEnvelope
    set?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    disconnect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    delete?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    connect?: ViagemWhereUniqueInput | ViagemWhereUniqueInput[]
    update?: ViagemUpdateWithWhereUniqueWithoutRotaPadraoInput | ViagemUpdateWithWhereUniqueWithoutRotaPadraoInput[]
    updateMany?: ViagemUpdateManyWithWhereWithoutRotaPadraoInput | ViagemUpdateManyWithWhereWithoutRotaPadraoInput[]
    deleteMany?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
  }

  export type RotaPadraoCreateNestedOneWithoutParadasInput = {
    create?: XOR<RotaPadraoCreateWithoutParadasInput, RotaPadraoUncheckedCreateWithoutParadasInput>
    connectOrCreate?: RotaPadraoCreateOrConnectWithoutParadasInput
    connect?: RotaPadraoWhereUniqueInput
  }

  export type BaseCreateNestedOneWithoutParadasPadraoInput = {
    create?: XOR<BaseCreateWithoutParadasPadraoInput, BaseUncheckedCreateWithoutParadasPadraoInput>
    connectOrCreate?: BaseCreateOrConnectWithoutParadasPadraoInput
    connect?: BaseWhereUniqueInput
  }

  export type RotaPadraoUpdateOneRequiredWithoutParadasNestedInput = {
    create?: XOR<RotaPadraoCreateWithoutParadasInput, RotaPadraoUncheckedCreateWithoutParadasInput>
    connectOrCreate?: RotaPadraoCreateOrConnectWithoutParadasInput
    upsert?: RotaPadraoUpsertWithoutParadasInput
    connect?: RotaPadraoWhereUniqueInput
    update?: XOR<XOR<RotaPadraoUpdateToOneWithWhereWithoutParadasInput, RotaPadraoUpdateWithoutParadasInput>, RotaPadraoUncheckedUpdateWithoutParadasInput>
  }

  export type BaseUpdateOneRequiredWithoutParadasPadraoNestedInput = {
    create?: XOR<BaseCreateWithoutParadasPadraoInput, BaseUncheckedCreateWithoutParadasPadraoInput>
    connectOrCreate?: BaseCreateOrConnectWithoutParadasPadraoInput
    upsert?: BaseUpsertWithoutParadasPadraoInput
    connect?: BaseWhereUniqueInput
    update?: XOR<XOR<BaseUpdateToOneWithWhereWithoutParadasPadraoInput, BaseUpdateWithoutParadasPadraoInput>, BaseUncheckedUpdateWithoutParadasPadraoInput>
  }

  export type ViagemCreateNestedOneWithoutParadasViagemInput = {
    create?: XOR<ViagemCreateWithoutParadasViagemInput, ViagemUncheckedCreateWithoutParadasViagemInput>
    connectOrCreate?: ViagemCreateOrConnectWithoutParadasViagemInput
    connect?: ViagemWhereUniqueInput
  }

  export type BaseCreateNestedOneWithoutParadasViagemInput = {
    create?: XOR<BaseCreateWithoutParadasViagemInput, BaseUncheckedCreateWithoutParadasViagemInput>
    connectOrCreate?: BaseCreateOrConnectWithoutParadasViagemInput
    connect?: BaseWhereUniqueInput
  }

  export type ViagemUpdateOneRequiredWithoutParadasViagemNestedInput = {
    create?: XOR<ViagemCreateWithoutParadasViagemInput, ViagemUncheckedCreateWithoutParadasViagemInput>
    connectOrCreate?: ViagemCreateOrConnectWithoutParadasViagemInput
    upsert?: ViagemUpsertWithoutParadasViagemInput
    connect?: ViagemWhereUniqueInput
    update?: XOR<XOR<ViagemUpdateToOneWithWhereWithoutParadasViagemInput, ViagemUpdateWithoutParadasViagemInput>, ViagemUncheckedUpdateWithoutParadasViagemInput>
  }

  export type BaseUpdateOneRequiredWithoutParadasViagemNestedInput = {
    create?: XOR<BaseCreateWithoutParadasViagemInput, BaseUncheckedCreateWithoutParadasViagemInput>
    connectOrCreate?: BaseCreateOrConnectWithoutParadasViagemInput
    upsert?: BaseUpsertWithoutParadasViagemInput
    connect?: BaseWhereUniqueInput
    update?: XOR<XOR<BaseUpdateToOneWithWhereWithoutParadasViagemInput, BaseUpdateWithoutParadasViagemInput>, BaseUncheckedUpdateWithoutParadasViagemInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedEnumStatusViagemFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusViagem | EnumStatusViagemFieldRefInput<$PrismaModel>
    in?: $Enums.StatusViagem[] | ListEnumStatusViagemFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusViagem[] | ListEnumStatusViagemFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusViagemFilter<$PrismaModel> | $Enums.StatusViagem
  }

  export type NestedEnumStatusViagemWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusViagem | EnumStatusViagemFieldRefInput<$PrismaModel>
    in?: $Enums.StatusViagem[] | ListEnumStatusViagemFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusViagem[] | ListEnumStatusViagemFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusViagemWithAggregatesFilter<$PrismaModel> | $Enums.StatusViagem
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusViagemFilter<$PrismaModel>
    _max?: NestedEnumStatusViagemFilter<$PrismaModel>
  }

  export type NestedEnumTipoAtrasoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoAtraso | EnumTipoAtrasoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoAtraso[] | ListEnumTipoAtrasoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoAtraso[] | ListEnumTipoAtrasoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoAtrasoFilter<$PrismaModel> | $Enums.TipoAtraso
  }

  export type NestedEnumTipoAtrasoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoAtraso | EnumTipoAtrasoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoAtraso[] | ListEnumTipoAtrasoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoAtraso[] | ListEnumTipoAtrasoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoAtrasoWithAggregatesFilter<$PrismaModel> | $Enums.TipoAtraso
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoAtrasoFilter<$PrismaModel>
    _max?: NestedEnumTipoAtrasoFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type UserCreateWithoutBaseInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    senhaHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutUsuarioInput
  }

  export type UserUncheckedCreateWithoutBaseInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    senhaHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UserCreateOrConnectWithoutBaseInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBaseInput, UserUncheckedCreateWithoutBaseInput>
  }

  export type UserCreateManyBaseInputEnvelope = {
    data: UserCreateManyBaseInput | UserCreateManyBaseInput[]
    skipDuplicates?: boolean
  }

  export type ViagemCreateWithoutBaseOrigemInput = {
    id: string
    motorista: string
    rotaDescricao: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutViagensInput
    baseDestino: BaseCreateNestedOneWithoutViagensDestinoInput
    rotaPadrao?: RotaPadraoCreateNestedOneWithoutViagensInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaCreateNestedManyWithoutViagemInput
  }

  export type ViagemUncheckedCreateWithoutBaseOrigemInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutViagemInput
  }

  export type ViagemCreateOrConnectWithoutBaseOrigemInput = {
    where: ViagemWhereUniqueInput
    create: XOR<ViagemCreateWithoutBaseOrigemInput, ViagemUncheckedCreateWithoutBaseOrigemInput>
  }

  export type ViagemCreateManyBaseOrigemInputEnvelope = {
    data: ViagemCreateManyBaseOrigemInput | ViagemCreateManyBaseOrigemInput[]
    skipDuplicates?: boolean
  }

  export type ViagemCreateWithoutBaseDestinoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutViagensInput
    baseOrigem: BaseCreateNestedOneWithoutViagensOrigemInput
    rotaPadrao?: RotaPadraoCreateNestedOneWithoutViagensInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaCreateNestedManyWithoutViagemInput
  }

  export type ViagemUncheckedCreateWithoutBaseDestinoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutViagemInput
  }

  export type ViagemCreateOrConnectWithoutBaseDestinoInput = {
    where: ViagemWhereUniqueInput
    create: XOR<ViagemCreateWithoutBaseDestinoInput, ViagemUncheckedCreateWithoutBaseDestinoInput>
  }

  export type ViagemCreateManyBaseDestinoInputEnvelope = {
    data: ViagemCreateManyBaseDestinoInput | ViagemCreateManyBaseDestinoInput[]
    skipDuplicates?: boolean
  }

  export type JustificativaAtrasoCreateWithoutBaseInput = {
    id?: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    tempoAtrasoMinutos: number
    createdAt?: Date | string
    viagem: ViagemCreateNestedOneWithoutJustificativasInput
    usuario: UserCreateNestedOneWithoutJustificativasInput
  }

  export type JustificativaAtrasoUncheckedCreateWithoutBaseInput = {
    id?: string
    viagemId: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    usuarioId: string
    tempoAtrasoMinutos: number
    createdAt?: Date | string
  }

  export type JustificativaAtrasoCreateOrConnectWithoutBaseInput = {
    where: JustificativaAtrasoWhereUniqueInput
    create: XOR<JustificativaAtrasoCreateWithoutBaseInput, JustificativaAtrasoUncheckedCreateWithoutBaseInput>
  }

  export type JustificativaAtrasoCreateManyBaseInputEnvelope = {
    data: JustificativaAtrasoCreateManyBaseInput | JustificativaAtrasoCreateManyBaseInput[]
    skipDuplicates?: boolean
  }

  export type ParadaPadraoCreateWithoutBaseInput = {
    id?: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
    rota: RotaPadraoCreateNestedOneWithoutParadasInput
  }

  export type ParadaPadraoUncheckedCreateWithoutBaseInput = {
    id?: string
    rotaId: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
  }

  export type ParadaPadraoCreateOrConnectWithoutBaseInput = {
    where: ParadaPadraoWhereUniqueInput
    create: XOR<ParadaPadraoCreateWithoutBaseInput, ParadaPadraoUncheckedCreateWithoutBaseInput>
  }

  export type ParadaPadraoCreateManyBaseInputEnvelope = {
    data: ParadaPadraoCreateManyBaseInput | ParadaPadraoCreateManyBaseInput[]
    skipDuplicates?: boolean
  }

  export type ParadaViagemCreateWithoutBaseInput = {
    id?: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
    viagem: ViagemCreateNestedOneWithoutParadasViagemInput
  }

  export type ParadaViagemUncheckedCreateWithoutBaseInput = {
    id?: string
    viagemId: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
  }

  export type ParadaViagemCreateOrConnectWithoutBaseInput = {
    where: ParadaViagemWhereUniqueInput
    create: XOR<ParadaViagemCreateWithoutBaseInput, ParadaViagemUncheckedCreateWithoutBaseInput>
  }

  export type ParadaViagemCreateManyBaseInputEnvelope = {
    data: ParadaViagemCreateManyBaseInput | ParadaViagemCreateManyBaseInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutBaseInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutBaseInput, UserUncheckedUpdateWithoutBaseInput>
    create: XOR<UserCreateWithoutBaseInput, UserUncheckedCreateWithoutBaseInput>
  }

  export type UserUpdateWithWhereUniqueWithoutBaseInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutBaseInput, UserUncheckedUpdateWithoutBaseInput>
  }

  export type UserUpdateManyWithWhereWithoutBaseInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutBaseInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    senhaHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    baseId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type ViagemUpsertWithWhereUniqueWithoutBaseOrigemInput = {
    where: ViagemWhereUniqueInput
    update: XOR<ViagemUpdateWithoutBaseOrigemInput, ViagemUncheckedUpdateWithoutBaseOrigemInput>
    create: XOR<ViagemCreateWithoutBaseOrigemInput, ViagemUncheckedCreateWithoutBaseOrigemInput>
  }

  export type ViagemUpdateWithWhereUniqueWithoutBaseOrigemInput = {
    where: ViagemWhereUniqueInput
    data: XOR<ViagemUpdateWithoutBaseOrigemInput, ViagemUncheckedUpdateWithoutBaseOrigemInput>
  }

  export type ViagemUpdateManyWithWhereWithoutBaseOrigemInput = {
    where: ViagemScalarWhereInput
    data: XOR<ViagemUpdateManyMutationInput, ViagemUncheckedUpdateManyWithoutBaseOrigemInput>
  }

  export type ViagemScalarWhereInput = {
    AND?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
    OR?: ViagemScalarWhereInput[]
    NOT?: ViagemScalarWhereInput | ViagemScalarWhereInput[]
    id?: StringFilter<"Viagem"> | string
    motorista?: StringFilter<"Viagem"> | string
    rotaDescricao?: StringFilter<"Viagem"> | string
    veiculoId?: StringFilter<"Viagem"> | string
    baseOrigemId?: StringFilter<"Viagem"> | string
    baseDestinoId?: StringFilter<"Viagem"> | string
    status?: EnumStatusViagemFilter<"Viagem"> | $Enums.StatusViagem
    prevInicioReal?: DateTimeFilter<"Viagem"> | Date | string
    prevFimReal?: DateTimeFilter<"Viagem"> | Date | string
    dataInicioEfetivo?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    dataFimEfetivo?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    rotaPadraoId?: StringNullableFilter<"Viagem"> | string | null
    novaPrevisaoSaida?: DateTimeNullableFilter<"Viagem"> | Date | string | null
    createdAt?: DateTimeFilter<"Viagem"> | Date | string
    updatedAt?: DateTimeFilter<"Viagem"> | Date | string
  }

  export type ViagemUpsertWithWhereUniqueWithoutBaseDestinoInput = {
    where: ViagemWhereUniqueInput
    update: XOR<ViagemUpdateWithoutBaseDestinoInput, ViagemUncheckedUpdateWithoutBaseDestinoInput>
    create: XOR<ViagemCreateWithoutBaseDestinoInput, ViagemUncheckedCreateWithoutBaseDestinoInput>
  }

  export type ViagemUpdateWithWhereUniqueWithoutBaseDestinoInput = {
    where: ViagemWhereUniqueInput
    data: XOR<ViagemUpdateWithoutBaseDestinoInput, ViagemUncheckedUpdateWithoutBaseDestinoInput>
  }

  export type ViagemUpdateManyWithWhereWithoutBaseDestinoInput = {
    where: ViagemScalarWhereInput
    data: XOR<ViagemUpdateManyMutationInput, ViagemUncheckedUpdateManyWithoutBaseDestinoInput>
  }

  export type JustificativaAtrasoUpsertWithWhereUniqueWithoutBaseInput = {
    where: JustificativaAtrasoWhereUniqueInput
    update: XOR<JustificativaAtrasoUpdateWithoutBaseInput, JustificativaAtrasoUncheckedUpdateWithoutBaseInput>
    create: XOR<JustificativaAtrasoCreateWithoutBaseInput, JustificativaAtrasoUncheckedCreateWithoutBaseInput>
  }

  export type JustificativaAtrasoUpdateWithWhereUniqueWithoutBaseInput = {
    where: JustificativaAtrasoWhereUniqueInput
    data: XOR<JustificativaAtrasoUpdateWithoutBaseInput, JustificativaAtrasoUncheckedUpdateWithoutBaseInput>
  }

  export type JustificativaAtrasoUpdateManyWithWhereWithoutBaseInput = {
    where: JustificativaAtrasoScalarWhereInput
    data: XOR<JustificativaAtrasoUpdateManyMutationInput, JustificativaAtrasoUncheckedUpdateManyWithoutBaseInput>
  }

  export type JustificativaAtrasoScalarWhereInput = {
    AND?: JustificativaAtrasoScalarWhereInput | JustificativaAtrasoScalarWhereInput[]
    OR?: JustificativaAtrasoScalarWhereInput[]
    NOT?: JustificativaAtrasoScalarWhereInput | JustificativaAtrasoScalarWhereInput[]
    id?: StringFilter<"JustificativaAtraso"> | string
    viagemId?: StringFilter<"JustificativaAtraso"> | string
    tipoAtraso?: EnumTipoAtrasoFilter<"JustificativaAtraso"> | $Enums.TipoAtraso
    motivo?: StringFilter<"JustificativaAtraso"> | string
    usuarioId?: StringFilter<"JustificativaAtraso"> | string
    baseId?: StringNullableFilter<"JustificativaAtraso"> | string | null
    tempoAtrasoMinutos?: IntFilter<"JustificativaAtraso"> | number
    createdAt?: DateTimeFilter<"JustificativaAtraso"> | Date | string
  }

  export type ParadaPadraoUpsertWithWhereUniqueWithoutBaseInput = {
    where: ParadaPadraoWhereUniqueInput
    update: XOR<ParadaPadraoUpdateWithoutBaseInput, ParadaPadraoUncheckedUpdateWithoutBaseInput>
    create: XOR<ParadaPadraoCreateWithoutBaseInput, ParadaPadraoUncheckedCreateWithoutBaseInput>
  }

  export type ParadaPadraoUpdateWithWhereUniqueWithoutBaseInput = {
    where: ParadaPadraoWhereUniqueInput
    data: XOR<ParadaPadraoUpdateWithoutBaseInput, ParadaPadraoUncheckedUpdateWithoutBaseInput>
  }

  export type ParadaPadraoUpdateManyWithWhereWithoutBaseInput = {
    where: ParadaPadraoScalarWhereInput
    data: XOR<ParadaPadraoUpdateManyMutationInput, ParadaPadraoUncheckedUpdateManyWithoutBaseInput>
  }

  export type ParadaPadraoScalarWhereInput = {
    AND?: ParadaPadraoScalarWhereInput | ParadaPadraoScalarWhereInput[]
    OR?: ParadaPadraoScalarWhereInput[]
    NOT?: ParadaPadraoScalarWhereInput | ParadaPadraoScalarWhereInput[]
    id?: StringFilter<"ParadaPadrao"> | string
    rotaId?: StringFilter<"ParadaPadrao"> | string
    baseId?: StringFilter<"ParadaPadrao"> | string
    ordem?: IntFilter<"ParadaPadrao"> | number
    prevChegada?: StringNullableFilter<"ParadaPadrao"> | string | null
    prevSaida?: StringNullableFilter<"ParadaPadrao"> | string | null
  }

  export type ParadaViagemUpsertWithWhereUniqueWithoutBaseInput = {
    where: ParadaViagemWhereUniqueInput
    update: XOR<ParadaViagemUpdateWithoutBaseInput, ParadaViagemUncheckedUpdateWithoutBaseInput>
    create: XOR<ParadaViagemCreateWithoutBaseInput, ParadaViagemUncheckedCreateWithoutBaseInput>
  }

  export type ParadaViagemUpdateWithWhereUniqueWithoutBaseInput = {
    where: ParadaViagemWhereUniqueInput
    data: XOR<ParadaViagemUpdateWithoutBaseInput, ParadaViagemUncheckedUpdateWithoutBaseInput>
  }

  export type ParadaViagemUpdateManyWithWhereWithoutBaseInput = {
    where: ParadaViagemScalarWhereInput
    data: XOR<ParadaViagemUpdateManyMutationInput, ParadaViagemUncheckedUpdateManyWithoutBaseInput>
  }

  export type ParadaViagemScalarWhereInput = {
    AND?: ParadaViagemScalarWhereInput | ParadaViagemScalarWhereInput[]
    OR?: ParadaViagemScalarWhereInput[]
    NOT?: ParadaViagemScalarWhereInput | ParadaViagemScalarWhereInput[]
    id?: StringFilter<"ParadaViagem"> | string
    viagemId?: StringFilter<"ParadaViagem"> | string
    baseId?: StringFilter<"ParadaViagem"> | string
    ordem?: IntFilter<"ParadaViagem"> | number
    prevChegada?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    prevSaida?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    dataChegadaEfetiva?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
    dataSaidaEfetiva?: DateTimeNullableFilter<"ParadaViagem"> | Date | string | null
  }

  export type BaseCreateWithoutUsuariosInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    viagensOrigem?: ViagemCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutBaseInput
  }

  export type BaseUncheckedCreateWithoutUsuariosInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    viagensOrigem?: ViagemUncheckedCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemUncheckedCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoUncheckedCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutBaseInput
  }

  export type BaseCreateOrConnectWithoutUsuariosInput = {
    where: BaseWhereUniqueInput
    create: XOR<BaseCreateWithoutUsuariosInput, BaseUncheckedCreateWithoutUsuariosInput>
  }

  export type JustificativaAtrasoCreateWithoutUsuarioInput = {
    id?: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    tempoAtrasoMinutos: number
    createdAt?: Date | string
    viagem: ViagemCreateNestedOneWithoutJustificativasInput
    base?: BaseCreateNestedOneWithoutJustificativasInput
  }

  export type JustificativaAtrasoUncheckedCreateWithoutUsuarioInput = {
    id?: string
    viagemId: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    baseId?: string | null
    tempoAtrasoMinutos: number
    createdAt?: Date | string
  }

  export type JustificativaAtrasoCreateOrConnectWithoutUsuarioInput = {
    where: JustificativaAtrasoWhereUniqueInput
    create: XOR<JustificativaAtrasoCreateWithoutUsuarioInput, JustificativaAtrasoUncheckedCreateWithoutUsuarioInput>
  }

  export type JustificativaAtrasoCreateManyUsuarioInputEnvelope = {
    data: JustificativaAtrasoCreateManyUsuarioInput | JustificativaAtrasoCreateManyUsuarioInput[]
    skipDuplicates?: boolean
  }

  export type BaseUpsertWithoutUsuariosInput = {
    update: XOR<BaseUpdateWithoutUsuariosInput, BaseUncheckedUpdateWithoutUsuariosInput>
    create: XOR<BaseCreateWithoutUsuariosInput, BaseUncheckedCreateWithoutUsuariosInput>
    where?: BaseWhereInput
  }

  export type BaseUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: BaseWhereInput
    data: XOR<BaseUpdateWithoutUsuariosInput, BaseUncheckedUpdateWithoutUsuariosInput>
  }

  export type BaseUpdateWithoutUsuariosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagensOrigem?: ViagemUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutBaseNestedInput
  }

  export type BaseUncheckedUpdateWithoutUsuariosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagensOrigem?: ViagemUncheckedUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUncheckedUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUncheckedUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutBaseNestedInput
  }

  export type JustificativaAtrasoUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: JustificativaAtrasoWhereUniqueInput
    update: XOR<JustificativaAtrasoUpdateWithoutUsuarioInput, JustificativaAtrasoUncheckedUpdateWithoutUsuarioInput>
    create: XOR<JustificativaAtrasoCreateWithoutUsuarioInput, JustificativaAtrasoUncheckedCreateWithoutUsuarioInput>
  }

  export type JustificativaAtrasoUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: JustificativaAtrasoWhereUniqueInput
    data: XOR<JustificativaAtrasoUpdateWithoutUsuarioInput, JustificativaAtrasoUncheckedUpdateWithoutUsuarioInput>
  }

  export type JustificativaAtrasoUpdateManyWithWhereWithoutUsuarioInput = {
    where: JustificativaAtrasoScalarWhereInput
    data: XOR<JustificativaAtrasoUpdateManyMutationInput, JustificativaAtrasoUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type ViagemCreateWithoutVeiculoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    baseOrigem: BaseCreateNestedOneWithoutViagensOrigemInput
    baseDestino: BaseCreateNestedOneWithoutViagensDestinoInput
    rotaPadrao?: RotaPadraoCreateNestedOneWithoutViagensInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaCreateNestedManyWithoutViagemInput
  }

  export type ViagemUncheckedCreateWithoutVeiculoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutViagemInput
  }

  export type ViagemCreateOrConnectWithoutVeiculoInput = {
    where: ViagemWhereUniqueInput
    create: XOR<ViagemCreateWithoutVeiculoInput, ViagemUncheckedCreateWithoutVeiculoInput>
  }

  export type ViagemCreateManyVeiculoInputEnvelope = {
    data: ViagemCreateManyVeiculoInput | ViagemCreateManyVeiculoInput[]
    skipDuplicates?: boolean
  }

  export type TelemetriaCreateWithoutVeiculoInput = {
    id?: string
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
    viagem?: ViagemCreateNestedOneWithoutTelemetriasInput
  }

  export type TelemetriaUncheckedCreateWithoutVeiculoInput = {
    id?: string
    viagemId?: string | null
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
  }

  export type TelemetriaCreateOrConnectWithoutVeiculoInput = {
    where: TelemetriaWhereUniqueInput
    create: XOR<TelemetriaCreateWithoutVeiculoInput, TelemetriaUncheckedCreateWithoutVeiculoInput>
  }

  export type TelemetriaCreateManyVeiculoInputEnvelope = {
    data: TelemetriaCreateManyVeiculoInput | TelemetriaCreateManyVeiculoInput[]
    skipDuplicates?: boolean
  }

  export type ViagemUpsertWithWhereUniqueWithoutVeiculoInput = {
    where: ViagemWhereUniqueInput
    update: XOR<ViagemUpdateWithoutVeiculoInput, ViagemUncheckedUpdateWithoutVeiculoInput>
    create: XOR<ViagemCreateWithoutVeiculoInput, ViagemUncheckedCreateWithoutVeiculoInput>
  }

  export type ViagemUpdateWithWhereUniqueWithoutVeiculoInput = {
    where: ViagemWhereUniqueInput
    data: XOR<ViagemUpdateWithoutVeiculoInput, ViagemUncheckedUpdateWithoutVeiculoInput>
  }

  export type ViagemUpdateManyWithWhereWithoutVeiculoInput = {
    where: ViagemScalarWhereInput
    data: XOR<ViagemUpdateManyMutationInput, ViagemUncheckedUpdateManyWithoutVeiculoInput>
  }

  export type TelemetriaUpsertWithWhereUniqueWithoutVeiculoInput = {
    where: TelemetriaWhereUniqueInput
    update: XOR<TelemetriaUpdateWithoutVeiculoInput, TelemetriaUncheckedUpdateWithoutVeiculoInput>
    create: XOR<TelemetriaCreateWithoutVeiculoInput, TelemetriaUncheckedCreateWithoutVeiculoInput>
  }

  export type TelemetriaUpdateWithWhereUniqueWithoutVeiculoInput = {
    where: TelemetriaWhereUniqueInput
    data: XOR<TelemetriaUpdateWithoutVeiculoInput, TelemetriaUncheckedUpdateWithoutVeiculoInput>
  }

  export type TelemetriaUpdateManyWithWhereWithoutVeiculoInput = {
    where: TelemetriaScalarWhereInput
    data: XOR<TelemetriaUpdateManyMutationInput, TelemetriaUncheckedUpdateManyWithoutVeiculoInput>
  }

  export type TelemetriaScalarWhereInput = {
    AND?: TelemetriaScalarWhereInput | TelemetriaScalarWhereInput[]
    OR?: TelemetriaScalarWhereInput[]
    NOT?: TelemetriaScalarWhereInput | TelemetriaScalarWhereInput[]
    id?: StringFilter<"Telemetria"> | string
    veiculoId?: StringFilter<"Telemetria"> | string
    viagemId?: StringNullableFilter<"Telemetria"> | string | null
    latitude?: FloatFilter<"Telemetria"> | number
    longitude?: FloatFilter<"Telemetria"> | number
    ignicao?: BoolFilter<"Telemetria"> | boolean
    velocidade?: IntNullableFilter<"Telemetria"> | number | null
    dataHoraUtc?: DateTimeFilter<"Telemetria"> | Date | string
    dataHoraLocal?: DateTimeFilter<"Telemetria"> | Date | string
    createdAt?: DateTimeFilter<"Telemetria"> | Date | string
  }

  export type VeiculoCreateWithoutViagensInput = {
    id: string
    placa: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    telemetrias?: TelemetriaCreateNestedManyWithoutVeiculoInput
  }

  export type VeiculoUncheckedCreateWithoutViagensInput = {
    id: string
    placa: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutVeiculoInput
  }

  export type VeiculoCreateOrConnectWithoutViagensInput = {
    where: VeiculoWhereUniqueInput
    create: XOR<VeiculoCreateWithoutViagensInput, VeiculoUncheckedCreateWithoutViagensInput>
  }

  export type BaseCreateWithoutViagensOrigemInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutBaseInput
    viagensDestino?: ViagemCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutBaseInput
  }

  export type BaseUncheckedCreateWithoutViagensOrigemInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutBaseInput
    viagensDestino?: ViagemUncheckedCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoUncheckedCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutBaseInput
  }

  export type BaseCreateOrConnectWithoutViagensOrigemInput = {
    where: BaseWhereUniqueInput
    create: XOR<BaseCreateWithoutViagensOrigemInput, BaseUncheckedCreateWithoutViagensOrigemInput>
  }

  export type BaseCreateWithoutViagensDestinoInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemCreateNestedManyWithoutBaseOrigemInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutBaseInput
  }

  export type BaseUncheckedCreateWithoutViagensDestinoInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemUncheckedCreateNestedManyWithoutBaseOrigemInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoUncheckedCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutBaseInput
  }

  export type BaseCreateOrConnectWithoutViagensDestinoInput = {
    where: BaseWhereUniqueInput
    create: XOR<BaseCreateWithoutViagensDestinoInput, BaseUncheckedCreateWithoutViagensDestinoInput>
  }

  export type RotaPadraoCreateWithoutViagensInput = {
    id?: string
    nome: string
    paradas?: ParadaPadraoCreateNestedManyWithoutRotaInput
  }

  export type RotaPadraoUncheckedCreateWithoutViagensInput = {
    id?: string
    nome: string
    paradas?: ParadaPadraoUncheckedCreateNestedManyWithoutRotaInput
  }

  export type RotaPadraoCreateOrConnectWithoutViagensInput = {
    where: RotaPadraoWhereUniqueInput
    create: XOR<RotaPadraoCreateWithoutViagensInput, RotaPadraoUncheckedCreateWithoutViagensInput>
  }

  export type ParadaViagemCreateWithoutViagemInput = {
    id?: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
    base: BaseCreateNestedOneWithoutParadasViagemInput
  }

  export type ParadaViagemUncheckedCreateWithoutViagemInput = {
    id?: string
    baseId: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
  }

  export type ParadaViagemCreateOrConnectWithoutViagemInput = {
    where: ParadaViagemWhereUniqueInput
    create: XOR<ParadaViagemCreateWithoutViagemInput, ParadaViagemUncheckedCreateWithoutViagemInput>
  }

  export type ParadaViagemCreateManyViagemInputEnvelope = {
    data: ParadaViagemCreateManyViagemInput | ParadaViagemCreateManyViagemInput[]
    skipDuplicates?: boolean
  }

  export type JustificativaAtrasoCreateWithoutViagemInput = {
    id?: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    tempoAtrasoMinutos: number
    createdAt?: Date | string
    usuario: UserCreateNestedOneWithoutJustificativasInput
    base?: BaseCreateNestedOneWithoutJustificativasInput
  }

  export type JustificativaAtrasoUncheckedCreateWithoutViagemInput = {
    id?: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    usuarioId: string
    baseId?: string | null
    tempoAtrasoMinutos: number
    createdAt?: Date | string
  }

  export type JustificativaAtrasoCreateOrConnectWithoutViagemInput = {
    where: JustificativaAtrasoWhereUniqueInput
    create: XOR<JustificativaAtrasoCreateWithoutViagemInput, JustificativaAtrasoUncheckedCreateWithoutViagemInput>
  }

  export type JustificativaAtrasoCreateManyViagemInputEnvelope = {
    data: JustificativaAtrasoCreateManyViagemInput | JustificativaAtrasoCreateManyViagemInput[]
    skipDuplicates?: boolean
  }

  export type TelemetriaCreateWithoutViagemInput = {
    id?: string
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutTelemetriasInput
  }

  export type TelemetriaUncheckedCreateWithoutViagemInput = {
    id?: string
    veiculoId: string
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
  }

  export type TelemetriaCreateOrConnectWithoutViagemInput = {
    where: TelemetriaWhereUniqueInput
    create: XOR<TelemetriaCreateWithoutViagemInput, TelemetriaUncheckedCreateWithoutViagemInput>
  }

  export type TelemetriaCreateManyViagemInputEnvelope = {
    data: TelemetriaCreateManyViagemInput | TelemetriaCreateManyViagemInput[]
    skipDuplicates?: boolean
  }

  export type VeiculoUpsertWithoutViagensInput = {
    update: XOR<VeiculoUpdateWithoutViagensInput, VeiculoUncheckedUpdateWithoutViagensInput>
    create: XOR<VeiculoCreateWithoutViagensInput, VeiculoUncheckedCreateWithoutViagensInput>
    where?: VeiculoWhereInput
  }

  export type VeiculoUpdateToOneWithWhereWithoutViagensInput = {
    where?: VeiculoWhereInput
    data: XOR<VeiculoUpdateWithoutViagensInput, VeiculoUncheckedUpdateWithoutViagensInput>
  }

  export type VeiculoUpdateWithoutViagensInput = {
    id?: StringFieldUpdateOperationsInput | string
    placa?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    telemetrias?: TelemetriaUpdateManyWithoutVeiculoNestedInput
  }

  export type VeiculoUncheckedUpdateWithoutViagensInput = {
    id?: StringFieldUpdateOperationsInput | string
    placa?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutVeiculoNestedInput
  }

  export type BaseUpsertWithoutViagensOrigemInput = {
    update: XOR<BaseUpdateWithoutViagensOrigemInput, BaseUncheckedUpdateWithoutViagensOrigemInput>
    create: XOR<BaseCreateWithoutViagensOrigemInput, BaseUncheckedCreateWithoutViagensOrigemInput>
    where?: BaseWhereInput
  }

  export type BaseUpdateToOneWithWhereWithoutViagensOrigemInput = {
    where?: BaseWhereInput
    data: XOR<BaseUpdateWithoutViagensOrigemInput, BaseUncheckedUpdateWithoutViagensOrigemInput>
  }

  export type BaseUpdateWithoutViagensOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutBaseNestedInput
    viagensDestino?: ViagemUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutBaseNestedInput
  }

  export type BaseUncheckedUpdateWithoutViagensOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutBaseNestedInput
    viagensDestino?: ViagemUncheckedUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUncheckedUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutBaseNestedInput
  }

  export type BaseUpsertWithoutViagensDestinoInput = {
    update: XOR<BaseUpdateWithoutViagensDestinoInput, BaseUncheckedUpdateWithoutViagensDestinoInput>
    create: XOR<BaseCreateWithoutViagensDestinoInput, BaseUncheckedCreateWithoutViagensDestinoInput>
    where?: BaseWhereInput
  }

  export type BaseUpdateToOneWithWhereWithoutViagensDestinoInput = {
    where?: BaseWhereInput
    data: XOR<BaseUpdateWithoutViagensDestinoInput, BaseUncheckedUpdateWithoutViagensDestinoInput>
  }

  export type BaseUpdateWithoutViagensDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUpdateManyWithoutBaseOrigemNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutBaseNestedInput
  }

  export type BaseUncheckedUpdateWithoutViagensDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUncheckedUpdateManyWithoutBaseOrigemNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUncheckedUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutBaseNestedInput
  }

  export type RotaPadraoUpsertWithoutViagensInput = {
    update: XOR<RotaPadraoUpdateWithoutViagensInput, RotaPadraoUncheckedUpdateWithoutViagensInput>
    create: XOR<RotaPadraoCreateWithoutViagensInput, RotaPadraoUncheckedCreateWithoutViagensInput>
    where?: RotaPadraoWhereInput
  }

  export type RotaPadraoUpdateToOneWithWhereWithoutViagensInput = {
    where?: RotaPadraoWhereInput
    data: XOR<RotaPadraoUpdateWithoutViagensInput, RotaPadraoUncheckedUpdateWithoutViagensInput>
  }

  export type RotaPadraoUpdateWithoutViagensInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    paradas?: ParadaPadraoUpdateManyWithoutRotaNestedInput
  }

  export type RotaPadraoUncheckedUpdateWithoutViagensInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    paradas?: ParadaPadraoUncheckedUpdateManyWithoutRotaNestedInput
  }

  export type ParadaViagemUpsertWithWhereUniqueWithoutViagemInput = {
    where: ParadaViagemWhereUniqueInput
    update: XOR<ParadaViagemUpdateWithoutViagemInput, ParadaViagemUncheckedUpdateWithoutViagemInput>
    create: XOR<ParadaViagemCreateWithoutViagemInput, ParadaViagemUncheckedCreateWithoutViagemInput>
  }

  export type ParadaViagemUpdateWithWhereUniqueWithoutViagemInput = {
    where: ParadaViagemWhereUniqueInput
    data: XOR<ParadaViagemUpdateWithoutViagemInput, ParadaViagemUncheckedUpdateWithoutViagemInput>
  }

  export type ParadaViagemUpdateManyWithWhereWithoutViagemInput = {
    where: ParadaViagemScalarWhereInput
    data: XOR<ParadaViagemUpdateManyMutationInput, ParadaViagemUncheckedUpdateManyWithoutViagemInput>
  }

  export type JustificativaAtrasoUpsertWithWhereUniqueWithoutViagemInput = {
    where: JustificativaAtrasoWhereUniqueInput
    update: XOR<JustificativaAtrasoUpdateWithoutViagemInput, JustificativaAtrasoUncheckedUpdateWithoutViagemInput>
    create: XOR<JustificativaAtrasoCreateWithoutViagemInput, JustificativaAtrasoUncheckedCreateWithoutViagemInput>
  }

  export type JustificativaAtrasoUpdateWithWhereUniqueWithoutViagemInput = {
    where: JustificativaAtrasoWhereUniqueInput
    data: XOR<JustificativaAtrasoUpdateWithoutViagemInput, JustificativaAtrasoUncheckedUpdateWithoutViagemInput>
  }

  export type JustificativaAtrasoUpdateManyWithWhereWithoutViagemInput = {
    where: JustificativaAtrasoScalarWhereInput
    data: XOR<JustificativaAtrasoUpdateManyMutationInput, JustificativaAtrasoUncheckedUpdateManyWithoutViagemInput>
  }

  export type TelemetriaUpsertWithWhereUniqueWithoutViagemInput = {
    where: TelemetriaWhereUniqueInput
    update: XOR<TelemetriaUpdateWithoutViagemInput, TelemetriaUncheckedUpdateWithoutViagemInput>
    create: XOR<TelemetriaCreateWithoutViagemInput, TelemetriaUncheckedCreateWithoutViagemInput>
  }

  export type TelemetriaUpdateWithWhereUniqueWithoutViagemInput = {
    where: TelemetriaWhereUniqueInput
    data: XOR<TelemetriaUpdateWithoutViagemInput, TelemetriaUncheckedUpdateWithoutViagemInput>
  }

  export type TelemetriaUpdateManyWithWhereWithoutViagemInput = {
    where: TelemetriaScalarWhereInput
    data: XOR<TelemetriaUpdateManyMutationInput, TelemetriaUncheckedUpdateManyWithoutViagemInput>
  }

  export type ViagemCreateWithoutJustificativasInput = {
    id: string
    motorista: string
    rotaDescricao: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutViagensInput
    baseOrigem: BaseCreateNestedOneWithoutViagensOrigemInput
    baseDestino: BaseCreateNestedOneWithoutViagensDestinoInput
    rotaPadrao?: RotaPadraoCreateNestedOneWithoutViagensInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaCreateNestedManyWithoutViagemInput
  }

  export type ViagemUncheckedCreateWithoutJustificativasInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutViagemInput
  }

  export type ViagemCreateOrConnectWithoutJustificativasInput = {
    where: ViagemWhereUniqueInput
    create: XOR<ViagemCreateWithoutJustificativasInput, ViagemUncheckedCreateWithoutJustificativasInput>
  }

  export type UserCreateWithoutJustificativasInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    senhaHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    base?: BaseCreateNestedOneWithoutUsuariosInput
  }

  export type UserUncheckedCreateWithoutJustificativasInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    senhaHash: string
    role?: $Enums.Role
    baseId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutJustificativasInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutJustificativasInput, UserUncheckedCreateWithoutJustificativasInput>
  }

  export type BaseCreateWithoutJustificativasInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemCreateNestedManyWithoutBaseDestinoInput
    paradasPadrao?: ParadaPadraoCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutBaseInput
  }

  export type BaseUncheckedCreateWithoutJustificativasInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemUncheckedCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemUncheckedCreateNestedManyWithoutBaseDestinoInput
    paradasPadrao?: ParadaPadraoUncheckedCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutBaseInput
  }

  export type BaseCreateOrConnectWithoutJustificativasInput = {
    where: BaseWhereUniqueInput
    create: XOR<BaseCreateWithoutJustificativasInput, BaseUncheckedCreateWithoutJustificativasInput>
  }

  export type ViagemUpsertWithoutJustificativasInput = {
    update: XOR<ViagemUpdateWithoutJustificativasInput, ViagemUncheckedUpdateWithoutJustificativasInput>
    create: XOR<ViagemCreateWithoutJustificativasInput, ViagemUncheckedCreateWithoutJustificativasInput>
    where?: ViagemWhereInput
  }

  export type ViagemUpdateToOneWithWhereWithoutJustificativasInput = {
    where?: ViagemWhereInput
    data: XOR<ViagemUpdateWithoutJustificativasInput, ViagemUncheckedUpdateWithoutJustificativasInput>
  }

  export type ViagemUpdateWithoutJustificativasInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutViagensNestedInput
    baseOrigem?: BaseUpdateOneRequiredWithoutViagensOrigemNestedInput
    baseDestino?: BaseUpdateOneRequiredWithoutViagensDestinoNestedInput
    rotaPadrao?: RotaPadraoUpdateOneWithoutViagensNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateWithoutJustificativasInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutViagemNestedInput
  }

  export type UserUpsertWithoutJustificativasInput = {
    update: XOR<UserUpdateWithoutJustificativasInput, UserUncheckedUpdateWithoutJustificativasInput>
    create: XOR<UserCreateWithoutJustificativasInput, UserUncheckedCreateWithoutJustificativasInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutJustificativasInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutJustificativasInput, UserUncheckedUpdateWithoutJustificativasInput>
  }

  export type UserUpdateWithoutJustificativasInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    base?: BaseUpdateOneWithoutUsuariosNestedInput
  }

  export type UserUncheckedUpdateWithoutJustificativasInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BaseUpsertWithoutJustificativasInput = {
    update: XOR<BaseUpdateWithoutJustificativasInput, BaseUncheckedUpdateWithoutJustificativasInput>
    create: XOR<BaseCreateWithoutJustificativasInput, BaseUncheckedCreateWithoutJustificativasInput>
    where?: BaseWhereInput
  }

  export type BaseUpdateToOneWithWhereWithoutJustificativasInput = {
    where?: BaseWhereInput
    data: XOR<BaseUpdateWithoutJustificativasInput, BaseUncheckedUpdateWithoutJustificativasInput>
  }

  export type BaseUpdateWithoutJustificativasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUpdateManyWithoutBaseDestinoNestedInput
    paradasPadrao?: ParadaPadraoUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutBaseNestedInput
  }

  export type BaseUncheckedUpdateWithoutJustificativasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUncheckedUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUncheckedUpdateManyWithoutBaseDestinoNestedInput
    paradasPadrao?: ParadaPadraoUncheckedUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutBaseNestedInput
  }

  export type VeiculoCreateWithoutTelemetriasInput = {
    id: string
    placa: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    viagens?: ViagemCreateNestedManyWithoutVeiculoInput
  }

  export type VeiculoUncheckedCreateWithoutTelemetriasInput = {
    id: string
    placa: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    viagens?: ViagemUncheckedCreateNestedManyWithoutVeiculoInput
  }

  export type VeiculoCreateOrConnectWithoutTelemetriasInput = {
    where: VeiculoWhereUniqueInput
    create: XOR<VeiculoCreateWithoutTelemetriasInput, VeiculoUncheckedCreateWithoutTelemetriasInput>
  }

  export type ViagemCreateWithoutTelemetriasInput = {
    id: string
    motorista: string
    rotaDescricao: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutViagensInput
    baseOrigem: BaseCreateNestedOneWithoutViagensOrigemInput
    baseDestino: BaseCreateNestedOneWithoutViagensDestinoInput
    rotaPadrao?: RotaPadraoCreateNestedOneWithoutViagensInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutViagemInput
  }

  export type ViagemUncheckedCreateWithoutTelemetriasInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutViagemInput
  }

  export type ViagemCreateOrConnectWithoutTelemetriasInput = {
    where: ViagemWhereUniqueInput
    create: XOR<ViagemCreateWithoutTelemetriasInput, ViagemUncheckedCreateWithoutTelemetriasInput>
  }

  export type VeiculoUpsertWithoutTelemetriasInput = {
    update: XOR<VeiculoUpdateWithoutTelemetriasInput, VeiculoUncheckedUpdateWithoutTelemetriasInput>
    create: XOR<VeiculoCreateWithoutTelemetriasInput, VeiculoUncheckedCreateWithoutTelemetriasInput>
    where?: VeiculoWhereInput
  }

  export type VeiculoUpdateToOneWithWhereWithoutTelemetriasInput = {
    where?: VeiculoWhereInput
    data: XOR<VeiculoUpdateWithoutTelemetriasInput, VeiculoUncheckedUpdateWithoutTelemetriasInput>
  }

  export type VeiculoUpdateWithoutTelemetriasInput = {
    id?: StringFieldUpdateOperationsInput | string
    placa?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagens?: ViagemUpdateManyWithoutVeiculoNestedInput
  }

  export type VeiculoUncheckedUpdateWithoutTelemetriasInput = {
    id?: StringFieldUpdateOperationsInput | string
    placa?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagens?: ViagemUncheckedUpdateManyWithoutVeiculoNestedInput
  }

  export type ViagemUpsertWithoutTelemetriasInput = {
    update: XOR<ViagemUpdateWithoutTelemetriasInput, ViagemUncheckedUpdateWithoutTelemetriasInput>
    create: XOR<ViagemCreateWithoutTelemetriasInput, ViagemUncheckedCreateWithoutTelemetriasInput>
    where?: ViagemWhereInput
  }

  export type ViagemUpdateToOneWithWhereWithoutTelemetriasInput = {
    where?: ViagemWhereInput
    data: XOR<ViagemUpdateWithoutTelemetriasInput, ViagemUncheckedUpdateWithoutTelemetriasInput>
  }

  export type ViagemUpdateWithoutTelemetriasInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutViagensNestedInput
    baseOrigem?: BaseUpdateOneRequiredWithoutViagensOrigemNestedInput
    baseDestino?: BaseUpdateOneRequiredWithoutViagensDestinoNestedInput
    rotaPadrao?: RotaPadraoUpdateOneWithoutViagensNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateWithoutTelemetriasInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutViagemNestedInput
  }

  export type ParadaPadraoCreateWithoutRotaInput = {
    id?: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
    base: BaseCreateNestedOneWithoutParadasPadraoInput
  }

  export type ParadaPadraoUncheckedCreateWithoutRotaInput = {
    id?: string
    baseId: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
  }

  export type ParadaPadraoCreateOrConnectWithoutRotaInput = {
    where: ParadaPadraoWhereUniqueInput
    create: XOR<ParadaPadraoCreateWithoutRotaInput, ParadaPadraoUncheckedCreateWithoutRotaInput>
  }

  export type ParadaPadraoCreateManyRotaInputEnvelope = {
    data: ParadaPadraoCreateManyRotaInput | ParadaPadraoCreateManyRotaInput[]
    skipDuplicates?: boolean
  }

  export type ViagemCreateWithoutRotaPadraoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutViagensInput
    baseOrigem: BaseCreateNestedOneWithoutViagensOrigemInput
    baseDestino: BaseCreateNestedOneWithoutViagensDestinoInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaCreateNestedManyWithoutViagemInput
  }

  export type ViagemUncheckedCreateWithoutRotaPadraoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutViagemInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutViagemInput
  }

  export type ViagemCreateOrConnectWithoutRotaPadraoInput = {
    where: ViagemWhereUniqueInput
    create: XOR<ViagemCreateWithoutRotaPadraoInput, ViagemUncheckedCreateWithoutRotaPadraoInput>
  }

  export type ViagemCreateManyRotaPadraoInputEnvelope = {
    data: ViagemCreateManyRotaPadraoInput | ViagemCreateManyRotaPadraoInput[]
    skipDuplicates?: boolean
  }

  export type ParadaPadraoUpsertWithWhereUniqueWithoutRotaInput = {
    where: ParadaPadraoWhereUniqueInput
    update: XOR<ParadaPadraoUpdateWithoutRotaInput, ParadaPadraoUncheckedUpdateWithoutRotaInput>
    create: XOR<ParadaPadraoCreateWithoutRotaInput, ParadaPadraoUncheckedCreateWithoutRotaInput>
  }

  export type ParadaPadraoUpdateWithWhereUniqueWithoutRotaInput = {
    where: ParadaPadraoWhereUniqueInput
    data: XOR<ParadaPadraoUpdateWithoutRotaInput, ParadaPadraoUncheckedUpdateWithoutRotaInput>
  }

  export type ParadaPadraoUpdateManyWithWhereWithoutRotaInput = {
    where: ParadaPadraoScalarWhereInput
    data: XOR<ParadaPadraoUpdateManyMutationInput, ParadaPadraoUncheckedUpdateManyWithoutRotaInput>
  }

  export type ViagemUpsertWithWhereUniqueWithoutRotaPadraoInput = {
    where: ViagemWhereUniqueInput
    update: XOR<ViagemUpdateWithoutRotaPadraoInput, ViagemUncheckedUpdateWithoutRotaPadraoInput>
    create: XOR<ViagemCreateWithoutRotaPadraoInput, ViagemUncheckedCreateWithoutRotaPadraoInput>
  }

  export type ViagemUpdateWithWhereUniqueWithoutRotaPadraoInput = {
    where: ViagemWhereUniqueInput
    data: XOR<ViagemUpdateWithoutRotaPadraoInput, ViagemUncheckedUpdateWithoutRotaPadraoInput>
  }

  export type ViagemUpdateManyWithWhereWithoutRotaPadraoInput = {
    where: ViagemScalarWhereInput
    data: XOR<ViagemUpdateManyMutationInput, ViagemUncheckedUpdateManyWithoutRotaPadraoInput>
  }

  export type RotaPadraoCreateWithoutParadasInput = {
    id?: string
    nome: string
    viagens?: ViagemCreateNestedManyWithoutRotaPadraoInput
  }

  export type RotaPadraoUncheckedCreateWithoutParadasInput = {
    id?: string
    nome: string
    viagens?: ViagemUncheckedCreateNestedManyWithoutRotaPadraoInput
  }

  export type RotaPadraoCreateOrConnectWithoutParadasInput = {
    where: RotaPadraoWhereUniqueInput
    create: XOR<RotaPadraoCreateWithoutParadasInput, RotaPadraoUncheckedCreateWithoutParadasInput>
  }

  export type BaseCreateWithoutParadasPadraoInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemCreateNestedManyWithoutBaseInput
  }

  export type BaseUncheckedCreateWithoutParadasPadraoInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemUncheckedCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemUncheckedCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutBaseInput
    paradasViagem?: ParadaViagemUncheckedCreateNestedManyWithoutBaseInput
  }

  export type BaseCreateOrConnectWithoutParadasPadraoInput = {
    where: BaseWhereUniqueInput
    create: XOR<BaseCreateWithoutParadasPadraoInput, BaseUncheckedCreateWithoutParadasPadraoInput>
  }

  export type RotaPadraoUpsertWithoutParadasInput = {
    update: XOR<RotaPadraoUpdateWithoutParadasInput, RotaPadraoUncheckedUpdateWithoutParadasInput>
    create: XOR<RotaPadraoCreateWithoutParadasInput, RotaPadraoUncheckedCreateWithoutParadasInput>
    where?: RotaPadraoWhereInput
  }

  export type RotaPadraoUpdateToOneWithWhereWithoutParadasInput = {
    where?: RotaPadraoWhereInput
    data: XOR<RotaPadraoUpdateWithoutParadasInput, RotaPadraoUncheckedUpdateWithoutParadasInput>
  }

  export type RotaPadraoUpdateWithoutParadasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    viagens?: ViagemUpdateManyWithoutRotaPadraoNestedInput
  }

  export type RotaPadraoUncheckedUpdateWithoutParadasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    viagens?: ViagemUncheckedUpdateManyWithoutRotaPadraoNestedInput
  }

  export type BaseUpsertWithoutParadasPadraoInput = {
    update: XOR<BaseUpdateWithoutParadasPadraoInput, BaseUncheckedUpdateWithoutParadasPadraoInput>
    create: XOR<BaseCreateWithoutParadasPadraoInput, BaseUncheckedCreateWithoutParadasPadraoInput>
    where?: BaseWhereInput
  }

  export type BaseUpdateToOneWithWhereWithoutParadasPadraoInput = {
    where?: BaseWhereInput
    data: XOR<BaseUpdateWithoutParadasPadraoInput, BaseUncheckedUpdateWithoutParadasPadraoInput>
  }

  export type BaseUpdateWithoutParadasPadraoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutBaseNestedInput
  }

  export type BaseUncheckedUpdateWithoutParadasPadraoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUncheckedUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUncheckedUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutBaseNestedInput
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutBaseNestedInput
  }

  export type ViagemCreateWithoutParadasViagemInput = {
    id: string
    motorista: string
    rotaDescricao: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    veiculo: VeiculoCreateNestedOneWithoutViagensInput
    baseOrigem: BaseCreateNestedOneWithoutViagensOrigemInput
    baseDestino: BaseCreateNestedOneWithoutViagensDestinoInput
    rotaPadrao?: RotaPadraoCreateNestedOneWithoutViagensInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaCreateNestedManyWithoutViagemInput
  }

  export type ViagemUncheckedCreateWithoutParadasViagemInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutViagemInput
    telemetrias?: TelemetriaUncheckedCreateNestedManyWithoutViagemInput
  }

  export type ViagemCreateOrConnectWithoutParadasViagemInput = {
    where: ViagemWhereUniqueInput
    create: XOR<ViagemCreateWithoutParadasViagemInput, ViagemUncheckedCreateWithoutParadasViagemInput>
  }

  export type BaseCreateWithoutParadasViagemInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoCreateNestedManyWithoutBaseInput
  }

  export type BaseUncheckedCreateWithoutParadasViagemInput = {
    id?: string
    nome: string
    cidade: string
    latitude?: number | null
    longitude?: number | null
    raioMetros?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UserUncheckedCreateNestedManyWithoutBaseInput
    viagensOrigem?: ViagemUncheckedCreateNestedManyWithoutBaseOrigemInput
    viagensDestino?: ViagemUncheckedCreateNestedManyWithoutBaseDestinoInput
    justificativas?: JustificativaAtrasoUncheckedCreateNestedManyWithoutBaseInput
    paradasPadrao?: ParadaPadraoUncheckedCreateNestedManyWithoutBaseInput
  }

  export type BaseCreateOrConnectWithoutParadasViagemInput = {
    where: BaseWhereUniqueInput
    create: XOR<BaseCreateWithoutParadasViagemInput, BaseUncheckedCreateWithoutParadasViagemInput>
  }

  export type ViagemUpsertWithoutParadasViagemInput = {
    update: XOR<ViagemUpdateWithoutParadasViagemInput, ViagemUncheckedUpdateWithoutParadasViagemInput>
    create: XOR<ViagemCreateWithoutParadasViagemInput, ViagemUncheckedCreateWithoutParadasViagemInput>
    where?: ViagemWhereInput
  }

  export type ViagemUpdateToOneWithWhereWithoutParadasViagemInput = {
    where?: ViagemWhereInput
    data: XOR<ViagemUpdateWithoutParadasViagemInput, ViagemUncheckedUpdateWithoutParadasViagemInput>
  }

  export type ViagemUpdateWithoutParadasViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutViagensNestedInput
    baseOrigem?: BaseUpdateOneRequiredWithoutViagensOrigemNestedInput
    baseDestino?: BaseUpdateOneRequiredWithoutViagensDestinoNestedInput
    rotaPadrao?: RotaPadraoUpdateOneWithoutViagensNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateWithoutParadasViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutViagemNestedInput
  }

  export type BaseUpsertWithoutParadasViagemInput = {
    update: XOR<BaseUpdateWithoutParadasViagemInput, BaseUncheckedUpdateWithoutParadasViagemInput>
    create: XOR<BaseCreateWithoutParadasViagemInput, BaseUncheckedCreateWithoutParadasViagemInput>
    where?: BaseWhereInput
  }

  export type BaseUpdateToOneWithWhereWithoutParadasViagemInput = {
    where?: BaseWhereInput
    data: XOR<BaseUpdateWithoutParadasViagemInput, BaseUncheckedUpdateWithoutParadasViagemInput>
  }

  export type BaseUpdateWithoutParadasViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUpdateManyWithoutBaseNestedInput
  }

  export type BaseUncheckedUpdateWithoutParadasViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    raioMetros?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UserUncheckedUpdateManyWithoutBaseNestedInput
    viagensOrigem?: ViagemUncheckedUpdateManyWithoutBaseOrigemNestedInput
    viagensDestino?: ViagemUncheckedUpdateManyWithoutBaseDestinoNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutBaseNestedInput
    paradasPadrao?: ParadaPadraoUncheckedUpdateManyWithoutBaseNestedInput
  }

  export type UserCreateManyBaseInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    senhaHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ViagemCreateManyBaseOrigemInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ViagemCreateManyBaseDestinoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JustificativaAtrasoCreateManyBaseInput = {
    id?: string
    viagemId: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    usuarioId: string
    tempoAtrasoMinutos: number
    createdAt?: Date | string
  }

  export type ParadaPadraoCreateManyBaseInput = {
    id?: string
    rotaId: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
  }

  export type ParadaViagemCreateManyBaseInput = {
    id?: string
    viagemId: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
  }

  export type UserUpdateWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    justificativas?: JustificativaAtrasoUpdateManyWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UserUncheckedUpdateManyWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViagemUpdateWithoutBaseOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutViagensNestedInput
    baseDestino?: BaseUpdateOneRequiredWithoutViagensDestinoNestedInput
    rotaPadrao?: RotaPadraoUpdateOneWithoutViagensNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateWithoutBaseOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateManyWithoutBaseOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViagemUpdateWithoutBaseDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutViagensNestedInput
    baseOrigem?: BaseUpdateOneRequiredWithoutViagensOrigemNestedInput
    rotaPadrao?: RotaPadraoUpdateOneWithoutViagensNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateWithoutBaseDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateManyWithoutBaseDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JustificativaAtrasoUpdateWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagem?: ViagemUpdateOneRequiredWithoutJustificativasNestedInput
    usuario?: UserUpdateOneRequiredWithoutJustificativasNestedInput
  }

  export type JustificativaAtrasoUncheckedUpdateWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JustificativaAtrasoUncheckedUpdateManyWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParadaPadraoUpdateWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
    rota?: RotaPadraoUpdateOneRequiredWithoutParadasNestedInput
  }

  export type ParadaPadraoUncheckedUpdateWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    rotaId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ParadaPadraoUncheckedUpdateManyWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    rotaId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ParadaViagemUpdateWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    viagem?: ViagemUpdateOneRequiredWithoutParadasViagemNestedInput
  }

  export type ParadaViagemUncheckedUpdateWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ParadaViagemUncheckedUpdateManyWithoutBaseInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JustificativaAtrasoCreateManyUsuarioInput = {
    id?: string
    viagemId: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    baseId?: string | null
    tempoAtrasoMinutos: number
    createdAt?: Date | string
  }

  export type JustificativaAtrasoUpdateWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagem?: ViagemUpdateOneRequiredWithoutJustificativasNestedInput
    base?: BaseUpdateOneWithoutJustificativasNestedInput
  }

  export type JustificativaAtrasoUncheckedUpdateWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JustificativaAtrasoUncheckedUpdateManyWithoutUsuarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ViagemCreateManyVeiculoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    rotaPadraoId?: string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TelemetriaCreateManyVeiculoInput = {
    id?: string
    viagemId?: string | null
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
  }

  export type ViagemUpdateWithoutVeiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    baseOrigem?: BaseUpdateOneRequiredWithoutViagensOrigemNestedInput
    baseDestino?: BaseUpdateOneRequiredWithoutViagensDestinoNestedInput
    rotaPadrao?: RotaPadraoUpdateOneWithoutViagensNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateWithoutVeiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateManyWithoutVeiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rotaPadraoId?: NullableStringFieldUpdateOperationsInput | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetriaUpdateWithoutVeiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    viagem?: ViagemUpdateOneWithoutTelemetriasNestedInput
  }

  export type TelemetriaUncheckedUpdateWithoutVeiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetriaUncheckedUpdateManyWithoutVeiculoInput = {
    id?: StringFieldUpdateOperationsInput | string
    viagemId?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParadaViagemCreateManyViagemInput = {
    id?: string
    baseId: string
    ordem: number
    prevChegada?: Date | string | null
    prevSaida?: Date | string | null
    dataChegadaEfetiva?: Date | string | null
    dataSaidaEfetiva?: Date | string | null
  }

  export type JustificativaAtrasoCreateManyViagemInput = {
    id?: string
    tipoAtraso: $Enums.TipoAtraso
    motivo: string
    usuarioId: string
    baseId?: string | null
    tempoAtrasoMinutos: number
    createdAt?: Date | string
  }

  export type TelemetriaCreateManyViagemInput = {
    id?: string
    veiculoId: string
    latitude: number
    longitude: number
    ignicao: boolean
    velocidade?: number | null
    dataHoraUtc: Date | string
    dataHoraLocal: Date | string
    createdAt?: Date | string
  }

  export type ParadaViagemUpdateWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    base?: BaseUpdateOneRequiredWithoutParadasViagemNestedInput
  }

  export type ParadaViagemUncheckedUpdateWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ParadaViagemUncheckedUpdateManyWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prevSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataChegadaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSaidaEfetiva?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JustificativaAtrasoUpdateWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UserUpdateOneRequiredWithoutJustificativasNestedInput
    base?: BaseUpdateOneWithoutJustificativasNestedInput
  }

  export type JustificativaAtrasoUncheckedUpdateWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JustificativaAtrasoUncheckedUpdateManyWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipoAtraso?: EnumTipoAtrasoFieldUpdateOperationsInput | $Enums.TipoAtraso
    motivo?: StringFieldUpdateOperationsInput | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    baseId?: NullableStringFieldUpdateOperationsInput | string | null
    tempoAtrasoMinutos?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetriaUpdateWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutTelemetriasNestedInput
  }

  export type TelemetriaUncheckedUpdateWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TelemetriaUncheckedUpdateManyWithoutViagemInput = {
    id?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    ignicao?: BoolFieldUpdateOperationsInput | boolean
    velocidade?: NullableIntFieldUpdateOperationsInput | number | null
    dataHoraUtc?: DateTimeFieldUpdateOperationsInput | Date | string
    dataHoraLocal?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParadaPadraoCreateManyRotaInput = {
    id?: string
    baseId: string
    ordem: number
    prevChegada?: string | null
    prevSaida?: string | null
  }

  export type ViagemCreateManyRotaPadraoInput = {
    id: string
    motorista: string
    rotaDescricao: string
    veiculoId: string
    baseOrigemId: string
    baseDestinoId: string
    status?: $Enums.StatusViagem
    prevInicioReal: Date | string
    prevFimReal: Date | string
    dataInicioEfetivo?: Date | string | null
    dataFimEfetivo?: Date | string | null
    novaPrevisaoSaida?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ParadaPadraoUpdateWithoutRotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
    base?: BaseUpdateOneRequiredWithoutParadasPadraoNestedInput
  }

  export type ParadaPadraoUncheckedUpdateWithoutRotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ParadaPadraoUncheckedUpdateManyWithoutRotaInput = {
    id?: StringFieldUpdateOperationsInput | string
    baseId?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    prevChegada?: NullableStringFieldUpdateOperationsInput | string | null
    prevSaida?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ViagemUpdateWithoutRotaPadraoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    veiculo?: VeiculoUpdateOneRequiredWithoutViagensNestedInput
    baseOrigem?: BaseUpdateOneRequiredWithoutViagensOrigemNestedInput
    baseDestino?: BaseUpdateOneRequiredWithoutViagensDestinoNestedInput
    paradasViagem?: ParadaViagemUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateWithoutRotaPadraoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paradasViagem?: ParadaViagemUncheckedUpdateManyWithoutViagemNestedInput
    justificativas?: JustificativaAtrasoUncheckedUpdateManyWithoutViagemNestedInput
    telemetrias?: TelemetriaUncheckedUpdateManyWithoutViagemNestedInput
  }

  export type ViagemUncheckedUpdateManyWithoutRotaPadraoInput = {
    id?: StringFieldUpdateOperationsInput | string
    motorista?: StringFieldUpdateOperationsInput | string
    rotaDescricao?: StringFieldUpdateOperationsInput | string
    veiculoId?: StringFieldUpdateOperationsInput | string
    baseOrigemId?: StringFieldUpdateOperationsInput | string
    baseDestinoId?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusViagemFieldUpdateOperationsInput | $Enums.StatusViagem
    prevInicioReal?: DateTimeFieldUpdateOperationsInput | Date | string
    prevFimReal?: DateTimeFieldUpdateOperationsInput | Date | string
    dataInicioEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFimEfetivo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    novaPrevisaoSaida?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}