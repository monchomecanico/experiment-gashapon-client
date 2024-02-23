// types
import { FormEvent, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { GetServerSideProps } from 'next';

export interface ChangeType extends ChangeEvent<HTMLInputElement> {}
export interface SubmitType extends FormEvent<HTMLFormElement> {}
export type GetSSPropsType<PropsType> = PropsType extends GetServerSideProps<
  infer Props,
  any
>
  ? Props
  : PropsType;
export type SetStateType<objectType> = Dispatch<SetStateAction<objectType>>;
