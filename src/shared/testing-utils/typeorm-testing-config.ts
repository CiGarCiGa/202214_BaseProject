/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../../producto/producto.entity';
import { TiendaEntity } from '../../tienda/tienda.entity';

const entitiesArray = [ProductoEntity, TiendaEntity];
export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: entitiesArray,
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature(entitiesArray),
];
