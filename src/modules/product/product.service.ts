import { Get, Inject, Injectable } from '@nestjs/common';
import { MySQLProvider } from 'src/database/mysq.provider';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(@Inject('DATABASE') private readonly mysql: MySQLProvider) {}
  @Get()
  async findAll(): Promise<Product[]> {
    const conn = await this.mysql.getConnection();
    const [results] = await conn.query('select * from products');
    const resultPlain = JSON.parse(JSON.stringify(results));
    const products = resultPlain.map((product) => {
      const productEntity = new Product();
      productEntity.product = product.product;
      productEntity.price = product.price;
      return productEntity;
    });
    return products;
  }

  async findById(id: string): Promise<Product> {
    const conn = await this.mysql.getConnection();
    const [results] = await conn.query('select * from products where id= ?', [
      id,
    ]);
    const resultPlain = JSON.parse(JSON.stringify(results));
    const products = resultPlain.map((product) => {
      const productEntity = new Product();
      productEntity.id = product.id;
      productEntity.product = product.product;
      productEntity.price = product.price;
      return productEntity;
    });
    return products[0];
  }

  async create(entity: Product): Promise<Product> {
    const conn = await this.mysql.getConnection();
    await conn.query('insert into products (product, price) values (?, ?)', [
      entity.product,
      entity.price,
    ]);
    return entity;
  }

  async remove(id: string): Promise<boolean> {
    const conn = await this.mysql.getConnection();
    await conn.query('delete from products where id = ? limit 1', [id]);
    return true;
  }
}
