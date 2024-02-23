// types
import { ReactNode, FC } from 'react';

type RowProps = {
	children: ReactNode;
	spacing?: string;
	className?: string;
};

export const Row: FC<RowProps> = ({ children, spacing, className = '' }) => {
	const rowClasses = `flex flex-wrap 
        ${spacing ? `-mx-${spacing}` : 'mx-4'}
        ${className}
    `;

	return <div className={rowClasses}>{children}</div>;
};
