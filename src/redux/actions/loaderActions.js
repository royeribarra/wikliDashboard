export const showLoader = (show = true) =>
    show
      ? { type: 'SHOW'}
      : { type: 'CLOSE' };