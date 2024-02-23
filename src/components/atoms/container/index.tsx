// types
import { FC, ReactNode } from 'react';

type ContainerProps = {
  maxWidth?: string;
  className?: string;
  children: ReactNode;
};

export const Container: FC<ContainerProps> = ({
  children,
  maxWidth,
  className = '',
}) => {
  const containerClasses = `${maxWidth ? maxWidth : 'max-w-screen-xl'}
    mx-auto px-4 sm:px-6 lg:px-8 ${className}`;

  return <div className={containerClasses}>{children}</div>;
};
