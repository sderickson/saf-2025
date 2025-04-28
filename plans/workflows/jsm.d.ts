declare module "javascript-state-machine" {
  import { CamelCase } from "type-fest";

  namespace StateMachine {
    // Does not use a class type because it does not allow to produce instances
    // whose members depend on the generic type parameters, e.g. using type
    // union as we do here.
    type Constructor = {
      new <
        TransitionName extends string,
        StateName extends string,
        CustomMethods extends Methods<TransitionName, StateName>,
        Data,
      >(
        options: Options<
          TransitionName | InitTransition,
          StateName | InitState,
          Data,
          CustomMethods &
            ThisType<Instance<TransitionName, StateName, Data, CustomMethods>>
        >,
      ): Instance<
        TransitionName | InitTransition,
        StateName | InitState,
        Data,
        CustomMethods
      >;

      factory: <
        TransitionName extends string,
        StateName extends string,
        CustomMethods extends Methods<TransitionName, StateName>,
        Data = undefined,
        DataArgs extends Array<unknown> = [],
      >(
        options: FactoryOptions<
          TransitionName | InitTransition,
          StateName | InitState,
          Data,
          DataArgs,
          CustomMethods &
            ThisType<Instance<TransitionName, StateName, Data, CustomMethods>>
        >,
      ) => new (
        ...args: DataArgs
      ) => Instance<
        TransitionName | InitTransition,
        StateName | InitState,
        Data,
        CustomMethods
      >;
    };

    type Options<
      TransitionName extends string,
      StateName extends string,
      Data,
      CustomMethods,
    > = {
      init?: StateName;
      transitions: Array<Transition<TransitionName, StateName>>;
      data?: Data;
      methods?: CustomMethods;
    };

    // StateMachine.factory() options. It needs to be distinguished from
    // StateMachineOptions because the data property is different, and
    // we need to set up a DataArgs type in this case.
    type FactoryOptions<
      TransitionName extends string,
      StateName extends string,
      Data,
      DataArgs extends Array<unknown>,
      CustomMethods,
    > = {
      init?: StateName;
      methods?: CustomMethods;
      data?: (...args: DataArgs) => Data;
      transitions: Array<Transition<TransitionName, StateName>>;
    };

    export type Transition<TransitionName, StateName> = {
      name: TransitionName;
      from: StateName | Wildcard | Array<StateName>;
      to: StateName | ((...args: number[]) => StateName);
    };

    type TransitionMethods<TransitionName extends string> = {
      [T in TransitionName]: (...args: unknown[]) => void;
    };

    type Methods<
      TransitionName extends string,
      StateName extends string,
    > = AnyMethods & Observer<TransitionName, StateName>;

    type AnyMethods = {
      [key: string]: (...args: never[]) => unknown;
    };

    export type Observer<
      TransitionName extends string,
      StateName extends string,
    > = {
      onBeforeTransition?: CancelableLifeCycleEvent<
        TransitionName,
        StateName
      > | null;
      onLeaveState?: CancelableLifeCycleEvent<TransitionName, StateName> | null;
      onTransition?: CancelableLifeCycleEvent<TransitionName, StateName> | null;
      onEnterState?: LifeCycleEvent<TransitionName, StateName> | null;
      onAfterTransition?: LifeCycleEvent<TransitionName, StateName> | null;
      onInvalidTransition?: LifeCycleEvent<TransitionName, StateName> | null;
      onPendingTransition?: LifeCycleEvent<TransitionName, StateName> | null;
    } & {
      // Cancelable named transition events.
      [T in TransitionName as CamelCase<`on-before-${T}`>]?: CancelableLifeCycleEvent<
        T,
        StateName
      > | null;
    } & {
      // Non Cancelable named transition events.
      [T in TransitionName as
        | CamelCase<`on-after-${T}`>
        | CamelCase<`on-${T}`>]?: LifeCycleEvent<T, StateName> | null;
    } & {
      // Cancelable named state events.
      [S in StateName as CamelCase<`on-leave-${S}`>]?: CancelableLifeCycleEvent<
        TransitionName,
        S,
        StateName
      > | null;
    } & {
      // Non Cancelable named state events.
      [S in StateName as
        | CamelCase<`on-enter-${S}`>
        | CamelCase<`on-${S}`>]?: LifeCycleEvent<
        TransitionName,
        StateName,
        S
      > | null;
    };

    export type LifeCycleEvent<
      TransitionName = string,
      FromStateName = string,
      ToStateName = FromStateName,
    > = (
      lifeCycle: LifeCycle<TransitionName, FromStateName, ToStateName>,
      ...args: unknown[]
    ) => void | Promise<void>;

    type CancelableLifeCycleEvent<
      TransitionName,
      FromStateName,
      ToStateName = FromStateName,
    > = (
      lifeCycle: LifeCycle<TransitionName, FromStateName, ToStateName>,
      ...args: unknown[]
    ) => void | boolean | Promise<void | boolean>;

    export type LifeCycle<
      TransitionName = string,
      FromStateName = string,
      ToStateName = FromStateName,
    > = {
      transition: TransitionName;
      from: FromStateName;
      to: ToStateName;
    };

    type Instance<
      TransitionName extends string,
      StateName extends string,
      Data,
      CustomMethods extends AnyMethods,
    > = {
      // Use a generic type to ensure the this value of observer methods
      // is correct.
      observe<O extends Observer<TransitionName, StateName>>(observer: O): void;
      state: StateName;
      is(state: StateName): boolean;
      can(transition: TransitionName): boolean;
      cannot(transition: TransitionName): boolean;
      transitions(): Array<TransitionName>;
      allTransitions(): Array<TransitionName>;
      allStates(): Array<StateName>;
    } & (Data extends undefined
      ? // Use a conditional type so the data property is not even visible if
        // it was not provided. This matches the library behavior that does not
        // have a data property in this case.
        Record<string, never>
      : { data: Data }) &
      Observer<TransitionName, StateName> &
      Omit<CustomMethods, keyof Observer<TransitionName, StateName>> &
      TransitionMethods<TransitionName>;

    type Wildcard = "*";
    type InitState = "none";
    type InitTransition = "init";
  }

  const StateMachine: StateMachine.Constructor;

  // Use the export = syntax to support cases where esModuleInterop is not
  // enabled (https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html#default-exports).
  export = StateMachine;
}
