export interface PublishCarDto {
  carId: number;
  platform: string;
  status: 'enabled' | 'disabled';
}