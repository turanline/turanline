export const arraySort = (searchNumber: number, searchArray: { orderNumber: number }[]): number | null => {

    searchArray?.sort((a, b) => a.orderNumber - b.orderNumber);

    let left = 0;
    let right = searchArray.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midOrderNumber = searchArray[mid].orderNumber;

        if (midOrderNumber === searchNumber) {
            return mid;
        } else if (midOrderNumber < searchNumber) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return null;
};

export const convertToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
