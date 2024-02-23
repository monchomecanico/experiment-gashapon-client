import { SetStateType } from '@/types';
import { createContext } from 'react';

type CreateContextDataType = {};

export const AppContext = createContext<CreateContextDataType>({});
