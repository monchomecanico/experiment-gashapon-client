import React, { FC } from 'react';

type ToasTemplateProps = {
  title: string;
  detail: string;
};

export const ToastTemplate: FC<ToasTemplateProps> = ({ detail, title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <span>{detail}</span>
    </div>
  );
};
