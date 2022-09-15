import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}
  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({
      relations: ['productos'],
    });
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return tienda;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length != 3)
      throw new BusinessLogicException(
        'The ciudad should a code of 3 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.tiendaRepository.save(tienda);
  }

  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    if (tienda.ciudad.length != 3)
      throw new BusinessLogicException(
        'The ciudad should a code of 3 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    const persistedProducto: TiendaEntity = await this.tiendaRepository.findOne(
      { where: { id } },
    );
    if (!persistedProducto)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.tiendaRepository.save({
      ...persistedProducto,
      ...tienda,
    });
  }

  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.remove(tienda);
  }
}
