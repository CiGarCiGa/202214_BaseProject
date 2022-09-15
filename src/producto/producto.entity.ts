import { TiendaEntity } from '../tienda/tienda.entity';
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
@Entity({ name: 'producto' })
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  precio: number;
  @Column()
  tipo: string;
  @ManyToMany(() => TiendaEntity, (tienda) => tienda.productos)
  @JoinTable({ name: 'tiendas_productos' })
  tiendas: TiendaEntity[];
}
