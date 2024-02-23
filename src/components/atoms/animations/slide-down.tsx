import { motion } from 'framer-motion';

// type
import { ReactNode, FC } from 'react';

type SlideDown = {
  animar?: boolean;
  children: ReactNode;
  className?: string;
};

export const SlideDown: FC<SlideDown> = ({ children, animar }) => {
  const animationVariants = {
    initial: {
      y: -100, // Inicialmente, la carta estará fuera de la pantalla hacia arriba
      opacity: 0, // Inicialmente, la carta estará invisible
    },
    animate: animar
      ? {
          y: 0, // Cuando la animación esté en el estado "animate", la carta estará en su posición final
          opacity: 1, // La carta será completamente visible
        }
      : {},
  };
  return (
    <motion.div
      initial='initial'
      animate='animate'
      variants={animationVariants}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
};
