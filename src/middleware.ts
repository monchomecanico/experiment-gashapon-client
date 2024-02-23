// main tools
// import jwtDecoder from 'jwt-decode';
// import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

type DecodedToken = {
  sub?: number;
  iat?: number;
  exp?: number;
  token_address?: string;
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // por si necesito validar con algun dato dentro del token
  // const decoded: DecodedToken | null = token && jwtDecoder(token.at!);

  // if (!token) {
  //   if (pathname === '/missions')
  //     return NextResponse.redirect(new URL('/', req.url));
  // }

  // if (token) {
  //   if (pathname === '/')
  //     return NextResponse.redirect(new URL('/missions', req.url));
  // }
}
