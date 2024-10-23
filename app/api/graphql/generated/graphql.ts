/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Game = {
  __typename?: 'Game';
  currentQuestionIndex: Scalars['Int']['output'];
  currentQuestionStartTime?: Maybe<Scalars['DateTime']['output']>;
  gameType?: Maybe<GameType>;
  id: Scalars['ID']['output'];
  openAt?: Maybe<Scalars['DateTime']['output']>;
  questions?: Maybe<Array<Question>>;
  status: GameStatus;
  timeEnded?: Maybe<Scalars['DateTime']['output']>;
  timeStarted: Scalars['DateTime']['output'];
  topic: Scalars['String']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export enum GameStatus {
  Closed = 'CLOSED',
  Finished = 'FINISHED',
  Open = 'OPEN'
}

export enum GameType {
  Mcq = 'mcq',
  OpenEnded = 'open_ended'
}

export type Mutation = {
  __typename?: 'Mutation';
  closeGame: Game;
  finishGame: Game;
  openGame: Game;
  updateGameQuestion: Game;
};


export type MutationCloseGameArgs = {
  currentQuestionIndex?: InputMaybe<Scalars['Int']['input']>;
  currentQuestionStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  gameId: Scalars['String']['input'];
};


export type MutationFinishGameArgs = {
  gameId: Scalars['String']['input'];
  timeEnded?: InputMaybe<Scalars['DateTime']['input']>;
};


export type MutationOpenGameArgs = {
  currentQuestionIndex?: InputMaybe<Scalars['Int']['input']>;
  currentQuestionStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  gameId: Scalars['String']['input'];
};


export type MutationUpdateGameQuestionArgs = {
  currentQuestionIndex: Scalars['Int']['input'];
  currentQuestionStartTime: Scalars['DateTime']['input'];
  gameId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  activeGames: Array<Game>;
  game: Game;
};


export type QueryGameArgs = {
  gameId: Scalars['String']['input'];
};

export type Question = {
  __typename?: 'Question';
  answer: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  options?: Maybe<Scalars['JSON']['output']>;
  question: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  gameUpdated: Game;
};


export type SubscriptionGameUpdatedArgs = {
  gameId?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Game: ResolverTypeWrapper<Game>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  GameStatus: GameStatus;
  GameType: GameType;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Question: ResolverTypeWrapper<Question>;
  Subscription: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars['DateTime']['output'];
  Game: Game;
  Int: Scalars['Int']['output'];
  ID: Scalars['ID']['output'];
  String: Scalars['String']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  Query: {};
  Question: Question;
  Subscription: {};
  Boolean: Scalars['Boolean']['output'];
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = {
  currentQuestionIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  currentQuestionStartTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  gameType?: Resolver<Maybe<ResolversTypes['GameType']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  openAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  questions?: Resolver<Maybe<Array<ResolversTypes['Question']>>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['GameStatus'], ParentType, ContextType>;
  timeEnded?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  timeStarted?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  topic?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  closeGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationCloseGameArgs, 'gameId'>>;
  finishGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationFinishGameArgs, 'gameId'>>;
  openGame?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationOpenGameArgs, 'gameId'>>;
  updateGameQuestion?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<MutationUpdateGameQuestionArgs, 'currentQuestionIndex' | 'currentQuestionStartTime' | 'gameId'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeGames?: Resolver<Array<ResolversTypes['Game']>, ParentType, ContextType>;
  game?: Resolver<ResolversTypes['Game'], ParentType, ContextType, RequireFields<QueryGameArgs, 'gameId'>>;
};

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = {
  answer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  options?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  gameUpdated?: SubscriptionResolver<ResolversTypes['Game'], "gameUpdated", ParentType, ContextType, Partial<SubscriptionGameUpdatedArgs>>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Game?: GameResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
};

