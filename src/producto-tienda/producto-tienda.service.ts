import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async addStoreToProduct(
    productoId: string,
    tiendaId: string,
  ): Promise<ProductoEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    producto.tiendas = [...producto.tiendas, tienda];
    return await this.productoRepository.save(producto);
  }

  async findStoreFromProduct(
    productoId: string,
    tiendaId: string,
  ): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const productoArtwork: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tienda.id,
    );

    if (!productoArtwork)
      throw new BusinessLogicException(
        'The tienda with the given id is not associated to the producto',
        BusinessError.PRECONDITION_FAILED,
      );

    return productoArtwork;
  }

  async findStoresFromProduct(productoId: string): Promise<TiendaEntity[]> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return producto.tiendas;
  }

  async updateStoresFromProduct(
    productoId: string,
    tiendas: TiendaEntity[],
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });

    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    console.log(JSON.stringify(tiendas));
    for (let i = 0; i < tiendas.length; i++) {
      const tienda: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id: tiendas[i].id },
      });
      if (!tienda)
        throw new BusinessLogicException(
          'The tienda with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    producto.tiendas = tiendas;
    return await this.productoRepository.save(producto);
  }

  async deleteStoreFromProduct(productoId: string, tiendaId: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const productoArtwork: TiendaEntity = producto.tiendas.find(
      (e) => e.id === tienda.id,
    );

    if (!productoArtwork)
      throw new BusinessLogicException(
        'The tienda with the given id is not associated to the producto',
        BusinessError.PRECONDITION_FAILED,
      );

    producto.tiendas = producto.tiendas.filter((e) => e.id !== tiendaId);
    await this.productoRepository.save(producto);
  }
}
