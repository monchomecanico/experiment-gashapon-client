/**
 * @description - Retrasa la entrada de un elemento, para animar 1 por 1
 */

export const lazyRenderAnimation = () => {
  // missionList  //? Array de elementos a animar
  // setCartas    //? setState para actualizar el estado de los elementos a animar

  const staggerDelay = 0.5; // En segundos

  //   missionList.forEach((carta, index) => {
  //     setTimeout(() => {
  //       setCartas((prevCartas: any) => {
  //         const nuevasCartas = [...prevCartas];
  //         nuevasCartas[index] = { ...carta, animar: true };
  //         return nuevasCartas;
  //       });
  //     }, index * (staggerDelay * 1000)); // Convierte el retraso en milisegundos
  //   });
};
