import { IsNotEmpty, IsString } from 'class-validator';
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
  @IsNotEmpty()
  readonly precio: number;
  @IsString()
  @IsNotEmpty()
  readonly tipo: string;
}
