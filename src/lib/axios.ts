// main tools
import axios from 'axios';

//? In case of using NextAuth
/*
import { getServerAuthSession } from '@/pages/api/auth/[...nextauth]';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

const axiosClient = (ctx?: GetServerSidePropsContext) => {
  const instance = axios.create();
  instance.interceptors.request.use(async (request) => {
    const session =
      typeof window !== 'undefined'
        ? await getSession()
        : await getServerAuthSession(ctx!);
    if (session) {
      request.headers.Authorization = `Bearer ${session.at}`;
    }

    return request;
  });

  return instance;
};

export default axiosClient;
*/

/**
 *
 * @description In case u need inject a JWT in the header
 * @param token
 * @returns
 */
export const axiosAuthServer = (token: string) => {
  const instance = axios.create();
  instance.interceptors.request.use(async (request) => {
    request.headers.Authorization = `Bearer ${token}`;

    return request;
  });

  return instance;
};
