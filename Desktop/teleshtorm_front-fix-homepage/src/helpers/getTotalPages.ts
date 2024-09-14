export function getTotalPages(page: number, data: any = []) {
  const totalPages: number[] = [];
  
  if (data.length < 30) {
    return null;
  } else if (page >= 4) {
    for (let i = page - 3; i <= page + 3; i++) {
      totalPages.push(i);
    }
    return totalPages;
  } else if (data.length >= 30) {
    for (let i = 1; i <= page + 3; i++) {
      totalPages.push(i);
    }
  }
  return totalPages;
}
