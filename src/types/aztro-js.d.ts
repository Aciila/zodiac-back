declare module "aztro-js" {
  export function getTodaysHoroscope(
    sign: string,
    callback: (result: any) => void,
    property?: string
  ): void;

  export function getTomorrowsHoroscope(
    sign: string,
    callback: (result: any) => void,
    property?: string
  ): void;

  export function getYesterdaysHoroscope(
    sign: string,
    callback: (result: any) => void,
    property?: string
  ): void;

  export function getAllHoroscope(
    sign: string,
    callback: (result: any) => void
  ): void;
}
