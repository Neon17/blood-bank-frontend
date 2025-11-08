//some helper functions will be here
'use server';

export const formatDateToLocal = async (
  dateStr: string,
  locale: string = 'en-US'
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const getCityCountryByLatitudeLongitude = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error occured at fetching country: ', error);
    return null;
  }
};
