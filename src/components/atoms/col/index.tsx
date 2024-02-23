// types
import { FC, ReactNode } from 'react';

type ColProps = {
  auto?: boolean;
  width?: string;
  spacing?: string;
  className?: string;
  children: ReactNode;
};

export const Col: FC<ColProps> = ({
  auto,
  width,
  spacing,
  children,
  className = '',
}) => {
  const colClasses = `
  ${auto ? 'flex-1' : width ?? 'w-full'}
  ${spacing ? `px-${spacing}` : 'px-4'}
  ${className}
  `;
  return <div className={colClasses}>{children}</div>;
};
