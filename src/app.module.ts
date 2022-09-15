/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto/producto.entity';
import { TiendaEntity } from './tienda/tienda.entity';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mi_tienda',
      entities: [ProductoEntity, TiendaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    TiendaModule,
    ProductoModule,
    ProductoTiendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
