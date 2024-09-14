export const changeSubscribers = (subscribers: string) => {
    const lastDigit = parseInt(subscribers.slice(-1));
    if ([2, 3, 4].includes(lastDigit)) {
      return "Подписчика";
    }
    return "Подписчиков";
  };