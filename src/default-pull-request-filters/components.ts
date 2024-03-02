export const observeValueChange = <T>(initialValue: T) => {
  let currentValue = initialValue;
  return (newValue: T) => {
    const hasChanged = currentValue !== newValue;
    currentValue = newValue;
    return hasChanged;
  };
};
