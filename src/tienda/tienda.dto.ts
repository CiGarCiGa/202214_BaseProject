import { IsNotEmpty, IsString } from 'class-validator';
export class TiendaDto {
  id: string;
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsString()
  @IsNotEmpty()
  ciudad: string;
  @IsString()
  @IsNotEmpty()
  direccion: string;
}
