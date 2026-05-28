
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Subject
 * 
 */
export type Subject = $Result.DefaultSelection<Prisma.$SubjectPayload>
/**
 * Model Module
 * 
 */
export type Module = $Result.DefaultSelection<Prisma.$ModulePayload>
/**
 * Model Topic
 * 
 */
export type Topic = $Result.DefaultSelection<Prisma.$TopicPayload>
/**
 * Model FileMaterial
 * 
 */
export type FileMaterial = $Result.DefaultSelection<Prisma.$FileMaterialPayload>
/**
 * Model QuizQuestion
 * 
 */
export type QuizQuestion = $Result.DefaultSelection<Prisma.$QuizQuestionPayload>
/**
 * Model TopicProgress
 * 
 */
export type TopicProgress = $Result.DefaultSelection<Prisma.$TopicProgressPayload>
/**
 * Model ModuleProgress
 * 
 */
export type ModuleProgress = $Result.DefaultSelection<Prisma.$ModuleProgressPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
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
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

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
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subject`: Exposes CRUD operations for the **Subject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subjects
    * const subjects = await prisma.subject.findMany()
    * ```
    */
  get subject(): Prisma.SubjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.module`: Exposes CRUD operations for the **Module** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Modules
    * const modules = await prisma.module.findMany()
    * ```
    */
  get module(): Prisma.ModuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.topic`: Exposes CRUD operations for the **Topic** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Topics
    * const topics = await prisma.topic.findMany()
    * ```
    */
  get topic(): Prisma.TopicDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fileMaterial`: Exposes CRUD operations for the **FileMaterial** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileMaterials
    * const fileMaterials = await prisma.fileMaterial.findMany()
    * ```
    */
  get fileMaterial(): Prisma.FileMaterialDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quizQuestion`: Exposes CRUD operations for the **QuizQuestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuizQuestions
    * const quizQuestions = await prisma.quizQuestion.findMany()
    * ```
    */
  get quizQuestion(): Prisma.QuizQuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.topicProgress`: Exposes CRUD operations for the **TopicProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TopicProgresses
    * const topicProgresses = await prisma.topicProgress.findMany()
    * ```
    */
  get topicProgress(): Prisma.TopicProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.moduleProgress`: Exposes CRUD operations for the **ModuleProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ModuleProgresses
    * const moduleProgresses = await prisma.moduleProgress.findMany()
    * ```
    */
  get moduleProgress(): Prisma.ModuleProgressDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
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
    User: 'User',
    Account: 'Account',
    Subject: 'Subject',
    Module: 'Module',
    Topic: 'Topic',
    FileMaterial: 'FileMaterial',
    QuizQuestion: 'QuizQuestion',
    TopicProgress: 'TopicProgress',
    ModuleProgress: 'ModuleProgress'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "account" | "subject" | "module" | "topic" | "fileMaterial" | "quizQuestion" | "topicProgress" | "moduleProgress"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
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
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Subject: {
        payload: Prisma.$SubjectPayload<ExtArgs>
        fields: Prisma.SubjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          findFirst: {
            args: Prisma.SubjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          findMany: {
            args: Prisma.SubjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>[]
          }
          create: {
            args: Prisma.SubjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          createMany: {
            args: Prisma.SubjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>[]
          }
          delete: {
            args: Prisma.SubjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          update: {
            args: Prisma.SubjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          deleteMany: {
            args: Prisma.SubjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>[]
          }
          upsert: {
            args: Prisma.SubjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubjectPayload>
          }
          aggregate: {
            args: Prisma.SubjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubject>
          }
          groupBy: {
            args: Prisma.SubjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubjectCountArgs<ExtArgs>
            result: $Utils.Optional<SubjectCountAggregateOutputType> | number
          }
        }
      }
      Module: {
        payload: Prisma.$ModulePayload<ExtArgs>
        fields: Prisma.ModuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ModuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ModuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          findFirst: {
            args: Prisma.ModuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ModuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          findMany: {
            args: Prisma.ModuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>[]
          }
          create: {
            args: Prisma.ModuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          createMany: {
            args: Prisma.ModuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ModuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>[]
          }
          delete: {
            args: Prisma.ModuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          update: {
            args: Prisma.ModuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          deleteMany: {
            args: Prisma.ModuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ModuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ModuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>[]
          }
          upsert: {
            args: Prisma.ModuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          aggregate: {
            args: Prisma.ModuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModule>
          }
          groupBy: {
            args: Prisma.ModuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ModuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ModuleCountArgs<ExtArgs>
            result: $Utils.Optional<ModuleCountAggregateOutputType> | number
          }
        }
      }
      Topic: {
        payload: Prisma.$TopicPayload<ExtArgs>
        fields: Prisma.TopicFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          findFirst: {
            args: Prisma.TopicFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          findMany: {
            args: Prisma.TopicFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>[]
          }
          create: {
            args: Prisma.TopicCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          createMany: {
            args: Prisma.TopicCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TopicCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>[]
          }
          delete: {
            args: Prisma.TopicDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          update: {
            args: Prisma.TopicUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          deleteMany: {
            args: Prisma.TopicDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TopicUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>[]
          }
          upsert: {
            args: Prisma.TopicUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          aggregate: {
            args: Prisma.TopicAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopic>
          }
          groupBy: {
            args: Prisma.TopicGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicCountArgs<ExtArgs>
            result: $Utils.Optional<TopicCountAggregateOutputType> | number
          }
        }
      }
      FileMaterial: {
        payload: Prisma.$FileMaterialPayload<ExtArgs>
        fields: Prisma.FileMaterialFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileMaterialFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileMaterialFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>
          }
          findFirst: {
            args: Prisma.FileMaterialFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileMaterialFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>
          }
          findMany: {
            args: Prisma.FileMaterialFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>[]
          }
          create: {
            args: Prisma.FileMaterialCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>
          }
          createMany: {
            args: Prisma.FileMaterialCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileMaterialCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>[]
          }
          delete: {
            args: Prisma.FileMaterialDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>
          }
          update: {
            args: Prisma.FileMaterialUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>
          }
          deleteMany: {
            args: Prisma.FileMaterialDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileMaterialUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FileMaterialUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>[]
          }
          upsert: {
            args: Prisma.FileMaterialUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMaterialPayload>
          }
          aggregate: {
            args: Prisma.FileMaterialAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileMaterial>
          }
          groupBy: {
            args: Prisma.FileMaterialGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileMaterialGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileMaterialCountArgs<ExtArgs>
            result: $Utils.Optional<FileMaterialCountAggregateOutputType> | number
          }
        }
      }
      QuizQuestion: {
        payload: Prisma.$QuizQuestionPayload<ExtArgs>
        fields: Prisma.QuizQuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizQuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizQuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          findFirst: {
            args: Prisma.QuizQuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizQuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          findMany: {
            args: Prisma.QuizQuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>[]
          }
          create: {
            args: Prisma.QuizQuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          createMany: {
            args: Prisma.QuizQuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizQuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>[]
          }
          delete: {
            args: Prisma.QuizQuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          update: {
            args: Prisma.QuizQuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          deleteMany: {
            args: Prisma.QuizQuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizQuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizQuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>[]
          }
          upsert: {
            args: Prisma.QuizQuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizQuestionPayload>
          }
          aggregate: {
            args: Prisma.QuizQuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuizQuestion>
          }
          groupBy: {
            args: Prisma.QuizQuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizQuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizQuestionCountArgs<ExtArgs>
            result: $Utils.Optional<QuizQuestionCountAggregateOutputType> | number
          }
        }
      }
      TopicProgress: {
        payload: Prisma.$TopicProgressPayload<ExtArgs>
        fields: Prisma.TopicProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>
          }
          findFirst: {
            args: Prisma.TopicProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>
          }
          findMany: {
            args: Prisma.TopicProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>[]
          }
          create: {
            args: Prisma.TopicProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>
          }
          createMany: {
            args: Prisma.TopicProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TopicProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>[]
          }
          delete: {
            args: Prisma.TopicProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>
          }
          update: {
            args: Prisma.TopicProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>
          }
          deleteMany: {
            args: Prisma.TopicProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TopicProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>[]
          }
          upsert: {
            args: Prisma.TopicProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicProgressPayload>
          }
          aggregate: {
            args: Prisma.TopicProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopicProgress>
          }
          groupBy: {
            args: Prisma.TopicProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicProgressCountArgs<ExtArgs>
            result: $Utils.Optional<TopicProgressCountAggregateOutputType> | number
          }
        }
      }
      ModuleProgress: {
        payload: Prisma.$ModuleProgressPayload<ExtArgs>
        fields: Prisma.ModuleProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ModuleProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ModuleProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>
          }
          findFirst: {
            args: Prisma.ModuleProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ModuleProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>
          }
          findMany: {
            args: Prisma.ModuleProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>[]
          }
          create: {
            args: Prisma.ModuleProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>
          }
          createMany: {
            args: Prisma.ModuleProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ModuleProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>[]
          }
          delete: {
            args: Prisma.ModuleProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>
          }
          update: {
            args: Prisma.ModuleProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>
          }
          deleteMany: {
            args: Prisma.ModuleProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ModuleProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ModuleProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>[]
          }
          upsert: {
            args: Prisma.ModuleProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModuleProgressPayload>
          }
          aggregate: {
            args: Prisma.ModuleProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModuleProgress>
          }
          groupBy: {
            args: Prisma.ModuleProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<ModuleProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.ModuleProgressCountArgs<ExtArgs>
            result: $Utils.Optional<ModuleProgressCountAggregateOutputType> | number
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    account?: AccountOmit
    subject?: SubjectOmit
    module?: ModuleOmit
    topic?: TopicOmit
    fileMaterial?: FileMaterialOmit
    quizQuestion?: QuizQuestionOmit
    topicProgress?: TopicProgressOmit
    moduleProgress?: ModuleProgressOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    topicProgress: number
    moduleProgress: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    topicProgress?: boolean | UserCountOutputTypeCountTopicProgressArgs
    moduleProgress?: boolean | UserCountOutputTypeCountModuleProgressArgs
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
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTopicProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountModuleProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleProgressWhereInput
  }


  /**
   * Count Type SubjectCountOutputType
   */

  export type SubjectCountOutputType = {
    modules: number
  }

  export type SubjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    modules?: boolean | SubjectCountOutputTypeCountModulesArgs
  }

  // Custom InputTypes
  /**
   * SubjectCountOutputType without action
   */
  export type SubjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubjectCountOutputType
     */
    select?: SubjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubjectCountOutputType without action
   */
  export type SubjectCountOutputTypeCountModulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleWhereInput
  }


  /**
   * Count Type ModuleCountOutputType
   */

  export type ModuleCountOutputType = {
    topics: number
    studentProgress: number
  }

  export type ModuleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topics?: boolean | ModuleCountOutputTypeCountTopicsArgs
    studentProgress?: boolean | ModuleCountOutputTypeCountStudentProgressArgs
  }

  // Custom InputTypes
  /**
   * ModuleCountOutputType without action
   */
  export type ModuleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleCountOutputType
     */
    select?: ModuleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ModuleCountOutputType without action
   */
  export type ModuleCountOutputTypeCountTopicsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicWhereInput
  }

  /**
   * ModuleCountOutputType without action
   */
  export type ModuleCountOutputTypeCountStudentProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleProgressWhereInput
  }


  /**
   * Count Type TopicCountOutputType
   */

  export type TopicCountOutputType = {
    quizQuestions: number
    fileMaterials: number
    studentProgress: number
  }

  export type TopicCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizQuestions?: boolean | TopicCountOutputTypeCountQuizQuestionsArgs
    fileMaterials?: boolean | TopicCountOutputTypeCountFileMaterialsArgs
    studentProgress?: boolean | TopicCountOutputTypeCountStudentProgressArgs
  }

  // Custom InputTypes
  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCountOutputType
     */
    select?: TopicCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeCountQuizQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizQuestionWhereInput
  }

  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeCountFileMaterialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileMaterialWhereInput
  }

  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeCountStudentProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicProgressWhereInput
  }


  /**
   * Models
   */

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
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    role: number
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
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
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
    email: string | null
    emailVerified: Date | null
    image: string | null
    role: $Enums.Role
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
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    topicProgress?: boolean | User$topicProgressArgs<ExtArgs>
    moduleProgress?: boolean | User$moduleProgressArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    topicProgress?: boolean | User$topicProgressArgs<ExtArgs>
    moduleProgress?: boolean | User$moduleProgressArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      topicProgress: Prisma.$TopicProgressPayload<ExtArgs>[]
      moduleProgress: Prisma.$ModuleProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      emailVerified: Date | null
      image: string | null
      role: $Enums.Role
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
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    topicProgress<T extends User$topicProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$topicProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    moduleProgress<T extends User$moduleProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$moduleProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly role: FieldRef<"User", 'Role'>
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
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
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
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.topicProgress
   */
  export type User$topicProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    where?: TopicProgressWhereInput
    orderBy?: TopicProgressOrderByWithRelationInput | TopicProgressOrderByWithRelationInput[]
    cursor?: TopicProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicProgressScalarFieldEnum | TopicProgressScalarFieldEnum[]
  }

  /**
   * User.moduleProgress
   */
  export type User$moduleProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    where?: ModuleProgressWhereInput
    orderBy?: ModuleProgressOrderByWithRelationInput | ModuleProgressOrderByWithRelationInput[]
    cursor?: ModuleProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ModuleProgressScalarFieldEnum | ModuleProgressScalarFieldEnum[]
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
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
    refresh_token_expires_in: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
    refresh_token_expires_in: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    refresh_token_expires_in: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    refresh_token_expires_in: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    refresh_token_expires_in: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
    refresh_token_expires_in?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
    refresh_token_expires_in?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    refresh_token_expires_in?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    refresh_token_expires_in?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    refresh_token_expires_in?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    refresh_token_expires_in: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    refresh_token_expires_in?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    refresh_token_expires_in?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    refresh_token_expires_in?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    refresh_token_expires_in?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "refresh_token_expires_in" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      refresh_token_expires_in: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
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
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
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
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly refresh_token_expires_in: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Subject
   */

  export type AggregateSubject = {
    _count: SubjectCountAggregateOutputType | null
    _avg: SubjectAvgAggregateOutputType | null
    _sum: SubjectSumAggregateOutputType | null
    _min: SubjectMinAggregateOutputType | null
    _max: SubjectMaxAggregateOutputType | null
  }

  export type SubjectAvgAggregateOutputType = {
    credits: number | null
    semester: number | null
    totalModules: number | null
    totalTopics: number | null
  }

  export type SubjectSumAggregateOutputType = {
    credits: number | null
    semester: number | null
    totalModules: number | null
    totalTopics: number | null
  }

  export type SubjectMinAggregateOutputType = {
    id: string | null
    code: string | null
    title: string | null
    description: string | null
    instructor: string | null
    credits: number | null
    semester: number | null
    coverColor: string | null
    totalModules: number | null
    totalTopics: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubjectMaxAggregateOutputType = {
    id: string | null
    code: string | null
    title: string | null
    description: string | null
    instructor: string | null
    credits: number | null
    semester: number | null
    coverColor: string | null
    totalModules: number | null
    totalTopics: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubjectCountAggregateOutputType = {
    id: number
    code: number
    title: number
    description: number
    instructor: number
    credits: number
    semester: number
    coverColor: number
    totalModules: number
    totalTopics: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubjectAvgAggregateInputType = {
    credits?: true
    semester?: true
    totalModules?: true
    totalTopics?: true
  }

  export type SubjectSumAggregateInputType = {
    credits?: true
    semester?: true
    totalModules?: true
    totalTopics?: true
  }

  export type SubjectMinAggregateInputType = {
    id?: true
    code?: true
    title?: true
    description?: true
    instructor?: true
    credits?: true
    semester?: true
    coverColor?: true
    totalModules?: true
    totalTopics?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubjectMaxAggregateInputType = {
    id?: true
    code?: true
    title?: true
    description?: true
    instructor?: true
    credits?: true
    semester?: true
    coverColor?: true
    totalModules?: true
    totalTopics?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubjectCountAggregateInputType = {
    id?: true
    code?: true
    title?: true
    description?: true
    instructor?: true
    credits?: true
    semester?: true
    coverColor?: true
    totalModules?: true
    totalTopics?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subject to aggregate.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subjects
    **/
    _count?: true | SubjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubjectMaxAggregateInputType
  }

  export type GetSubjectAggregateType<T extends SubjectAggregateArgs> = {
        [P in keyof T & keyof AggregateSubject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubject[P]>
      : GetScalarType<T[P], AggregateSubject[P]>
  }




  export type SubjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubjectWhereInput
    orderBy?: SubjectOrderByWithAggregationInput | SubjectOrderByWithAggregationInput[]
    by: SubjectScalarFieldEnum[] | SubjectScalarFieldEnum
    having?: SubjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubjectCountAggregateInputType | true
    _avg?: SubjectAvgAggregateInputType
    _sum?: SubjectSumAggregateInputType
    _min?: SubjectMinAggregateInputType
    _max?: SubjectMaxAggregateInputType
  }

  export type SubjectGroupByOutputType = {
    id: string
    code: string
    title: string
    description: string
    instructor: string
    credits: number
    semester: number
    coverColor: string
    totalModules: number
    totalTopics: number
    createdAt: Date
    updatedAt: Date
    _count: SubjectCountAggregateOutputType | null
    _avg: SubjectAvgAggregateOutputType | null
    _sum: SubjectSumAggregateOutputType | null
    _min: SubjectMinAggregateOutputType | null
    _max: SubjectMaxAggregateOutputType | null
  }

  type GetSubjectGroupByPayload<T extends SubjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubjectGroupByOutputType[P]>
            : GetScalarType<T[P], SubjectGroupByOutputType[P]>
        }
      >
    >


  export type SubjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    title?: boolean
    description?: boolean
    instructor?: boolean
    credits?: boolean
    semester?: boolean
    coverColor?: boolean
    totalModules?: boolean
    totalTopics?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    modules?: boolean | Subject$modulesArgs<ExtArgs>
    _count?: boolean | SubjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subject"]>

  export type SubjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    title?: boolean
    description?: boolean
    instructor?: boolean
    credits?: boolean
    semester?: boolean
    coverColor?: boolean
    totalModules?: boolean
    totalTopics?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subject"]>

  export type SubjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    title?: boolean
    description?: boolean
    instructor?: boolean
    credits?: boolean
    semester?: boolean
    coverColor?: boolean
    totalModules?: boolean
    totalTopics?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subject"]>

  export type SubjectSelectScalar = {
    id?: boolean
    code?: boolean
    title?: boolean
    description?: boolean
    instructor?: boolean
    credits?: boolean
    semester?: boolean
    coverColor?: boolean
    totalModules?: boolean
    totalTopics?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "title" | "description" | "instructor" | "credits" | "semester" | "coverColor" | "totalModules" | "totalTopics" | "createdAt" | "updatedAt", ExtArgs["result"]["subject"]>
  export type SubjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    modules?: boolean | Subject$modulesArgs<ExtArgs>
    _count?: boolean | SubjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SubjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SubjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subject"
    objects: {
      modules: Prisma.$ModulePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      title: string
      description: string
      instructor: string
      credits: number
      semester: number
      coverColor: string
      totalModules: number
      totalTopics: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subject"]>
    composites: {}
  }

  type SubjectGetPayload<S extends boolean | null | undefined | SubjectDefaultArgs> = $Result.GetResult<Prisma.$SubjectPayload, S>

  type SubjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubjectCountAggregateInputType | true
    }

  export interface SubjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subject'], meta: { name: 'Subject' } }
    /**
     * Find zero or one Subject that matches the filter.
     * @param {SubjectFindUniqueArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubjectFindUniqueArgs>(args: SelectSubset<T, SubjectFindUniqueArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubjectFindUniqueOrThrowArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubjectFindUniqueOrThrowArgs>(args: SelectSubset<T, SubjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindFirstArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubjectFindFirstArgs>(args?: SelectSubset<T, SubjectFindFirstArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindFirstOrThrowArgs} args - Arguments to find a Subject
     * @example
     * // Get one Subject
     * const subject = await prisma.subject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubjectFindFirstOrThrowArgs>(args?: SelectSubset<T, SubjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subjects
     * const subjects = await prisma.subject.findMany()
     * 
     * // Get first 10 Subjects
     * const subjects = await prisma.subject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subjectWithIdOnly = await prisma.subject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubjectFindManyArgs>(args?: SelectSubset<T, SubjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subject.
     * @param {SubjectCreateArgs} args - Arguments to create a Subject.
     * @example
     * // Create one Subject
     * const Subject = await prisma.subject.create({
     *   data: {
     *     // ... data to create a Subject
     *   }
     * })
     * 
     */
    create<T extends SubjectCreateArgs>(args: SelectSubset<T, SubjectCreateArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subjects.
     * @param {SubjectCreateManyArgs} args - Arguments to create many Subjects.
     * @example
     * // Create many Subjects
     * const subject = await prisma.subject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubjectCreateManyArgs>(args?: SelectSubset<T, SubjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subjects and returns the data saved in the database.
     * @param {SubjectCreateManyAndReturnArgs} args - Arguments to create many Subjects.
     * @example
     * // Create many Subjects
     * const subject = await prisma.subject.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subjects and only return the `id`
     * const subjectWithIdOnly = await prisma.subject.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubjectCreateManyAndReturnArgs>(args?: SelectSubset<T, SubjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subject.
     * @param {SubjectDeleteArgs} args - Arguments to delete one Subject.
     * @example
     * // Delete one Subject
     * const Subject = await prisma.subject.delete({
     *   where: {
     *     // ... filter to delete one Subject
     *   }
     * })
     * 
     */
    delete<T extends SubjectDeleteArgs>(args: SelectSubset<T, SubjectDeleteArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subject.
     * @param {SubjectUpdateArgs} args - Arguments to update one Subject.
     * @example
     * // Update one Subject
     * const subject = await prisma.subject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubjectUpdateArgs>(args: SelectSubset<T, SubjectUpdateArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subjects.
     * @param {SubjectDeleteManyArgs} args - Arguments to filter Subjects to delete.
     * @example
     * // Delete a few Subjects
     * const { count } = await prisma.subject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubjectDeleteManyArgs>(args?: SelectSubset<T, SubjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subjects
     * const subject = await prisma.subject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubjectUpdateManyArgs>(args: SelectSubset<T, SubjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subjects and returns the data updated in the database.
     * @param {SubjectUpdateManyAndReturnArgs} args - Arguments to update many Subjects.
     * @example
     * // Update many Subjects
     * const subject = await prisma.subject.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subjects and only return the `id`
     * const subjectWithIdOnly = await prisma.subject.updateManyAndReturn({
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
    updateManyAndReturn<T extends SubjectUpdateManyAndReturnArgs>(args: SelectSubset<T, SubjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subject.
     * @param {SubjectUpsertArgs} args - Arguments to update or create a Subject.
     * @example
     * // Update or create a Subject
     * const subject = await prisma.subject.upsert({
     *   create: {
     *     // ... data to create a Subject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subject we want to update
     *   }
     * })
     */
    upsert<T extends SubjectUpsertArgs>(args: SelectSubset<T, SubjectUpsertArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectCountArgs} args - Arguments to filter Subjects to count.
     * @example
     * // Count the number of Subjects
     * const count = await prisma.subject.count({
     *   where: {
     *     // ... the filter for the Subjects we want to count
     *   }
     * })
    **/
    count<T extends SubjectCountArgs>(
      args?: Subset<T, SubjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SubjectAggregateArgs>(args: Subset<T, SubjectAggregateArgs>): Prisma.PrismaPromise<GetSubjectAggregateType<T>>

    /**
     * Group by Subject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubjectGroupByArgs} args - Group by arguments.
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
      T extends SubjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubjectGroupByArgs['orderBy'] }
        : { orderBy?: SubjectGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SubjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subject model
   */
  readonly fields: SubjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    modules<T extends Subject$modulesArgs<ExtArgs> = {}>(args?: Subset<T, Subject$modulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Subject model
   */
  interface SubjectFieldRefs {
    readonly id: FieldRef<"Subject", 'String'>
    readonly code: FieldRef<"Subject", 'String'>
    readonly title: FieldRef<"Subject", 'String'>
    readonly description: FieldRef<"Subject", 'String'>
    readonly instructor: FieldRef<"Subject", 'String'>
    readonly credits: FieldRef<"Subject", 'Int'>
    readonly semester: FieldRef<"Subject", 'Int'>
    readonly coverColor: FieldRef<"Subject", 'String'>
    readonly totalModules: FieldRef<"Subject", 'Int'>
    readonly totalTopics: FieldRef<"Subject", 'Int'>
    readonly createdAt: FieldRef<"Subject", 'DateTime'>
    readonly updatedAt: FieldRef<"Subject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subject findUnique
   */
  export type SubjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where: SubjectWhereUniqueInput
  }

  /**
   * Subject findUniqueOrThrow
   */
  export type SubjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where: SubjectWhereUniqueInput
  }

  /**
   * Subject findFirst
   */
  export type SubjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * Subject findFirstOrThrow
   */
  export type SubjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subject to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * Subject findMany
   */
  export type SubjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter, which Subjects to fetch.
     */
    where?: SubjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subjects to fetch.
     */
    orderBy?: SubjectOrderByWithRelationInput | SubjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subjects.
     */
    cursor?: SubjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subjects.
     */
    distinct?: SubjectScalarFieldEnum | SubjectScalarFieldEnum[]
  }

  /**
   * Subject create
   */
  export type SubjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Subject.
     */
    data: XOR<SubjectCreateInput, SubjectUncheckedCreateInput>
  }

  /**
   * Subject createMany
   */
  export type SubjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subjects.
     */
    data: SubjectCreateManyInput | SubjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subject createManyAndReturn
   */
  export type SubjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * The data used to create many Subjects.
     */
    data: SubjectCreateManyInput | SubjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subject update
   */
  export type SubjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Subject.
     */
    data: XOR<SubjectUpdateInput, SubjectUncheckedUpdateInput>
    /**
     * Choose, which Subject to update.
     */
    where: SubjectWhereUniqueInput
  }

  /**
   * Subject updateMany
   */
  export type SubjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subjects.
     */
    data: XOR<SubjectUpdateManyMutationInput, SubjectUncheckedUpdateManyInput>
    /**
     * Filter which Subjects to update
     */
    where?: SubjectWhereInput
    /**
     * Limit how many Subjects to update.
     */
    limit?: number
  }

  /**
   * Subject updateManyAndReturn
   */
  export type SubjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * The data used to update Subjects.
     */
    data: XOR<SubjectUpdateManyMutationInput, SubjectUncheckedUpdateManyInput>
    /**
     * Filter which Subjects to update
     */
    where?: SubjectWhereInput
    /**
     * Limit how many Subjects to update.
     */
    limit?: number
  }

  /**
   * Subject upsert
   */
  export type SubjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Subject to update in case it exists.
     */
    where: SubjectWhereUniqueInput
    /**
     * In case the Subject found by the `where` argument doesn't exist, create a new Subject with this data.
     */
    create: XOR<SubjectCreateInput, SubjectUncheckedCreateInput>
    /**
     * In case the Subject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubjectUpdateInput, SubjectUncheckedUpdateInput>
  }

  /**
   * Subject delete
   */
  export type SubjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
    /**
     * Filter which Subject to delete.
     */
    where: SubjectWhereUniqueInput
  }

  /**
   * Subject deleteMany
   */
  export type SubjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subjects to delete
     */
    where?: SubjectWhereInput
    /**
     * Limit how many Subjects to delete.
     */
    limit?: number
  }

  /**
   * Subject.modules
   */
  export type Subject$modulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    where?: ModuleWhereInput
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    cursor?: ModuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Subject without action
   */
  export type SubjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subject
     */
    select?: SubjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subject
     */
    omit?: SubjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubjectInclude<ExtArgs> | null
  }


  /**
   * Model Module
   */

  export type AggregateModule = {
    _count: ModuleCountAggregateOutputType | null
    _avg: ModuleAvgAggregateOutputType | null
    _sum: ModuleSumAggregateOutputType | null
    _min: ModuleMinAggregateOutputType | null
    _max: ModuleMaxAggregateOutputType | null
  }

  export type ModuleAvgAggregateOutputType = {
    order: number | null
  }

  export type ModuleSumAggregateOutputType = {
    order: number | null
  }

  export type ModuleMinAggregateOutputType = {
    id: string | null
    subjectId: string | null
    order: number | null
    title: string | null
    description: string | null
    isLocked: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ModuleMaxAggregateOutputType = {
    id: string | null
    subjectId: string | null
    order: number | null
    title: string | null
    description: string | null
    isLocked: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ModuleCountAggregateOutputType = {
    id: number
    subjectId: number
    order: number
    title: number
    description: number
    isLocked: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ModuleAvgAggregateInputType = {
    order?: true
  }

  export type ModuleSumAggregateInputType = {
    order?: true
  }

  export type ModuleMinAggregateInputType = {
    id?: true
    subjectId?: true
    order?: true
    title?: true
    description?: true
    isLocked?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ModuleMaxAggregateInputType = {
    id?: true
    subjectId?: true
    order?: true
    title?: true
    description?: true
    isLocked?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ModuleCountAggregateInputType = {
    id?: true
    subjectId?: true
    order?: true
    title?: true
    description?: true
    isLocked?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ModuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Module to aggregate.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Modules
    **/
    _count?: true | ModuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ModuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ModuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ModuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ModuleMaxAggregateInputType
  }

  export type GetModuleAggregateType<T extends ModuleAggregateArgs> = {
        [P in keyof T & keyof AggregateModule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModule[P]>
      : GetScalarType<T[P], AggregateModule[P]>
  }




  export type ModuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleWhereInput
    orderBy?: ModuleOrderByWithAggregationInput | ModuleOrderByWithAggregationInput[]
    by: ModuleScalarFieldEnum[] | ModuleScalarFieldEnum
    having?: ModuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ModuleCountAggregateInputType | true
    _avg?: ModuleAvgAggregateInputType
    _sum?: ModuleSumAggregateInputType
    _min?: ModuleMinAggregateInputType
    _max?: ModuleMaxAggregateInputType
  }

  export type ModuleGroupByOutputType = {
    id: string
    subjectId: string
    order: number
    title: string
    description: string
    isLocked: boolean
    createdAt: Date
    updatedAt: Date
    _count: ModuleCountAggregateOutputType | null
    _avg: ModuleAvgAggregateOutputType | null
    _sum: ModuleSumAggregateOutputType | null
    _min: ModuleMinAggregateOutputType | null
    _max: ModuleMaxAggregateOutputType | null
  }

  type GetModuleGroupByPayload<T extends ModuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ModuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ModuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ModuleGroupByOutputType[P]>
            : GetScalarType<T[P], ModuleGroupByOutputType[P]>
        }
      >
    >


  export type ModuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subjectId?: boolean
    order?: boolean
    title?: boolean
    description?: boolean
    isLocked?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subject?: boolean | SubjectDefaultArgs<ExtArgs>
    topics?: boolean | Module$topicsArgs<ExtArgs>
    studentProgress?: boolean | Module$studentProgressArgs<ExtArgs>
    _count?: boolean | ModuleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["module"]>

  export type ModuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subjectId?: boolean
    order?: boolean
    title?: boolean
    description?: boolean
    isLocked?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subject?: boolean | SubjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["module"]>

  export type ModuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subjectId?: boolean
    order?: boolean
    title?: boolean
    description?: boolean
    isLocked?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subject?: boolean | SubjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["module"]>

  export type ModuleSelectScalar = {
    id?: boolean
    subjectId?: boolean
    order?: boolean
    title?: boolean
    description?: boolean
    isLocked?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ModuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "subjectId" | "order" | "title" | "description" | "isLocked" | "createdAt" | "updatedAt", ExtArgs["result"]["module"]>
  export type ModuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subject?: boolean | SubjectDefaultArgs<ExtArgs>
    topics?: boolean | Module$topicsArgs<ExtArgs>
    studentProgress?: boolean | Module$studentProgressArgs<ExtArgs>
    _count?: boolean | ModuleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ModuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subject?: boolean | SubjectDefaultArgs<ExtArgs>
  }
  export type ModuleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subject?: boolean | SubjectDefaultArgs<ExtArgs>
  }

  export type $ModulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Module"
    objects: {
      subject: Prisma.$SubjectPayload<ExtArgs>
      topics: Prisma.$TopicPayload<ExtArgs>[]
      studentProgress: Prisma.$ModuleProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      subjectId: string
      order: number
      title: string
      description: string
      isLocked: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["module"]>
    composites: {}
  }

  type ModuleGetPayload<S extends boolean | null | undefined | ModuleDefaultArgs> = $Result.GetResult<Prisma.$ModulePayload, S>

  type ModuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ModuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ModuleCountAggregateInputType | true
    }

  export interface ModuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Module'], meta: { name: 'Module' } }
    /**
     * Find zero or one Module that matches the filter.
     * @param {ModuleFindUniqueArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModuleFindUniqueArgs>(args: SelectSubset<T, ModuleFindUniqueArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Module that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ModuleFindUniqueOrThrowArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModuleFindUniqueOrThrowArgs>(args: SelectSubset<T, ModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Module that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindFirstArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModuleFindFirstArgs>(args?: SelectSubset<T, ModuleFindFirstArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Module that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindFirstOrThrowArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModuleFindFirstOrThrowArgs>(args?: SelectSubset<T, ModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Modules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Modules
     * const modules = await prisma.module.findMany()
     * 
     * // Get first 10 Modules
     * const modules = await prisma.module.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moduleWithIdOnly = await prisma.module.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ModuleFindManyArgs>(args?: SelectSubset<T, ModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Module.
     * @param {ModuleCreateArgs} args - Arguments to create a Module.
     * @example
     * // Create one Module
     * const Module = await prisma.module.create({
     *   data: {
     *     // ... data to create a Module
     *   }
     * })
     * 
     */
    create<T extends ModuleCreateArgs>(args: SelectSubset<T, ModuleCreateArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Modules.
     * @param {ModuleCreateManyArgs} args - Arguments to create many Modules.
     * @example
     * // Create many Modules
     * const module = await prisma.module.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ModuleCreateManyArgs>(args?: SelectSubset<T, ModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Modules and returns the data saved in the database.
     * @param {ModuleCreateManyAndReturnArgs} args - Arguments to create many Modules.
     * @example
     * // Create many Modules
     * const module = await prisma.module.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Modules and only return the `id`
     * const moduleWithIdOnly = await prisma.module.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ModuleCreateManyAndReturnArgs>(args?: SelectSubset<T, ModuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Module.
     * @param {ModuleDeleteArgs} args - Arguments to delete one Module.
     * @example
     * // Delete one Module
     * const Module = await prisma.module.delete({
     *   where: {
     *     // ... filter to delete one Module
     *   }
     * })
     * 
     */
    delete<T extends ModuleDeleteArgs>(args: SelectSubset<T, ModuleDeleteArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Module.
     * @param {ModuleUpdateArgs} args - Arguments to update one Module.
     * @example
     * // Update one Module
     * const module = await prisma.module.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ModuleUpdateArgs>(args: SelectSubset<T, ModuleUpdateArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Modules.
     * @param {ModuleDeleteManyArgs} args - Arguments to filter Modules to delete.
     * @example
     * // Delete a few Modules
     * const { count } = await prisma.module.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ModuleDeleteManyArgs>(args?: SelectSubset<T, ModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Modules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Modules
     * const module = await prisma.module.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ModuleUpdateManyArgs>(args: SelectSubset<T, ModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Modules and returns the data updated in the database.
     * @param {ModuleUpdateManyAndReturnArgs} args - Arguments to update many Modules.
     * @example
     * // Update many Modules
     * const module = await prisma.module.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Modules and only return the `id`
     * const moduleWithIdOnly = await prisma.module.updateManyAndReturn({
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
    updateManyAndReturn<T extends ModuleUpdateManyAndReturnArgs>(args: SelectSubset<T, ModuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Module.
     * @param {ModuleUpsertArgs} args - Arguments to update or create a Module.
     * @example
     * // Update or create a Module
     * const module = await prisma.module.upsert({
     *   create: {
     *     // ... data to create a Module
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Module we want to update
     *   }
     * })
     */
    upsert<T extends ModuleUpsertArgs>(args: SelectSubset<T, ModuleUpsertArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Modules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleCountArgs} args - Arguments to filter Modules to count.
     * @example
     * // Count the number of Modules
     * const count = await prisma.module.count({
     *   where: {
     *     // ... the filter for the Modules we want to count
     *   }
     * })
    **/
    count<T extends ModuleCountArgs>(
      args?: Subset<T, ModuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ModuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Module.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ModuleAggregateArgs>(args: Subset<T, ModuleAggregateArgs>): Prisma.PrismaPromise<GetModuleAggregateType<T>>

    /**
     * Group by Module.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleGroupByArgs} args - Group by arguments.
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
      T extends ModuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ModuleGroupByArgs['orderBy'] }
        : { orderBy?: ModuleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Module model
   */
  readonly fields: ModuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Module.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ModuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subject<T extends SubjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubjectDefaultArgs<ExtArgs>>): Prisma__SubjectClient<$Result.GetResult<Prisma.$SubjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    topics<T extends Module$topicsArgs<ExtArgs> = {}>(args?: Subset<T, Module$topicsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    studentProgress<T extends Module$studentProgressArgs<ExtArgs> = {}>(args?: Subset<T, Module$studentProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Module model
   */
  interface ModuleFieldRefs {
    readonly id: FieldRef<"Module", 'String'>
    readonly subjectId: FieldRef<"Module", 'String'>
    readonly order: FieldRef<"Module", 'Int'>
    readonly title: FieldRef<"Module", 'String'>
    readonly description: FieldRef<"Module", 'String'>
    readonly isLocked: FieldRef<"Module", 'Boolean'>
    readonly createdAt: FieldRef<"Module", 'DateTime'>
    readonly updatedAt: FieldRef<"Module", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Module findUnique
   */
  export type ModuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module findUniqueOrThrow
   */
  export type ModuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module findFirst
   */
  export type ModuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Modules.
     */
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module findFirstOrThrow
   */
  export type ModuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Modules.
     */
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module findMany
   */
  export type ModuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Modules to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Modules.
     */
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module create
   */
  export type ModuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The data needed to create a Module.
     */
    data: XOR<ModuleCreateInput, ModuleUncheckedCreateInput>
  }

  /**
   * Module createMany
   */
  export type ModuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Modules.
     */
    data: ModuleCreateManyInput | ModuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Module createManyAndReturn
   */
  export type ModuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * The data used to create many Modules.
     */
    data: ModuleCreateManyInput | ModuleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Module update
   */
  export type ModuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The data needed to update a Module.
     */
    data: XOR<ModuleUpdateInput, ModuleUncheckedUpdateInput>
    /**
     * Choose, which Module to update.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module updateMany
   */
  export type ModuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Modules.
     */
    data: XOR<ModuleUpdateManyMutationInput, ModuleUncheckedUpdateManyInput>
    /**
     * Filter which Modules to update
     */
    where?: ModuleWhereInput
    /**
     * Limit how many Modules to update.
     */
    limit?: number
  }

  /**
   * Module updateManyAndReturn
   */
  export type ModuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * The data used to update Modules.
     */
    data: XOR<ModuleUpdateManyMutationInput, ModuleUncheckedUpdateManyInput>
    /**
     * Filter which Modules to update
     */
    where?: ModuleWhereInput
    /**
     * Limit how many Modules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Module upsert
   */
  export type ModuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The filter to search for the Module to update in case it exists.
     */
    where: ModuleWhereUniqueInput
    /**
     * In case the Module found by the `where` argument doesn't exist, create a new Module with this data.
     */
    create: XOR<ModuleCreateInput, ModuleUncheckedCreateInput>
    /**
     * In case the Module was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ModuleUpdateInput, ModuleUncheckedUpdateInput>
  }

  /**
   * Module delete
   */
  export type ModuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter which Module to delete.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module deleteMany
   */
  export type ModuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Modules to delete
     */
    where?: ModuleWhereInput
    /**
     * Limit how many Modules to delete.
     */
    limit?: number
  }

  /**
   * Module.topics
   */
  export type Module$topicsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    where?: TopicWhereInput
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    cursor?: TopicWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Module.studentProgress
   */
  export type Module$studentProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    where?: ModuleProgressWhereInput
    orderBy?: ModuleProgressOrderByWithRelationInput | ModuleProgressOrderByWithRelationInput[]
    cursor?: ModuleProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ModuleProgressScalarFieldEnum | ModuleProgressScalarFieldEnum[]
  }

  /**
   * Module without action
   */
  export type ModuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
  }


  /**
   * Model Topic
   */

  export type AggregateTopic = {
    _count: TopicCountAggregateOutputType | null
    _avg: TopicAvgAggregateOutputType | null
    _sum: TopicSumAggregateOutputType | null
    _min: TopicMinAggregateOutputType | null
    _max: TopicMaxAggregateOutputType | null
  }

  export type TopicAvgAggregateOutputType = {
    order: number | null
    durationMinutes: number | null
  }

  export type TopicSumAggregateOutputType = {
    order: number | null
    durationMinutes: number | null
  }

  export type TopicMinAggregateOutputType = {
    id: string | null
    moduleId: string | null
    order: number | null
    title: string | null
    type: string | null
    durationMinutes: number | null
    videoId: string | null
    ebookContent: string | null
    simulationUrl: string | null
    assignmentDescription: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TopicMaxAggregateOutputType = {
    id: string | null
    moduleId: string | null
    order: number | null
    title: string | null
    type: string | null
    durationMinutes: number | null
    videoId: string | null
    ebookContent: string | null
    simulationUrl: string | null
    assignmentDescription: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TopicCountAggregateOutputType = {
    id: number
    moduleId: number
    order: number
    title: number
    type: number
    durationMinutes: number
    videoId: number
    ebookContent: number
    simulationUrl: number
    assignmentDescription: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TopicAvgAggregateInputType = {
    order?: true
    durationMinutes?: true
  }

  export type TopicSumAggregateInputType = {
    order?: true
    durationMinutes?: true
  }

  export type TopicMinAggregateInputType = {
    id?: true
    moduleId?: true
    order?: true
    title?: true
    type?: true
    durationMinutes?: true
    videoId?: true
    ebookContent?: true
    simulationUrl?: true
    assignmentDescription?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TopicMaxAggregateInputType = {
    id?: true
    moduleId?: true
    order?: true
    title?: true
    type?: true
    durationMinutes?: true
    videoId?: true
    ebookContent?: true
    simulationUrl?: true
    assignmentDescription?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TopicCountAggregateInputType = {
    id?: true
    moduleId?: true
    order?: true
    title?: true
    type?: true
    durationMinutes?: true
    videoId?: true
    ebookContent?: true
    simulationUrl?: true
    assignmentDescription?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TopicAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Topic to aggregate.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Topics
    **/
    _count?: true | TopicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicMaxAggregateInputType
  }

  export type GetTopicAggregateType<T extends TopicAggregateArgs> = {
        [P in keyof T & keyof AggregateTopic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopic[P]>
      : GetScalarType<T[P], AggregateTopic[P]>
  }




  export type TopicGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicWhereInput
    orderBy?: TopicOrderByWithAggregationInput | TopicOrderByWithAggregationInput[]
    by: TopicScalarFieldEnum[] | TopicScalarFieldEnum
    having?: TopicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicCountAggregateInputType | true
    _avg?: TopicAvgAggregateInputType
    _sum?: TopicSumAggregateInputType
    _min?: TopicMinAggregateInputType
    _max?: TopicMaxAggregateInputType
  }

  export type TopicGroupByOutputType = {
    id: string
    moduleId: string
    order: number
    title: string
    type: string
    durationMinutes: number
    videoId: string | null
    ebookContent: string | null
    simulationUrl: string | null
    assignmentDescription: string | null
    createdAt: Date
    updatedAt: Date
    _count: TopicCountAggregateOutputType | null
    _avg: TopicAvgAggregateOutputType | null
    _sum: TopicSumAggregateOutputType | null
    _min: TopicMinAggregateOutputType | null
    _max: TopicMaxAggregateOutputType | null
  }

  type GetTopicGroupByPayload<T extends TopicGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicGroupByOutputType[P]>
            : GetScalarType<T[P], TopicGroupByOutputType[P]>
        }
      >
    >


  export type TopicSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    moduleId?: boolean
    order?: boolean
    title?: boolean
    type?: boolean
    durationMinutes?: boolean
    videoId?: boolean
    ebookContent?: boolean
    simulationUrl?: boolean
    assignmentDescription?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    module?: boolean | ModuleDefaultArgs<ExtArgs>
    quizQuestions?: boolean | Topic$quizQuestionsArgs<ExtArgs>
    fileMaterials?: boolean | Topic$fileMaterialsArgs<ExtArgs>
    studentProgress?: boolean | Topic$studentProgressArgs<ExtArgs>
    _count?: boolean | TopicCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    moduleId?: boolean
    order?: boolean
    title?: boolean
    type?: boolean
    durationMinutes?: boolean
    videoId?: boolean
    ebookContent?: boolean
    simulationUrl?: boolean
    assignmentDescription?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    moduleId?: boolean
    order?: boolean
    title?: boolean
    type?: boolean
    durationMinutes?: boolean
    videoId?: boolean
    ebookContent?: boolean
    simulationUrl?: boolean
    assignmentDescription?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectScalar = {
    id?: boolean
    moduleId?: boolean
    order?: boolean
    title?: boolean
    type?: boolean
    durationMinutes?: boolean
    videoId?: boolean
    ebookContent?: boolean
    simulationUrl?: boolean
    assignmentDescription?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TopicOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "moduleId" | "order" | "title" | "type" | "durationMinutes" | "videoId" | "ebookContent" | "simulationUrl" | "assignmentDescription" | "createdAt" | "updatedAt", ExtArgs["result"]["topic"]>
  export type TopicInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | ModuleDefaultArgs<ExtArgs>
    quizQuestions?: boolean | Topic$quizQuestionsArgs<ExtArgs>
    fileMaterials?: boolean | Topic$fileMaterialsArgs<ExtArgs>
    studentProgress?: boolean | Topic$studentProgressArgs<ExtArgs>
    _count?: boolean | TopicCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TopicIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }
  export type TopicIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }

  export type $TopicPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Topic"
    objects: {
      module: Prisma.$ModulePayload<ExtArgs>
      quizQuestions: Prisma.$QuizQuestionPayload<ExtArgs>[]
      fileMaterials: Prisma.$FileMaterialPayload<ExtArgs>[]
      studentProgress: Prisma.$TopicProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      moduleId: string
      order: number
      title: string
      type: string
      durationMinutes: number
      videoId: string | null
      ebookContent: string | null
      simulationUrl: string | null
      assignmentDescription: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["topic"]>
    composites: {}
  }

  type TopicGetPayload<S extends boolean | null | undefined | TopicDefaultArgs> = $Result.GetResult<Prisma.$TopicPayload, S>

  type TopicCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TopicFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TopicCountAggregateInputType | true
    }

  export interface TopicDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Topic'], meta: { name: 'Topic' } }
    /**
     * Find zero or one Topic that matches the filter.
     * @param {TopicFindUniqueArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicFindUniqueArgs>(args: SelectSubset<T, TopicFindUniqueArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Topic that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TopicFindUniqueOrThrowArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Topic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindFirstArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicFindFirstArgs>(args?: SelectSubset<T, TopicFindFirstArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Topic that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindFirstOrThrowArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Topics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Topics
     * const topics = await prisma.topic.findMany()
     * 
     * // Get first 10 Topics
     * const topics = await prisma.topic.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicWithIdOnly = await prisma.topic.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicFindManyArgs>(args?: SelectSubset<T, TopicFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Topic.
     * @param {TopicCreateArgs} args - Arguments to create a Topic.
     * @example
     * // Create one Topic
     * const Topic = await prisma.topic.create({
     *   data: {
     *     // ... data to create a Topic
     *   }
     * })
     * 
     */
    create<T extends TopicCreateArgs>(args: SelectSubset<T, TopicCreateArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Topics.
     * @param {TopicCreateManyArgs} args - Arguments to create many Topics.
     * @example
     * // Create many Topics
     * const topic = await prisma.topic.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TopicCreateManyArgs>(args?: SelectSubset<T, TopicCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Topics and returns the data saved in the database.
     * @param {TopicCreateManyAndReturnArgs} args - Arguments to create many Topics.
     * @example
     * // Create many Topics
     * const topic = await prisma.topic.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Topics and only return the `id`
     * const topicWithIdOnly = await prisma.topic.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TopicCreateManyAndReturnArgs>(args?: SelectSubset<T, TopicCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Topic.
     * @param {TopicDeleteArgs} args - Arguments to delete one Topic.
     * @example
     * // Delete one Topic
     * const Topic = await prisma.topic.delete({
     *   where: {
     *     // ... filter to delete one Topic
     *   }
     * })
     * 
     */
    delete<T extends TopicDeleteArgs>(args: SelectSubset<T, TopicDeleteArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Topic.
     * @param {TopicUpdateArgs} args - Arguments to update one Topic.
     * @example
     * // Update one Topic
     * const topic = await prisma.topic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicUpdateArgs>(args: SelectSubset<T, TopicUpdateArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Topics.
     * @param {TopicDeleteManyArgs} args - Arguments to filter Topics to delete.
     * @example
     * // Delete a few Topics
     * const { count } = await prisma.topic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicDeleteManyArgs>(args?: SelectSubset<T, TopicDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Topics
     * const topic = await prisma.topic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicUpdateManyArgs>(args: SelectSubset<T, TopicUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Topics and returns the data updated in the database.
     * @param {TopicUpdateManyAndReturnArgs} args - Arguments to update many Topics.
     * @example
     * // Update many Topics
     * const topic = await prisma.topic.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Topics and only return the `id`
     * const topicWithIdOnly = await prisma.topic.updateManyAndReturn({
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
    updateManyAndReturn<T extends TopicUpdateManyAndReturnArgs>(args: SelectSubset<T, TopicUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Topic.
     * @param {TopicUpsertArgs} args - Arguments to update or create a Topic.
     * @example
     * // Update or create a Topic
     * const topic = await prisma.topic.upsert({
     *   create: {
     *     // ... data to create a Topic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Topic we want to update
     *   }
     * })
     */
    upsert<T extends TopicUpsertArgs>(args: SelectSubset<T, TopicUpsertArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountArgs} args - Arguments to filter Topics to count.
     * @example
     * // Count the number of Topics
     * const count = await prisma.topic.count({
     *   where: {
     *     // ... the filter for the Topics we want to count
     *   }
     * })
    **/
    count<T extends TopicCountArgs>(
      args?: Subset<T, TopicCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Topic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TopicAggregateArgs>(args: Subset<T, TopicAggregateArgs>): Prisma.PrismaPromise<GetTopicAggregateType<T>>

    /**
     * Group by Topic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicGroupByArgs} args - Group by arguments.
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
      T extends TopicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicGroupByArgs['orderBy'] }
        : { orderBy?: TopicGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TopicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Topic model
   */
  readonly fields: TopicFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Topic.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    module<T extends ModuleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ModuleDefaultArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    quizQuestions<T extends Topic$quizQuestionsArgs<ExtArgs> = {}>(args?: Subset<T, Topic$quizQuestionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    fileMaterials<T extends Topic$fileMaterialsArgs<ExtArgs> = {}>(args?: Subset<T, Topic$fileMaterialsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    studentProgress<T extends Topic$studentProgressArgs<ExtArgs> = {}>(args?: Subset<T, Topic$studentProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Topic model
   */
  interface TopicFieldRefs {
    readonly id: FieldRef<"Topic", 'String'>
    readonly moduleId: FieldRef<"Topic", 'String'>
    readonly order: FieldRef<"Topic", 'Int'>
    readonly title: FieldRef<"Topic", 'String'>
    readonly type: FieldRef<"Topic", 'String'>
    readonly durationMinutes: FieldRef<"Topic", 'Int'>
    readonly videoId: FieldRef<"Topic", 'String'>
    readonly ebookContent: FieldRef<"Topic", 'String'>
    readonly simulationUrl: FieldRef<"Topic", 'String'>
    readonly assignmentDescription: FieldRef<"Topic", 'String'>
    readonly createdAt: FieldRef<"Topic", 'DateTime'>
    readonly updatedAt: FieldRef<"Topic", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Topic findUnique
   */
  export type TopicFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic findUniqueOrThrow
   */
  export type TopicFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic findFirst
   */
  export type TopicFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic findFirstOrThrow
   */
  export type TopicFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic findMany
   */
  export type TopicFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topics to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic create
   */
  export type TopicCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The data needed to create a Topic.
     */
    data: XOR<TopicCreateInput, TopicUncheckedCreateInput>
  }

  /**
   * Topic createMany
   */
  export type TopicCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Topics.
     */
    data: TopicCreateManyInput | TopicCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Topic createManyAndReturn
   */
  export type TopicCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * The data used to create many Topics.
     */
    data: TopicCreateManyInput | TopicCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Topic update
   */
  export type TopicUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The data needed to update a Topic.
     */
    data: XOR<TopicUpdateInput, TopicUncheckedUpdateInput>
    /**
     * Choose, which Topic to update.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic updateMany
   */
  export type TopicUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Topics.
     */
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyInput>
    /**
     * Filter which Topics to update
     */
    where?: TopicWhereInput
    /**
     * Limit how many Topics to update.
     */
    limit?: number
  }

  /**
   * Topic updateManyAndReturn
   */
  export type TopicUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * The data used to update Topics.
     */
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyInput>
    /**
     * Filter which Topics to update
     */
    where?: TopicWhereInput
    /**
     * Limit how many Topics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Topic upsert
   */
  export type TopicUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The filter to search for the Topic to update in case it exists.
     */
    where: TopicWhereUniqueInput
    /**
     * In case the Topic found by the `where` argument doesn't exist, create a new Topic with this data.
     */
    create: XOR<TopicCreateInput, TopicUncheckedCreateInput>
    /**
     * In case the Topic was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicUpdateInput, TopicUncheckedUpdateInput>
  }

  /**
   * Topic delete
   */
  export type TopicDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter which Topic to delete.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic deleteMany
   */
  export type TopicDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Topics to delete
     */
    where?: TopicWhereInput
    /**
     * Limit how many Topics to delete.
     */
    limit?: number
  }

  /**
   * Topic.quizQuestions
   */
  export type Topic$quizQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    where?: QuizQuestionWhereInput
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    cursor?: QuizQuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizQuestionScalarFieldEnum | QuizQuestionScalarFieldEnum[]
  }

  /**
   * Topic.fileMaterials
   */
  export type Topic$fileMaterialsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    where?: FileMaterialWhereInput
    orderBy?: FileMaterialOrderByWithRelationInput | FileMaterialOrderByWithRelationInput[]
    cursor?: FileMaterialWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileMaterialScalarFieldEnum | FileMaterialScalarFieldEnum[]
  }

  /**
   * Topic.studentProgress
   */
  export type Topic$studentProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    where?: TopicProgressWhereInput
    orderBy?: TopicProgressOrderByWithRelationInput | TopicProgressOrderByWithRelationInput[]
    cursor?: TopicProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicProgressScalarFieldEnum | TopicProgressScalarFieldEnum[]
  }

  /**
   * Topic without action
   */
  export type TopicDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
  }


  /**
   * Model FileMaterial
   */

  export type AggregateFileMaterial = {
    _count: FileMaterialCountAggregateOutputType | null
    _min: FileMaterialMinAggregateOutputType | null
    _max: FileMaterialMaxAggregateOutputType | null
  }

  export type FileMaterialMinAggregateOutputType = {
    id: string | null
    topicId: string | null
    googleDriveFileId: string | null
    webContentLink: string | null
    mimeType: string | null
    fileName: string | null
    createdAt: Date | null
  }

  export type FileMaterialMaxAggregateOutputType = {
    id: string | null
    topicId: string | null
    googleDriveFileId: string | null
    webContentLink: string | null
    mimeType: string | null
    fileName: string | null
    createdAt: Date | null
  }

  export type FileMaterialCountAggregateOutputType = {
    id: number
    topicId: number
    googleDriveFileId: number
    webContentLink: number
    mimeType: number
    fileName: number
    createdAt: number
    _all: number
  }


  export type FileMaterialMinAggregateInputType = {
    id?: true
    topicId?: true
    googleDriveFileId?: true
    webContentLink?: true
    mimeType?: true
    fileName?: true
    createdAt?: true
  }

  export type FileMaterialMaxAggregateInputType = {
    id?: true
    topicId?: true
    googleDriveFileId?: true
    webContentLink?: true
    mimeType?: true
    fileName?: true
    createdAt?: true
  }

  export type FileMaterialCountAggregateInputType = {
    id?: true
    topicId?: true
    googleDriveFileId?: true
    webContentLink?: true
    mimeType?: true
    fileName?: true
    createdAt?: true
    _all?: true
  }

  export type FileMaterialAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileMaterial to aggregate.
     */
    where?: FileMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileMaterials to fetch.
     */
    orderBy?: FileMaterialOrderByWithRelationInput | FileMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileMaterials
    **/
    _count?: true | FileMaterialCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMaterialMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMaterialMaxAggregateInputType
  }

  export type GetFileMaterialAggregateType<T extends FileMaterialAggregateArgs> = {
        [P in keyof T & keyof AggregateFileMaterial]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileMaterial[P]>
      : GetScalarType<T[P], AggregateFileMaterial[P]>
  }




  export type FileMaterialGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileMaterialWhereInput
    orderBy?: FileMaterialOrderByWithAggregationInput | FileMaterialOrderByWithAggregationInput[]
    by: FileMaterialScalarFieldEnum[] | FileMaterialScalarFieldEnum
    having?: FileMaterialScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileMaterialCountAggregateInputType | true
    _min?: FileMaterialMinAggregateInputType
    _max?: FileMaterialMaxAggregateInputType
  }

  export type FileMaterialGroupByOutputType = {
    id: string
    topicId: string
    googleDriveFileId: string
    webContentLink: string | null
    mimeType: string | null
    fileName: string
    createdAt: Date
    _count: FileMaterialCountAggregateOutputType | null
    _min: FileMaterialMinAggregateOutputType | null
    _max: FileMaterialMaxAggregateOutputType | null
  }

  type GetFileMaterialGroupByPayload<T extends FileMaterialGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileMaterialGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileMaterialGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileMaterialGroupByOutputType[P]>
            : GetScalarType<T[P], FileMaterialGroupByOutputType[P]>
        }
      >
    >


  export type FileMaterialSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topicId?: boolean
    googleDriveFileId?: boolean
    webContentLink?: boolean
    mimeType?: boolean
    fileName?: boolean
    createdAt?: boolean
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileMaterial"]>

  export type FileMaterialSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topicId?: boolean
    googleDriveFileId?: boolean
    webContentLink?: boolean
    mimeType?: boolean
    fileName?: boolean
    createdAt?: boolean
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileMaterial"]>

  export type FileMaterialSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topicId?: boolean
    googleDriveFileId?: boolean
    webContentLink?: boolean
    mimeType?: boolean
    fileName?: boolean
    createdAt?: boolean
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileMaterial"]>

  export type FileMaterialSelectScalar = {
    id?: boolean
    topicId?: boolean
    googleDriveFileId?: boolean
    webContentLink?: boolean
    mimeType?: boolean
    fileName?: boolean
    createdAt?: boolean
  }

  export type FileMaterialOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "topicId" | "googleDriveFileId" | "webContentLink" | "mimeType" | "fileName" | "createdAt", ExtArgs["result"]["fileMaterial"]>
  export type FileMaterialInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }
  export type FileMaterialIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }
  export type FileMaterialIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }

  export type $FileMaterialPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileMaterial"
    objects: {
      topic: Prisma.$TopicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      topicId: string
      googleDriveFileId: string
      webContentLink: string | null
      mimeType: string | null
      fileName: string
      createdAt: Date
    }, ExtArgs["result"]["fileMaterial"]>
    composites: {}
  }

  type FileMaterialGetPayload<S extends boolean | null | undefined | FileMaterialDefaultArgs> = $Result.GetResult<Prisma.$FileMaterialPayload, S>

  type FileMaterialCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileMaterialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileMaterialCountAggregateInputType | true
    }

  export interface FileMaterialDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileMaterial'], meta: { name: 'FileMaterial' } }
    /**
     * Find zero or one FileMaterial that matches the filter.
     * @param {FileMaterialFindUniqueArgs} args - Arguments to find a FileMaterial
     * @example
     * // Get one FileMaterial
     * const fileMaterial = await prisma.fileMaterial.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileMaterialFindUniqueArgs>(args: SelectSubset<T, FileMaterialFindUniqueArgs<ExtArgs>>): Prisma__FileMaterialClient<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FileMaterial that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileMaterialFindUniqueOrThrowArgs} args - Arguments to find a FileMaterial
     * @example
     * // Get one FileMaterial
     * const fileMaterial = await prisma.fileMaterial.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileMaterialFindUniqueOrThrowArgs>(args: SelectSubset<T, FileMaterialFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileMaterialClient<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileMaterial that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMaterialFindFirstArgs} args - Arguments to find a FileMaterial
     * @example
     * // Get one FileMaterial
     * const fileMaterial = await prisma.fileMaterial.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileMaterialFindFirstArgs>(args?: SelectSubset<T, FileMaterialFindFirstArgs<ExtArgs>>): Prisma__FileMaterialClient<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileMaterial that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMaterialFindFirstOrThrowArgs} args - Arguments to find a FileMaterial
     * @example
     * // Get one FileMaterial
     * const fileMaterial = await prisma.fileMaterial.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileMaterialFindFirstOrThrowArgs>(args?: SelectSubset<T, FileMaterialFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileMaterialClient<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FileMaterials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMaterialFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileMaterials
     * const fileMaterials = await prisma.fileMaterial.findMany()
     * 
     * // Get first 10 FileMaterials
     * const fileMaterials = await prisma.fileMaterial.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileMaterialWithIdOnly = await prisma.fileMaterial.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileMaterialFindManyArgs>(args?: SelectSubset<T, FileMaterialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FileMaterial.
     * @param {FileMaterialCreateArgs} args - Arguments to create a FileMaterial.
     * @example
     * // Create one FileMaterial
     * const FileMaterial = await prisma.fileMaterial.create({
     *   data: {
     *     // ... data to create a FileMaterial
     *   }
     * })
     * 
     */
    create<T extends FileMaterialCreateArgs>(args: SelectSubset<T, FileMaterialCreateArgs<ExtArgs>>): Prisma__FileMaterialClient<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FileMaterials.
     * @param {FileMaterialCreateManyArgs} args - Arguments to create many FileMaterials.
     * @example
     * // Create many FileMaterials
     * const fileMaterial = await prisma.fileMaterial.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileMaterialCreateManyArgs>(args?: SelectSubset<T, FileMaterialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileMaterials and returns the data saved in the database.
     * @param {FileMaterialCreateManyAndReturnArgs} args - Arguments to create many FileMaterials.
     * @example
     * // Create many FileMaterials
     * const fileMaterial = await prisma.fileMaterial.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileMaterials and only return the `id`
     * const fileMaterialWithIdOnly = await prisma.fileMaterial.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileMaterialCreateManyAndReturnArgs>(args?: SelectSubset<T, FileMaterialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FileMaterial.
     * @param {FileMaterialDeleteArgs} args - Arguments to delete one FileMaterial.
     * @example
     * // Delete one FileMaterial
     * const FileMaterial = await prisma.fileMaterial.delete({
     *   where: {
     *     // ... filter to delete one FileMaterial
     *   }
     * })
     * 
     */
    delete<T extends FileMaterialDeleteArgs>(args: SelectSubset<T, FileMaterialDeleteArgs<ExtArgs>>): Prisma__FileMaterialClient<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FileMaterial.
     * @param {FileMaterialUpdateArgs} args - Arguments to update one FileMaterial.
     * @example
     * // Update one FileMaterial
     * const fileMaterial = await prisma.fileMaterial.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileMaterialUpdateArgs>(args: SelectSubset<T, FileMaterialUpdateArgs<ExtArgs>>): Prisma__FileMaterialClient<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FileMaterials.
     * @param {FileMaterialDeleteManyArgs} args - Arguments to filter FileMaterials to delete.
     * @example
     * // Delete a few FileMaterials
     * const { count } = await prisma.fileMaterial.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileMaterialDeleteManyArgs>(args?: SelectSubset<T, FileMaterialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMaterialUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileMaterials
     * const fileMaterial = await prisma.fileMaterial.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileMaterialUpdateManyArgs>(args: SelectSubset<T, FileMaterialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileMaterials and returns the data updated in the database.
     * @param {FileMaterialUpdateManyAndReturnArgs} args - Arguments to update many FileMaterials.
     * @example
     * // Update many FileMaterials
     * const fileMaterial = await prisma.fileMaterial.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FileMaterials and only return the `id`
     * const fileMaterialWithIdOnly = await prisma.fileMaterial.updateManyAndReturn({
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
    updateManyAndReturn<T extends FileMaterialUpdateManyAndReturnArgs>(args: SelectSubset<T, FileMaterialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FileMaterial.
     * @param {FileMaterialUpsertArgs} args - Arguments to update or create a FileMaterial.
     * @example
     * // Update or create a FileMaterial
     * const fileMaterial = await prisma.fileMaterial.upsert({
     *   create: {
     *     // ... data to create a FileMaterial
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileMaterial we want to update
     *   }
     * })
     */
    upsert<T extends FileMaterialUpsertArgs>(args: SelectSubset<T, FileMaterialUpsertArgs<ExtArgs>>): Prisma__FileMaterialClient<$Result.GetResult<Prisma.$FileMaterialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FileMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMaterialCountArgs} args - Arguments to filter FileMaterials to count.
     * @example
     * // Count the number of FileMaterials
     * const count = await prisma.fileMaterial.count({
     *   where: {
     *     // ... the filter for the FileMaterials we want to count
     *   }
     * })
    **/
    count<T extends FileMaterialCountArgs>(
      args?: Subset<T, FileMaterialCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileMaterialCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMaterialAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FileMaterialAggregateArgs>(args: Subset<T, FileMaterialAggregateArgs>): Prisma.PrismaPromise<GetFileMaterialAggregateType<T>>

    /**
     * Group by FileMaterial.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMaterialGroupByArgs} args - Group by arguments.
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
      T extends FileMaterialGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileMaterialGroupByArgs['orderBy'] }
        : { orderBy?: FileMaterialGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FileMaterialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileMaterialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileMaterial model
   */
  readonly fields: FileMaterialFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileMaterial.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileMaterialClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    topic<T extends TopicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TopicDefaultArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the FileMaterial model
   */
  interface FileMaterialFieldRefs {
    readonly id: FieldRef<"FileMaterial", 'String'>
    readonly topicId: FieldRef<"FileMaterial", 'String'>
    readonly googleDriveFileId: FieldRef<"FileMaterial", 'String'>
    readonly webContentLink: FieldRef<"FileMaterial", 'String'>
    readonly mimeType: FieldRef<"FileMaterial", 'String'>
    readonly fileName: FieldRef<"FileMaterial", 'String'>
    readonly createdAt: FieldRef<"FileMaterial", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileMaterial findUnique
   */
  export type FileMaterialFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * Filter, which FileMaterial to fetch.
     */
    where: FileMaterialWhereUniqueInput
  }

  /**
   * FileMaterial findUniqueOrThrow
   */
  export type FileMaterialFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * Filter, which FileMaterial to fetch.
     */
    where: FileMaterialWhereUniqueInput
  }

  /**
   * FileMaterial findFirst
   */
  export type FileMaterialFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * Filter, which FileMaterial to fetch.
     */
    where?: FileMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileMaterials to fetch.
     */
    orderBy?: FileMaterialOrderByWithRelationInput | FileMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileMaterials.
     */
    cursor?: FileMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileMaterials.
     */
    distinct?: FileMaterialScalarFieldEnum | FileMaterialScalarFieldEnum[]
  }

  /**
   * FileMaterial findFirstOrThrow
   */
  export type FileMaterialFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * Filter, which FileMaterial to fetch.
     */
    where?: FileMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileMaterials to fetch.
     */
    orderBy?: FileMaterialOrderByWithRelationInput | FileMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileMaterials.
     */
    cursor?: FileMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileMaterials.
     */
    distinct?: FileMaterialScalarFieldEnum | FileMaterialScalarFieldEnum[]
  }

  /**
   * FileMaterial findMany
   */
  export type FileMaterialFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * Filter, which FileMaterials to fetch.
     */
    where?: FileMaterialWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileMaterials to fetch.
     */
    orderBy?: FileMaterialOrderByWithRelationInput | FileMaterialOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileMaterials.
     */
    cursor?: FileMaterialWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileMaterials.
     */
    distinct?: FileMaterialScalarFieldEnum | FileMaterialScalarFieldEnum[]
  }

  /**
   * FileMaterial create
   */
  export type FileMaterialCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * The data needed to create a FileMaterial.
     */
    data: XOR<FileMaterialCreateInput, FileMaterialUncheckedCreateInput>
  }

  /**
   * FileMaterial createMany
   */
  export type FileMaterialCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileMaterials.
     */
    data: FileMaterialCreateManyInput | FileMaterialCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileMaterial createManyAndReturn
   */
  export type FileMaterialCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * The data used to create many FileMaterials.
     */
    data: FileMaterialCreateManyInput | FileMaterialCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileMaterial update
   */
  export type FileMaterialUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * The data needed to update a FileMaterial.
     */
    data: XOR<FileMaterialUpdateInput, FileMaterialUncheckedUpdateInput>
    /**
     * Choose, which FileMaterial to update.
     */
    where: FileMaterialWhereUniqueInput
  }

  /**
   * FileMaterial updateMany
   */
  export type FileMaterialUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileMaterials.
     */
    data: XOR<FileMaterialUpdateManyMutationInput, FileMaterialUncheckedUpdateManyInput>
    /**
     * Filter which FileMaterials to update
     */
    where?: FileMaterialWhereInput
    /**
     * Limit how many FileMaterials to update.
     */
    limit?: number
  }

  /**
   * FileMaterial updateManyAndReturn
   */
  export type FileMaterialUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * The data used to update FileMaterials.
     */
    data: XOR<FileMaterialUpdateManyMutationInput, FileMaterialUncheckedUpdateManyInput>
    /**
     * Filter which FileMaterials to update
     */
    where?: FileMaterialWhereInput
    /**
     * Limit how many FileMaterials to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileMaterial upsert
   */
  export type FileMaterialUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * The filter to search for the FileMaterial to update in case it exists.
     */
    where: FileMaterialWhereUniqueInput
    /**
     * In case the FileMaterial found by the `where` argument doesn't exist, create a new FileMaterial with this data.
     */
    create: XOR<FileMaterialCreateInput, FileMaterialUncheckedCreateInput>
    /**
     * In case the FileMaterial was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileMaterialUpdateInput, FileMaterialUncheckedUpdateInput>
  }

  /**
   * FileMaterial delete
   */
  export type FileMaterialDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
    /**
     * Filter which FileMaterial to delete.
     */
    where: FileMaterialWhereUniqueInput
  }

  /**
   * FileMaterial deleteMany
   */
  export type FileMaterialDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileMaterials to delete
     */
    where?: FileMaterialWhereInput
    /**
     * Limit how many FileMaterials to delete.
     */
    limit?: number
  }

  /**
   * FileMaterial without action
   */
  export type FileMaterialDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMaterial
     */
    select?: FileMaterialSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileMaterial
     */
    omit?: FileMaterialOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMaterialInclude<ExtArgs> | null
  }


  /**
   * Model QuizQuestion
   */

  export type AggregateQuizQuestion = {
    _count: QuizQuestionCountAggregateOutputType | null
    _avg: QuizQuestionAvgAggregateOutputType | null
    _sum: QuizQuestionSumAggregateOutputType | null
    _min: QuizQuestionMinAggregateOutputType | null
    _max: QuizQuestionMaxAggregateOutputType | null
  }

  export type QuizQuestionAvgAggregateOutputType = {
    correctIndex: number | null
  }

  export type QuizQuestionSumAggregateOutputType = {
    correctIndex: number | null
  }

  export type QuizQuestionMinAggregateOutputType = {
    id: string | null
    topicId: string | null
    question: string | null
    correctIndex: number | null
    explanation: string | null
  }

  export type QuizQuestionMaxAggregateOutputType = {
    id: string | null
    topicId: string | null
    question: string | null
    correctIndex: number | null
    explanation: string | null
  }

  export type QuizQuestionCountAggregateOutputType = {
    id: number
    topicId: number
    question: number
    options: number
    correctIndex: number
    explanation: number
    _all: number
  }


  export type QuizQuestionAvgAggregateInputType = {
    correctIndex?: true
  }

  export type QuizQuestionSumAggregateInputType = {
    correctIndex?: true
  }

  export type QuizQuestionMinAggregateInputType = {
    id?: true
    topicId?: true
    question?: true
    correctIndex?: true
    explanation?: true
  }

  export type QuizQuestionMaxAggregateInputType = {
    id?: true
    topicId?: true
    question?: true
    correctIndex?: true
    explanation?: true
  }

  export type QuizQuestionCountAggregateInputType = {
    id?: true
    topicId?: true
    question?: true
    options?: true
    correctIndex?: true
    explanation?: true
    _all?: true
  }

  export type QuizQuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizQuestion to aggregate.
     */
    where?: QuizQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizQuestions to fetch.
     */
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuizQuestions
    **/
    _count?: true | QuizQuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizQuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizQuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizQuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizQuestionMaxAggregateInputType
  }

  export type GetQuizQuestionAggregateType<T extends QuizQuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuizQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuizQuestion[P]>
      : GetScalarType<T[P], AggregateQuizQuestion[P]>
  }




  export type QuizQuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizQuestionWhereInput
    orderBy?: QuizQuestionOrderByWithAggregationInput | QuizQuestionOrderByWithAggregationInput[]
    by: QuizQuestionScalarFieldEnum[] | QuizQuestionScalarFieldEnum
    having?: QuizQuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizQuestionCountAggregateInputType | true
    _avg?: QuizQuestionAvgAggregateInputType
    _sum?: QuizQuestionSumAggregateInputType
    _min?: QuizQuestionMinAggregateInputType
    _max?: QuizQuestionMaxAggregateInputType
  }

  export type QuizQuestionGroupByOutputType = {
    id: string
    topicId: string
    question: string
    options: string[]
    correctIndex: number
    explanation: string
    _count: QuizQuestionCountAggregateOutputType | null
    _avg: QuizQuestionAvgAggregateOutputType | null
    _sum: QuizQuestionSumAggregateOutputType | null
    _min: QuizQuestionMinAggregateOutputType | null
    _max: QuizQuestionMaxAggregateOutputType | null
  }

  type GetQuizQuestionGroupByPayload<T extends QuizQuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizQuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizQuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizQuestionGroupByOutputType[P]>
            : GetScalarType<T[P], QuizQuestionGroupByOutputType[P]>
        }
      >
    >


  export type QuizQuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topicId?: boolean
    question?: boolean
    options?: boolean
    correctIndex?: boolean
    explanation?: boolean
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizQuestion"]>

  export type QuizQuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topicId?: boolean
    question?: boolean
    options?: boolean
    correctIndex?: boolean
    explanation?: boolean
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizQuestion"]>

  export type QuizQuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topicId?: boolean
    question?: boolean
    options?: boolean
    correctIndex?: boolean
    explanation?: boolean
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quizQuestion"]>

  export type QuizQuestionSelectScalar = {
    id?: boolean
    topicId?: boolean
    question?: boolean
    options?: boolean
    correctIndex?: boolean
    explanation?: boolean
  }

  export type QuizQuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "topicId" | "question" | "options" | "correctIndex" | "explanation", ExtArgs["result"]["quizQuestion"]>
  export type QuizQuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }
  export type QuizQuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }
  export type QuizQuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }

  export type $QuizQuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuizQuestion"
    objects: {
      topic: Prisma.$TopicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      topicId: string
      question: string
      options: string[]
      correctIndex: number
      explanation: string
    }, ExtArgs["result"]["quizQuestion"]>
    composites: {}
  }

  type QuizQuestionGetPayload<S extends boolean | null | undefined | QuizQuestionDefaultArgs> = $Result.GetResult<Prisma.$QuizQuestionPayload, S>

  type QuizQuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizQuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizQuestionCountAggregateInputType | true
    }

  export interface QuizQuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuizQuestion'], meta: { name: 'QuizQuestion' } }
    /**
     * Find zero or one QuizQuestion that matches the filter.
     * @param {QuizQuestionFindUniqueArgs} args - Arguments to find a QuizQuestion
     * @example
     * // Get one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizQuestionFindUniqueArgs>(args: SelectSubset<T, QuizQuestionFindUniqueArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuizQuestion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizQuestionFindUniqueOrThrowArgs} args - Arguments to find a QuizQuestion
     * @example
     * // Get one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizQuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizQuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizQuestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionFindFirstArgs} args - Arguments to find a QuizQuestion
     * @example
     * // Get one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizQuestionFindFirstArgs>(args?: SelectSubset<T, QuizQuestionFindFirstArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuizQuestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionFindFirstOrThrowArgs} args - Arguments to find a QuizQuestion
     * @example
     * // Get one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizQuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizQuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuizQuestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuizQuestions
     * const quizQuestions = await prisma.quizQuestion.findMany()
     * 
     * // Get first 10 QuizQuestions
     * const quizQuestions = await prisma.quizQuestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizQuestionWithIdOnly = await prisma.quizQuestion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizQuestionFindManyArgs>(args?: SelectSubset<T, QuizQuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuizQuestion.
     * @param {QuizQuestionCreateArgs} args - Arguments to create a QuizQuestion.
     * @example
     * // Create one QuizQuestion
     * const QuizQuestion = await prisma.quizQuestion.create({
     *   data: {
     *     // ... data to create a QuizQuestion
     *   }
     * })
     * 
     */
    create<T extends QuizQuestionCreateArgs>(args: SelectSubset<T, QuizQuestionCreateArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuizQuestions.
     * @param {QuizQuestionCreateManyArgs} args - Arguments to create many QuizQuestions.
     * @example
     * // Create many QuizQuestions
     * const quizQuestion = await prisma.quizQuestion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizQuestionCreateManyArgs>(args?: SelectSubset<T, QuizQuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuizQuestions and returns the data saved in the database.
     * @param {QuizQuestionCreateManyAndReturnArgs} args - Arguments to create many QuizQuestions.
     * @example
     * // Create many QuizQuestions
     * const quizQuestion = await prisma.quizQuestion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuizQuestions and only return the `id`
     * const quizQuestionWithIdOnly = await prisma.quizQuestion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizQuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizQuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuizQuestion.
     * @param {QuizQuestionDeleteArgs} args - Arguments to delete one QuizQuestion.
     * @example
     * // Delete one QuizQuestion
     * const QuizQuestion = await prisma.quizQuestion.delete({
     *   where: {
     *     // ... filter to delete one QuizQuestion
     *   }
     * })
     * 
     */
    delete<T extends QuizQuestionDeleteArgs>(args: SelectSubset<T, QuizQuestionDeleteArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuizQuestion.
     * @param {QuizQuestionUpdateArgs} args - Arguments to update one QuizQuestion.
     * @example
     * // Update one QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizQuestionUpdateArgs>(args: SelectSubset<T, QuizQuestionUpdateArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuizQuestions.
     * @param {QuizQuestionDeleteManyArgs} args - Arguments to filter QuizQuestions to delete.
     * @example
     * // Delete a few QuizQuestions
     * const { count } = await prisma.quizQuestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizQuestionDeleteManyArgs>(args?: SelectSubset<T, QuizQuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuizQuestions
     * const quizQuestion = await prisma.quizQuestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizQuestionUpdateManyArgs>(args: SelectSubset<T, QuizQuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuizQuestions and returns the data updated in the database.
     * @param {QuizQuestionUpdateManyAndReturnArgs} args - Arguments to update many QuizQuestions.
     * @example
     * // Update many QuizQuestions
     * const quizQuestion = await prisma.quizQuestion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuizQuestions and only return the `id`
     * const quizQuestionWithIdOnly = await prisma.quizQuestion.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuizQuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizQuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuizQuestion.
     * @param {QuizQuestionUpsertArgs} args - Arguments to update or create a QuizQuestion.
     * @example
     * // Update or create a QuizQuestion
     * const quizQuestion = await prisma.quizQuestion.upsert({
     *   create: {
     *     // ... data to create a QuizQuestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuizQuestion we want to update
     *   }
     * })
     */
    upsert<T extends QuizQuestionUpsertArgs>(args: SelectSubset<T, QuizQuestionUpsertArgs<ExtArgs>>): Prisma__QuizQuestionClient<$Result.GetResult<Prisma.$QuizQuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuizQuestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionCountArgs} args - Arguments to filter QuizQuestions to count.
     * @example
     * // Count the number of QuizQuestions
     * const count = await prisma.quizQuestion.count({
     *   where: {
     *     // ... the filter for the QuizQuestions we want to count
     *   }
     * })
    **/
    count<T extends QuizQuestionCountArgs>(
      args?: Subset<T, QuizQuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizQuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuizQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuizQuestionAggregateArgs>(args: Subset<T, QuizQuestionAggregateArgs>): Prisma.PrismaPromise<GetQuizQuestionAggregateType<T>>

    /**
     * Group by QuizQuestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizQuestionGroupByArgs} args - Group by arguments.
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
      T extends QuizQuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizQuestionGroupByArgs['orderBy'] }
        : { orderBy?: QuizQuestionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuizQuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuizQuestion model
   */
  readonly fields: QuizQuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuizQuestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizQuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    topic<T extends TopicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TopicDefaultArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the QuizQuestion model
   */
  interface QuizQuestionFieldRefs {
    readonly id: FieldRef<"QuizQuestion", 'String'>
    readonly topicId: FieldRef<"QuizQuestion", 'String'>
    readonly question: FieldRef<"QuizQuestion", 'String'>
    readonly options: FieldRef<"QuizQuestion", 'String[]'>
    readonly correctIndex: FieldRef<"QuizQuestion", 'Int'>
    readonly explanation: FieldRef<"QuizQuestion", 'String'>
  }
    

  // Custom InputTypes
  /**
   * QuizQuestion findUnique
   */
  export type QuizQuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestion to fetch.
     */
    where: QuizQuestionWhereUniqueInput
  }

  /**
   * QuizQuestion findUniqueOrThrow
   */
  export type QuizQuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestion to fetch.
     */
    where: QuizQuestionWhereUniqueInput
  }

  /**
   * QuizQuestion findFirst
   */
  export type QuizQuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestion to fetch.
     */
    where?: QuizQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizQuestions to fetch.
     */
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizQuestions.
     */
    cursor?: QuizQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizQuestions.
     */
    distinct?: QuizQuestionScalarFieldEnum | QuizQuestionScalarFieldEnum[]
  }

  /**
   * QuizQuestion findFirstOrThrow
   */
  export type QuizQuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestion to fetch.
     */
    where?: QuizQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizQuestions to fetch.
     */
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuizQuestions.
     */
    cursor?: QuizQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizQuestions.
     */
    distinct?: QuizQuestionScalarFieldEnum | QuizQuestionScalarFieldEnum[]
  }

  /**
   * QuizQuestion findMany
   */
  export type QuizQuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter, which QuizQuestions to fetch.
     */
    where?: QuizQuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuizQuestions to fetch.
     */
    orderBy?: QuizQuestionOrderByWithRelationInput | QuizQuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuizQuestions.
     */
    cursor?: QuizQuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuizQuestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuizQuestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuizQuestions.
     */
    distinct?: QuizQuestionScalarFieldEnum | QuizQuestionScalarFieldEnum[]
  }

  /**
   * QuizQuestion create
   */
  export type QuizQuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a QuizQuestion.
     */
    data: XOR<QuizQuestionCreateInput, QuizQuestionUncheckedCreateInput>
  }

  /**
   * QuizQuestion createMany
   */
  export type QuizQuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuizQuestions.
     */
    data: QuizQuestionCreateManyInput | QuizQuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuizQuestion createManyAndReturn
   */
  export type QuizQuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * The data used to create many QuizQuestions.
     */
    data: QuizQuestionCreateManyInput | QuizQuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizQuestion update
   */
  export type QuizQuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a QuizQuestion.
     */
    data: XOR<QuizQuestionUpdateInput, QuizQuestionUncheckedUpdateInput>
    /**
     * Choose, which QuizQuestion to update.
     */
    where: QuizQuestionWhereUniqueInput
  }

  /**
   * QuizQuestion updateMany
   */
  export type QuizQuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuizQuestions.
     */
    data: XOR<QuizQuestionUpdateManyMutationInput, QuizQuestionUncheckedUpdateManyInput>
    /**
     * Filter which QuizQuestions to update
     */
    where?: QuizQuestionWhereInput
    /**
     * Limit how many QuizQuestions to update.
     */
    limit?: number
  }

  /**
   * QuizQuestion updateManyAndReturn
   */
  export type QuizQuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * The data used to update QuizQuestions.
     */
    data: XOR<QuizQuestionUpdateManyMutationInput, QuizQuestionUncheckedUpdateManyInput>
    /**
     * Filter which QuizQuestions to update
     */
    where?: QuizQuestionWhereInput
    /**
     * Limit how many QuizQuestions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuizQuestion upsert
   */
  export type QuizQuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the QuizQuestion to update in case it exists.
     */
    where: QuizQuestionWhereUniqueInput
    /**
     * In case the QuizQuestion found by the `where` argument doesn't exist, create a new QuizQuestion with this data.
     */
    create: XOR<QuizQuestionCreateInput, QuizQuestionUncheckedCreateInput>
    /**
     * In case the QuizQuestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizQuestionUpdateInput, QuizQuestionUncheckedUpdateInput>
  }

  /**
   * QuizQuestion delete
   */
  export type QuizQuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
    /**
     * Filter which QuizQuestion to delete.
     */
    where: QuizQuestionWhereUniqueInput
  }

  /**
   * QuizQuestion deleteMany
   */
  export type QuizQuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuizQuestions to delete
     */
    where?: QuizQuestionWhereInput
    /**
     * Limit how many QuizQuestions to delete.
     */
    limit?: number
  }

  /**
   * QuizQuestion without action
   */
  export type QuizQuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuizQuestion
     */
    select?: QuizQuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuizQuestion
     */
    omit?: QuizQuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizQuestionInclude<ExtArgs> | null
  }


  /**
   * Model TopicProgress
   */

  export type AggregateTopicProgress = {
    _count: TopicProgressCountAggregateOutputType | null
    _avg: TopicProgressAvgAggregateOutputType | null
    _sum: TopicProgressSumAggregateOutputType | null
    _min: TopicProgressMinAggregateOutputType | null
    _max: TopicProgressMaxAggregateOutputType | null
  }

  export type TopicProgressAvgAggregateOutputType = {
    quizScore: number | null
  }

  export type TopicProgressSumAggregateOutputType = {
    quizScore: number | null
  }

  export type TopicProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    topicId: string | null
    isCompleted: boolean | null
    quizScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TopicProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    topicId: string | null
    isCompleted: boolean | null
    quizScore: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TopicProgressCountAggregateOutputType = {
    id: number
    userId: number
    topicId: number
    isCompleted: number
    quizScore: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TopicProgressAvgAggregateInputType = {
    quizScore?: true
  }

  export type TopicProgressSumAggregateInputType = {
    quizScore?: true
  }

  export type TopicProgressMinAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    isCompleted?: true
    quizScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TopicProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    isCompleted?: true
    quizScore?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TopicProgressCountAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    isCompleted?: true
    quizScore?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TopicProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicProgress to aggregate.
     */
    where?: TopicProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicProgresses to fetch.
     */
    orderBy?: TopicProgressOrderByWithRelationInput | TopicProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TopicProgresses
    **/
    _count?: true | TopicProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicProgressMaxAggregateInputType
  }

  export type GetTopicProgressAggregateType<T extends TopicProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateTopicProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopicProgress[P]>
      : GetScalarType<T[P], AggregateTopicProgress[P]>
  }




  export type TopicProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicProgressWhereInput
    orderBy?: TopicProgressOrderByWithAggregationInput | TopicProgressOrderByWithAggregationInput[]
    by: TopicProgressScalarFieldEnum[] | TopicProgressScalarFieldEnum
    having?: TopicProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicProgressCountAggregateInputType | true
    _avg?: TopicProgressAvgAggregateInputType
    _sum?: TopicProgressSumAggregateInputType
    _min?: TopicProgressMinAggregateInputType
    _max?: TopicProgressMaxAggregateInputType
  }

  export type TopicProgressGroupByOutputType = {
    id: string
    userId: string
    topicId: string
    isCompleted: boolean
    quizScore: number | null
    createdAt: Date
    updatedAt: Date
    _count: TopicProgressCountAggregateOutputType | null
    _avg: TopicProgressAvgAggregateOutputType | null
    _sum: TopicProgressSumAggregateOutputType | null
    _min: TopicProgressMinAggregateOutputType | null
    _max: TopicProgressMaxAggregateOutputType | null
  }

  type GetTopicProgressGroupByPayload<T extends TopicProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicProgressGroupByOutputType[P]>
            : GetScalarType<T[P], TopicProgressGroupByOutputType[P]>
        }
      >
    >


  export type TopicProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    isCompleted?: boolean
    quizScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicProgress"]>

  export type TopicProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    isCompleted?: boolean
    quizScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicProgress"]>

  export type TopicProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    isCompleted?: boolean
    quizScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicProgress"]>

  export type TopicProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    topicId?: boolean
    isCompleted?: boolean
    quizScore?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TopicProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "topicId" | "isCompleted" | "quizScore" | "createdAt" | "updatedAt", ExtArgs["result"]["topicProgress"]>
  export type TopicProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }
  export type TopicProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }
  export type TopicProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }

  export type $TopicProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TopicProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      topic: Prisma.$TopicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      topicId: string
      isCompleted: boolean
      quizScore: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["topicProgress"]>
    composites: {}
  }

  type TopicProgressGetPayload<S extends boolean | null | undefined | TopicProgressDefaultArgs> = $Result.GetResult<Prisma.$TopicProgressPayload, S>

  type TopicProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TopicProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TopicProgressCountAggregateInputType | true
    }

  export interface TopicProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TopicProgress'], meta: { name: 'TopicProgress' } }
    /**
     * Find zero or one TopicProgress that matches the filter.
     * @param {TopicProgressFindUniqueArgs} args - Arguments to find a TopicProgress
     * @example
     * // Get one TopicProgress
     * const topicProgress = await prisma.topicProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicProgressFindUniqueArgs>(args: SelectSubset<T, TopicProgressFindUniqueArgs<ExtArgs>>): Prisma__TopicProgressClient<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TopicProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TopicProgressFindUniqueOrThrowArgs} args - Arguments to find a TopicProgress
     * @example
     * // Get one TopicProgress
     * const topicProgress = await prisma.topicProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicProgressClient<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TopicProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicProgressFindFirstArgs} args - Arguments to find a TopicProgress
     * @example
     * // Get one TopicProgress
     * const topicProgress = await prisma.topicProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicProgressFindFirstArgs>(args?: SelectSubset<T, TopicProgressFindFirstArgs<ExtArgs>>): Prisma__TopicProgressClient<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TopicProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicProgressFindFirstOrThrowArgs} args - Arguments to find a TopicProgress
     * @example
     * // Get one TopicProgress
     * const topicProgress = await prisma.topicProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicProgressClient<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TopicProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TopicProgresses
     * const topicProgresses = await prisma.topicProgress.findMany()
     * 
     * // Get first 10 TopicProgresses
     * const topicProgresses = await prisma.topicProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicProgressWithIdOnly = await prisma.topicProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicProgressFindManyArgs>(args?: SelectSubset<T, TopicProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TopicProgress.
     * @param {TopicProgressCreateArgs} args - Arguments to create a TopicProgress.
     * @example
     * // Create one TopicProgress
     * const TopicProgress = await prisma.topicProgress.create({
     *   data: {
     *     // ... data to create a TopicProgress
     *   }
     * })
     * 
     */
    create<T extends TopicProgressCreateArgs>(args: SelectSubset<T, TopicProgressCreateArgs<ExtArgs>>): Prisma__TopicProgressClient<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TopicProgresses.
     * @param {TopicProgressCreateManyArgs} args - Arguments to create many TopicProgresses.
     * @example
     * // Create many TopicProgresses
     * const topicProgress = await prisma.topicProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TopicProgressCreateManyArgs>(args?: SelectSubset<T, TopicProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TopicProgresses and returns the data saved in the database.
     * @param {TopicProgressCreateManyAndReturnArgs} args - Arguments to create many TopicProgresses.
     * @example
     * // Create many TopicProgresses
     * const topicProgress = await prisma.topicProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TopicProgresses and only return the `id`
     * const topicProgressWithIdOnly = await prisma.topicProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TopicProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, TopicProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TopicProgress.
     * @param {TopicProgressDeleteArgs} args - Arguments to delete one TopicProgress.
     * @example
     * // Delete one TopicProgress
     * const TopicProgress = await prisma.topicProgress.delete({
     *   where: {
     *     // ... filter to delete one TopicProgress
     *   }
     * })
     * 
     */
    delete<T extends TopicProgressDeleteArgs>(args: SelectSubset<T, TopicProgressDeleteArgs<ExtArgs>>): Prisma__TopicProgressClient<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TopicProgress.
     * @param {TopicProgressUpdateArgs} args - Arguments to update one TopicProgress.
     * @example
     * // Update one TopicProgress
     * const topicProgress = await prisma.topicProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicProgressUpdateArgs>(args: SelectSubset<T, TopicProgressUpdateArgs<ExtArgs>>): Prisma__TopicProgressClient<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TopicProgresses.
     * @param {TopicProgressDeleteManyArgs} args - Arguments to filter TopicProgresses to delete.
     * @example
     * // Delete a few TopicProgresses
     * const { count } = await prisma.topicProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicProgressDeleteManyArgs>(args?: SelectSubset<T, TopicProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TopicProgresses
     * const topicProgress = await prisma.topicProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicProgressUpdateManyArgs>(args: SelectSubset<T, TopicProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicProgresses and returns the data updated in the database.
     * @param {TopicProgressUpdateManyAndReturnArgs} args - Arguments to update many TopicProgresses.
     * @example
     * // Update many TopicProgresses
     * const topicProgress = await prisma.topicProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TopicProgresses and only return the `id`
     * const topicProgressWithIdOnly = await prisma.topicProgress.updateManyAndReturn({
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
    updateManyAndReturn<T extends TopicProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, TopicProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TopicProgress.
     * @param {TopicProgressUpsertArgs} args - Arguments to update or create a TopicProgress.
     * @example
     * // Update or create a TopicProgress
     * const topicProgress = await prisma.topicProgress.upsert({
     *   create: {
     *     // ... data to create a TopicProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TopicProgress we want to update
     *   }
     * })
     */
    upsert<T extends TopicProgressUpsertArgs>(args: SelectSubset<T, TopicProgressUpsertArgs<ExtArgs>>): Prisma__TopicProgressClient<$Result.GetResult<Prisma.$TopicProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TopicProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicProgressCountArgs} args - Arguments to filter TopicProgresses to count.
     * @example
     * // Count the number of TopicProgresses
     * const count = await prisma.topicProgress.count({
     *   where: {
     *     // ... the filter for the TopicProgresses we want to count
     *   }
     * })
    **/
    count<T extends TopicProgressCountArgs>(
      args?: Subset<T, TopicProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TopicProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TopicProgressAggregateArgs>(args: Subset<T, TopicProgressAggregateArgs>): Prisma.PrismaPromise<GetTopicProgressAggregateType<T>>

    /**
     * Group by TopicProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicProgressGroupByArgs} args - Group by arguments.
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
      T extends TopicProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicProgressGroupByArgs['orderBy'] }
        : { orderBy?: TopicProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TopicProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TopicProgress model
   */
  readonly fields: TopicProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TopicProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    topic<T extends TopicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TopicDefaultArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TopicProgress model
   */
  interface TopicProgressFieldRefs {
    readonly id: FieldRef<"TopicProgress", 'String'>
    readonly userId: FieldRef<"TopicProgress", 'String'>
    readonly topicId: FieldRef<"TopicProgress", 'String'>
    readonly isCompleted: FieldRef<"TopicProgress", 'Boolean'>
    readonly quizScore: FieldRef<"TopicProgress", 'Int'>
    readonly createdAt: FieldRef<"TopicProgress", 'DateTime'>
    readonly updatedAt: FieldRef<"TopicProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TopicProgress findUnique
   */
  export type TopicProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * Filter, which TopicProgress to fetch.
     */
    where: TopicProgressWhereUniqueInput
  }

  /**
   * TopicProgress findUniqueOrThrow
   */
  export type TopicProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * Filter, which TopicProgress to fetch.
     */
    where: TopicProgressWhereUniqueInput
  }

  /**
   * TopicProgress findFirst
   */
  export type TopicProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * Filter, which TopicProgress to fetch.
     */
    where?: TopicProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicProgresses to fetch.
     */
    orderBy?: TopicProgressOrderByWithRelationInput | TopicProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicProgresses.
     */
    cursor?: TopicProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicProgresses.
     */
    distinct?: TopicProgressScalarFieldEnum | TopicProgressScalarFieldEnum[]
  }

  /**
   * TopicProgress findFirstOrThrow
   */
  export type TopicProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * Filter, which TopicProgress to fetch.
     */
    where?: TopicProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicProgresses to fetch.
     */
    orderBy?: TopicProgressOrderByWithRelationInput | TopicProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicProgresses.
     */
    cursor?: TopicProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicProgresses.
     */
    distinct?: TopicProgressScalarFieldEnum | TopicProgressScalarFieldEnum[]
  }

  /**
   * TopicProgress findMany
   */
  export type TopicProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * Filter, which TopicProgresses to fetch.
     */
    where?: TopicProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicProgresses to fetch.
     */
    orderBy?: TopicProgressOrderByWithRelationInput | TopicProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TopicProgresses.
     */
    cursor?: TopicProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicProgresses.
     */
    distinct?: TopicProgressScalarFieldEnum | TopicProgressScalarFieldEnum[]
  }

  /**
   * TopicProgress create
   */
  export type TopicProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a TopicProgress.
     */
    data: XOR<TopicProgressCreateInput, TopicProgressUncheckedCreateInput>
  }

  /**
   * TopicProgress createMany
   */
  export type TopicProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TopicProgresses.
     */
    data: TopicProgressCreateManyInput | TopicProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TopicProgress createManyAndReturn
   */
  export type TopicProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * The data used to create many TopicProgresses.
     */
    data: TopicProgressCreateManyInput | TopicProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TopicProgress update
   */
  export type TopicProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a TopicProgress.
     */
    data: XOR<TopicProgressUpdateInput, TopicProgressUncheckedUpdateInput>
    /**
     * Choose, which TopicProgress to update.
     */
    where: TopicProgressWhereUniqueInput
  }

  /**
   * TopicProgress updateMany
   */
  export type TopicProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TopicProgresses.
     */
    data: XOR<TopicProgressUpdateManyMutationInput, TopicProgressUncheckedUpdateManyInput>
    /**
     * Filter which TopicProgresses to update
     */
    where?: TopicProgressWhereInput
    /**
     * Limit how many TopicProgresses to update.
     */
    limit?: number
  }

  /**
   * TopicProgress updateManyAndReturn
   */
  export type TopicProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * The data used to update TopicProgresses.
     */
    data: XOR<TopicProgressUpdateManyMutationInput, TopicProgressUncheckedUpdateManyInput>
    /**
     * Filter which TopicProgresses to update
     */
    where?: TopicProgressWhereInput
    /**
     * Limit how many TopicProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TopicProgress upsert
   */
  export type TopicProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the TopicProgress to update in case it exists.
     */
    where: TopicProgressWhereUniqueInput
    /**
     * In case the TopicProgress found by the `where` argument doesn't exist, create a new TopicProgress with this data.
     */
    create: XOR<TopicProgressCreateInput, TopicProgressUncheckedCreateInput>
    /**
     * In case the TopicProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicProgressUpdateInput, TopicProgressUncheckedUpdateInput>
  }

  /**
   * TopicProgress delete
   */
  export type TopicProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
    /**
     * Filter which TopicProgress to delete.
     */
    where: TopicProgressWhereUniqueInput
  }

  /**
   * TopicProgress deleteMany
   */
  export type TopicProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicProgresses to delete
     */
    where?: TopicProgressWhereInput
    /**
     * Limit how many TopicProgresses to delete.
     */
    limit?: number
  }

  /**
   * TopicProgress without action
   */
  export type TopicProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicProgress
     */
    select?: TopicProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicProgress
     */
    omit?: TopicProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicProgressInclude<ExtArgs> | null
  }


  /**
   * Model ModuleProgress
   */

  export type AggregateModuleProgress = {
    _count: ModuleProgressCountAggregateOutputType | null
    _min: ModuleProgressMinAggregateOutputType | null
    _max: ModuleProgressMaxAggregateOutputType | null
  }

  export type ModuleProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    moduleId: string | null
    isCompleted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ModuleProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    moduleId: string | null
    isCompleted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ModuleProgressCountAggregateOutputType = {
    id: number
    userId: number
    moduleId: number
    isCompleted: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ModuleProgressMinAggregateInputType = {
    id?: true
    userId?: true
    moduleId?: true
    isCompleted?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ModuleProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    moduleId?: true
    isCompleted?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ModuleProgressCountAggregateInputType = {
    id?: true
    userId?: true
    moduleId?: true
    isCompleted?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ModuleProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ModuleProgress to aggregate.
     */
    where?: ModuleProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModuleProgresses to fetch.
     */
    orderBy?: ModuleProgressOrderByWithRelationInput | ModuleProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ModuleProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModuleProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModuleProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ModuleProgresses
    **/
    _count?: true | ModuleProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ModuleProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ModuleProgressMaxAggregateInputType
  }

  export type GetModuleProgressAggregateType<T extends ModuleProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateModuleProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModuleProgress[P]>
      : GetScalarType<T[P], AggregateModuleProgress[P]>
  }




  export type ModuleProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleProgressWhereInput
    orderBy?: ModuleProgressOrderByWithAggregationInput | ModuleProgressOrderByWithAggregationInput[]
    by: ModuleProgressScalarFieldEnum[] | ModuleProgressScalarFieldEnum
    having?: ModuleProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ModuleProgressCountAggregateInputType | true
    _min?: ModuleProgressMinAggregateInputType
    _max?: ModuleProgressMaxAggregateInputType
  }

  export type ModuleProgressGroupByOutputType = {
    id: string
    userId: string
    moduleId: string
    isCompleted: boolean
    createdAt: Date
    updatedAt: Date
    _count: ModuleProgressCountAggregateOutputType | null
    _min: ModuleProgressMinAggregateOutputType | null
    _max: ModuleProgressMaxAggregateOutputType | null
  }

  type GetModuleProgressGroupByPayload<T extends ModuleProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ModuleProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ModuleProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ModuleProgressGroupByOutputType[P]>
            : GetScalarType<T[P], ModuleProgressGroupByOutputType[P]>
        }
      >
    >


  export type ModuleProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    moduleId?: boolean
    isCompleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moduleProgress"]>

  export type ModuleProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    moduleId?: boolean
    isCompleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moduleProgress"]>

  export type ModuleProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    moduleId?: boolean
    isCompleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["moduleProgress"]>

  export type ModuleProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    moduleId?: boolean
    isCompleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ModuleProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "moduleId" | "isCompleted" | "createdAt" | "updatedAt", ExtArgs["result"]["moduleProgress"]>
  export type ModuleProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }
  export type ModuleProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }
  export type ModuleProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }

  export type $ModuleProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ModuleProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      module: Prisma.$ModulePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      moduleId: string
      isCompleted: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["moduleProgress"]>
    composites: {}
  }

  type ModuleProgressGetPayload<S extends boolean | null | undefined | ModuleProgressDefaultArgs> = $Result.GetResult<Prisma.$ModuleProgressPayload, S>

  type ModuleProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ModuleProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ModuleProgressCountAggregateInputType | true
    }

  export interface ModuleProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ModuleProgress'], meta: { name: 'ModuleProgress' } }
    /**
     * Find zero or one ModuleProgress that matches the filter.
     * @param {ModuleProgressFindUniqueArgs} args - Arguments to find a ModuleProgress
     * @example
     * // Get one ModuleProgress
     * const moduleProgress = await prisma.moduleProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModuleProgressFindUniqueArgs>(args: SelectSubset<T, ModuleProgressFindUniqueArgs<ExtArgs>>): Prisma__ModuleProgressClient<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ModuleProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ModuleProgressFindUniqueOrThrowArgs} args - Arguments to find a ModuleProgress
     * @example
     * // Get one ModuleProgress
     * const moduleProgress = await prisma.moduleProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModuleProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, ModuleProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ModuleProgressClient<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ModuleProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleProgressFindFirstArgs} args - Arguments to find a ModuleProgress
     * @example
     * // Get one ModuleProgress
     * const moduleProgress = await prisma.moduleProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModuleProgressFindFirstArgs>(args?: SelectSubset<T, ModuleProgressFindFirstArgs<ExtArgs>>): Prisma__ModuleProgressClient<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ModuleProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleProgressFindFirstOrThrowArgs} args - Arguments to find a ModuleProgress
     * @example
     * // Get one ModuleProgress
     * const moduleProgress = await prisma.moduleProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModuleProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, ModuleProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__ModuleProgressClient<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ModuleProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ModuleProgresses
     * const moduleProgresses = await prisma.moduleProgress.findMany()
     * 
     * // Get first 10 ModuleProgresses
     * const moduleProgresses = await prisma.moduleProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moduleProgressWithIdOnly = await prisma.moduleProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ModuleProgressFindManyArgs>(args?: SelectSubset<T, ModuleProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ModuleProgress.
     * @param {ModuleProgressCreateArgs} args - Arguments to create a ModuleProgress.
     * @example
     * // Create one ModuleProgress
     * const ModuleProgress = await prisma.moduleProgress.create({
     *   data: {
     *     // ... data to create a ModuleProgress
     *   }
     * })
     * 
     */
    create<T extends ModuleProgressCreateArgs>(args: SelectSubset<T, ModuleProgressCreateArgs<ExtArgs>>): Prisma__ModuleProgressClient<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ModuleProgresses.
     * @param {ModuleProgressCreateManyArgs} args - Arguments to create many ModuleProgresses.
     * @example
     * // Create many ModuleProgresses
     * const moduleProgress = await prisma.moduleProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ModuleProgressCreateManyArgs>(args?: SelectSubset<T, ModuleProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ModuleProgresses and returns the data saved in the database.
     * @param {ModuleProgressCreateManyAndReturnArgs} args - Arguments to create many ModuleProgresses.
     * @example
     * // Create many ModuleProgresses
     * const moduleProgress = await prisma.moduleProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ModuleProgresses and only return the `id`
     * const moduleProgressWithIdOnly = await prisma.moduleProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ModuleProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, ModuleProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ModuleProgress.
     * @param {ModuleProgressDeleteArgs} args - Arguments to delete one ModuleProgress.
     * @example
     * // Delete one ModuleProgress
     * const ModuleProgress = await prisma.moduleProgress.delete({
     *   where: {
     *     // ... filter to delete one ModuleProgress
     *   }
     * })
     * 
     */
    delete<T extends ModuleProgressDeleteArgs>(args: SelectSubset<T, ModuleProgressDeleteArgs<ExtArgs>>): Prisma__ModuleProgressClient<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ModuleProgress.
     * @param {ModuleProgressUpdateArgs} args - Arguments to update one ModuleProgress.
     * @example
     * // Update one ModuleProgress
     * const moduleProgress = await prisma.moduleProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ModuleProgressUpdateArgs>(args: SelectSubset<T, ModuleProgressUpdateArgs<ExtArgs>>): Prisma__ModuleProgressClient<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ModuleProgresses.
     * @param {ModuleProgressDeleteManyArgs} args - Arguments to filter ModuleProgresses to delete.
     * @example
     * // Delete a few ModuleProgresses
     * const { count } = await prisma.moduleProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ModuleProgressDeleteManyArgs>(args?: SelectSubset<T, ModuleProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ModuleProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ModuleProgresses
     * const moduleProgress = await prisma.moduleProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ModuleProgressUpdateManyArgs>(args: SelectSubset<T, ModuleProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ModuleProgresses and returns the data updated in the database.
     * @param {ModuleProgressUpdateManyAndReturnArgs} args - Arguments to update many ModuleProgresses.
     * @example
     * // Update many ModuleProgresses
     * const moduleProgress = await prisma.moduleProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ModuleProgresses and only return the `id`
     * const moduleProgressWithIdOnly = await prisma.moduleProgress.updateManyAndReturn({
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
    updateManyAndReturn<T extends ModuleProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, ModuleProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ModuleProgress.
     * @param {ModuleProgressUpsertArgs} args - Arguments to update or create a ModuleProgress.
     * @example
     * // Update or create a ModuleProgress
     * const moduleProgress = await prisma.moduleProgress.upsert({
     *   create: {
     *     // ... data to create a ModuleProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ModuleProgress we want to update
     *   }
     * })
     */
    upsert<T extends ModuleProgressUpsertArgs>(args: SelectSubset<T, ModuleProgressUpsertArgs<ExtArgs>>): Prisma__ModuleProgressClient<$Result.GetResult<Prisma.$ModuleProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ModuleProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleProgressCountArgs} args - Arguments to filter ModuleProgresses to count.
     * @example
     * // Count the number of ModuleProgresses
     * const count = await prisma.moduleProgress.count({
     *   where: {
     *     // ... the filter for the ModuleProgresses we want to count
     *   }
     * })
    **/
    count<T extends ModuleProgressCountArgs>(
      args?: Subset<T, ModuleProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ModuleProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ModuleProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ModuleProgressAggregateArgs>(args: Subset<T, ModuleProgressAggregateArgs>): Prisma.PrismaPromise<GetModuleProgressAggregateType<T>>

    /**
     * Group by ModuleProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleProgressGroupByArgs} args - Group by arguments.
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
      T extends ModuleProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ModuleProgressGroupByArgs['orderBy'] }
        : { orderBy?: ModuleProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ModuleProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModuleProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ModuleProgress model
   */
  readonly fields: ModuleProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ModuleProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ModuleProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    module<T extends ModuleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ModuleDefaultArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ModuleProgress model
   */
  interface ModuleProgressFieldRefs {
    readonly id: FieldRef<"ModuleProgress", 'String'>
    readonly userId: FieldRef<"ModuleProgress", 'String'>
    readonly moduleId: FieldRef<"ModuleProgress", 'String'>
    readonly isCompleted: FieldRef<"ModuleProgress", 'Boolean'>
    readonly createdAt: FieldRef<"ModuleProgress", 'DateTime'>
    readonly updatedAt: FieldRef<"ModuleProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ModuleProgress findUnique
   */
  export type ModuleProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * Filter, which ModuleProgress to fetch.
     */
    where: ModuleProgressWhereUniqueInput
  }

  /**
   * ModuleProgress findUniqueOrThrow
   */
  export type ModuleProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * Filter, which ModuleProgress to fetch.
     */
    where: ModuleProgressWhereUniqueInput
  }

  /**
   * ModuleProgress findFirst
   */
  export type ModuleProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * Filter, which ModuleProgress to fetch.
     */
    where?: ModuleProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModuleProgresses to fetch.
     */
    orderBy?: ModuleProgressOrderByWithRelationInput | ModuleProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ModuleProgresses.
     */
    cursor?: ModuleProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModuleProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModuleProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModuleProgresses.
     */
    distinct?: ModuleProgressScalarFieldEnum | ModuleProgressScalarFieldEnum[]
  }

  /**
   * ModuleProgress findFirstOrThrow
   */
  export type ModuleProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * Filter, which ModuleProgress to fetch.
     */
    where?: ModuleProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModuleProgresses to fetch.
     */
    orderBy?: ModuleProgressOrderByWithRelationInput | ModuleProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ModuleProgresses.
     */
    cursor?: ModuleProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModuleProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModuleProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModuleProgresses.
     */
    distinct?: ModuleProgressScalarFieldEnum | ModuleProgressScalarFieldEnum[]
  }

  /**
   * ModuleProgress findMany
   */
  export type ModuleProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * Filter, which ModuleProgresses to fetch.
     */
    where?: ModuleProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModuleProgresses to fetch.
     */
    orderBy?: ModuleProgressOrderByWithRelationInput | ModuleProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ModuleProgresses.
     */
    cursor?: ModuleProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModuleProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModuleProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModuleProgresses.
     */
    distinct?: ModuleProgressScalarFieldEnum | ModuleProgressScalarFieldEnum[]
  }

  /**
   * ModuleProgress create
   */
  export type ModuleProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a ModuleProgress.
     */
    data: XOR<ModuleProgressCreateInput, ModuleProgressUncheckedCreateInput>
  }

  /**
   * ModuleProgress createMany
   */
  export type ModuleProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ModuleProgresses.
     */
    data: ModuleProgressCreateManyInput | ModuleProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ModuleProgress createManyAndReturn
   */
  export type ModuleProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * The data used to create many ModuleProgresses.
     */
    data: ModuleProgressCreateManyInput | ModuleProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ModuleProgress update
   */
  export type ModuleProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a ModuleProgress.
     */
    data: XOR<ModuleProgressUpdateInput, ModuleProgressUncheckedUpdateInput>
    /**
     * Choose, which ModuleProgress to update.
     */
    where: ModuleProgressWhereUniqueInput
  }

  /**
   * ModuleProgress updateMany
   */
  export type ModuleProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ModuleProgresses.
     */
    data: XOR<ModuleProgressUpdateManyMutationInput, ModuleProgressUncheckedUpdateManyInput>
    /**
     * Filter which ModuleProgresses to update
     */
    where?: ModuleProgressWhereInput
    /**
     * Limit how many ModuleProgresses to update.
     */
    limit?: number
  }

  /**
   * ModuleProgress updateManyAndReturn
   */
  export type ModuleProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * The data used to update ModuleProgresses.
     */
    data: XOR<ModuleProgressUpdateManyMutationInput, ModuleProgressUncheckedUpdateManyInput>
    /**
     * Filter which ModuleProgresses to update
     */
    where?: ModuleProgressWhereInput
    /**
     * Limit how many ModuleProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ModuleProgress upsert
   */
  export type ModuleProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the ModuleProgress to update in case it exists.
     */
    where: ModuleProgressWhereUniqueInput
    /**
     * In case the ModuleProgress found by the `where` argument doesn't exist, create a new ModuleProgress with this data.
     */
    create: XOR<ModuleProgressCreateInput, ModuleProgressUncheckedCreateInput>
    /**
     * In case the ModuleProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ModuleProgressUpdateInput, ModuleProgressUncheckedUpdateInput>
  }

  /**
   * ModuleProgress delete
   */
  export type ModuleProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
    /**
     * Filter which ModuleProgress to delete.
     */
    where: ModuleProgressWhereUniqueInput
  }

  /**
   * ModuleProgress deleteMany
   */
  export type ModuleProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ModuleProgresses to delete
     */
    where?: ModuleProgressWhereInput
    /**
     * Limit how many ModuleProgresses to delete.
     */
    limit?: number
  }

  /**
   * ModuleProgress without action
   */
  export type ModuleProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleProgress
     */
    select?: ModuleProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModuleProgress
     */
    omit?: ModuleProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleProgressInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    refresh_token_expires_in: 'refresh_token_expires_in',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SubjectScalarFieldEnum: {
    id: 'id',
    code: 'code',
    title: 'title',
    description: 'description',
    instructor: 'instructor',
    credits: 'credits',
    semester: 'semester',
    coverColor: 'coverColor',
    totalModules: 'totalModules',
    totalTopics: 'totalTopics',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubjectScalarFieldEnum = (typeof SubjectScalarFieldEnum)[keyof typeof SubjectScalarFieldEnum]


  export const ModuleScalarFieldEnum: {
    id: 'id',
    subjectId: 'subjectId',
    order: 'order',
    title: 'title',
    description: 'description',
    isLocked: 'isLocked',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum]


  export const TopicScalarFieldEnum: {
    id: 'id',
    moduleId: 'moduleId',
    order: 'order',
    title: 'title',
    type: 'type',
    durationMinutes: 'durationMinutes',
    videoId: 'videoId',
    ebookContent: 'ebookContent',
    simulationUrl: 'simulationUrl',
    assignmentDescription: 'assignmentDescription',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TopicScalarFieldEnum = (typeof TopicScalarFieldEnum)[keyof typeof TopicScalarFieldEnum]


  export const FileMaterialScalarFieldEnum: {
    id: 'id',
    topicId: 'topicId',
    googleDriveFileId: 'googleDriveFileId',
    webContentLink: 'webContentLink',
    mimeType: 'mimeType',
    fileName: 'fileName',
    createdAt: 'createdAt'
  };

  export type FileMaterialScalarFieldEnum = (typeof FileMaterialScalarFieldEnum)[keyof typeof FileMaterialScalarFieldEnum]


  export const QuizQuestionScalarFieldEnum: {
    id: 'id',
    topicId: 'topicId',
    question: 'question',
    options: 'options',
    correctIndex: 'correctIndex',
    explanation: 'explanation'
  };

  export type QuizQuestionScalarFieldEnum = (typeof QuizQuestionScalarFieldEnum)[keyof typeof QuizQuestionScalarFieldEnum]


  export const TopicProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    topicId: 'topicId',
    isCompleted: 'isCompleted',
    quizScore: 'quizScore',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TopicProgressScalarFieldEnum = (typeof TopicProgressScalarFieldEnum)[keyof typeof TopicProgressScalarFieldEnum]


  export const ModuleProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    moduleId: 'moduleId',
    isCompleted: 'isCompleted',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ModuleProgressScalarFieldEnum = (typeof ModuleProgressScalarFieldEnum)[keyof typeof ModuleProgressScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    topicProgress?: TopicProgressListRelationFilter
    moduleProgress?: ModuleProgressListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    topicProgress?: TopicProgressOrderByRelationAggregateInput
    moduleProgress?: ModuleProgressOrderByRelationAggregateInput
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
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    topicProgress?: TopicProgressListRelationFilter
    moduleProgress?: ModuleProgressListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
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
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    refresh_token_expires_in?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    refresh_token_expires_in?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    refresh_token_expires_in?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    refresh_token_expires_in?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    refresh_token_expires_in?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SubjectWhereInput = {
    AND?: SubjectWhereInput | SubjectWhereInput[]
    OR?: SubjectWhereInput[]
    NOT?: SubjectWhereInput | SubjectWhereInput[]
    id?: StringFilter<"Subject"> | string
    code?: StringFilter<"Subject"> | string
    title?: StringFilter<"Subject"> | string
    description?: StringFilter<"Subject"> | string
    instructor?: StringFilter<"Subject"> | string
    credits?: IntFilter<"Subject"> | number
    semester?: IntFilter<"Subject"> | number
    coverColor?: StringFilter<"Subject"> | string
    totalModules?: IntFilter<"Subject"> | number
    totalTopics?: IntFilter<"Subject"> | number
    createdAt?: DateTimeFilter<"Subject"> | Date | string
    updatedAt?: DateTimeFilter<"Subject"> | Date | string
    modules?: ModuleListRelationFilter
  }

  export type SubjectOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    title?: SortOrder
    description?: SortOrder
    instructor?: SortOrder
    credits?: SortOrder
    semester?: SortOrder
    coverColor?: SortOrder
    totalModules?: SortOrder
    totalTopics?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    modules?: ModuleOrderByRelationAggregateInput
  }

  export type SubjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: SubjectWhereInput | SubjectWhereInput[]
    OR?: SubjectWhereInput[]
    NOT?: SubjectWhereInput | SubjectWhereInput[]
    title?: StringFilter<"Subject"> | string
    description?: StringFilter<"Subject"> | string
    instructor?: StringFilter<"Subject"> | string
    credits?: IntFilter<"Subject"> | number
    semester?: IntFilter<"Subject"> | number
    coverColor?: StringFilter<"Subject"> | string
    totalModules?: IntFilter<"Subject"> | number
    totalTopics?: IntFilter<"Subject"> | number
    createdAt?: DateTimeFilter<"Subject"> | Date | string
    updatedAt?: DateTimeFilter<"Subject"> | Date | string
    modules?: ModuleListRelationFilter
  }, "id" | "code">

  export type SubjectOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    title?: SortOrder
    description?: SortOrder
    instructor?: SortOrder
    credits?: SortOrder
    semester?: SortOrder
    coverColor?: SortOrder
    totalModules?: SortOrder
    totalTopics?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubjectCountOrderByAggregateInput
    _avg?: SubjectAvgOrderByAggregateInput
    _max?: SubjectMaxOrderByAggregateInput
    _min?: SubjectMinOrderByAggregateInput
    _sum?: SubjectSumOrderByAggregateInput
  }

  export type SubjectScalarWhereWithAggregatesInput = {
    AND?: SubjectScalarWhereWithAggregatesInput | SubjectScalarWhereWithAggregatesInput[]
    OR?: SubjectScalarWhereWithAggregatesInput[]
    NOT?: SubjectScalarWhereWithAggregatesInput | SubjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subject"> | string
    code?: StringWithAggregatesFilter<"Subject"> | string
    title?: StringWithAggregatesFilter<"Subject"> | string
    description?: StringWithAggregatesFilter<"Subject"> | string
    instructor?: StringWithAggregatesFilter<"Subject"> | string
    credits?: IntWithAggregatesFilter<"Subject"> | number
    semester?: IntWithAggregatesFilter<"Subject"> | number
    coverColor?: StringWithAggregatesFilter<"Subject"> | string
    totalModules?: IntWithAggregatesFilter<"Subject"> | number
    totalTopics?: IntWithAggregatesFilter<"Subject"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Subject"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Subject"> | Date | string
  }

  export type ModuleWhereInput = {
    AND?: ModuleWhereInput | ModuleWhereInput[]
    OR?: ModuleWhereInput[]
    NOT?: ModuleWhereInput | ModuleWhereInput[]
    id?: StringFilter<"Module"> | string
    subjectId?: StringFilter<"Module"> | string
    order?: IntFilter<"Module"> | number
    title?: StringFilter<"Module"> | string
    description?: StringFilter<"Module"> | string
    isLocked?: BoolFilter<"Module"> | boolean
    createdAt?: DateTimeFilter<"Module"> | Date | string
    updatedAt?: DateTimeFilter<"Module"> | Date | string
    subject?: XOR<SubjectScalarRelationFilter, SubjectWhereInput>
    topics?: TopicListRelationFilter
    studentProgress?: ModuleProgressListRelationFilter
  }

  export type ModuleOrderByWithRelationInput = {
    id?: SortOrder
    subjectId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isLocked?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subject?: SubjectOrderByWithRelationInput
    topics?: TopicOrderByRelationAggregateInput
    studentProgress?: ModuleProgressOrderByRelationAggregateInput
  }

  export type ModuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ModuleWhereInput | ModuleWhereInput[]
    OR?: ModuleWhereInput[]
    NOT?: ModuleWhereInput | ModuleWhereInput[]
    subjectId?: StringFilter<"Module"> | string
    order?: IntFilter<"Module"> | number
    title?: StringFilter<"Module"> | string
    description?: StringFilter<"Module"> | string
    isLocked?: BoolFilter<"Module"> | boolean
    createdAt?: DateTimeFilter<"Module"> | Date | string
    updatedAt?: DateTimeFilter<"Module"> | Date | string
    subject?: XOR<SubjectScalarRelationFilter, SubjectWhereInput>
    topics?: TopicListRelationFilter
    studentProgress?: ModuleProgressListRelationFilter
  }, "id">

  export type ModuleOrderByWithAggregationInput = {
    id?: SortOrder
    subjectId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isLocked?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ModuleCountOrderByAggregateInput
    _avg?: ModuleAvgOrderByAggregateInput
    _max?: ModuleMaxOrderByAggregateInput
    _min?: ModuleMinOrderByAggregateInput
    _sum?: ModuleSumOrderByAggregateInput
  }

  export type ModuleScalarWhereWithAggregatesInput = {
    AND?: ModuleScalarWhereWithAggregatesInput | ModuleScalarWhereWithAggregatesInput[]
    OR?: ModuleScalarWhereWithAggregatesInput[]
    NOT?: ModuleScalarWhereWithAggregatesInput | ModuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Module"> | string
    subjectId?: StringWithAggregatesFilter<"Module"> | string
    order?: IntWithAggregatesFilter<"Module"> | number
    title?: StringWithAggregatesFilter<"Module"> | string
    description?: StringWithAggregatesFilter<"Module"> | string
    isLocked?: BoolWithAggregatesFilter<"Module"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Module"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Module"> | Date | string
  }

  export type TopicWhereInput = {
    AND?: TopicWhereInput | TopicWhereInput[]
    OR?: TopicWhereInput[]
    NOT?: TopicWhereInput | TopicWhereInput[]
    id?: StringFilter<"Topic"> | string
    moduleId?: StringFilter<"Topic"> | string
    order?: IntFilter<"Topic"> | number
    title?: StringFilter<"Topic"> | string
    type?: StringFilter<"Topic"> | string
    durationMinutes?: IntFilter<"Topic"> | number
    videoId?: StringNullableFilter<"Topic"> | string | null
    ebookContent?: StringNullableFilter<"Topic"> | string | null
    simulationUrl?: StringNullableFilter<"Topic"> | string | null
    assignmentDescription?: StringNullableFilter<"Topic"> | string | null
    createdAt?: DateTimeFilter<"Topic"> | Date | string
    updatedAt?: DateTimeFilter<"Topic"> | Date | string
    module?: XOR<ModuleScalarRelationFilter, ModuleWhereInput>
    quizQuestions?: QuizQuestionListRelationFilter
    fileMaterials?: FileMaterialListRelationFilter
    studentProgress?: TopicProgressListRelationFilter
  }

  export type TopicOrderByWithRelationInput = {
    id?: SortOrder
    moduleId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    type?: SortOrder
    durationMinutes?: SortOrder
    videoId?: SortOrderInput | SortOrder
    ebookContent?: SortOrderInput | SortOrder
    simulationUrl?: SortOrderInput | SortOrder
    assignmentDescription?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    module?: ModuleOrderByWithRelationInput
    quizQuestions?: QuizQuestionOrderByRelationAggregateInput
    fileMaterials?: FileMaterialOrderByRelationAggregateInput
    studentProgress?: TopicProgressOrderByRelationAggregateInput
  }

  export type TopicWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TopicWhereInput | TopicWhereInput[]
    OR?: TopicWhereInput[]
    NOT?: TopicWhereInput | TopicWhereInput[]
    moduleId?: StringFilter<"Topic"> | string
    order?: IntFilter<"Topic"> | number
    title?: StringFilter<"Topic"> | string
    type?: StringFilter<"Topic"> | string
    durationMinutes?: IntFilter<"Topic"> | number
    videoId?: StringNullableFilter<"Topic"> | string | null
    ebookContent?: StringNullableFilter<"Topic"> | string | null
    simulationUrl?: StringNullableFilter<"Topic"> | string | null
    assignmentDescription?: StringNullableFilter<"Topic"> | string | null
    createdAt?: DateTimeFilter<"Topic"> | Date | string
    updatedAt?: DateTimeFilter<"Topic"> | Date | string
    module?: XOR<ModuleScalarRelationFilter, ModuleWhereInput>
    quizQuestions?: QuizQuestionListRelationFilter
    fileMaterials?: FileMaterialListRelationFilter
    studentProgress?: TopicProgressListRelationFilter
  }, "id">

  export type TopicOrderByWithAggregationInput = {
    id?: SortOrder
    moduleId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    type?: SortOrder
    durationMinutes?: SortOrder
    videoId?: SortOrderInput | SortOrder
    ebookContent?: SortOrderInput | SortOrder
    simulationUrl?: SortOrderInput | SortOrder
    assignmentDescription?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TopicCountOrderByAggregateInput
    _avg?: TopicAvgOrderByAggregateInput
    _max?: TopicMaxOrderByAggregateInput
    _min?: TopicMinOrderByAggregateInput
    _sum?: TopicSumOrderByAggregateInput
  }

  export type TopicScalarWhereWithAggregatesInput = {
    AND?: TopicScalarWhereWithAggregatesInput | TopicScalarWhereWithAggregatesInput[]
    OR?: TopicScalarWhereWithAggregatesInput[]
    NOT?: TopicScalarWhereWithAggregatesInput | TopicScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Topic"> | string
    moduleId?: StringWithAggregatesFilter<"Topic"> | string
    order?: IntWithAggregatesFilter<"Topic"> | number
    title?: StringWithAggregatesFilter<"Topic"> | string
    type?: StringWithAggregatesFilter<"Topic"> | string
    durationMinutes?: IntWithAggregatesFilter<"Topic"> | number
    videoId?: StringNullableWithAggregatesFilter<"Topic"> | string | null
    ebookContent?: StringNullableWithAggregatesFilter<"Topic"> | string | null
    simulationUrl?: StringNullableWithAggregatesFilter<"Topic"> | string | null
    assignmentDescription?: StringNullableWithAggregatesFilter<"Topic"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Topic"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Topic"> | Date | string
  }

  export type FileMaterialWhereInput = {
    AND?: FileMaterialWhereInput | FileMaterialWhereInput[]
    OR?: FileMaterialWhereInput[]
    NOT?: FileMaterialWhereInput | FileMaterialWhereInput[]
    id?: StringFilter<"FileMaterial"> | string
    topicId?: StringFilter<"FileMaterial"> | string
    googleDriveFileId?: StringFilter<"FileMaterial"> | string
    webContentLink?: StringNullableFilter<"FileMaterial"> | string | null
    mimeType?: StringNullableFilter<"FileMaterial"> | string | null
    fileName?: StringFilter<"FileMaterial"> | string
    createdAt?: DateTimeFilter<"FileMaterial"> | Date | string
    topic?: XOR<TopicScalarRelationFilter, TopicWhereInput>
  }

  export type FileMaterialOrderByWithRelationInput = {
    id?: SortOrder
    topicId?: SortOrder
    googleDriveFileId?: SortOrder
    webContentLink?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    fileName?: SortOrder
    createdAt?: SortOrder
    topic?: TopicOrderByWithRelationInput
  }

  export type FileMaterialWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileMaterialWhereInput | FileMaterialWhereInput[]
    OR?: FileMaterialWhereInput[]
    NOT?: FileMaterialWhereInput | FileMaterialWhereInput[]
    topicId?: StringFilter<"FileMaterial"> | string
    googleDriveFileId?: StringFilter<"FileMaterial"> | string
    webContentLink?: StringNullableFilter<"FileMaterial"> | string | null
    mimeType?: StringNullableFilter<"FileMaterial"> | string | null
    fileName?: StringFilter<"FileMaterial"> | string
    createdAt?: DateTimeFilter<"FileMaterial"> | Date | string
    topic?: XOR<TopicScalarRelationFilter, TopicWhereInput>
  }, "id">

  export type FileMaterialOrderByWithAggregationInput = {
    id?: SortOrder
    topicId?: SortOrder
    googleDriveFileId?: SortOrder
    webContentLink?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    fileName?: SortOrder
    createdAt?: SortOrder
    _count?: FileMaterialCountOrderByAggregateInput
    _max?: FileMaterialMaxOrderByAggregateInput
    _min?: FileMaterialMinOrderByAggregateInput
  }

  export type FileMaterialScalarWhereWithAggregatesInput = {
    AND?: FileMaterialScalarWhereWithAggregatesInput | FileMaterialScalarWhereWithAggregatesInput[]
    OR?: FileMaterialScalarWhereWithAggregatesInput[]
    NOT?: FileMaterialScalarWhereWithAggregatesInput | FileMaterialScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileMaterial"> | string
    topicId?: StringWithAggregatesFilter<"FileMaterial"> | string
    googleDriveFileId?: StringWithAggregatesFilter<"FileMaterial"> | string
    webContentLink?: StringNullableWithAggregatesFilter<"FileMaterial"> | string | null
    mimeType?: StringNullableWithAggregatesFilter<"FileMaterial"> | string | null
    fileName?: StringWithAggregatesFilter<"FileMaterial"> | string
    createdAt?: DateTimeWithAggregatesFilter<"FileMaterial"> | Date | string
  }

  export type QuizQuestionWhereInput = {
    AND?: QuizQuestionWhereInput | QuizQuestionWhereInput[]
    OR?: QuizQuestionWhereInput[]
    NOT?: QuizQuestionWhereInput | QuizQuestionWhereInput[]
    id?: StringFilter<"QuizQuestion"> | string
    topicId?: StringFilter<"QuizQuestion"> | string
    question?: StringFilter<"QuizQuestion"> | string
    options?: StringNullableListFilter<"QuizQuestion">
    correctIndex?: IntFilter<"QuizQuestion"> | number
    explanation?: StringFilter<"QuizQuestion"> | string
    topic?: XOR<TopicScalarRelationFilter, TopicWhereInput>
  }

  export type QuizQuestionOrderByWithRelationInput = {
    id?: SortOrder
    topicId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
    topic?: TopicOrderByWithRelationInput
  }

  export type QuizQuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuizQuestionWhereInput | QuizQuestionWhereInput[]
    OR?: QuizQuestionWhereInput[]
    NOT?: QuizQuestionWhereInput | QuizQuestionWhereInput[]
    topicId?: StringFilter<"QuizQuestion"> | string
    question?: StringFilter<"QuizQuestion"> | string
    options?: StringNullableListFilter<"QuizQuestion">
    correctIndex?: IntFilter<"QuizQuestion"> | number
    explanation?: StringFilter<"QuizQuestion"> | string
    topic?: XOR<TopicScalarRelationFilter, TopicWhereInput>
  }, "id">

  export type QuizQuestionOrderByWithAggregationInput = {
    id?: SortOrder
    topicId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
    _count?: QuizQuestionCountOrderByAggregateInput
    _avg?: QuizQuestionAvgOrderByAggregateInput
    _max?: QuizQuestionMaxOrderByAggregateInput
    _min?: QuizQuestionMinOrderByAggregateInput
    _sum?: QuizQuestionSumOrderByAggregateInput
  }

  export type QuizQuestionScalarWhereWithAggregatesInput = {
    AND?: QuizQuestionScalarWhereWithAggregatesInput | QuizQuestionScalarWhereWithAggregatesInput[]
    OR?: QuizQuestionScalarWhereWithAggregatesInput[]
    NOT?: QuizQuestionScalarWhereWithAggregatesInput | QuizQuestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuizQuestion"> | string
    topicId?: StringWithAggregatesFilter<"QuizQuestion"> | string
    question?: StringWithAggregatesFilter<"QuizQuestion"> | string
    options?: StringNullableListFilter<"QuizQuestion">
    correctIndex?: IntWithAggregatesFilter<"QuizQuestion"> | number
    explanation?: StringWithAggregatesFilter<"QuizQuestion"> | string
  }

  export type TopicProgressWhereInput = {
    AND?: TopicProgressWhereInput | TopicProgressWhereInput[]
    OR?: TopicProgressWhereInput[]
    NOT?: TopicProgressWhereInput | TopicProgressWhereInput[]
    id?: StringFilter<"TopicProgress"> | string
    userId?: StringFilter<"TopicProgress"> | string
    topicId?: StringFilter<"TopicProgress"> | string
    isCompleted?: BoolFilter<"TopicProgress"> | boolean
    quizScore?: IntNullableFilter<"TopicProgress"> | number | null
    createdAt?: DateTimeFilter<"TopicProgress"> | Date | string
    updatedAt?: DateTimeFilter<"TopicProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    topic?: XOR<TopicScalarRelationFilter, TopicWhereInput>
  }

  export type TopicProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    isCompleted?: SortOrder
    quizScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    topic?: TopicOrderByWithRelationInput
  }

  export type TopicProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_topicId?: TopicProgressUserIdTopicIdCompoundUniqueInput
    AND?: TopicProgressWhereInput | TopicProgressWhereInput[]
    OR?: TopicProgressWhereInput[]
    NOT?: TopicProgressWhereInput | TopicProgressWhereInput[]
    userId?: StringFilter<"TopicProgress"> | string
    topicId?: StringFilter<"TopicProgress"> | string
    isCompleted?: BoolFilter<"TopicProgress"> | boolean
    quizScore?: IntNullableFilter<"TopicProgress"> | number | null
    createdAt?: DateTimeFilter<"TopicProgress"> | Date | string
    updatedAt?: DateTimeFilter<"TopicProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    topic?: XOR<TopicScalarRelationFilter, TopicWhereInput>
  }, "id" | "userId_topicId">

  export type TopicProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    isCompleted?: SortOrder
    quizScore?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TopicProgressCountOrderByAggregateInput
    _avg?: TopicProgressAvgOrderByAggregateInput
    _max?: TopicProgressMaxOrderByAggregateInput
    _min?: TopicProgressMinOrderByAggregateInput
    _sum?: TopicProgressSumOrderByAggregateInput
  }

  export type TopicProgressScalarWhereWithAggregatesInput = {
    AND?: TopicProgressScalarWhereWithAggregatesInput | TopicProgressScalarWhereWithAggregatesInput[]
    OR?: TopicProgressScalarWhereWithAggregatesInput[]
    NOT?: TopicProgressScalarWhereWithAggregatesInput | TopicProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TopicProgress"> | string
    userId?: StringWithAggregatesFilter<"TopicProgress"> | string
    topicId?: StringWithAggregatesFilter<"TopicProgress"> | string
    isCompleted?: BoolWithAggregatesFilter<"TopicProgress"> | boolean
    quizScore?: IntNullableWithAggregatesFilter<"TopicProgress"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"TopicProgress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TopicProgress"> | Date | string
  }

  export type ModuleProgressWhereInput = {
    AND?: ModuleProgressWhereInput | ModuleProgressWhereInput[]
    OR?: ModuleProgressWhereInput[]
    NOT?: ModuleProgressWhereInput | ModuleProgressWhereInput[]
    id?: StringFilter<"ModuleProgress"> | string
    userId?: StringFilter<"ModuleProgress"> | string
    moduleId?: StringFilter<"ModuleProgress"> | string
    isCompleted?: BoolFilter<"ModuleProgress"> | boolean
    createdAt?: DateTimeFilter<"ModuleProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ModuleProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    module?: XOR<ModuleScalarRelationFilter, ModuleWhereInput>
  }

  export type ModuleProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    moduleId?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    module?: ModuleOrderByWithRelationInput
  }

  export type ModuleProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_moduleId?: ModuleProgressUserIdModuleIdCompoundUniqueInput
    AND?: ModuleProgressWhereInput | ModuleProgressWhereInput[]
    OR?: ModuleProgressWhereInput[]
    NOT?: ModuleProgressWhereInput | ModuleProgressWhereInput[]
    userId?: StringFilter<"ModuleProgress"> | string
    moduleId?: StringFilter<"ModuleProgress"> | string
    isCompleted?: BoolFilter<"ModuleProgress"> | boolean
    createdAt?: DateTimeFilter<"ModuleProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ModuleProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    module?: XOR<ModuleScalarRelationFilter, ModuleWhereInput>
  }, "id" | "userId_moduleId">

  export type ModuleProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    moduleId?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ModuleProgressCountOrderByAggregateInput
    _max?: ModuleProgressMaxOrderByAggregateInput
    _min?: ModuleProgressMinOrderByAggregateInput
  }

  export type ModuleProgressScalarWhereWithAggregatesInput = {
    AND?: ModuleProgressScalarWhereWithAggregatesInput | ModuleProgressScalarWhereWithAggregatesInput[]
    OR?: ModuleProgressScalarWhereWithAggregatesInput[]
    NOT?: ModuleProgressScalarWhereWithAggregatesInput | ModuleProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ModuleProgress"> | string
    userId?: StringWithAggregatesFilter<"ModuleProgress"> | string
    moduleId?: StringWithAggregatesFilter<"ModuleProgress"> | string
    isCompleted?: BoolWithAggregatesFilter<"ModuleProgress"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ModuleProgress"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ModuleProgress"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    topicProgress?: TopicProgressCreateNestedManyWithoutUserInput
    moduleProgress?: ModuleProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    topicProgress?: TopicProgressUncheckedCreateNestedManyWithoutUserInput
    moduleProgress?: ModuleProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    topicProgress?: TopicProgressUpdateManyWithoutUserNestedInput
    moduleProgress?: ModuleProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    topicProgress?: TopicProgressUncheckedUpdateManyWithoutUserNestedInput
    moduleProgress?: ModuleProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    refresh_token_expires_in?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    refresh_token_expires_in?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    refresh_token_expires_in?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    refresh_token_expires_in?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    refresh_token_expires_in?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    refresh_token_expires_in?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    refresh_token_expires_in?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubjectCreateInput = {
    id?: string
    code: string
    title: string
    description: string
    instructor: string
    credits: number
    semester: number
    coverColor: string
    totalModules?: number
    totalTopics?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    modules?: ModuleCreateNestedManyWithoutSubjectInput
  }

  export type SubjectUncheckedCreateInput = {
    id?: string
    code: string
    title: string
    description: string
    instructor: string
    credits: number
    semester: number
    coverColor: string
    totalModules?: number
    totalTopics?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    modules?: ModuleUncheckedCreateNestedManyWithoutSubjectInput
  }

  export type SubjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructor?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    semester?: IntFieldUpdateOperationsInput | number
    coverColor?: StringFieldUpdateOperationsInput | string
    totalModules?: IntFieldUpdateOperationsInput | number
    totalTopics?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modules?: ModuleUpdateManyWithoutSubjectNestedInput
  }

  export type SubjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructor?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    semester?: IntFieldUpdateOperationsInput | number
    coverColor?: StringFieldUpdateOperationsInput | string
    totalModules?: IntFieldUpdateOperationsInput | number
    totalTopics?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    modules?: ModuleUncheckedUpdateManyWithoutSubjectNestedInput
  }

  export type SubjectCreateManyInput = {
    id?: string
    code: string
    title: string
    description: string
    instructor: string
    credits: number
    semester: number
    coverColor: string
    totalModules?: number
    totalTopics?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructor?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    semester?: IntFieldUpdateOperationsInput | number
    coverColor?: StringFieldUpdateOperationsInput | string
    totalModules?: IntFieldUpdateOperationsInput | number
    totalTopics?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructor?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    semester?: IntFieldUpdateOperationsInput | number
    coverColor?: StringFieldUpdateOperationsInput | string
    totalModules?: IntFieldUpdateOperationsInput | number
    totalTopics?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleCreateInput = {
    id?: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subject: SubjectCreateNestedOneWithoutModulesInput
    topics?: TopicCreateNestedManyWithoutModuleInput
    studentProgress?: ModuleProgressCreateNestedManyWithoutModuleInput
  }

  export type ModuleUncheckedCreateInput = {
    id?: string
    subjectId: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    topics?: TopicUncheckedCreateNestedManyWithoutModuleInput
    studentProgress?: ModuleProgressUncheckedCreateNestedManyWithoutModuleInput
  }

  export type ModuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subject?: SubjectUpdateOneRequiredWithoutModulesNestedInput
    topics?: TopicUpdateManyWithoutModuleNestedInput
    studentProgress?: ModuleProgressUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topics?: TopicUncheckedUpdateManyWithoutModuleNestedInput
    studentProgress?: ModuleProgressUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type ModuleCreateManyInput = {
    id?: string
    subjectId: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicCreateInput = {
    id?: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    module: ModuleCreateNestedOneWithoutTopicsInput
    quizQuestions?: QuizQuestionCreateNestedManyWithoutTopicInput
    fileMaterials?: FileMaterialCreateNestedManyWithoutTopicInput
    studentProgress?: TopicProgressCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateInput = {
    id?: string
    moduleId: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    quizQuestions?: QuizQuestionUncheckedCreateNestedManyWithoutTopicInput
    fileMaterials?: FileMaterialUncheckedCreateNestedManyWithoutTopicInput
    studentProgress?: TopicProgressUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    module?: ModuleUpdateOneRequiredWithoutTopicsNestedInput
    quizQuestions?: QuizQuestionUpdateManyWithoutTopicNestedInput
    fileMaterials?: FileMaterialUpdateManyWithoutTopicNestedInput
    studentProgress?: TopicProgressUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizQuestions?: QuizQuestionUncheckedUpdateManyWithoutTopicNestedInput
    fileMaterials?: FileMaterialUncheckedUpdateManyWithoutTopicNestedInput
    studentProgress?: TopicProgressUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicCreateManyInput = {
    id?: string
    moduleId: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileMaterialCreateInput = {
    id?: string
    googleDriveFileId: string
    webContentLink?: string | null
    mimeType?: string | null
    fileName: string
    createdAt?: Date | string
    topic: TopicCreateNestedOneWithoutFileMaterialsInput
  }

  export type FileMaterialUncheckedCreateInput = {
    id?: string
    topicId: string
    googleDriveFileId: string
    webContentLink?: string | null
    mimeType?: string | null
    fileName: string
    createdAt?: Date | string
  }

  export type FileMaterialUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    googleDriveFileId?: StringFieldUpdateOperationsInput | string
    webContentLink?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topic?: TopicUpdateOneRequiredWithoutFileMaterialsNestedInput
  }

  export type FileMaterialUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    googleDriveFileId?: StringFieldUpdateOperationsInput | string
    webContentLink?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileMaterialCreateManyInput = {
    id?: string
    topicId: string
    googleDriveFileId: string
    webContentLink?: string | null
    mimeType?: string | null
    fileName: string
    createdAt?: Date | string
  }

  export type FileMaterialUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    googleDriveFileId?: StringFieldUpdateOperationsInput | string
    webContentLink?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileMaterialUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    googleDriveFileId?: StringFieldUpdateOperationsInput | string
    webContentLink?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizQuestionCreateInput = {
    id?: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
    topic: TopicCreateNestedOneWithoutQuizQuestionsInput
  }

  export type QuizQuestionUncheckedCreateInput = {
    id?: string
    topicId: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
  }

  export type QuizQuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    topic?: TopicUpdateOneRequiredWithoutQuizQuestionsNestedInput
  }

  export type QuizQuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
  }

  export type QuizQuestionCreateManyInput = {
    id?: string
    topicId: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
  }

  export type QuizQuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
  }

  export type QuizQuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
  }

  export type TopicProgressCreateInput = {
    id?: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTopicProgressInput
    topic: TopicCreateNestedOneWithoutStudentProgressInput
  }

  export type TopicProgressUncheckedCreateInput = {
    id?: string
    userId: string
    topicId: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTopicProgressNestedInput
    topic?: TopicUpdateOneRequiredWithoutStudentProgressNestedInput
  }

  export type TopicProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicProgressCreateManyInput = {
    id?: string
    userId: string
    topicId: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleProgressCreateInput = {
    id?: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutModuleProgressInput
    module: ModuleCreateNestedOneWithoutStudentProgressInput
  }

  export type ModuleProgressUncheckedCreateInput = {
    id?: string
    userId: string
    moduleId: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModuleProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutModuleProgressNestedInput
    module?: ModuleUpdateOneRequiredWithoutStudentProgressNestedInput
  }

  export type ModuleProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleProgressCreateManyInput = {
    id?: string
    userId: string
    moduleId: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModuleProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type TopicProgressListRelationFilter = {
    every?: TopicProgressWhereInput
    some?: TopicProgressWhereInput
    none?: TopicProgressWhereInput
  }

  export type ModuleProgressListRelationFilter = {
    every?: ModuleProgressWhereInput
    some?: ModuleProgressWhereInput
    none?: ModuleProgressWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TopicProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ModuleProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    refresh_token_expires_in?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
    refresh_token_expires_in?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    refresh_token_expires_in?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    refresh_token_expires_in?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
    refresh_token_expires_in?: SortOrder
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

  export type ModuleListRelationFilter = {
    every?: ModuleWhereInput
    some?: ModuleWhereInput
    none?: ModuleWhereInput
  }

  export type ModuleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubjectCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    title?: SortOrder
    description?: SortOrder
    instructor?: SortOrder
    credits?: SortOrder
    semester?: SortOrder
    coverColor?: SortOrder
    totalModules?: SortOrder
    totalTopics?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubjectAvgOrderByAggregateInput = {
    credits?: SortOrder
    semester?: SortOrder
    totalModules?: SortOrder
    totalTopics?: SortOrder
  }

  export type SubjectMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    title?: SortOrder
    description?: SortOrder
    instructor?: SortOrder
    credits?: SortOrder
    semester?: SortOrder
    coverColor?: SortOrder
    totalModules?: SortOrder
    totalTopics?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubjectMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    title?: SortOrder
    description?: SortOrder
    instructor?: SortOrder
    credits?: SortOrder
    semester?: SortOrder
    coverColor?: SortOrder
    totalModules?: SortOrder
    totalTopics?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubjectSumOrderByAggregateInput = {
    credits?: SortOrder
    semester?: SortOrder
    totalModules?: SortOrder
    totalTopics?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SubjectScalarRelationFilter = {
    is?: SubjectWhereInput
    isNot?: SubjectWhereInput
  }

  export type TopicListRelationFilter = {
    every?: TopicWhereInput
    some?: TopicWhereInput
    none?: TopicWhereInput
  }

  export type TopicOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ModuleCountOrderByAggregateInput = {
    id?: SortOrder
    subjectId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isLocked?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ModuleAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type ModuleMaxOrderByAggregateInput = {
    id?: SortOrder
    subjectId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isLocked?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ModuleMinOrderByAggregateInput = {
    id?: SortOrder
    subjectId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isLocked?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ModuleSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ModuleScalarRelationFilter = {
    is?: ModuleWhereInput
    isNot?: ModuleWhereInput
  }

  export type QuizQuestionListRelationFilter = {
    every?: QuizQuestionWhereInput
    some?: QuizQuestionWhereInput
    none?: QuizQuestionWhereInput
  }

  export type FileMaterialListRelationFilter = {
    every?: FileMaterialWhereInput
    some?: FileMaterialWhereInput
    none?: FileMaterialWhereInput
  }

  export type QuizQuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileMaterialOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TopicCountOrderByAggregateInput = {
    id?: SortOrder
    moduleId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    type?: SortOrder
    durationMinutes?: SortOrder
    videoId?: SortOrder
    ebookContent?: SortOrder
    simulationUrl?: SortOrder
    assignmentDescription?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicAvgOrderByAggregateInput = {
    order?: SortOrder
    durationMinutes?: SortOrder
  }

  export type TopicMaxOrderByAggregateInput = {
    id?: SortOrder
    moduleId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    type?: SortOrder
    durationMinutes?: SortOrder
    videoId?: SortOrder
    ebookContent?: SortOrder
    simulationUrl?: SortOrder
    assignmentDescription?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicMinOrderByAggregateInput = {
    id?: SortOrder
    moduleId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    type?: SortOrder
    durationMinutes?: SortOrder
    videoId?: SortOrder
    ebookContent?: SortOrder
    simulationUrl?: SortOrder
    assignmentDescription?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicSumOrderByAggregateInput = {
    order?: SortOrder
    durationMinutes?: SortOrder
  }

  export type TopicScalarRelationFilter = {
    is?: TopicWhereInput
    isNot?: TopicWhereInput
  }

  export type FileMaterialCountOrderByAggregateInput = {
    id?: SortOrder
    topicId?: SortOrder
    googleDriveFileId?: SortOrder
    webContentLink?: SortOrder
    mimeType?: SortOrder
    fileName?: SortOrder
    createdAt?: SortOrder
  }

  export type FileMaterialMaxOrderByAggregateInput = {
    id?: SortOrder
    topicId?: SortOrder
    googleDriveFileId?: SortOrder
    webContentLink?: SortOrder
    mimeType?: SortOrder
    fileName?: SortOrder
    createdAt?: SortOrder
  }

  export type FileMaterialMinOrderByAggregateInput = {
    id?: SortOrder
    topicId?: SortOrder
    googleDriveFileId?: SortOrder
    webContentLink?: SortOrder
    mimeType?: SortOrder
    fileName?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type QuizQuestionCountOrderByAggregateInput = {
    id?: SortOrder
    topicId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
  }

  export type QuizQuestionAvgOrderByAggregateInput = {
    correctIndex?: SortOrder
  }

  export type QuizQuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    topicId?: SortOrder
    question?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
  }

  export type QuizQuestionMinOrderByAggregateInput = {
    id?: SortOrder
    topicId?: SortOrder
    question?: SortOrder
    correctIndex?: SortOrder
    explanation?: SortOrder
  }

  export type QuizQuestionSumOrderByAggregateInput = {
    correctIndex?: SortOrder
  }

  export type TopicProgressUserIdTopicIdCompoundUniqueInput = {
    userId: string
    topicId: string
  }

  export type TopicProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    isCompleted?: SortOrder
    quizScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicProgressAvgOrderByAggregateInput = {
    quizScore?: SortOrder
  }

  export type TopicProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    isCompleted?: SortOrder
    quizScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    isCompleted?: SortOrder
    quizScore?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicProgressSumOrderByAggregateInput = {
    quizScore?: SortOrder
  }

  export type ModuleProgressUserIdModuleIdCompoundUniqueInput = {
    userId: string
    moduleId: string
  }

  export type ModuleProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    moduleId?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ModuleProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    moduleId?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ModuleProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    moduleId?: SortOrder
    isCompleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type TopicProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<TopicProgressCreateWithoutUserInput, TopicProgressUncheckedCreateWithoutUserInput> | TopicProgressCreateWithoutUserInput[] | TopicProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TopicProgressCreateOrConnectWithoutUserInput | TopicProgressCreateOrConnectWithoutUserInput[]
    createMany?: TopicProgressCreateManyUserInputEnvelope
    connect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
  }

  export type ModuleProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<ModuleProgressCreateWithoutUserInput, ModuleProgressUncheckedCreateWithoutUserInput> | ModuleProgressCreateWithoutUserInput[] | ModuleProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ModuleProgressCreateOrConnectWithoutUserInput | ModuleProgressCreateOrConnectWithoutUserInput[]
    createMany?: ModuleProgressCreateManyUserInputEnvelope
    connect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type TopicProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TopicProgressCreateWithoutUserInput, TopicProgressUncheckedCreateWithoutUserInput> | TopicProgressCreateWithoutUserInput[] | TopicProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TopicProgressCreateOrConnectWithoutUserInput | TopicProgressCreateOrConnectWithoutUserInput[]
    createMany?: TopicProgressCreateManyUserInputEnvelope
    connect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
  }

  export type ModuleProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ModuleProgressCreateWithoutUserInput, ModuleProgressUncheckedCreateWithoutUserInput> | ModuleProgressCreateWithoutUserInput[] | ModuleProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ModuleProgressCreateOrConnectWithoutUserInput | ModuleProgressCreateOrConnectWithoutUserInput[]
    createMany?: ModuleProgressCreateManyUserInputEnvelope
    connect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
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

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type TopicProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<TopicProgressCreateWithoutUserInput, TopicProgressUncheckedCreateWithoutUserInput> | TopicProgressCreateWithoutUserInput[] | TopicProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TopicProgressCreateOrConnectWithoutUserInput | TopicProgressCreateOrConnectWithoutUserInput[]
    upsert?: TopicProgressUpsertWithWhereUniqueWithoutUserInput | TopicProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TopicProgressCreateManyUserInputEnvelope
    set?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    disconnect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    delete?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    connect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    update?: TopicProgressUpdateWithWhereUniqueWithoutUserInput | TopicProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TopicProgressUpdateManyWithWhereWithoutUserInput | TopicProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TopicProgressScalarWhereInput | TopicProgressScalarWhereInput[]
  }

  export type ModuleProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<ModuleProgressCreateWithoutUserInput, ModuleProgressUncheckedCreateWithoutUserInput> | ModuleProgressCreateWithoutUserInput[] | ModuleProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ModuleProgressCreateOrConnectWithoutUserInput | ModuleProgressCreateOrConnectWithoutUserInput[]
    upsert?: ModuleProgressUpsertWithWhereUniqueWithoutUserInput | ModuleProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ModuleProgressCreateManyUserInputEnvelope
    set?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    disconnect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    delete?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    connect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    update?: ModuleProgressUpdateWithWhereUniqueWithoutUserInput | ModuleProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ModuleProgressUpdateManyWithWhereWithoutUserInput | ModuleProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ModuleProgressScalarWhereInput | ModuleProgressScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type TopicProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TopicProgressCreateWithoutUserInput, TopicProgressUncheckedCreateWithoutUserInput> | TopicProgressCreateWithoutUserInput[] | TopicProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TopicProgressCreateOrConnectWithoutUserInput | TopicProgressCreateOrConnectWithoutUserInput[]
    upsert?: TopicProgressUpsertWithWhereUniqueWithoutUserInput | TopicProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TopicProgressCreateManyUserInputEnvelope
    set?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    disconnect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    delete?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    connect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    update?: TopicProgressUpdateWithWhereUniqueWithoutUserInput | TopicProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TopicProgressUpdateManyWithWhereWithoutUserInput | TopicProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TopicProgressScalarWhereInput | TopicProgressScalarWhereInput[]
  }

  export type ModuleProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ModuleProgressCreateWithoutUserInput, ModuleProgressUncheckedCreateWithoutUserInput> | ModuleProgressCreateWithoutUserInput[] | ModuleProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ModuleProgressCreateOrConnectWithoutUserInput | ModuleProgressCreateOrConnectWithoutUserInput[]
    upsert?: ModuleProgressUpsertWithWhereUniqueWithoutUserInput | ModuleProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ModuleProgressCreateManyUserInputEnvelope
    set?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    disconnect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    delete?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    connect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    update?: ModuleProgressUpdateWithWhereUniqueWithoutUserInput | ModuleProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ModuleProgressUpdateManyWithWhereWithoutUserInput | ModuleProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ModuleProgressScalarWhereInput | ModuleProgressScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type ModuleCreateNestedManyWithoutSubjectInput = {
    create?: XOR<ModuleCreateWithoutSubjectInput, ModuleUncheckedCreateWithoutSubjectInput> | ModuleCreateWithoutSubjectInput[] | ModuleUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutSubjectInput | ModuleCreateOrConnectWithoutSubjectInput[]
    createMany?: ModuleCreateManySubjectInputEnvelope
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
  }

  export type ModuleUncheckedCreateNestedManyWithoutSubjectInput = {
    create?: XOR<ModuleCreateWithoutSubjectInput, ModuleUncheckedCreateWithoutSubjectInput> | ModuleCreateWithoutSubjectInput[] | ModuleUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutSubjectInput | ModuleCreateOrConnectWithoutSubjectInput[]
    createMany?: ModuleCreateManySubjectInputEnvelope
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ModuleUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<ModuleCreateWithoutSubjectInput, ModuleUncheckedCreateWithoutSubjectInput> | ModuleCreateWithoutSubjectInput[] | ModuleUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutSubjectInput | ModuleCreateOrConnectWithoutSubjectInput[]
    upsert?: ModuleUpsertWithWhereUniqueWithoutSubjectInput | ModuleUpsertWithWhereUniqueWithoutSubjectInput[]
    createMany?: ModuleCreateManySubjectInputEnvelope
    set?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    disconnect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    delete?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    update?: ModuleUpdateWithWhereUniqueWithoutSubjectInput | ModuleUpdateWithWhereUniqueWithoutSubjectInput[]
    updateMany?: ModuleUpdateManyWithWhereWithoutSubjectInput | ModuleUpdateManyWithWhereWithoutSubjectInput[]
    deleteMany?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
  }

  export type ModuleUncheckedUpdateManyWithoutSubjectNestedInput = {
    create?: XOR<ModuleCreateWithoutSubjectInput, ModuleUncheckedCreateWithoutSubjectInput> | ModuleCreateWithoutSubjectInput[] | ModuleUncheckedCreateWithoutSubjectInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutSubjectInput | ModuleCreateOrConnectWithoutSubjectInput[]
    upsert?: ModuleUpsertWithWhereUniqueWithoutSubjectInput | ModuleUpsertWithWhereUniqueWithoutSubjectInput[]
    createMany?: ModuleCreateManySubjectInputEnvelope
    set?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    disconnect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    delete?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    update?: ModuleUpdateWithWhereUniqueWithoutSubjectInput | ModuleUpdateWithWhereUniqueWithoutSubjectInput[]
    updateMany?: ModuleUpdateManyWithWhereWithoutSubjectInput | ModuleUpdateManyWithWhereWithoutSubjectInput[]
    deleteMany?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
  }

  export type SubjectCreateNestedOneWithoutModulesInput = {
    create?: XOR<SubjectCreateWithoutModulesInput, SubjectUncheckedCreateWithoutModulesInput>
    connectOrCreate?: SubjectCreateOrConnectWithoutModulesInput
    connect?: SubjectWhereUniqueInput
  }

  export type TopicCreateNestedManyWithoutModuleInput = {
    create?: XOR<TopicCreateWithoutModuleInput, TopicUncheckedCreateWithoutModuleInput> | TopicCreateWithoutModuleInput[] | TopicUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutModuleInput | TopicCreateOrConnectWithoutModuleInput[]
    createMany?: TopicCreateManyModuleInputEnvelope
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
  }

  export type ModuleProgressCreateNestedManyWithoutModuleInput = {
    create?: XOR<ModuleProgressCreateWithoutModuleInput, ModuleProgressUncheckedCreateWithoutModuleInput> | ModuleProgressCreateWithoutModuleInput[] | ModuleProgressUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: ModuleProgressCreateOrConnectWithoutModuleInput | ModuleProgressCreateOrConnectWithoutModuleInput[]
    createMany?: ModuleProgressCreateManyModuleInputEnvelope
    connect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
  }

  export type TopicUncheckedCreateNestedManyWithoutModuleInput = {
    create?: XOR<TopicCreateWithoutModuleInput, TopicUncheckedCreateWithoutModuleInput> | TopicCreateWithoutModuleInput[] | TopicUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutModuleInput | TopicCreateOrConnectWithoutModuleInput[]
    createMany?: TopicCreateManyModuleInputEnvelope
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
  }

  export type ModuleProgressUncheckedCreateNestedManyWithoutModuleInput = {
    create?: XOR<ModuleProgressCreateWithoutModuleInput, ModuleProgressUncheckedCreateWithoutModuleInput> | ModuleProgressCreateWithoutModuleInput[] | ModuleProgressUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: ModuleProgressCreateOrConnectWithoutModuleInput | ModuleProgressCreateOrConnectWithoutModuleInput[]
    createMany?: ModuleProgressCreateManyModuleInputEnvelope
    connect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SubjectUpdateOneRequiredWithoutModulesNestedInput = {
    create?: XOR<SubjectCreateWithoutModulesInput, SubjectUncheckedCreateWithoutModulesInput>
    connectOrCreate?: SubjectCreateOrConnectWithoutModulesInput
    upsert?: SubjectUpsertWithoutModulesInput
    connect?: SubjectWhereUniqueInput
    update?: XOR<XOR<SubjectUpdateToOneWithWhereWithoutModulesInput, SubjectUpdateWithoutModulesInput>, SubjectUncheckedUpdateWithoutModulesInput>
  }

  export type TopicUpdateManyWithoutModuleNestedInput = {
    create?: XOR<TopicCreateWithoutModuleInput, TopicUncheckedCreateWithoutModuleInput> | TopicCreateWithoutModuleInput[] | TopicUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutModuleInput | TopicCreateOrConnectWithoutModuleInput[]
    upsert?: TopicUpsertWithWhereUniqueWithoutModuleInput | TopicUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: TopicCreateManyModuleInputEnvelope
    set?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    disconnect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    delete?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    update?: TopicUpdateWithWhereUniqueWithoutModuleInput | TopicUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: TopicUpdateManyWithWhereWithoutModuleInput | TopicUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: TopicScalarWhereInput | TopicScalarWhereInput[]
  }

  export type ModuleProgressUpdateManyWithoutModuleNestedInput = {
    create?: XOR<ModuleProgressCreateWithoutModuleInput, ModuleProgressUncheckedCreateWithoutModuleInput> | ModuleProgressCreateWithoutModuleInput[] | ModuleProgressUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: ModuleProgressCreateOrConnectWithoutModuleInput | ModuleProgressCreateOrConnectWithoutModuleInput[]
    upsert?: ModuleProgressUpsertWithWhereUniqueWithoutModuleInput | ModuleProgressUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: ModuleProgressCreateManyModuleInputEnvelope
    set?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    disconnect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    delete?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    connect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    update?: ModuleProgressUpdateWithWhereUniqueWithoutModuleInput | ModuleProgressUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: ModuleProgressUpdateManyWithWhereWithoutModuleInput | ModuleProgressUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: ModuleProgressScalarWhereInput | ModuleProgressScalarWhereInput[]
  }

  export type TopicUncheckedUpdateManyWithoutModuleNestedInput = {
    create?: XOR<TopicCreateWithoutModuleInput, TopicUncheckedCreateWithoutModuleInput> | TopicCreateWithoutModuleInput[] | TopicUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutModuleInput | TopicCreateOrConnectWithoutModuleInput[]
    upsert?: TopicUpsertWithWhereUniqueWithoutModuleInput | TopicUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: TopicCreateManyModuleInputEnvelope
    set?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    disconnect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    delete?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    update?: TopicUpdateWithWhereUniqueWithoutModuleInput | TopicUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: TopicUpdateManyWithWhereWithoutModuleInput | TopicUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: TopicScalarWhereInput | TopicScalarWhereInput[]
  }

  export type ModuleProgressUncheckedUpdateManyWithoutModuleNestedInput = {
    create?: XOR<ModuleProgressCreateWithoutModuleInput, ModuleProgressUncheckedCreateWithoutModuleInput> | ModuleProgressCreateWithoutModuleInput[] | ModuleProgressUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: ModuleProgressCreateOrConnectWithoutModuleInput | ModuleProgressCreateOrConnectWithoutModuleInput[]
    upsert?: ModuleProgressUpsertWithWhereUniqueWithoutModuleInput | ModuleProgressUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: ModuleProgressCreateManyModuleInputEnvelope
    set?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    disconnect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    delete?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    connect?: ModuleProgressWhereUniqueInput | ModuleProgressWhereUniqueInput[]
    update?: ModuleProgressUpdateWithWhereUniqueWithoutModuleInput | ModuleProgressUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: ModuleProgressUpdateManyWithWhereWithoutModuleInput | ModuleProgressUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: ModuleProgressScalarWhereInput | ModuleProgressScalarWhereInput[]
  }

  export type ModuleCreateNestedOneWithoutTopicsInput = {
    create?: XOR<ModuleCreateWithoutTopicsInput, ModuleUncheckedCreateWithoutTopicsInput>
    connectOrCreate?: ModuleCreateOrConnectWithoutTopicsInput
    connect?: ModuleWhereUniqueInput
  }

  export type QuizQuestionCreateNestedManyWithoutTopicInput = {
    create?: XOR<QuizQuestionCreateWithoutTopicInput, QuizQuestionUncheckedCreateWithoutTopicInput> | QuizQuestionCreateWithoutTopicInput[] | QuizQuestionUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: QuizQuestionCreateOrConnectWithoutTopicInput | QuizQuestionCreateOrConnectWithoutTopicInput[]
    createMany?: QuizQuestionCreateManyTopicInputEnvelope
    connect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
  }

  export type FileMaterialCreateNestedManyWithoutTopicInput = {
    create?: XOR<FileMaterialCreateWithoutTopicInput, FileMaterialUncheckedCreateWithoutTopicInput> | FileMaterialCreateWithoutTopicInput[] | FileMaterialUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: FileMaterialCreateOrConnectWithoutTopicInput | FileMaterialCreateOrConnectWithoutTopicInput[]
    createMany?: FileMaterialCreateManyTopicInputEnvelope
    connect?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
  }

  export type TopicProgressCreateNestedManyWithoutTopicInput = {
    create?: XOR<TopicProgressCreateWithoutTopicInput, TopicProgressUncheckedCreateWithoutTopicInput> | TopicProgressCreateWithoutTopicInput[] | TopicProgressUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: TopicProgressCreateOrConnectWithoutTopicInput | TopicProgressCreateOrConnectWithoutTopicInput[]
    createMany?: TopicProgressCreateManyTopicInputEnvelope
    connect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
  }

  export type QuizQuestionUncheckedCreateNestedManyWithoutTopicInput = {
    create?: XOR<QuizQuestionCreateWithoutTopicInput, QuizQuestionUncheckedCreateWithoutTopicInput> | QuizQuestionCreateWithoutTopicInput[] | QuizQuestionUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: QuizQuestionCreateOrConnectWithoutTopicInput | QuizQuestionCreateOrConnectWithoutTopicInput[]
    createMany?: QuizQuestionCreateManyTopicInputEnvelope
    connect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
  }

  export type FileMaterialUncheckedCreateNestedManyWithoutTopicInput = {
    create?: XOR<FileMaterialCreateWithoutTopicInput, FileMaterialUncheckedCreateWithoutTopicInput> | FileMaterialCreateWithoutTopicInput[] | FileMaterialUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: FileMaterialCreateOrConnectWithoutTopicInput | FileMaterialCreateOrConnectWithoutTopicInput[]
    createMany?: FileMaterialCreateManyTopicInputEnvelope
    connect?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
  }

  export type TopicProgressUncheckedCreateNestedManyWithoutTopicInput = {
    create?: XOR<TopicProgressCreateWithoutTopicInput, TopicProgressUncheckedCreateWithoutTopicInput> | TopicProgressCreateWithoutTopicInput[] | TopicProgressUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: TopicProgressCreateOrConnectWithoutTopicInput | TopicProgressCreateOrConnectWithoutTopicInput[]
    createMany?: TopicProgressCreateManyTopicInputEnvelope
    connect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
  }

  export type ModuleUpdateOneRequiredWithoutTopicsNestedInput = {
    create?: XOR<ModuleCreateWithoutTopicsInput, ModuleUncheckedCreateWithoutTopicsInput>
    connectOrCreate?: ModuleCreateOrConnectWithoutTopicsInput
    upsert?: ModuleUpsertWithoutTopicsInput
    connect?: ModuleWhereUniqueInput
    update?: XOR<XOR<ModuleUpdateToOneWithWhereWithoutTopicsInput, ModuleUpdateWithoutTopicsInput>, ModuleUncheckedUpdateWithoutTopicsInput>
  }

  export type QuizQuestionUpdateManyWithoutTopicNestedInput = {
    create?: XOR<QuizQuestionCreateWithoutTopicInput, QuizQuestionUncheckedCreateWithoutTopicInput> | QuizQuestionCreateWithoutTopicInput[] | QuizQuestionUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: QuizQuestionCreateOrConnectWithoutTopicInput | QuizQuestionCreateOrConnectWithoutTopicInput[]
    upsert?: QuizQuestionUpsertWithWhereUniqueWithoutTopicInput | QuizQuestionUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: QuizQuestionCreateManyTopicInputEnvelope
    set?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    disconnect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    delete?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    connect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    update?: QuizQuestionUpdateWithWhereUniqueWithoutTopicInput | QuizQuestionUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: QuizQuestionUpdateManyWithWhereWithoutTopicInput | QuizQuestionUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: QuizQuestionScalarWhereInput | QuizQuestionScalarWhereInput[]
  }

  export type FileMaterialUpdateManyWithoutTopicNestedInput = {
    create?: XOR<FileMaterialCreateWithoutTopicInput, FileMaterialUncheckedCreateWithoutTopicInput> | FileMaterialCreateWithoutTopicInput[] | FileMaterialUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: FileMaterialCreateOrConnectWithoutTopicInput | FileMaterialCreateOrConnectWithoutTopicInput[]
    upsert?: FileMaterialUpsertWithWhereUniqueWithoutTopicInput | FileMaterialUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: FileMaterialCreateManyTopicInputEnvelope
    set?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
    disconnect?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
    delete?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
    connect?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
    update?: FileMaterialUpdateWithWhereUniqueWithoutTopicInput | FileMaterialUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: FileMaterialUpdateManyWithWhereWithoutTopicInput | FileMaterialUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: FileMaterialScalarWhereInput | FileMaterialScalarWhereInput[]
  }

  export type TopicProgressUpdateManyWithoutTopicNestedInput = {
    create?: XOR<TopicProgressCreateWithoutTopicInput, TopicProgressUncheckedCreateWithoutTopicInput> | TopicProgressCreateWithoutTopicInput[] | TopicProgressUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: TopicProgressCreateOrConnectWithoutTopicInput | TopicProgressCreateOrConnectWithoutTopicInput[]
    upsert?: TopicProgressUpsertWithWhereUniqueWithoutTopicInput | TopicProgressUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: TopicProgressCreateManyTopicInputEnvelope
    set?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    disconnect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    delete?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    connect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    update?: TopicProgressUpdateWithWhereUniqueWithoutTopicInput | TopicProgressUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: TopicProgressUpdateManyWithWhereWithoutTopicInput | TopicProgressUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: TopicProgressScalarWhereInput | TopicProgressScalarWhereInput[]
  }

  export type QuizQuestionUncheckedUpdateManyWithoutTopicNestedInput = {
    create?: XOR<QuizQuestionCreateWithoutTopicInput, QuizQuestionUncheckedCreateWithoutTopicInput> | QuizQuestionCreateWithoutTopicInput[] | QuizQuestionUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: QuizQuestionCreateOrConnectWithoutTopicInput | QuizQuestionCreateOrConnectWithoutTopicInput[]
    upsert?: QuizQuestionUpsertWithWhereUniqueWithoutTopicInput | QuizQuestionUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: QuizQuestionCreateManyTopicInputEnvelope
    set?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    disconnect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    delete?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    connect?: QuizQuestionWhereUniqueInput | QuizQuestionWhereUniqueInput[]
    update?: QuizQuestionUpdateWithWhereUniqueWithoutTopicInput | QuizQuestionUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: QuizQuestionUpdateManyWithWhereWithoutTopicInput | QuizQuestionUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: QuizQuestionScalarWhereInput | QuizQuestionScalarWhereInput[]
  }

  export type FileMaterialUncheckedUpdateManyWithoutTopicNestedInput = {
    create?: XOR<FileMaterialCreateWithoutTopicInput, FileMaterialUncheckedCreateWithoutTopicInput> | FileMaterialCreateWithoutTopicInput[] | FileMaterialUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: FileMaterialCreateOrConnectWithoutTopicInput | FileMaterialCreateOrConnectWithoutTopicInput[]
    upsert?: FileMaterialUpsertWithWhereUniqueWithoutTopicInput | FileMaterialUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: FileMaterialCreateManyTopicInputEnvelope
    set?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
    disconnect?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
    delete?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
    connect?: FileMaterialWhereUniqueInput | FileMaterialWhereUniqueInput[]
    update?: FileMaterialUpdateWithWhereUniqueWithoutTopicInput | FileMaterialUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: FileMaterialUpdateManyWithWhereWithoutTopicInput | FileMaterialUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: FileMaterialScalarWhereInput | FileMaterialScalarWhereInput[]
  }

  export type TopicProgressUncheckedUpdateManyWithoutTopicNestedInput = {
    create?: XOR<TopicProgressCreateWithoutTopicInput, TopicProgressUncheckedCreateWithoutTopicInput> | TopicProgressCreateWithoutTopicInput[] | TopicProgressUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: TopicProgressCreateOrConnectWithoutTopicInput | TopicProgressCreateOrConnectWithoutTopicInput[]
    upsert?: TopicProgressUpsertWithWhereUniqueWithoutTopicInput | TopicProgressUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: TopicProgressCreateManyTopicInputEnvelope
    set?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    disconnect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    delete?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    connect?: TopicProgressWhereUniqueInput | TopicProgressWhereUniqueInput[]
    update?: TopicProgressUpdateWithWhereUniqueWithoutTopicInput | TopicProgressUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: TopicProgressUpdateManyWithWhereWithoutTopicInput | TopicProgressUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: TopicProgressScalarWhereInput | TopicProgressScalarWhereInput[]
  }

  export type TopicCreateNestedOneWithoutFileMaterialsInput = {
    create?: XOR<TopicCreateWithoutFileMaterialsInput, TopicUncheckedCreateWithoutFileMaterialsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutFileMaterialsInput
    connect?: TopicWhereUniqueInput
  }

  export type TopicUpdateOneRequiredWithoutFileMaterialsNestedInput = {
    create?: XOR<TopicCreateWithoutFileMaterialsInput, TopicUncheckedCreateWithoutFileMaterialsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutFileMaterialsInput
    upsert?: TopicUpsertWithoutFileMaterialsInput
    connect?: TopicWhereUniqueInput
    update?: XOR<XOR<TopicUpdateToOneWithWhereWithoutFileMaterialsInput, TopicUpdateWithoutFileMaterialsInput>, TopicUncheckedUpdateWithoutFileMaterialsInput>
  }

  export type QuizQuestionCreateoptionsInput = {
    set: string[]
  }

  export type TopicCreateNestedOneWithoutQuizQuestionsInput = {
    create?: XOR<TopicCreateWithoutQuizQuestionsInput, TopicUncheckedCreateWithoutQuizQuestionsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutQuizQuestionsInput
    connect?: TopicWhereUniqueInput
  }

  export type QuizQuestionUpdateoptionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TopicUpdateOneRequiredWithoutQuizQuestionsNestedInput = {
    create?: XOR<TopicCreateWithoutQuizQuestionsInput, TopicUncheckedCreateWithoutQuizQuestionsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutQuizQuestionsInput
    upsert?: TopicUpsertWithoutQuizQuestionsInput
    connect?: TopicWhereUniqueInput
    update?: XOR<XOR<TopicUpdateToOneWithWhereWithoutQuizQuestionsInput, TopicUpdateWithoutQuizQuestionsInput>, TopicUncheckedUpdateWithoutQuizQuestionsInput>
  }

  export type UserCreateNestedOneWithoutTopicProgressInput = {
    create?: XOR<UserCreateWithoutTopicProgressInput, UserUncheckedCreateWithoutTopicProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutTopicProgressInput
    connect?: UserWhereUniqueInput
  }

  export type TopicCreateNestedOneWithoutStudentProgressInput = {
    create?: XOR<TopicCreateWithoutStudentProgressInput, TopicUncheckedCreateWithoutStudentProgressInput>
    connectOrCreate?: TopicCreateOrConnectWithoutStudentProgressInput
    connect?: TopicWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTopicProgressNestedInput = {
    create?: XOR<UserCreateWithoutTopicProgressInput, UserUncheckedCreateWithoutTopicProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutTopicProgressInput
    upsert?: UserUpsertWithoutTopicProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTopicProgressInput, UserUpdateWithoutTopicProgressInput>, UserUncheckedUpdateWithoutTopicProgressInput>
  }

  export type TopicUpdateOneRequiredWithoutStudentProgressNestedInput = {
    create?: XOR<TopicCreateWithoutStudentProgressInput, TopicUncheckedCreateWithoutStudentProgressInput>
    connectOrCreate?: TopicCreateOrConnectWithoutStudentProgressInput
    upsert?: TopicUpsertWithoutStudentProgressInput
    connect?: TopicWhereUniqueInput
    update?: XOR<XOR<TopicUpdateToOneWithWhereWithoutStudentProgressInput, TopicUpdateWithoutStudentProgressInput>, TopicUncheckedUpdateWithoutStudentProgressInput>
  }

  export type UserCreateNestedOneWithoutModuleProgressInput = {
    create?: XOR<UserCreateWithoutModuleProgressInput, UserUncheckedCreateWithoutModuleProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutModuleProgressInput
    connect?: UserWhereUniqueInput
  }

  export type ModuleCreateNestedOneWithoutStudentProgressInput = {
    create?: XOR<ModuleCreateWithoutStudentProgressInput, ModuleUncheckedCreateWithoutStudentProgressInput>
    connectOrCreate?: ModuleCreateOrConnectWithoutStudentProgressInput
    connect?: ModuleWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutModuleProgressNestedInput = {
    create?: XOR<UserCreateWithoutModuleProgressInput, UserUncheckedCreateWithoutModuleProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutModuleProgressInput
    upsert?: UserUpsertWithoutModuleProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutModuleProgressInput, UserUpdateWithoutModuleProgressInput>, UserUncheckedUpdateWithoutModuleProgressInput>
  }

  export type ModuleUpdateOneRequiredWithoutStudentProgressNestedInput = {
    create?: XOR<ModuleCreateWithoutStudentProgressInput, ModuleUncheckedCreateWithoutStudentProgressInput>
    connectOrCreate?: ModuleCreateOrConnectWithoutStudentProgressInput
    upsert?: ModuleUpsertWithoutStudentProgressInput
    connect?: ModuleWhereUniqueInput
    update?: XOR<XOR<ModuleUpdateToOneWithWhereWithoutStudentProgressInput, ModuleUpdateWithoutStudentProgressInput>, ModuleUncheckedUpdateWithoutStudentProgressInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    refresh_token_expires_in?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    refresh_token_expires_in?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TopicProgressCreateWithoutUserInput = {
    id?: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    topic: TopicCreateNestedOneWithoutStudentProgressInput
  }

  export type TopicProgressUncheckedCreateWithoutUserInput = {
    id?: string
    topicId: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicProgressCreateOrConnectWithoutUserInput = {
    where: TopicProgressWhereUniqueInput
    create: XOR<TopicProgressCreateWithoutUserInput, TopicProgressUncheckedCreateWithoutUserInput>
  }

  export type TopicProgressCreateManyUserInputEnvelope = {
    data: TopicProgressCreateManyUserInput | TopicProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ModuleProgressCreateWithoutUserInput = {
    id?: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    module: ModuleCreateNestedOneWithoutStudentProgressInput
  }

  export type ModuleProgressUncheckedCreateWithoutUserInput = {
    id?: string
    moduleId: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModuleProgressCreateOrConnectWithoutUserInput = {
    where: ModuleProgressWhereUniqueInput
    create: XOR<ModuleProgressCreateWithoutUserInput, ModuleProgressUncheckedCreateWithoutUserInput>
  }

  export type ModuleProgressCreateManyUserInputEnvelope = {
    data: ModuleProgressCreateManyUserInput | ModuleProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    refresh_token_expires_in?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type TopicProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: TopicProgressWhereUniqueInput
    update: XOR<TopicProgressUpdateWithoutUserInput, TopicProgressUncheckedUpdateWithoutUserInput>
    create: XOR<TopicProgressCreateWithoutUserInput, TopicProgressUncheckedCreateWithoutUserInput>
  }

  export type TopicProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: TopicProgressWhereUniqueInput
    data: XOR<TopicProgressUpdateWithoutUserInput, TopicProgressUncheckedUpdateWithoutUserInput>
  }

  export type TopicProgressUpdateManyWithWhereWithoutUserInput = {
    where: TopicProgressScalarWhereInput
    data: XOR<TopicProgressUpdateManyMutationInput, TopicProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type TopicProgressScalarWhereInput = {
    AND?: TopicProgressScalarWhereInput | TopicProgressScalarWhereInput[]
    OR?: TopicProgressScalarWhereInput[]
    NOT?: TopicProgressScalarWhereInput | TopicProgressScalarWhereInput[]
    id?: StringFilter<"TopicProgress"> | string
    userId?: StringFilter<"TopicProgress"> | string
    topicId?: StringFilter<"TopicProgress"> | string
    isCompleted?: BoolFilter<"TopicProgress"> | boolean
    quizScore?: IntNullableFilter<"TopicProgress"> | number | null
    createdAt?: DateTimeFilter<"TopicProgress"> | Date | string
    updatedAt?: DateTimeFilter<"TopicProgress"> | Date | string
  }

  export type ModuleProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: ModuleProgressWhereUniqueInput
    update: XOR<ModuleProgressUpdateWithoutUserInput, ModuleProgressUncheckedUpdateWithoutUserInput>
    create: XOR<ModuleProgressCreateWithoutUserInput, ModuleProgressUncheckedCreateWithoutUserInput>
  }

  export type ModuleProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: ModuleProgressWhereUniqueInput
    data: XOR<ModuleProgressUpdateWithoutUserInput, ModuleProgressUncheckedUpdateWithoutUserInput>
  }

  export type ModuleProgressUpdateManyWithWhereWithoutUserInput = {
    where: ModuleProgressScalarWhereInput
    data: XOR<ModuleProgressUpdateManyMutationInput, ModuleProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type ModuleProgressScalarWhereInput = {
    AND?: ModuleProgressScalarWhereInput | ModuleProgressScalarWhereInput[]
    OR?: ModuleProgressScalarWhereInput[]
    NOT?: ModuleProgressScalarWhereInput | ModuleProgressScalarWhereInput[]
    id?: StringFilter<"ModuleProgress"> | string
    userId?: StringFilter<"ModuleProgress"> | string
    moduleId?: StringFilter<"ModuleProgress"> | string
    isCompleted?: BoolFilter<"ModuleProgress"> | boolean
    createdAt?: DateTimeFilter<"ModuleProgress"> | Date | string
    updatedAt?: DateTimeFilter<"ModuleProgress"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    topicProgress?: TopicProgressCreateNestedManyWithoutUserInput
    moduleProgress?: ModuleProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    topicProgress?: TopicProgressUncheckedCreateNestedManyWithoutUserInput
    moduleProgress?: ModuleProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topicProgress?: TopicProgressUpdateManyWithoutUserNestedInput
    moduleProgress?: ModuleProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topicProgress?: TopicProgressUncheckedUpdateManyWithoutUserNestedInput
    moduleProgress?: ModuleProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ModuleCreateWithoutSubjectInput = {
    id?: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    topics?: TopicCreateNestedManyWithoutModuleInput
    studentProgress?: ModuleProgressCreateNestedManyWithoutModuleInput
  }

  export type ModuleUncheckedCreateWithoutSubjectInput = {
    id?: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    topics?: TopicUncheckedCreateNestedManyWithoutModuleInput
    studentProgress?: ModuleProgressUncheckedCreateNestedManyWithoutModuleInput
  }

  export type ModuleCreateOrConnectWithoutSubjectInput = {
    where: ModuleWhereUniqueInput
    create: XOR<ModuleCreateWithoutSubjectInput, ModuleUncheckedCreateWithoutSubjectInput>
  }

  export type ModuleCreateManySubjectInputEnvelope = {
    data: ModuleCreateManySubjectInput | ModuleCreateManySubjectInput[]
    skipDuplicates?: boolean
  }

  export type ModuleUpsertWithWhereUniqueWithoutSubjectInput = {
    where: ModuleWhereUniqueInput
    update: XOR<ModuleUpdateWithoutSubjectInput, ModuleUncheckedUpdateWithoutSubjectInput>
    create: XOR<ModuleCreateWithoutSubjectInput, ModuleUncheckedCreateWithoutSubjectInput>
  }

  export type ModuleUpdateWithWhereUniqueWithoutSubjectInput = {
    where: ModuleWhereUniqueInput
    data: XOR<ModuleUpdateWithoutSubjectInput, ModuleUncheckedUpdateWithoutSubjectInput>
  }

  export type ModuleUpdateManyWithWhereWithoutSubjectInput = {
    where: ModuleScalarWhereInput
    data: XOR<ModuleUpdateManyMutationInput, ModuleUncheckedUpdateManyWithoutSubjectInput>
  }

  export type ModuleScalarWhereInput = {
    AND?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
    OR?: ModuleScalarWhereInput[]
    NOT?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
    id?: StringFilter<"Module"> | string
    subjectId?: StringFilter<"Module"> | string
    order?: IntFilter<"Module"> | number
    title?: StringFilter<"Module"> | string
    description?: StringFilter<"Module"> | string
    isLocked?: BoolFilter<"Module"> | boolean
    createdAt?: DateTimeFilter<"Module"> | Date | string
    updatedAt?: DateTimeFilter<"Module"> | Date | string
  }

  export type SubjectCreateWithoutModulesInput = {
    id?: string
    code: string
    title: string
    description: string
    instructor: string
    credits: number
    semester: number
    coverColor: string
    totalModules?: number
    totalTopics?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubjectUncheckedCreateWithoutModulesInput = {
    id?: string
    code: string
    title: string
    description: string
    instructor: string
    credits: number
    semester: number
    coverColor: string
    totalModules?: number
    totalTopics?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubjectCreateOrConnectWithoutModulesInput = {
    where: SubjectWhereUniqueInput
    create: XOR<SubjectCreateWithoutModulesInput, SubjectUncheckedCreateWithoutModulesInput>
  }

  export type TopicCreateWithoutModuleInput = {
    id?: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    quizQuestions?: QuizQuestionCreateNestedManyWithoutTopicInput
    fileMaterials?: FileMaterialCreateNestedManyWithoutTopicInput
    studentProgress?: TopicProgressCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutModuleInput = {
    id?: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    quizQuestions?: QuizQuestionUncheckedCreateNestedManyWithoutTopicInput
    fileMaterials?: FileMaterialUncheckedCreateNestedManyWithoutTopicInput
    studentProgress?: TopicProgressUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutModuleInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutModuleInput, TopicUncheckedCreateWithoutModuleInput>
  }

  export type TopicCreateManyModuleInputEnvelope = {
    data: TopicCreateManyModuleInput | TopicCreateManyModuleInput[]
    skipDuplicates?: boolean
  }

  export type ModuleProgressCreateWithoutModuleInput = {
    id?: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutModuleProgressInput
  }

  export type ModuleProgressUncheckedCreateWithoutModuleInput = {
    id?: string
    userId: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModuleProgressCreateOrConnectWithoutModuleInput = {
    where: ModuleProgressWhereUniqueInput
    create: XOR<ModuleProgressCreateWithoutModuleInput, ModuleProgressUncheckedCreateWithoutModuleInput>
  }

  export type ModuleProgressCreateManyModuleInputEnvelope = {
    data: ModuleProgressCreateManyModuleInput | ModuleProgressCreateManyModuleInput[]
    skipDuplicates?: boolean
  }

  export type SubjectUpsertWithoutModulesInput = {
    update: XOR<SubjectUpdateWithoutModulesInput, SubjectUncheckedUpdateWithoutModulesInput>
    create: XOR<SubjectCreateWithoutModulesInput, SubjectUncheckedCreateWithoutModulesInput>
    where?: SubjectWhereInput
  }

  export type SubjectUpdateToOneWithWhereWithoutModulesInput = {
    where?: SubjectWhereInput
    data: XOR<SubjectUpdateWithoutModulesInput, SubjectUncheckedUpdateWithoutModulesInput>
  }

  export type SubjectUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructor?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    semester?: IntFieldUpdateOperationsInput | number
    coverColor?: StringFieldUpdateOperationsInput | string
    totalModules?: IntFieldUpdateOperationsInput | number
    totalTopics?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubjectUncheckedUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    instructor?: StringFieldUpdateOperationsInput | string
    credits?: IntFieldUpdateOperationsInput | number
    semester?: IntFieldUpdateOperationsInput | number
    coverColor?: StringFieldUpdateOperationsInput | string
    totalModules?: IntFieldUpdateOperationsInput | number
    totalTopics?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicUpsertWithWhereUniqueWithoutModuleInput = {
    where: TopicWhereUniqueInput
    update: XOR<TopicUpdateWithoutModuleInput, TopicUncheckedUpdateWithoutModuleInput>
    create: XOR<TopicCreateWithoutModuleInput, TopicUncheckedCreateWithoutModuleInput>
  }

  export type TopicUpdateWithWhereUniqueWithoutModuleInput = {
    where: TopicWhereUniqueInput
    data: XOR<TopicUpdateWithoutModuleInput, TopicUncheckedUpdateWithoutModuleInput>
  }

  export type TopicUpdateManyWithWhereWithoutModuleInput = {
    where: TopicScalarWhereInput
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyWithoutModuleInput>
  }

  export type TopicScalarWhereInput = {
    AND?: TopicScalarWhereInput | TopicScalarWhereInput[]
    OR?: TopicScalarWhereInput[]
    NOT?: TopicScalarWhereInput | TopicScalarWhereInput[]
    id?: StringFilter<"Topic"> | string
    moduleId?: StringFilter<"Topic"> | string
    order?: IntFilter<"Topic"> | number
    title?: StringFilter<"Topic"> | string
    type?: StringFilter<"Topic"> | string
    durationMinutes?: IntFilter<"Topic"> | number
    videoId?: StringNullableFilter<"Topic"> | string | null
    ebookContent?: StringNullableFilter<"Topic"> | string | null
    simulationUrl?: StringNullableFilter<"Topic"> | string | null
    assignmentDescription?: StringNullableFilter<"Topic"> | string | null
    createdAt?: DateTimeFilter<"Topic"> | Date | string
    updatedAt?: DateTimeFilter<"Topic"> | Date | string
  }

  export type ModuleProgressUpsertWithWhereUniqueWithoutModuleInput = {
    where: ModuleProgressWhereUniqueInput
    update: XOR<ModuleProgressUpdateWithoutModuleInput, ModuleProgressUncheckedUpdateWithoutModuleInput>
    create: XOR<ModuleProgressCreateWithoutModuleInput, ModuleProgressUncheckedCreateWithoutModuleInput>
  }

  export type ModuleProgressUpdateWithWhereUniqueWithoutModuleInput = {
    where: ModuleProgressWhereUniqueInput
    data: XOR<ModuleProgressUpdateWithoutModuleInput, ModuleProgressUncheckedUpdateWithoutModuleInput>
  }

  export type ModuleProgressUpdateManyWithWhereWithoutModuleInput = {
    where: ModuleProgressScalarWhereInput
    data: XOR<ModuleProgressUpdateManyMutationInput, ModuleProgressUncheckedUpdateManyWithoutModuleInput>
  }

  export type ModuleCreateWithoutTopicsInput = {
    id?: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subject: SubjectCreateNestedOneWithoutModulesInput
    studentProgress?: ModuleProgressCreateNestedManyWithoutModuleInput
  }

  export type ModuleUncheckedCreateWithoutTopicsInput = {
    id?: string
    subjectId: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProgress?: ModuleProgressUncheckedCreateNestedManyWithoutModuleInput
  }

  export type ModuleCreateOrConnectWithoutTopicsInput = {
    where: ModuleWhereUniqueInput
    create: XOR<ModuleCreateWithoutTopicsInput, ModuleUncheckedCreateWithoutTopicsInput>
  }

  export type QuizQuestionCreateWithoutTopicInput = {
    id?: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
  }

  export type QuizQuestionUncheckedCreateWithoutTopicInput = {
    id?: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
  }

  export type QuizQuestionCreateOrConnectWithoutTopicInput = {
    where: QuizQuestionWhereUniqueInput
    create: XOR<QuizQuestionCreateWithoutTopicInput, QuizQuestionUncheckedCreateWithoutTopicInput>
  }

  export type QuizQuestionCreateManyTopicInputEnvelope = {
    data: QuizQuestionCreateManyTopicInput | QuizQuestionCreateManyTopicInput[]
    skipDuplicates?: boolean
  }

  export type FileMaterialCreateWithoutTopicInput = {
    id?: string
    googleDriveFileId: string
    webContentLink?: string | null
    mimeType?: string | null
    fileName: string
    createdAt?: Date | string
  }

  export type FileMaterialUncheckedCreateWithoutTopicInput = {
    id?: string
    googleDriveFileId: string
    webContentLink?: string | null
    mimeType?: string | null
    fileName: string
    createdAt?: Date | string
  }

  export type FileMaterialCreateOrConnectWithoutTopicInput = {
    where: FileMaterialWhereUniqueInput
    create: XOR<FileMaterialCreateWithoutTopicInput, FileMaterialUncheckedCreateWithoutTopicInput>
  }

  export type FileMaterialCreateManyTopicInputEnvelope = {
    data: FileMaterialCreateManyTopicInput | FileMaterialCreateManyTopicInput[]
    skipDuplicates?: boolean
  }

  export type TopicProgressCreateWithoutTopicInput = {
    id?: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTopicProgressInput
  }

  export type TopicProgressUncheckedCreateWithoutTopicInput = {
    id?: string
    userId: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicProgressCreateOrConnectWithoutTopicInput = {
    where: TopicProgressWhereUniqueInput
    create: XOR<TopicProgressCreateWithoutTopicInput, TopicProgressUncheckedCreateWithoutTopicInput>
  }

  export type TopicProgressCreateManyTopicInputEnvelope = {
    data: TopicProgressCreateManyTopicInput | TopicProgressCreateManyTopicInput[]
    skipDuplicates?: boolean
  }

  export type ModuleUpsertWithoutTopicsInput = {
    update: XOR<ModuleUpdateWithoutTopicsInput, ModuleUncheckedUpdateWithoutTopicsInput>
    create: XOR<ModuleCreateWithoutTopicsInput, ModuleUncheckedCreateWithoutTopicsInput>
    where?: ModuleWhereInput
  }

  export type ModuleUpdateToOneWithWhereWithoutTopicsInput = {
    where?: ModuleWhereInput
    data: XOR<ModuleUpdateWithoutTopicsInput, ModuleUncheckedUpdateWithoutTopicsInput>
  }

  export type ModuleUpdateWithoutTopicsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subject?: SubjectUpdateOneRequiredWithoutModulesNestedInput
    studentProgress?: ModuleProgressUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateWithoutTopicsInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProgress?: ModuleProgressUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type QuizQuestionUpsertWithWhereUniqueWithoutTopicInput = {
    where: QuizQuestionWhereUniqueInput
    update: XOR<QuizQuestionUpdateWithoutTopicInput, QuizQuestionUncheckedUpdateWithoutTopicInput>
    create: XOR<QuizQuestionCreateWithoutTopicInput, QuizQuestionUncheckedCreateWithoutTopicInput>
  }

  export type QuizQuestionUpdateWithWhereUniqueWithoutTopicInput = {
    where: QuizQuestionWhereUniqueInput
    data: XOR<QuizQuestionUpdateWithoutTopicInput, QuizQuestionUncheckedUpdateWithoutTopicInput>
  }

  export type QuizQuestionUpdateManyWithWhereWithoutTopicInput = {
    where: QuizQuestionScalarWhereInput
    data: XOR<QuizQuestionUpdateManyMutationInput, QuizQuestionUncheckedUpdateManyWithoutTopicInput>
  }

  export type QuizQuestionScalarWhereInput = {
    AND?: QuizQuestionScalarWhereInput | QuizQuestionScalarWhereInput[]
    OR?: QuizQuestionScalarWhereInput[]
    NOT?: QuizQuestionScalarWhereInput | QuizQuestionScalarWhereInput[]
    id?: StringFilter<"QuizQuestion"> | string
    topicId?: StringFilter<"QuizQuestion"> | string
    question?: StringFilter<"QuizQuestion"> | string
    options?: StringNullableListFilter<"QuizQuestion">
    correctIndex?: IntFilter<"QuizQuestion"> | number
    explanation?: StringFilter<"QuizQuestion"> | string
  }

  export type FileMaterialUpsertWithWhereUniqueWithoutTopicInput = {
    where: FileMaterialWhereUniqueInput
    update: XOR<FileMaterialUpdateWithoutTopicInput, FileMaterialUncheckedUpdateWithoutTopicInput>
    create: XOR<FileMaterialCreateWithoutTopicInput, FileMaterialUncheckedCreateWithoutTopicInput>
  }

  export type FileMaterialUpdateWithWhereUniqueWithoutTopicInput = {
    where: FileMaterialWhereUniqueInput
    data: XOR<FileMaterialUpdateWithoutTopicInput, FileMaterialUncheckedUpdateWithoutTopicInput>
  }

  export type FileMaterialUpdateManyWithWhereWithoutTopicInput = {
    where: FileMaterialScalarWhereInput
    data: XOR<FileMaterialUpdateManyMutationInput, FileMaterialUncheckedUpdateManyWithoutTopicInput>
  }

  export type FileMaterialScalarWhereInput = {
    AND?: FileMaterialScalarWhereInput | FileMaterialScalarWhereInput[]
    OR?: FileMaterialScalarWhereInput[]
    NOT?: FileMaterialScalarWhereInput | FileMaterialScalarWhereInput[]
    id?: StringFilter<"FileMaterial"> | string
    topicId?: StringFilter<"FileMaterial"> | string
    googleDriveFileId?: StringFilter<"FileMaterial"> | string
    webContentLink?: StringNullableFilter<"FileMaterial"> | string | null
    mimeType?: StringNullableFilter<"FileMaterial"> | string | null
    fileName?: StringFilter<"FileMaterial"> | string
    createdAt?: DateTimeFilter<"FileMaterial"> | Date | string
  }

  export type TopicProgressUpsertWithWhereUniqueWithoutTopicInput = {
    where: TopicProgressWhereUniqueInput
    update: XOR<TopicProgressUpdateWithoutTopicInput, TopicProgressUncheckedUpdateWithoutTopicInput>
    create: XOR<TopicProgressCreateWithoutTopicInput, TopicProgressUncheckedCreateWithoutTopicInput>
  }

  export type TopicProgressUpdateWithWhereUniqueWithoutTopicInput = {
    where: TopicProgressWhereUniqueInput
    data: XOR<TopicProgressUpdateWithoutTopicInput, TopicProgressUncheckedUpdateWithoutTopicInput>
  }

  export type TopicProgressUpdateManyWithWhereWithoutTopicInput = {
    where: TopicProgressScalarWhereInput
    data: XOR<TopicProgressUpdateManyMutationInput, TopicProgressUncheckedUpdateManyWithoutTopicInput>
  }

  export type TopicCreateWithoutFileMaterialsInput = {
    id?: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    module: ModuleCreateNestedOneWithoutTopicsInput
    quizQuestions?: QuizQuestionCreateNestedManyWithoutTopicInput
    studentProgress?: TopicProgressCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutFileMaterialsInput = {
    id?: string
    moduleId: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    quizQuestions?: QuizQuestionUncheckedCreateNestedManyWithoutTopicInput
    studentProgress?: TopicProgressUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutFileMaterialsInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutFileMaterialsInput, TopicUncheckedCreateWithoutFileMaterialsInput>
  }

  export type TopicUpsertWithoutFileMaterialsInput = {
    update: XOR<TopicUpdateWithoutFileMaterialsInput, TopicUncheckedUpdateWithoutFileMaterialsInput>
    create: XOR<TopicCreateWithoutFileMaterialsInput, TopicUncheckedCreateWithoutFileMaterialsInput>
    where?: TopicWhereInput
  }

  export type TopicUpdateToOneWithWhereWithoutFileMaterialsInput = {
    where?: TopicWhereInput
    data: XOR<TopicUpdateWithoutFileMaterialsInput, TopicUncheckedUpdateWithoutFileMaterialsInput>
  }

  export type TopicUpdateWithoutFileMaterialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    module?: ModuleUpdateOneRequiredWithoutTopicsNestedInput
    quizQuestions?: QuizQuestionUpdateManyWithoutTopicNestedInput
    studentProgress?: TopicProgressUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutFileMaterialsInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizQuestions?: QuizQuestionUncheckedUpdateManyWithoutTopicNestedInput
    studentProgress?: TopicProgressUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicCreateWithoutQuizQuestionsInput = {
    id?: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    module: ModuleCreateNestedOneWithoutTopicsInput
    fileMaterials?: FileMaterialCreateNestedManyWithoutTopicInput
    studentProgress?: TopicProgressCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutQuizQuestionsInput = {
    id?: string
    moduleId: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    fileMaterials?: FileMaterialUncheckedCreateNestedManyWithoutTopicInput
    studentProgress?: TopicProgressUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutQuizQuestionsInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutQuizQuestionsInput, TopicUncheckedCreateWithoutQuizQuestionsInput>
  }

  export type TopicUpsertWithoutQuizQuestionsInput = {
    update: XOR<TopicUpdateWithoutQuizQuestionsInput, TopicUncheckedUpdateWithoutQuizQuestionsInput>
    create: XOR<TopicCreateWithoutQuizQuestionsInput, TopicUncheckedCreateWithoutQuizQuestionsInput>
    where?: TopicWhereInput
  }

  export type TopicUpdateToOneWithWhereWithoutQuizQuestionsInput = {
    where?: TopicWhereInput
    data: XOR<TopicUpdateWithoutQuizQuestionsInput, TopicUncheckedUpdateWithoutQuizQuestionsInput>
  }

  export type TopicUpdateWithoutQuizQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    module?: ModuleUpdateOneRequiredWithoutTopicsNestedInput
    fileMaterials?: FileMaterialUpdateManyWithoutTopicNestedInput
    studentProgress?: TopicProgressUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutQuizQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileMaterials?: FileMaterialUncheckedUpdateManyWithoutTopicNestedInput
    studentProgress?: TopicProgressUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type UserCreateWithoutTopicProgressInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    moduleProgress?: ModuleProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTopicProgressInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    moduleProgress?: ModuleProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTopicProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTopicProgressInput, UserUncheckedCreateWithoutTopicProgressInput>
  }

  export type TopicCreateWithoutStudentProgressInput = {
    id?: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    module: ModuleCreateNestedOneWithoutTopicsInput
    quizQuestions?: QuizQuestionCreateNestedManyWithoutTopicInput
    fileMaterials?: FileMaterialCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutStudentProgressInput = {
    id?: string
    moduleId: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    quizQuestions?: QuizQuestionUncheckedCreateNestedManyWithoutTopicInput
    fileMaterials?: FileMaterialUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutStudentProgressInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutStudentProgressInput, TopicUncheckedCreateWithoutStudentProgressInput>
  }

  export type UserUpsertWithoutTopicProgressInput = {
    update: XOR<UserUpdateWithoutTopicProgressInput, UserUncheckedUpdateWithoutTopicProgressInput>
    create: XOR<UserCreateWithoutTopicProgressInput, UserUncheckedCreateWithoutTopicProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTopicProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTopicProgressInput, UserUncheckedUpdateWithoutTopicProgressInput>
  }

  export type UserUpdateWithoutTopicProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    moduleProgress?: ModuleProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTopicProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    moduleProgress?: ModuleProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TopicUpsertWithoutStudentProgressInput = {
    update: XOR<TopicUpdateWithoutStudentProgressInput, TopicUncheckedUpdateWithoutStudentProgressInput>
    create: XOR<TopicCreateWithoutStudentProgressInput, TopicUncheckedCreateWithoutStudentProgressInput>
    where?: TopicWhereInput
  }

  export type TopicUpdateToOneWithWhereWithoutStudentProgressInput = {
    where?: TopicWhereInput
    data: XOR<TopicUpdateWithoutStudentProgressInput, TopicUncheckedUpdateWithoutStudentProgressInput>
  }

  export type TopicUpdateWithoutStudentProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    module?: ModuleUpdateOneRequiredWithoutTopicsNestedInput
    quizQuestions?: QuizQuestionUpdateManyWithoutTopicNestedInput
    fileMaterials?: FileMaterialUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutStudentProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizQuestions?: QuizQuestionUncheckedUpdateManyWithoutTopicNestedInput
    fileMaterials?: FileMaterialUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type UserCreateWithoutModuleProgressInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    topicProgress?: TopicProgressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutModuleProgressInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    topicProgress?: TopicProgressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutModuleProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutModuleProgressInput, UserUncheckedCreateWithoutModuleProgressInput>
  }

  export type ModuleCreateWithoutStudentProgressInput = {
    id?: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subject: SubjectCreateNestedOneWithoutModulesInput
    topics?: TopicCreateNestedManyWithoutModuleInput
  }

  export type ModuleUncheckedCreateWithoutStudentProgressInput = {
    id?: string
    subjectId: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    topics?: TopicUncheckedCreateNestedManyWithoutModuleInput
  }

  export type ModuleCreateOrConnectWithoutStudentProgressInput = {
    where: ModuleWhereUniqueInput
    create: XOR<ModuleCreateWithoutStudentProgressInput, ModuleUncheckedCreateWithoutStudentProgressInput>
  }

  export type UserUpsertWithoutModuleProgressInput = {
    update: XOR<UserUpdateWithoutModuleProgressInput, UserUncheckedUpdateWithoutModuleProgressInput>
    create: XOR<UserCreateWithoutModuleProgressInput, UserUncheckedCreateWithoutModuleProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutModuleProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutModuleProgressInput, UserUncheckedUpdateWithoutModuleProgressInput>
  }

  export type UserUpdateWithoutModuleProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    topicProgress?: TopicProgressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutModuleProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    topicProgress?: TopicProgressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ModuleUpsertWithoutStudentProgressInput = {
    update: XOR<ModuleUpdateWithoutStudentProgressInput, ModuleUncheckedUpdateWithoutStudentProgressInput>
    create: XOR<ModuleCreateWithoutStudentProgressInput, ModuleUncheckedCreateWithoutStudentProgressInput>
    where?: ModuleWhereInput
  }

  export type ModuleUpdateToOneWithWhereWithoutStudentProgressInput = {
    where?: ModuleWhereInput
    data: XOR<ModuleUpdateWithoutStudentProgressInput, ModuleUncheckedUpdateWithoutStudentProgressInput>
  }

  export type ModuleUpdateWithoutStudentProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subject?: SubjectUpdateOneRequiredWithoutModulesNestedInput
    topics?: TopicUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateWithoutStudentProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topics?: TopicUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    refresh_token_expires_in?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type TopicProgressCreateManyUserInput = {
    id?: string
    topicId: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModuleProgressCreateManyUserInput = {
    id?: string
    moduleId: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    refresh_token_expires_in?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    refresh_token_expires_in?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    refresh_token_expires_in?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TopicProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topic?: TopicUpdateOneRequiredWithoutStudentProgressNestedInput
  }

  export type TopicProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    module?: ModuleUpdateOneRequiredWithoutStudentProgressNestedInput
  }

  export type ModuleProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleCreateManySubjectInput = {
    id?: string
    order: number
    title: string
    description: string
    isLocked?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModuleUpdateWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topics?: TopicUpdateManyWithoutModuleNestedInput
    studentProgress?: ModuleProgressUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topics?: TopicUncheckedUpdateManyWithoutModuleNestedInput
    studentProgress?: ModuleProgressUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateManyWithoutSubjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicCreateManyModuleInput = {
    id?: string
    order: number
    title: string
    type: string
    durationMinutes?: number
    videoId?: string | null
    ebookContent?: string | null
    simulationUrl?: string | null
    assignmentDescription?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ModuleProgressCreateManyModuleInput = {
    id?: string
    userId: string
    isCompleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizQuestions?: QuizQuestionUpdateManyWithoutTopicNestedInput
    fileMaterials?: FileMaterialUpdateManyWithoutTopicNestedInput
    studentProgress?: TopicProgressUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizQuestions?: QuizQuestionUncheckedUpdateManyWithoutTopicNestedInput
    fileMaterials?: FileMaterialUncheckedUpdateManyWithoutTopicNestedInput
    studentProgress?: TopicProgressUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateManyWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    videoId?: NullableStringFieldUpdateOperationsInput | string | null
    ebookContent?: NullableStringFieldUpdateOperationsInput | string | null
    simulationUrl?: NullableStringFieldUpdateOperationsInput | string | null
    assignmentDescription?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleProgressUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutModuleProgressNestedInput
  }

  export type ModuleProgressUncheckedUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleProgressUncheckedUpdateManyWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizQuestionCreateManyTopicInput = {
    id?: string
    question: string
    options?: QuizQuestionCreateoptionsInput | string[]
    correctIndex: number
    explanation: string
  }

  export type FileMaterialCreateManyTopicInput = {
    id?: string
    googleDriveFileId: string
    webContentLink?: string | null
    mimeType?: string | null
    fileName: string
    createdAt?: Date | string
  }

  export type TopicProgressCreateManyTopicInput = {
    id?: string
    userId: string
    isCompleted?: boolean
    quizScore?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuizQuestionUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
  }

  export type QuizQuestionUncheckedUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
  }

  export type QuizQuestionUncheckedUpdateManyWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: QuizQuestionUpdateoptionsInput | string[]
    correctIndex?: IntFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
  }

  export type FileMaterialUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    googleDriveFileId?: StringFieldUpdateOperationsInput | string
    webContentLink?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileMaterialUncheckedUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    googleDriveFileId?: StringFieldUpdateOperationsInput | string
    webContentLink?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileMaterialUncheckedUpdateManyWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    googleDriveFileId?: StringFieldUpdateOperationsInput | string
    webContentLink?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicProgressUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTopicProgressNestedInput
  }

  export type TopicProgressUncheckedUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicProgressUncheckedUpdateManyWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    quizScore?: NullableIntFieldUpdateOperationsInput | number | null
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