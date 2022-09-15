import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];
  const tipos = ['Perecedero', 'No perecedero'];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.word.noun(),
        precio: faker.datatype.number(),
        tipo: tipos[Math.floor(Math.random() * 2)],
      });
      productosList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne should return a producto by id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
    expect(producto.tipo).toEqual(storedProducto.tipo);
  });

  it('findOne should throw an exception for an invalid producto', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('create should return a new producto', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.word.noun(),
      precio: faker.datatype.number(),
      tipo: tipos[Math.floor(Math.random() * 2)],
      tiendas: [],
    };

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: newProducto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.precio).toEqual(newProducto.precio);
    expect(storedProducto.tipo).toEqual(newProducto.tipo);
  });

  it('create invalid tipo should return a error', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.word.noun(),
      precio: faker.datatype.number(),
      tipo: 'invalid tipo',
      tiendas: [],
    };
    await expect(() => service.create(producto)).rejects.toHaveProperty(
      'message',
      "The tipo should be 'Perecedero' or 'No perecedero'",
    );
  });

  it('update should modify a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'New name';
    producto.precio = 10;
    producto.tipo = tipos[0];

    const updatedProducto: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
    expect(storedProducto.precio).toEqual(producto.precio);
    expect(storedProducto.tipo).toEqual(producto.tipo);
  });

  it('update with invalid tipo should return an error', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = 'New name';
    producto.precio = 10;
    producto.tipo = 'invalid type';
    await expect(() =>
      service.update(producto.id, producto),
    ).rejects.toHaveProperty(
      'message',
      "The tipo should be 'Perecedero' or 'No perecedero'",
    );
  });

  it('update should throw an exception for an invalid producto', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: 'New name',
      precio: 20,
      tipo: tipos[1],
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('delete should remove a producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);

    const deletedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });
});
