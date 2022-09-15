import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}
  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      relations: ['tiendas'],
    });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    if (producto.tipo != 'Perecedero' && producto.tipo != 'No perecedero')
      throw new BusinessLogicException(
        "The tipo should be 'Perecedero' or 'No perecedero'",
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    if (producto.tipo != 'Perecedero' && producto.tipo != 'No perecedero')
      throw new BusinessLogicException(
        "The tipo should be 'Perecedero' or 'No perecedero'",
        BusinessError.PRECONDITION_FAILED,
      );
    const persistedProducto: ProductoEntity =
      await this.productoRepository.findOne({ where: { id } });
    if (!persistedProducto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.productoRepository.save({
      ...persistedProducto,
      ...producto,
    });
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
