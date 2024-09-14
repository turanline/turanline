export function formatDate(dateString: string, locale: string) {
    const date = new Date(dateString);
  
    const day = date.toLocaleDateString(`${locale}`, { day: 'numeric' });
    const month = date.toLocaleDateString(`${locale}`, { month: 'short' });
    const year = date.toLocaleDateString(`${locale}`, { year: 'numeric' });
    const formattedDate = `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year}`;
    return formattedDate;
  }