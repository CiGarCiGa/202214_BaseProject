import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaDto } from '../tienda/tienda.dto';
import { ProductoTiendaService } from './producto-tienda.service';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post(':productoId/tiendas/:tiendaId')
  async addStoreToProduct(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productoTiendaService.addStoreToProduct(
      productoId,
      tiendaId,
    );
  }

  @Get(':productoId/tiendas/:tiendaId')
  async findTiendaByProductoIdTiendaId(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productoTiendaService.findStoreFromProduct(
      productoId,
      tiendaId,
    );
  }

  @Get(':productoId/tiendas')
  async findTiendasByProductoId(@Param('productoId') productoId: string) {
    return await this.productoTiendaService.findStoresFromProduct(productoId);
  }

  @Put(':productoId/tiendas')
  async associateTiendasProducto(
    @Body() tiendasDto: TiendaDto[],
    @Param('productoId') productoId: string,
  ) {
    console.log(JSON.stringify(tiendasDto));
    const tiendas = plainToInstance(TiendaEntity, tiendasDto);
    console.log(JSON.stringify(tiendas));
    return await this.productoTiendaService.updateStoresFromProduct(
      productoId,
      tiendas,
    );
  }

  @Delete(':productoId/tiendas/:tiendaId')
  @HttpCode(204)
  async deleteTiendaProducto(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productoTiendaService.deleteStoreFromProduct(
      productoId,
      tiendaId,
    );
  }
}
