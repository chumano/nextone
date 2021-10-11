import React from 'react';
import {
  FieldName,
  Message,
  MultipleFieldErrors,
  FieldErrors,
  useFormContext,
  get,
} from 'react-hook-form';

type Assign<T extends object, U extends object> = T & Omit<U, keyof T>;

export type FieldValuesFromFieldErrors<
  TFieldErrors
> = TFieldErrors extends FieldErrors<infer TFieldValues> ? TFieldValues : never;

type AsProps<TAs> = TAs extends undefined
  ? {}
  : TAs extends React.ReactElement
  ? Record<string, any>
  : TAs extends React.ComponentType<infer P>
  ? P
  : TAs extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TAs]
  : never;

export type Props<
  TFieldErrors extends FieldErrors,
  TAs extends
    | undefined
    | React.ReactElement
    | React.ComponentType<any>
    | keyof JSX.IntrinsicElements
> = Assign<
  {
    as?: TAs;
    errors?: TFieldErrors;
    name: FieldName<FieldValuesFromFieldErrors<TFieldErrors>>;
    message?: Message;
    render?: (data: {
      message: Message;
      messages?: MultipleFieldErrors;
    }) => React.ReactNode;
  },
  AsProps<TAs>
>;


const ErrorMessage = <
  TFieldErrors extends FieldErrors,
  TAs extends
    | undefined
    | React.ReactElement
    | React.ComponentType<any>
    | keyof JSX.IntrinsicElements = undefined
>({
  as,
  errors,
  name,
  message,
  render,
  ...rest
}: Props<TFieldErrors, TAs>) => {
  const methods = useFormContext();
  const error = get(errors || methods.formState.errors, name);

  if (!error) {
    return null;
  }

  const { message: messageFromRegister, types } = error;
  const props = Object.assign({}, rest, {
    children: messageFromRegister || message,
  });

  return React.isValidElement(as)
    ? React.cloneElement(as, props)
    : render
    ? (render({
        message: messageFromRegister || message,
        messages: types,
      }) as React.ReactElement)
    : React.createElement((as as string) || React.Fragment, props);
};

export default ErrorMessage;