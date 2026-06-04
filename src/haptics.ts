export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      if (type === 'light') {
        navigator.vibrate(10);
      } else if (type === 'medium') {
        navigator.vibrate(20);
      } else if (type === 'heavy') {
        navigator.vibrate([30, 20, 30]);
      }
    } catch (e) {
      // Ignore vibration errors
    }
  }
};
