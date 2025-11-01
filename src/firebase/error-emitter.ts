import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// NOTE: This is a hack to get around the fact that EventEmitter is not generic.
// This allows us to have a typed event emitter.
// See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/23909
declare interface TypedEventEmitter<TEvents extends Record<string, any>> {
  on<TEvent extends keyof TEvents>(
    event: TEvent,
    listener: TEvents[TEvent]
  ): this;
  off<TEvent extends keyof TEvents>(
    event: TEvent,
    listener: TEvents[TEvent]
  ): this;
  emit<TEvent extends keyof TEvents>(
    event: TEvent,
    ...args: Parameters<TEvents[TEvent]>
  ): boolean;
}

class TypedEventEmitter<
  TEvents extends Record<string, any>
> extends EventEmitter {}

export const errorEmitter = new TypedEventEmitter<Events>();
